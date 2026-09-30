# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Simulation::DeadlockDetector do
  let(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let(:robot_1) { warehouse.robots.first }
  let(:robot_2) { warehouse.robots.second }
  let(:agent_1) { Simulation::RobotAgent.new(robot_1) }
  let(:agent_2) { Simulation::RobotAgent.new(robot_2) }

  it 'detects cyclic waiting between two robots' do
    # Agent 1 is at [2, 3] wanting [2, 4] (where Agent 2 is)
    # Agent 2 is at [2, 4] wanting [2, 3] (where Agent 1 is)
    agent_1.position_x = 2
    agent_1.position_y = 3
    agent_1.intended_next_position = [2, 4]

    agent_2.position_x = 2
    agent_2.position_y = 4
    agent_2.intended_next_position = [2, 3]

    decisions = {
      agent_1.id => { action: :WAIT, next_position: [2, 3] },
      agent_2.id => { action: :WAIT, next_position: [2, 4] }
    }

    result = described_class.detect([agent_1, agent_2], decisions)

    expect(result[:deadlocked]).to be true
    expect(result[:cycle_robot_ids]).to include(agent_1.id, agent_2.id)
    expect(result[:breaker_robot_id]).not_to be_nil
  end

  it 'returns false when there is no cyclic dependency' do
    agent_1.position_x = 2
    agent_1.position_y = 3
    agent_1.intended_next_position = [2, 4]

    agent_2.position_x = 2
    agent_2.position_y = 4
    agent_2.intended_next_position = [2, 5] # moving away to free cell

    decisions = {
      agent_1.id => { action: :WAIT, next_position: [2, 3] },
      agent_2.id => { action: :MOVE, next_position: [2, 5] }
    }

    result = described_class.detect([agent_1, agent_2], decisions)

    expect(result[:deadlocked]).to be false
  end
end
