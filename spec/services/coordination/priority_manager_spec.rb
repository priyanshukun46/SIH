# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Coordination::PriorityManager do
  let(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let(:robot_a) { warehouse.robots.first }
  let(:robot_b) { warehouse.robots.second }
  let(:agent_a) { Simulation::RobotAgent.new(robot_a) }
  let(:agent_b) { Simulation::RobotAgent.new(robot_b) }

  describe '.calculate_effective_priority' do
    it 'computes priority based on task urgency and robot priority' do
      score = described_class.calculate_effective_priority(agent_a)
      expect(score).to be > 0
    end

    it 'increases effective priority as waiting ticks increase (anti-starvation)' do
      initial_score = described_class.calculate_effective_priority(agent_a)
      agent_a.waiting_ticks = 10
      boosted_score = described_class.calculate_effective_priority(agent_a)

      expect(boosted_score).to be > initial_score
    end
  end

  describe '.compare' do
    it 'favors agent with higher priority or longer waiting time' do
      agent_a.waiting_ticks = 20
      agent_b.waiting_ticks = 0

      expect(described_class.compare(agent_a, agent_b)).to eq(:a_wins)
    end
  end
end
