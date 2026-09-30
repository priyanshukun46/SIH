# frozen_string_literal: true

module Simulation
  class MovementEngine
    def self.apply_decisions(agents, decisions, current_tick, warehouse, reservation_manager)
      agents.each do |agent|
        decision = decisions[agent.id]
        next unless decision

        agent.apply_decision(decision, current_tick, warehouse, reservation_manager)
      end
    end
  end
end
