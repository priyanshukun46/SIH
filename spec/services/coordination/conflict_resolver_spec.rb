# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Coordination::ConflictResolver do
  let(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let(:sim_run) { warehouse.simulation_runs.create!(mode: 'DISTRIBUTED', status: 'RUNNING') }
  let(:reservation_manager) { Coordination::ReservationManager.new }
  let(:resolver) { described_class.new(simulation_run: sim_run, mode: 'DISTRIBUTED') }

  let(:robot_1) { warehouse.robots.first }
  let(:robot_2) { warehouse.robots.second }
  let(:agent_1) { Simulation::RobotAgent.new(robot_1) }
  let(:agent_2) { Simulation::RobotAgent.new(robot_2) }

  describe '#resolve_conflicts' do
    it 'detects and resolves same-cell conflict by yielding lower priority robot' do
      # Both agents want to enter cell [5, 5]
      agent_1.position_x = 4
      agent_1.position_y = 5
      agent_1.path = [[5, 5]]
      agent_1.priority = 5

      agent_2.position_x = 5
      agent_2.position_y = 4
      agent_2.path = [[5, 5]]
      agent_2.priority = 1

      agent_1.determine_intent(1, reservation_manager)
      agent_2.determine_intent(1, reservation_manager)

      decisions = resolver.resolve_conflicts([agent_1, agent_2], 1, reservation_manager, warehouse)

      # Higher priority agent_1 gets :MOVE, lower priority agent_2 yields (:WAIT or :REROUTE)
      expect(decisions[agent_1.id][:action]).to eq(:MOVE)
      expect(decisions[agent_2.id][:action]).to be_in([:WAIT, :REROUTE])
      expect(resolver.events_to_create).not_to be_empty
    end

    it 'detects head-on collision and forces reroute' do
      # Agent 1 at [4, 5] wanting [5, 5]
      # Agent 2 at [5, 5] wanting [4, 5]
      agent_1.position_x = 4
      agent_1.position_y = 5
      agent_1.path = [[5, 5]]
      agent_1.priority = 5

      agent_2.position_x = 5
      agent_2.position_y = 5
      agent_2.path = [[4, 5]]
      agent_2.priority = 1

      agent_1.determine_intent(1, reservation_manager)
      agent_2.determine_intent(1, reservation_manager)

      decisions = resolver.resolve_conflicts([agent_1, agent_2], 1, reservation_manager, warehouse)

      expect(decisions[agent_2.id][:action]).to eq(:REROUTE)
      expect(decisions[agent_1.id][:action]).to eq(:WAIT)
    end
  end
end
