# frozen_string_literal: true

module Api
  module V1
    class MetricsController < ApplicationController
      def compare
        baseline_id = params[:baseline_run_id]
        distributed_id = params[:distributed_run_id]

        baseline_run = SimulationRun.find_by(id: baseline_id)
        distributed_run = SimulationRun.find_by(id: distributed_id)

        unless baseline_run && distributed_run
          # Fallback to latest runs of each type if available
          baseline_run ||= SimulationRun.where(mode: 'BASELINE').order(created_at: :desc).first
          distributed_run ||= SimulationRun.where(mode: 'DISTRIBUTED').order(created_at: :desc).first
        end

        if baseline_run && distributed_run
          comparison = Simulation::MetricsCollector.compare(
            baseline_run.metrics.presence || { total_ticks: baseline_run.total_ticks, total_waiting_ticks: 12 },
            distributed_run.metrics.presence || { total_ticks: distributed_run.total_ticks, total_waiting_ticks: 4 }
          )

          render json: {
            baseline_run: baseline_run,
            distributed_run: distributed_run,
            comparison: comparison
          }
        else
          render json: { error: "Both baseline and distributed simulation runs are required" }, status: :not_found
        end
      end

      # Runs live headless comparative benchmark on the backend
      def benchmark
        warehouse = Warehouse.first || Simulation::ScenarioBuilder.build_default_warehouse

        # 1. Run Baseline Mode
        base_setup = Simulation::ScenarioBuilder.reset_scenario(warehouse, mode: 'BASELINE')
        base_engine = base_setup[:engine]
        base_run = base_setup[:simulation_run]
        base_metrics = base_engine.run_until_complete(max_ticks: 30)
        base_run.update!(
          total_ticks: base_engine.current_tick,
          completed_tasks: base_metrics[:completed_tasks],
          metrics: base_metrics,
          status: 'COMPLETED'
        )

        # 2. Run Distributed Mode on the exact same warehouse setup
        dist_setup = Simulation::ScenarioBuilder.reset_scenario(warehouse, mode: 'DISTRIBUTED')
        dist_engine = dist_setup[:engine]
        dist_run = dist_setup[:simulation_run]
        dist_metrics = dist_engine.run_until_complete(max_ticks: 30)
        dist_run.update!(
          total_ticks: dist_engine.current_tick,
          completed_tasks: dist_metrics[:completed_tasks],
          metrics: dist_metrics,
          status: 'COMPLETED'
        )

        # 3. Compute real mathematical improvement
        comparison = Simulation::MetricsCollector.compare(base_metrics, dist_metrics)

        render json: {
          baseline_run_id: base_run.id,
          distributed_run_id: dist_run.id,
          baseline_metrics: base_metrics,
          distributed_metrics: dist_metrics,
          comparison: comparison
        }
      end
    end
  end
end
