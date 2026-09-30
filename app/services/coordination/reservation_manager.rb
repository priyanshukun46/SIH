# frozen_string_literal: true

module Coordination
  class ReservationManager
    attr_reader :reservations

    def initialize
      # @reservations: { [x, y, tick] => { robot_id: Integer, priority: Float } }
      @reservations = {}
      @lock = Monitor.new
    end

    def reserve(robot_id, x, y, tick, priority: 1.0)
      @lock.synchronize do
        existing = @reservations[[x, y, tick]]
        if existing && existing[:robot_id] != robot_id
          false # Conflict
        else
          @reservations[[x, y, tick]] = { robot_id: robot_id, priority: priority }
          true
        end
      end
    end

    def reserve_path(robot_id, path, start_tick: 0, priority: 1.0)
      @lock.synchronize do
        # First verify entire path is reservable
        conflicts = find_path_conflicts(robot_id, path, start_tick: start_tick)
        return false if conflicts.any?

        # Reserve each cell
        path.each_with_index do |point, idx|
          tick = start_tick + idx
          @reservations[[point[0], point[1], tick]] = { robot_id: robot_id, priority: priority }
        end
        true
      end
    end

    def release_robot_from(robot_id, start_tick: 0)
      @lock.synchronize do
        @reservations.delete_if do |(_x, _y, tick), data|
          data[:robot_id] == robot_id && tick >= start_tick
        end
      end
    end

    def clear_robot(robot_id)
      @lock.synchronize do
        @reservations.delete_if { |_key, data| data[:robot_id] == robot_id }
      end
    end

    def prune_before(tick)
      @lock.synchronize do
        @reservations.delete_if { |(_x, _y, t), _data| t < tick }
      end
    end

    def reserved_by(x, y, tick)
      res = @reservations[[x, y, tick]]
      res ? res[:robot_id] : nil
    end

    def available?(x, y, tick, for_robot_id: nil)
      res = @reservations[[x, y, tick]]
      res.nil? || (for_robot_id && res[:robot_id] == for_robot_id)
    end

    def find_path_conflicts(robot_id, path, start_tick: 0)
      conflicts = []
      path.each_with_index do |point, idx|
        tick = start_tick + idx
        res = @reservations[[point[0], point[1], tick]]
        if res && res[:robot_id] != robot_id
          conflicts << {
            point: point,
            tick: tick,
            conflicting_robot_id: res[:robot_id],
            conflicting_priority: res[:priority]
          }
        end
      end
      conflicts
    end

    def export_snapshot
      @lock.synchronize do
        @reservations.map do |(x, y, tick), data|
          { x: x, y: y, tick: tick, robot_id: data[:robot_id], priority: data[:priority] }
        end
      end
    end

    def clear!
      @lock.synchronize { @reservations.clear }
    end
  end
end
