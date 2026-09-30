# frozen_string_literal: true

module Simulation
  class CollisionDetector
    def self.detect_physical_collisions(agents)
      collisions = []
      positions = {}

      agents.each do |agent|
        pos = agent.current_position
        if positions.key?(pos)
          collisions << {
            type: 'PHYSICAL_COLLISION',
            position: pos,
            robot_ids: [positions[pos].id, agent.id]
          }
        else
          positions[pos] = agent
        end
      end

      collisions
    end
  end
end
