# frozen_string_literal: true

require 'set'

module PathPlanning
  class AStar
    DIRECTIONS = [
      [0, -1], # Up
      [1, 0],  # Right
      [0, 1],  # Down
      [-1, 0]  # Left
    ].freeze

    attr_reader :warehouse, :width, :height, :blocked_cells, :time_reservations, :current_robot_id

    def initialize(warehouse:, blocked_cells: [], time_reservations: {}, current_robot_id: nil)
      @warehouse = warehouse
      @width = warehouse.width
      @height = warehouse.height
      @blocked_cells = Set.new(blocked_cells)
      @time_reservations = time_reservations || {}
      @current_robot_id = current_robot_id
    end

    # Finds a path from start to goal.
    # Returns an array of coordinates: [[x0, y0], [x1, y1], [x2, y2], ...]
    # Returns empty array [] if no route is found.
    def find_path(start, goal, start_tick: 0, max_ticks: 200, allow_wait: true)
      return [] if start.nil? || goal.nil?
      return [start] if start == goal

      start_x, start_y = start
      goal_x, goal_y = goal

      # Check if start or goal is statically blocked
      return [] unless valid_cell?(start_x, start_y)
      return [] unless valid_cell?(goal_x, goal_y)

      # Space-time search when reservations are present or allow_wait is true
      if @time_reservations.any? || allow_wait
        find_space_time_path(start, goal, start_tick, max_ticks)
      else
        find_spatial_path(start, goal)
      end
    end

    private

    def find_space_time_path(start, goal, start_tick, max_ticks)
      start_state = [start[0], start[1], start_tick]
      goal_pos = [goal[0], goal[1]]

      open_set = [start_state]
      came_from = {}
      g_score = { start_state => 0 }
      f_score = { start_state => heuristic(start[0], start[1], goal_pos[0], goal_pos[1]) }
      closed_set = Set.new

      while open_set.any?
        # Pop lowest f_score
        open_set.sort_by! { |s| f_score[s] || Float::INFINITY }
        current = open_set.shift
        cx, cy, ct = current

        if [cx, cy] == goal_pos
          return reconstruct_path(came_from, current)
        end

        closed_set.add(current)
        next if ct - start_tick >= max_ticks

        neighbors = space_time_neighbors(cx, cy, ct)
        neighbors.each do |neighbor|
          next if closed_set.include?(neighbor)

          # Slight penalty for waiting to prioritize moving forward
          step_cost = ([neighbor[0], neighbor[1]] == [cx, cy]) ? 1.2 : 1.0
          tentative_g = g_score[current] + step_cost

          if tentative_g < (g_score[neighbor] || Float::INFINITY)
            came_from[neighbor] = current
            g_score[neighbor] = tentative_g
            f_score[neighbor] = tentative_g + heuristic(neighbor[0], neighbor[1], goal_pos[0], goal_pos[1])

            open_set << neighbor unless open_set.include?(neighbor)
          end
        end
      end

      [] # Impossible route
    end

    def find_spatial_path(start, goal)
      start_pos = [start[0], start[1]]
      goal_pos = [goal[0], goal[1]]

      open_set = [start_pos]
      came_from = {}
      g_score = { start_pos => 0 }
      f_score = { start_pos => heuristic(start_pos[0], start_pos[1], goal_pos[0], goal_pos[1]) }
      closed_set = Set.new

      while open_set.any?
        open_set.sort_by! { |s| f_score[s] || Float::INFINITY }
        current = open_set.shift

        return reconstruct_spatial_path(came_from, current) if current == goal_pos

        closed_set.add(current)
        cx, cy = current

        DIRECTIONS.each do |dx, dy|
          nx, ny = cx + dx, cy + dy
          neighbor = [nx, ny]

          next unless valid_cell?(nx, ny)
          next if @blocked_cells.include?(neighbor)
          next if closed_set.include?(neighbor)

          tentative_g = g_score[current] + 1.0

          if tentative_g < (g_score[neighbor] || Float::INFINITY)
            came_from[neighbor] = current
            g_score[neighbor] = tentative_g
            f_score[neighbor] = tentative_g + heuristic(nx, ny, goal_pos[0], goal_pos[1])

            open_set << neighbor unless open_set.include?(neighbor)
          end
        end
      end

      []
    end

    def space_time_neighbors(cx, cy, ct)
      candidates = []
      next_t = ct + 1

      # 4 orthogonal movements
      DIRECTIONS.each do |dx, dy|
        nx = cx + dx
        ny = cy + dy
        next unless valid_cell?(nx, ny)
        next if @blocked_cells.include?([nx, ny])

        # Conflict with reservations:
        res_robot = @time_reservations[[nx, ny, next_t]]
        next if res_robot && res_robot != @current_robot_id

        # Edge swap conflict:
        # Another robot at (nx, ny) at ct moving to (cx, cy) at next_t
        reverse_res = @time_reservations[[cx, cy, next_t]]
        occupant_now = @time_reservations[[nx, ny, ct]]
        next if reverse_res && occupant_now && reverse_res == occupant_now && reverse_res != @current_robot_id

        candidates << [nx, ny, next_t]
      end

      # Option to wait at current cell
      wait_res = @time_reservations[[cx, cy, next_t]]
      if !wait_res || wait_res == @current_robot_id
        candidates << [cx, cy, next_t]
      end

      candidates
    end

    def valid_cell?(x, y)
      return false if x < 0 || x >= width || y < 0 || y >= height
      warehouse.traversable?(x, y)
    end

    def heuristic(x1, y1, x2, y2)
      (x1 - x2).abs + (y1 - y2).abs
    end

    def reconstruct_path(came_from, current)
      total_path = [current]
      while came_from.key?(current)
        current = came_from[current]
        total_path.unshift(current)
      end
      # Return array of coordinates [x, y]
      total_path.map { |x, y, _t| [x, y] }
    end

    def reconstruct_spatial_path(came_from, current)
      total_path = [current]
      while came_from.key?(current)
        current = came_from[current]
        total_path.unshift(current)
      end
      total_path
    end
  end
end
