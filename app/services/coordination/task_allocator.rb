# frozen_string_literal: true

module Coordination
  class TaskAllocator
    attr_reader :warehouse

    def initialize(warehouse:)
      @warehouse = warehouse
    end

    # Finds the best robot candidate for a given task
    def find_best_robot(task, candidate_robots)
      available_robots = candidate_robots.reject do |r|
        r.status == 'ERROR' || r.battery < 15.0
      end

      return nil if available_robots.empty?

      # Prefer completely IDLE robots, then sort by score
      available_robots.min_by do |robot|
        calculate_candidate_cost(robot, task)
      end
    end

    # Scores candidate suitability (lower score is better)
    def calculate_candidate_cost(robot, task)
      dist_to_pickup = (robot.position_x - task.pickup_x).abs + (robot.position_y - task.pickup_y).abs
      workload_penalty = (robot.current_task_id.present? || robot.status != 'IDLE') ? 50.0 : 0.0
      battery_penalty = (100.0 - robot.battery) * 0.2

      dist_to_pickup + workload_penalty + battery_penalty
    end

    # Reassigns a blocked or stuck task to another robot
    def reassign_task(task, blocked_robot, all_robots, simulation_run: nil, current_tick: 0)
      other_candidates = all_robots.reject { |r| r.id == blocked_robot.id }
      new_robot = find_best_robot(task, other_candidates)

      return nil unless new_robot

      old_robot_name = blocked_robot.name
      new_robot_name = new_robot.name

      ActiveRecord::Base.transaction do
        # Free old robot
        blocked_robot.update!(current_task_id: nil, status: 'IDLE')

        # Assign to new robot
        task.update!(assigned_robot_id: new_robot.id, status: 'ASSIGNED')
        new_robot.update!(current_task_id: task.id, status: 'MOVING', target_x: task.pickup_x, target_y: task.pickup_y)

        # Plan new route
        resolver = PathPlanning::RouteResolver.new(warehouse: warehouse)
        route_plan = resolver.resolve_task_route(new_robot, task, start_tick: current_tick)

        if route_plan && route_plan[:full_path].any? && simulation_run
          Route.where(robot_id: new_robot.id, simulation_run_id: simulation_run.id).delete_all
          Route.create!(
            robot_id: new_robot.id,
            task_id: task.id,
            simulation_run_id: simulation_run.id,
            path: route_plan[:full_path],
            status: 'ACTIVE'
          )
        end

        if simulation_run
          SimulationEvent.create!(
            simulation_run_id: simulation_run.id,
            robot_id: new_robot.id,
            event_type: 'TASK_REASSIGNED',
            message: "Task ##{task.id} (#{task.name}) reassigned from #{old_robot_name} to #{new_robot_name}",
            metadata: {
              task_id: task.id,
              previous_robot_id: blocked_robot.id,
              new_robot_id: new_robot.id
            },
            tick: current_tick
          )
        end
      end

      { task: task, previous_robot: blocked_robot, new_robot: new_robot }
    end
  end
end
