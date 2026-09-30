# frozen_string_literal: true

module PathPlanning
  class PathValidator
    def self.valid?(path, warehouse:, blocked_cells: [])
      return false if path.nil? || path.empty?

      blocked_set = Set.new(blocked_cells)

      path.each do |point|
        x, y = point
        return false unless warehouse.traversable?(x, y)
        return false if blocked_set.include?([x, y])
      end

      true
    end

    def self.find_first_collision(path, warehouse:, blocked_cells: [])
      return nil if path.nil? || path.empty?

      blocked_set = Set.new(blocked_cells)

      path.each_with_index do |point, idx|
        x, y = point
        if !warehouse.traversable?(x, y) || blocked_set.include?([x, y])
          return { index: idx, point: point }
        end
      end

      nil
    end
  end
end
