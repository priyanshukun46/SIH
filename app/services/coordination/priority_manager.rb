# frozen_string_literal: true

module Coordination
  class PriorityManager
    def self.calculate_effective_priority(agent)
      task_priority = agent.current_task ? agent.current_task.priority.to_f : 1.0
      robot_base_priority = agent.priority.to_f
      wait_ticks = agent.waiting_ticks.to_f
      dist_to_goal = agent.remaining_distance.to_f
      battery = agent.battery.to_f

      # Effective Priority calculation:
      # High weight on task urgency
      # Continuous anti-starvation ramp via wait_ticks
      # Distance efficiency incentive
      # Battery consideration
      score = (task_priority * 3.0) +
              (robot_base_priority * 2.0) +
              (wait_ticks * 0.75) -
              (dist_to_goal * 0.05) +
              (battery > 20.0 ? 0.0 : -1.5)

      [score, 0.1].max.round(3)
    end

    def self.compare(agent_a, agent_b)
      p_a = calculate_effective_priority(agent_a)
      p_b = calculate_effective_priority(agent_b)

      if p_a > p_b
        :a_wins
      elsif p_b > p_a
        :b_wins
      else
        # Deterministic tie-breaker by robot id
        agent_a.id < agent_b.id ? :a_wins : :b_wins
      end
    end
  end
end
