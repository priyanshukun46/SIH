# frozen_string_literal: true

module Simulation
  class RobotAgent
    attr_accessor :id, :name, :color, :speed, :battery,
                  :position_x, :position_y,
                  :target_x, :target_y,
                  :status, :priority,
                  :current_task, :path,
                  :waiting_ticks, :intended_next_position,
                  :heading, :total_distance_traveled,
                  :last_action

    def initialize(robot)
      @id = robot.id
      @name = robot.name
      @color = robot.color || '#3B82F6'
      @speed = robot.speed || 1.0
      @battery = robot.battery || 100.0
      @position_x = robot.position_x
      @position_y = robot.position_y
      @target_x = robot.target_x
      @target_y = robot.target_y
      @status = robot.status
      @priority = robot.priority || 1
      @current_task = robot.current_task
      @waiting_ticks = 0
      @total_distance_traveled = 0
      @heading = 'RIGHT'
      @last_action = :NONE

      # Load current active route if any
      active_route = robot.routes.where(status: %w[PLANNED ACTIVE]).order(created_at: :desc).first
      @path = active_route&.path ? active_route.path.map { |pt| [pt[0].to_i, pt[1].to_i] } : []

      # If path is present and first point is current position, pop it so next point is path[0]
      if @path.any? && @path.first == current_position
        @path.shift
      end
    end

    def current_position
      [@position_x, @position_y]
    end

    def remaining_distance
      if @path.any?
        @path.size
      elsif @target_x && @target_y
        (@target_x - @position_x).abs + (@target_y - @position_y).abs
      else
        0
      end
    end

    def determine_intent(current_tick, reservation_manager)
      if @path.empty?
        @intended_next_position = current_position
        return
      end

      # Next intended position is the first waypoint in path
      @intended_next_position = @path.first
    end

    def apply_decision(decision, current_tick, warehouse, reservation_manager)
      action = decision[:action]
      @last_action = action

      case action
      when :MOVE
        move_to(decision[:next_position])
        @waiting_ticks = 0
        @status = 'MOVING'
      when :WAIT
        @waiting_ticks += 1
        @status = 'WAITING'
      when :REROUTE
        @status = 'REROUTING'
        recalculate_path(warehouse, reservation_manager, current_tick)
      when :BLOCKED
        @status = 'BLOCKED'
        @waiting_ticks += 1
      end

      drain_battery(action == :MOVE ? 0.05 : 0.01)
    end

    def move_to(new_pos)
      return if new_pos == current_position

      dx = new_pos[0] - @position_x
      dy = new_pos[1] - @position_y

      # Update heading
      if dx > 0
        @heading = 'RIGHT'
      elsif dx < 0
        @heading = 'LEFT'
      elsif dy > 0
        @heading = 'DOWN'
      elsif dy < 0
        @heading = 'UP'
      end

      @position_x = new_pos[0]
      @position_y = new_pos[1]
      @total_distance_traveled += 1

      # Pop reached waypoint
      if @path.any? && @path.first == new_pos
        @path.shift
      end
    end

    def recalculate_path(warehouse, reservation_manager, current_tick)
      return if @target_x.nil? || @target_y.nil?

      # Clear future reservations for this robot
      reservation_manager.release_robot_from(@id, start_tick: current_tick)

      # Build time reservations hash excluding self
      time_res = {}
      reservation_manager.reservations.each do |(x, y, t), data|
        time_res[[x, y, t]] = data[:robot_id] if data[:robot_id] != @id
      end

      planner = PathPlanning::AStar.new(
        warehouse: warehouse,
        time_reservations: time_res,
        current_robot_id: @id
      )

      new_path = planner.find_path(
        current_position,
        [@target_x, @target_y],
        start_tick: current_tick
      )

      if new_path.any?
        # Remove current position if it's the first element
        new_path.shift if new_path.first == current_position
        @path = new_path
        @intended_next_position = @path.first || current_position
        @waiting_ticks = 0

        # Reserve new path
        reservation_manager.reserve_path(@id, @path, start_tick: current_tick + 1, priority: @priority)
      else
        # Cannot find path -> blocked
        @status = 'BLOCKED'
        @intended_next_position = current_position
      end
    end

    def drain_battery(amount)
      @battery = [0.0, (@battery - amount).round(2)].max
    end

    def to_h
      {
        id: @id,
        name: @name,
        color: @color,
        position_x: @position_x,
        position_y: @position_y,
        target_x: @target_x,
        target_y: @target_y,
        status: @status,
        battery: @battery,
        speed: @speed,
        priority: @priority,
        current_task_id: @current_task&.id,
        heading: @heading,
        waiting_ticks: @waiting_ticks,
        path: @path,
        last_action: @last_action
      }
    end
  end
end
