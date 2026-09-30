# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Coordination::TaskAllocator do
  let(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let(:allocator) { described_class.new(warehouse: warehouse) }

  describe '#find_best_robot' do
    it 'selects the closest available robot with sufficient battery' do
      task = warehouse.tasks.create!(
        name: "Test Task",
        pickup_x: 2, pickup_y: 2,
        destination_x: 10, destination_y: 10,
        status: 'PENDING'
      )

      best = allocator.find_best_robot(task, warehouse.robots)
      # Robot AMR-01 starts at [0, 2], closest to [2, 2]
      expect(best).not_to be_nil
      expect(best.position_x).to eq(0)
      expect(best.position_y).to eq(2)
    end
  end

  describe '#reassign_task' do
    it 'reassigns a task from a blocked robot to an alternative robot' do
      r1 = warehouse.robots.first
      r2 = warehouse.robots.second

      task = warehouse.tasks.create!(
        name: "Blocked Task",
        pickup_x: 5, pickup_y: 5,
        destination_x: 10, destination_y: 10,
        assigned_robot_id: r1.id,
        status: 'ASSIGNED'
      )
      r1.update!(current_task_id: task.id, status: 'BLOCKED')

      result = allocator.reassign_task(task, r1, warehouse.robots)

      expect(result).not_to be_nil
      expect(result[:new_robot].id).not_to eq(r1.id)
      expect(task.reload.assigned_robot_id).to eq(result[:new_robot].id)
    end
  end
end
