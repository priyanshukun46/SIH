# frozen_string_literal: true

module Api
  module V1
    class SimulationsController < ApplicationController
      before_action :set_simulation_run, only: [:show, :start, :pause, :reset, :step, :block_aisle, :speed, :metrics]

      def create
        warehouse = Warehouse.find(params[:warehouse_id])
        mode = params[:mode].presence || 'DISTRIBUTED'

        sim_run = warehouse.simulation_runs.create!(
          mode: mode,
          status: 'IDLE',
          total_ticks: 0,
          completed_tasks: 0,
          collision_count: 0,
          deadlock_count: 0,
          metrics: {}
        )

        engine = Simulation::Engine.find_or_create(sim_run)

        render json: {
          simulation_run: sim_run,
          robots: engine.agents.map(&:to_h),
          message: "Simulation run created successfully in #{mode} mode"
        }, status: :created
      end

      def show
        engine = Simulation::Engine.find_or_create(@simulation_run)
        events = @simulation_run.simulation_events.order(tick: :desc, id: :desc).limit(50)
        routes = Route.where(simulation_run_id: @simulation_run.id, status: 'ACTIVE')

        render json: {
          simulation_run: @simulation_run,
          warehouse: @simulation_run.warehouse,
          robots: engine.agents.map(&:to_h),
          tasks: @simulation_run.warehouse.tasks.order(:id),
          obstacles: @simulation_run.warehouse.obstacles.active,
          routes: routes,
          events: events,
          reservations: engine.coordinator.reservation_manager.export_snapshot,
          metrics: engine.metrics_collector.to_h
        }
      end

      def start
        engine = Simulation::Engine.find_or_create(@simulation_run)
        engine.start_async

        render json: {
          status: 'RUNNING',
          simulation_run: @simulation_run.reload,
          message: "Simulation started in #{@simulation_run.mode} mode"
        }
      end

      def pause
        engine = Simulation::Engine.find_or_create(@simulation_run)
        engine.pause

        render json: {
          status: 'PAUSED',
          simulation_run: @simulation_run.reload,
          message: "Simulation paused at tick #{engine.current_tick}"
        }
      end

      def reset
        warehouse = @simulation_run.warehouse
        mode = params[:mode].presence || @simulation_run.mode

        result = Simulation::ScenarioBuilder.reset_scenario(warehouse, mode: mode)
        new_sim_run = result[:simulation_run]

        render json: {
          status: 'RESET',
          simulation_run: new_sim_run,
          robots: result[:engine].agents.map(&:to_h),
          message: "Warehouse scenario reset to initial state"
        }
      end

      def step
        engine = Simulation::Engine.find_or_create(@simulation_run)
        result = engine.step

        render json: {
          step_result: result,
          simulation_run: @simulation_run.reload
        }
      end

      def speed
        engine = Simulation::Engine.find_or_create(@simulation_run)
        new_speed = params[:speed].to_f
        engine.set_speed(new_speed)

        render json: { speed: engine.speed, message: "Simulation speed set to #{engine.speed}x" }
      end

      def block_aisle
        engine = Simulation::Engine.find_or_create(@simulation_run)
        x = params[:x].to_i
        y = params[:y].to_i
        width = params[:width].present? ? params[:width].to_i : 1
        height = params[:height].present? ? params[:height].to_i : 1

        result = engine.block_aisle(x, y, width: width, height: height)

        render json: {
          result: result,
          obstacles: @simulation_run.warehouse.obstacles.active,
          message: "Aisle blocked at (#{x}, #{y})"
        }
      end

      def metrics
        engine = Simulation::Engine.find_or_create(@simulation_run)
        render json: {
          simulation_run: @simulation_run,
          metrics: engine.metrics_collector.to_h
        }
      end

      # Automated full demo script
      def demo
        warehouse = Warehouse.first || Simulation::ScenarioBuilder.build_default_warehouse
        reset_result = Simulation::ScenarioBuilder.reset_scenario(warehouse, mode: 'DISTRIBUTED')
        sim_run = reset_result[:simulation_run]
        engine = reset_result[:engine]

        # 1. Step initial movements
        initial_steps = engine.run_steps(5)

        # 2. Dynamically block an aisle in the center (x=8, y=6)
        block_result = engine.block_aisle(8, 6, width: 2, height: 1)

        # 3. Run further steps with rerouting and task resolution
        further_steps = engine.run_steps(15)

        render json: {
          simulation_run: sim_run.reload,
          blocked_aisle: block_result,
          current_tick: engine.current_tick,
          robots: engine.agents.map(&:to_h),
          metrics: engine.metrics_collector.to_h,
          events: sim_run.simulation_events.order(id: :desc).limit(20),
          message: "Demo scenario successfully executed with conflict resolution and dynamic blocked aisle rerouting"
        }
      end

      private

      def set_simulation_run
        @simulation_run = SimulationRun.find(params[:id])
      end
    end
  end
end
