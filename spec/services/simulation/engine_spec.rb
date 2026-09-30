# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Simulation::Engine do
  let(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let(:sim_run) { warehouse.simulation_runs.create!(mode: 'DISTRIBUTED', status: 'IDLE') }
  let(:engine) { described_class.new(sim_run) }

  describe '#step' do
    it 'advances the simulation by one tick and updates states' do
      initial_tick = engine.current_tick
      result = engine.step

      expect(engine.current_tick).to eq(initial_tick + 1)
      expect(result[:tick]).to eq(engine.current_tick)
      expect(result[:agents]).not_to be_empty
      expect(sim_run.reload.total_ticks).to eq(engine.current_tick)
    end
  end

  describe '#block_aisle' do
    it 'creates an obstacle and reroutes affected robots' do
      engine.step
      result = engine.block_aisle(5, 5, width: 2, height: 1)

      expect(result[:obstacle]).to be_persisted
      expect(result[:obstacle].obstacle_type).to eq('BLOCKED_AISLE')
      expect(warehouse.obstacles.where(active: true, obstacle_type: 'BLOCKED_AISLE')).to exist
    end
  end

  describe '#run_steps' do
    it 'runs multiple discrete simulation steps synchronously' do
      steps = engine.run_steps(5)
      expect(steps.size).to eq(5)
      expect(engine.current_tick).to eq(5)
    end
  end
end
