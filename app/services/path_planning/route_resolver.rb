# frozen_string_literal: true

module PathPlanning
  class RouteResolver
    attr_reader :warehouse

    def initialize(warehouse:)
      @warehouse = warehouse
    end

    def resolve_task_route(robot, task, time_reservations: {}, start_tick: 0)
      start_pos = [robot.position_x, robot.position_y]
      pickup_pos = [task.pickup_x, task.pickup_y]
      dest_pos = [task.destination_x, task.destination_y]

      planner = PathPlanning::AStar.new(
        warehouse: warehouse,
        time_reservations: time_reservations,
        current_robot_id: robot.id
      )

      # Phase 1: To Pickup
      to_pickup = planner.find_path(start_pos, pickup_pos, start_tick: start_tick)
      return nil if to_pickup.empty? && start_pos != pickup_pos

      # Phase 2: Pickup to Destination
      pickup_tick = start_tick + [to_pickup.size - 1, 0].max
      to_dest = planner.find_path(pickup_pos, dest_pos, start_tick: pickup_tick)
      return nil if to_dest.empty? && pickup_pos != dest_pos

      full_path = if to_pickup.any? && to_dest.any?
                    to_pickup + to_dest[1..]
                  elsif to_pickup.any?
                    to_pickup
                  else
                    to_dest
                  end

      {
        to_pickup: to_pickup,
        to_destination: to_dest,
        full_path: full_path
      }
    end
  end
end
