# frozen_string_literal: true

require 'set'

module Simulation
  class DeadlockDetector
    # Analyzes agents and their wait dependencies.
    # agents: array of RobotAgent instances
    # decisions: decisions hash from ConflictResolver
    def self.detect(agents, decisions)
      # Map current cell to agent
      cell_occupants = {}
      agents.each do |agent|
        cell_occupants[agent.current_position] = agent
      end

      # Build adjacency list for wait-for graph: agent_id => [waiting_on_agent_ids]
      graph = {}
      agents.each do |agent|
        graph[agent.id] = []
        decision = decisions[agent.id]
        next unless decision

        # If agent is waiting or blocked, check what cell it wanted to move to
        wanted_pos = agent.intended_next_position
        if wanted_pos && wanted_pos != agent.current_position
          occupant = cell_occupants[wanted_pos]
          if occupant && occupant.id != agent.id
            # Agent is waiting for occupant to clear
            graph[agent.id] << occupant.id
          end
        end
      end

      # Find cycles in graph using DFS
      visited = {}
      rec_stack = {}
      cycle_nodes = []

      graph.keys.each do |node|
        if !visited[node]
          cycle = dfs_find_cycle(node, graph, visited, rec_stack, [])
          if cycle.any?
            cycle_nodes = cycle
            break
          end
        end
      end

      if cycle_nodes.any?
        # Select the agent with lowest priority in the cycle to reroute
        cycle_agents = agents.select { |a| cycle_nodes.include?(a.id) }
        breaker = cycle_agents.min_by { |a| Coordination::PriorityManager.calculate_effective_priority(a) }

        {
          deadlocked: true,
          cycle_robot_ids: cycle_nodes,
          breaker_robot_id: breaker ? breaker.id : cycle_nodes.first
        }
      else
        { deadlocked: false, cycle_robot_ids: [], breaker_robot_id: nil }
      end
    end

    private

    def self.dfs_find_cycle(node, graph, visited, rec_stack, path)
      visited[node] = true
      rec_stack[node] = true
      current_path = path + [node]

      (graph[node] || []).each do |neighbor|
        if !visited[neighbor]
          res = dfs_find_cycle(neighbor, graph, visited, rec_stack, current_path)
          return res if res.any?
        elsif rec_stack[neighbor]
          # Cycle detected! Extract the cycle path
          idx = current_path.index(neighbor)
          return current_path[idx..] if idx
          return current_path
        end
      end

      rec_stack[node] = false
      []
    end
  end
end
