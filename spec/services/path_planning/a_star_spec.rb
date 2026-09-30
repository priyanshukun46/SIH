# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PathPlanning::AStar do
  let(:warehouse) do
    # Simple 10x10 warehouse with a wall at x=5, y=0..7 with an opening at y=8, 9
    grid = Array.new(10) { Array.new(10, 0) }
    (0..7).each { |y| grid[y][5] = 1 } # Shelf wall

    Warehouse.create!(
      name: "Test Warehouse",
      width: 10,
      height: 10,
      grid_data: grid
    )
  end

  describe '#find_path' do
    it 'finds direct shortest path when no obstacles are in between' do
      planner = described_class.new(warehouse: warehouse)
      path = planner.find_path([0, 0], [3, 0])

      expect(path).not_to be_empty
      expect(path.first).to eq([0, 0])
      expect(path.last).to eq([3, 0])
      expect(path.size).to eq(4) # [0,0], [1,0], [2,0], [3,0]
    end

    it 'navigates around a wall to reach destination' do
      planner = described_class.new(warehouse: warehouse)
      # Start at [4, 2], Goal at [6, 2]. Wall is at x=5 from y=0 to y=7. Opening is at y=8.
      path = planner.find_path([4, 2], [6, 2])

      expect(path).not_to be_empty
      expect(path.first).to eq([4, 2])
      expect(path.last).to eq([6, 2])

      # Verify none of the waypoints hit the shelf
      path.each do |x, y|
        expect(warehouse.cell_type(x, y)).not_to eq(Warehouse::CELL_SHELF)
      end
    end

    it 'returns empty array when goal is inside an obstacle' do
      planner = described_class.new(warehouse: warehouse)
      path = planner.find_path([0, 0], [5, 2]) # [5, 2] is a shelf
      expect(path).to eq([])
    end

    it 'returns empty array when goal is completely blocked' do
      # Enclose cell [9, 9] with obstacles
      warehouse.grid_data[8][9] = 1
      warehouse.grid_data[9][8] = 1
      warehouse.save!

      planner = described_class.new(warehouse: warehouse)
      path = planner.find_path([0, 0], [9, 9])
      expect(path).to eq([])
    end

    it 'respects time reservations and avoids reserved cells at specific ticks' do
      # Reserve [2, 0] at tick 2 for another robot
      reservations = {
        [2, 0, 2] => 99 # Robot 99 reserves [2, 0] at t=2
      }

      planner = described_class.new(
        warehouse: warehouse,
        time_reservations: reservations,
        current_robot_id: 1
      )

      path = planner.find_path([0, 0], [3, 0], start_tick: 0)
      expect(path).not_to be_empty
      expect(path.last).to eq([3, 0])

      # Check that at tick 2, robot is NOT at [2, 0]
      # Path[0] is t=0 ([0,0]), Path[1] is t=1 ([1,0]), Path[2] is t=2
      expect(path[2]).not_to eq([2, 0])
    end
  end
end
