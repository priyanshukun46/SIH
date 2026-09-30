# frozen_string_literal: true

module Simulation
  class Engine
    # Registry of active simulation engines by simulation_run_id (for async threads)
    @engines = {}
    @engines_lock = Monitor.new

    class << self
      def find_or_create(simulation_run)
        @engines_lock.synchronize do
          @engines[simulation_run.id] ||= new(simulation_run)
        end
      end

      def find(simulation_run_id)
        @engines_lock.synchronize do
          @engines[simulation_run_id]
        end
      end

      def remove(simulation_run_id)
        @engines_lock.synchronize do
          engine = @engines.delete(simulation_run_id)
          engine&.pause
          engine
        end
      end
    end

    attr_reader :simulation_run, :warehouse, :agents, :coordinator,
                :metrics_collector, :current_tick, :running, :speed

    def initialize(simulation_run)
      @simulation_run = simulation_run
      @warehouse = simulation_run.warehouse
      @agents = []
      @current_tick = simulation_run.total_ticks || 0
      @running = false
      @speed = 1.0
      @thread = nil
      @lock = Monitor.new

      @coordinator = Coordination::FleetCoordinator.new(
        warehouse: @warehouse,
        simulation_run: @simulation_run
      )
      @metrics_collector = Simulation::MetricsCollector.new
      setup
    end

    def setup
      @lock.synchronize do
        # Initialize RobotAgents
        db_robots = @warehouse.robots.order(:id)
        @agents = db_robots.map { |r| Simulation::RobotAgent.new(r) }

        # Pre-assign pending tasks if agents are idle and have no task
        pending_tasks = @warehouse.tasks.where(status: 'PENDING').order(priority: :desc).to_a
        @agents.each do |agent|
          next if agent.current_task.present? || pending_tasks.empty?

          task = pending_tasks.shift
          task.update!(assigned_robot_id: agent.id, status: 'ASSIGNED')
          agent.current_task = task
          agent.target_x = task.pickup_x
          agent.target_y = task.pickup_y
          agent.status = 'MOVING'

          # Plan initial route
          resolver = PathPlanning::RouteResolver.new(warehouse: @warehouse)
          route_plan = resolver.resolve_task_route(agent, task, start_tick: @current_tick)
          if route_plan && route_plan[:full_path].any?
            path = route_plan[:full_path]
            path.shift if path.first == agent.current_position
            agent.path = path
            @coordinator.reservation_manager.reserve_path(agent.id, path, start_tick: @current_tick + 1, priority: agent.priority)

            Route.where(robot_id: agent.id, simulation_run_id: @simulation_run.id).delete_all
            Route.create!(
              robot_id: agent.id,
              task_id: task.id,
              simulation_run_id: @simulation_run.id,
              path: path,
              status: 'ACTIVE'
            )
          end
        end
      end
    end

    def step
      @lock.synchronize do
        @current_tick += 1

        tick_service = Simulation::Tick.new(
          warehouse: @warehouse,
          simulation_run: @simulation_run,
          agents: @agents,
          coordinator: @coordinator,
          metrics_collector: @metrics_collector,
          current_tick: @current_tick
        )

        result = tick_service.execute

        # Synchronize DB records with agent states
        sync_db_robot_states

        # Update SimulationRun state
        @simulation_run.update!(
          total_ticks: @current_tick,
          completed_tasks: @metrics_collector.completed_tasks,
          collision_count: @metrics_collector.collision_count,
          deadlock_count: @metrics_collector.deadlock_count,
          metrics: @metrics_collector.to_h
        )

        if result[:all_completed]
          @running = false
          @simulation_run.update!(
            status: 'COMPLETED',
            ended_at: Time.current,
            completion_time: @current_tick
          )
        end

        # Broadcast update over Action Cable
        broadcast_tick(result)

        result
      end
    end

    def run_steps(count)
      results = []
      count.times do
        break if @simulation_run.completed?
        results << step
      end
      results
    end

    def run_until_complete(max_ticks: 500)
      steps = 0
      while steps < max_ticks && !@simulation_run.completed?
        step
        steps += 1
      end
      @metrics_collector.to_h
    end

    def start_async(base_delay: 0.3)
      return if @running

      @running = true
      @simulation_run.update!(status: 'RUNNING', started_at: @simulation_run.started_at || Time.current)

      SimulationEvent.create!(
        simulation_run_id: @simulation_run.id,
        event_type: 'SIMULATION_STARTED',
        message: "Simulation run ##{@simulation_run.id} started (#{@simulation_run.mode} mode)",
        tick: @current_tick
      )

      @thread = Thread.new do
        while @running && !@simulation_run.completed?
          step
          sleep_time = [base_delay / [@speed, 0.1].max, 0.02].max
          sleep(sleep_time)
        end
      end
    end

    def pause
      @running = false
      @thread&.kill
      @thread = nil
      @simulation_run.update!(status: 'PAUSED')

      SimulationEvent.create!(
        simulation_run_id: @simulation_run.id,
        event_type: 'SIMULATION_PAUSED',
        message: "Simulation run ##{@simulation_run.id} paused at tick #{@current_tick}",
        tick: @current_tick
      )
    end

    def set_speed(new_speed)
      @speed = [0.1, new_speed.to_f].max
    end

    def block_aisle(x, y, width: 1, height: 1)
      @lock.synchronize do
        # 1. Create or activate obstacle
        obstacle = @warehouse.obstacles.create!(
          x: x,
          y: y,
          width: width,
          height: height,
          obstacle_type: 'BLOCKED_AISLE',
          active: true
        )
        @warehouse.reload_active_obstacles!

        SimulationEvent.create!(
          simulation_run_id: @simulation_run.id,
          event_type: 'AISLE_BLOCKED',
          message: "Aisle blocked at coordinate (#{x}, #{y}) with dimensions #{width}x#{height}",
          metadata: { x: x, y: y, width: width, height: height, obstacle_id: obstacle.id },
          tick: @current_tick
        )

        # 2. Check all agents to see if their current planned path intersects the blocked aisle
        affected_agents = []
        @agents.each do |agent|
          next if agent.path.empty?

          intersects = agent.path.any? do |px, py|
            px >= x && px < x + width && py >= y && py < y + height
          end

          if intersects
            affected_agents << agent
            handle_affected_agent(agent)
          end
        end

        # Broadcast aisle blocked event
        ActionCable.server.broadcast("simulation_#{@simulation_run.id}", {
          type: 'aisle_blocked',
          obstacle: obstacle.as_json,
          affected_robots: affected_agents.map(&:id),
          tick: @current_tick
        })

        { obstacle: obstacle, affected_agents: affected_agents.map(&:name) }
      end
    end

    private

    def handle_affected_agent(agent)
      agent.status = 'REROUTING'
      SimulationEvent.create!(
        simulation_run_id: @simulation_run.id,
        robot_id: agent.id,
        event_type: 'REROUTE',
        message: "#{agent.name} path intersects newly blocked aisle; recalculating trajectory",
        metadata: { robot_id: agent.id },
        tick: @current_tick
      )

      # Attempt rerouting
      agent.recalculate_path(@warehouse, @coordinator.reservation_manager, @current_tick)

      # If path is impossible, task reassignment is triggered
      if agent.status == 'BLOCKED' && agent.current_task.present?
        db_robot = @warehouse.robots.find_by(id: agent.id)
        all_db_robots = @warehouse.robots.to_a
        @coordinator.task_allocator.reassign_task(
          agent.current_task,
          db_robot,
          all_db_robots,
          simulation_run: @simulation_run,
          current_tick: @current_tick
        )
      end
    end

    def sync_db_robot_states
      @agents.each do |agent|
        r = @warehouse.robots.find_by(id: agent.id)
        next unless r

        r.update_columns(
          position_x: agent.position_x,
          position_y: agent.position_y,
          target_x: agent.target_x,
          target_y: agent.target_y,
          status: agent.status,
          battery: agent.battery,
          current_task_id: agent.current_task&.id,
          updated_at: Time.current
        )
      end
    end

    def broadcast_tick(tick_result)
      ActionCable.server.broadcast("simulation_#{@simulation_run.id}", {
        type: 'simulation_tick',
        data: tick_result
      })
    rescue StandardError => e
      Rails.logger.error("Failed to broadcast simulation tick: #{e.message}")
    end
  end
end
