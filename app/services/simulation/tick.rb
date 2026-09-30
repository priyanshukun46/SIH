# frozen_string_literal: true

module Simulation
  class Tick
    attr_reader :warehouse, :simulation_run, :agents, :coordinator, :metrics_collector, :current_tick

    def initialize(warehouse:, simulation_run:, agents:, coordinator:, metrics_collector:, current_tick:)
      @warehouse = warehouse
      @simulation_run = simulation_run
      @agents = agents
      @coordinator = coordinator
      @metrics_collector = metrics_collector
      @current_tick = current_tick
    end

    def execute
      # 1. Coordinate agents (intent, reservation pruning, conflict detection & resolution, deadlock detection)
      coordination_result = @coordinator.coordinate_tick(@agents, @current_tick)
      decisions = coordination_result[:decisions]
      deadlock = coordination_result[:deadlock]

      # Count reroutes in this tick
      reroutes_this_tick = decisions.values.count { |d| d[:action] == :REROUTE }

      # 2. Apply movement decisions
      Simulation::MovementEngine.apply_decisions(
        @agents,
        decisions,
        @current_tick,
        @warehouse,
        @coordinator.reservation_manager
      )

      # 3. Check for any physical safety collisions
      collisions = Simulation::CollisionDetector.detect_physical_collisions(@agents)
      if collisions.any?
        collisions.each do |col|
          SimulationEvent.create!(
            simulation_run_id: @simulation_run.id,
            event_type: 'COLLISION',
            message: "Collision detected at (#{col[:position][0]}, #{col[:position][1]}) involving robots #{col[:robot_ids].join(', ')}",
            metadata: col,
            tick: @current_tick
          )
        end
      end

      # 4. Handle Task progress (pickup & completion)
      handle_tasks_progress

      # 5. Record tick metrics
      @metrics_collector.record_tick(
        @agents,
        collisions: collisions,
        deadlock: deadlock[:deadlocked],
        reroutes: reroutes_this_tick
      )

      # 6. Save periodic robot states (e.g. every tick)
      save_robot_states

      # 7. Check if all tasks completed
      pending_or_active_tasks = @warehouse.tasks.where.not(status: 'COMPLETED').count
      all_done = pending_or_active_tasks.zero? && @agents.all? { |a| a.status == 'IDLE' || a.status == 'COMPLETED' }

      {
        tick: @current_tick,
        agents: @agents.map(&:to_h),
        decisions: decisions.transform_values { |v| v.except(:agent) },
        events: @coordinator.conflict_resolver.events_to_create,
        deadlock: deadlock,
        collisions: collisions,
        metrics: @metrics_collector.to_h,
        all_completed: all_done
      }
    end

    private

    def handle_tasks_progress
      @agents.each do |agent|
        task = agent.current_task
        next unless task

        # Check pickup reached
        if task.status == 'ASSIGNED' && agent.current_position == [task.pickup_x, task.pickup_y]
          task.update!(status: 'IN_PROGRESS')
          agent.target_x = task.destination_x
          agent.target_y = task.destination_y

          SimulationEvent.create!(
            simulation_run_id: @simulation_run.id,
            robot_id: agent.id,
            event_type: 'TASK_PICKUP',
            message: "#{agent.name} picked up cargo for #{task.name} at (#{task.pickup_x}, #{task.pickup_y})",
            metadata: { task_id: task.id },
            tick: @current_tick
          )
        # Check destination reached
        elsif task.status == 'IN_PROGRESS' && agent.current_position == [task.destination_x, task.destination_y]
          task.update!(status: 'COMPLETED', completed_at: Time.current)
          agent.current_task = nil
          agent.target_x = nil
          agent.target_y = nil
          agent.status = 'IDLE'
          @metrics_collector.record_task_completed(agent.waiting_ticks + agent.total_distance_traveled)

          SimulationEvent.create!(
            simulation_run_id: @simulation_run.id,
            robot_id: agent.id,
            event_type: 'TASK_COMPLETED',
            message: "#{agent.name} completed #{task.name} at destination (#{task.destination_x}, #{task.destination_y})",
            metadata: { task_id: task.id },
            tick: @current_tick
          )

          # Try allocating next pending task to this freed agent
          next_task = @warehouse.tasks.where(status: 'PENDING').order(priority: :desc).first
          if next_task
            assign_task_to_agent(next_task, agent)
          end
        end
      end
    end

    def assign_task_to_agent(task, agent)
      task.update!(assigned_robot_id: agent.id, status: 'ASSIGNED')
      agent.current_task = task
      agent.target_x = task.pickup_x
      agent.target_y = task.pickup_y
      agent.status = 'MOVING'

      # Plan route
      resolver = PathPlanning::RouteResolver.new(warehouse: @warehouse)
      route_plan = resolver.resolve_task_route(
        agent,
        task,
        time_reservations: @coordinator.reservation_manager.reservations,
        start_tick: @current_tick
      )

      if route_plan && route_plan[:full_path].any?
        path = route_plan[:full_path]
        path.shift if path.first == agent.current_position
        agent.path = path
        @coordinator.reservation_manager.reserve_path(agent.id, path, start_tick: @current_tick + 1, priority: agent.priority)

        Route.create!(
          robot_id: agent.id,
          task_id: task.id,
          simulation_run_id: @simulation_run.id,
          path: path,
          status: 'ACTIVE'
        )
      end

      SimulationEvent.create!(
        simulation_run_id: @simulation_run.id,
        robot_id: agent.id,
        event_type: 'TASK_ASSIGNED',
        message: "Assigned #{task.name} to #{agent.name} (pickup: #{task.pickup_x},#{task.pickup_y})",
        metadata: { task_id: task.id },
        tick: @current_tick
      )
    end

    def save_robot_states
      now = Time.current
      records = @agents.map do |agent|
        {
          robot_id: agent.id,
          simulation_run_id: @simulation_run.id,
          tick: @current_tick,
          position_x: agent.position_x,
          position_y: agent.position_y,
          velocity_x: 0.0,
          velocity_y: 0.0,
          battery: agent.battery,
          status: agent.status,
          created_at: now,
          updated_at: now
        }
      end
      RobotState.insert_all(records) if records.any?
    end
  end
end
