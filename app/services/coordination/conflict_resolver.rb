# frozen_string_literal: true

module Coordination
  class ConflictResolver
    CONFLICT_SAME_CELL     = 'SAME_CELL_COLLISION'
    CONFLICT_HEAD_ON       = 'HEAD_ON_COLLISION'
    CONFLICT_PATH_CROSSING = 'PATH_CROSSING'
    CONFLICT_INTERSECTION  = 'INTERSECTION_CONFLICT'
    CONFLICT_FOLLOWING     = 'FOLLOWING_CONFLICT'
    CONFLICT_DEADLOCK      = 'DEADLOCK'

    attr_reader :simulation_run, :mode, :events_to_create

    def initialize(simulation_run:, mode: 'DISTRIBUTED')
      @simulation_run = simulation_run
      @mode = mode # 'BASELINE' or 'DISTRIBUTED'
      @events_to_create = []
    end

    # Analyzes agents' intended moves for next tick and resolves conflicts.
    # Returns a hash of decisions: { robot_id => { action: :MOVE | :WAIT | :REROUTE, next_position: [x, y], reason: String } }
    def resolve_conflicts(agents, current_tick, reservation_manager, warehouse)
      @events_to_create = []
      decisions = {}

      # Pre-populate decisions with default intention for each agent
      agents.each do |agent|
        next_pos = agent.intended_next_position || agent.current_position
        decisions[agent.id] = {
          agent: agent,
          action: (next_pos == agent.current_position) ? :WAIT : :MOVE,
          next_position: next_pos,
          reason: 'Clear trajectory'
        }
      end

      # Iteratively detect and resolve pairwise conflicts
      active_agents = agents.reject { |a| a.status == 'COMPLETED' || a.status == 'ERROR' }

      conflicts_found = true
      passes = 0
      max_passes = 10 # Prevent any infinite loop in resolver

      while conflicts_found && passes < max_passes
        conflicts_found = false
        passes += 1

        active_agents.combination(2).each do |agent_a, agent_b|
          dec_a = decisions[agent_a.id]
          dec_b = decisions[agent_b.id]

          conflict_type, conflict_cell = detect_conflict(agent_a, dec_a, agent_b, dec_b, current_tick, reservation_manager)
          next unless conflict_type

          conflicts_found = true
          resolve_pair(agent_a, dec_a, agent_b, dec_b, conflict_type, conflict_cell, current_tick, warehouse)
        end
      end

      decisions
    end

    private

    def detect_conflict(agent_a, dec_a, agent_b, dec_b, current_tick, reservation_manager)
      pos_a_now = agent_a.current_position
      pos_b_now = agent_b.current_position
      target_a = dec_a[:next_position]
      target_b = dec_b[:next_position]

      # 1. Same-cell collision (both want the same cell at next tick)
      if target_a == target_b && (dec_a[:action] == :MOVE || dec_b[:action] == :MOVE)
        return [CONFLICT_SAME_CELL, target_a]
      end

      # 2. Head-on collision (swapping cells: A -> B and B -> A)
      if target_a == pos_b_now && target_b == pos_a_now && dec_a[:action] == :MOVE && dec_b[:action] == :MOVE
        return [CONFLICT_HEAD_ON, target_a]
      end

      # 3. Following conflict (A moves into B's current cell while B is stopped/waiting)
      if target_a == pos_b_now && dec_b[:action] == :WAIT && dec_a[:action] == :MOVE
        return [CONFLICT_FOLLOWING, target_a]
      end
      if target_b == pos_a_now && dec_a[:action] == :WAIT && dec_b[:action] == :MOVE
        return [CONFLICT_FOLLOWING, target_b]
      end

      # 4. Path crossing conflict (diagonal or perpendicular crossing)
      if crossing_conflict?(pos_a_now, target_a, pos_b_now, target_b)
        return [CONFLICT_PATH_CROSSING, target_a]
      end

      # 5. Baseline Mode: Intersection zone conflict
      # In baseline, if two robots are approaching an intersection within 2 tiles, the lower priority stops
      if @mode == 'BASELINE' && approaching_intersection?(target_a, target_b)
        return [CONFLICT_INTERSECTION, target_a]
      end

      nil
    end

    def resolve_pair(agent_a, dec_a, agent_b, dec_b, conflict_type, conflict_cell, current_tick, warehouse)
      if @mode == 'BASELINE'
        # Baseline stop-and-wait: robot with higher ID stops unconditionally until area is clear
        winner, loser = (agent_a.id < agent_b.id) ? [agent_a, agent_b] : [agent_b, agent_a]
        apply_yield(winner, loser, (winner == agent_a ? dec_a : dec_b), (loser == agent_a ? dec_a : dec_b), conflict_type, conflict_cell, current_tick, force_wait: true)
      else
        # Distributed mode: negotiation via Effective Priority
        outcome = PriorityManager.compare(agent_a, agent_b)
        winner, loser, winner_dec, loser_dec = if outcome == :a_wins
                                                  [agent_a, agent_b, dec_a, dec_b]
                                                else
                                                  [agent_b, agent_a, dec_b, dec_a]
                                                end

        apply_yield(winner, loser, winner_dec, loser_dec, conflict_type, conflict_cell, current_tick, force_wait: false)
      end
    end

    def apply_yield(winner, loser, winner_dec, loser_dec, conflict_type, conflict_cell, current_tick, force_wait: false)
      # Winner keeps moving
      # Loser yields: either WAIT or REROUTE
      action = if loser_dec[:action] == :REROUTE || conflict_type == CONFLICT_HEAD_ON || loser.waiting_ticks >= 3
                 :REROUTE
               elsif force_wait
                 :WAIT
               else
                 :WAIT
               end

      loser_dec[:action] = action
      loser_dec[:next_position] = loser.current_position # Don't move to conflict cell
      loser_dec[:reason] = "Yielded to #{winner.name} due to #{conflict_type} at (#{conflict_cell[0]}, #{conflict_cell[1]})"

      # If winner wanted to step into loser's current cell, winner must WAIT until loser moves away
      if winner_dec[:next_position] == loser.current_position
        winner_dec[:action] = :WAIT
        winner_dec[:next_position] = winner.current_position
        winner_dec[:reason] = "Waiting for #{loser.name} to vacate (#{loser.current_position[0]}, #{loser.current_position[1]})"
      end

      @events_to_create << {
        simulation_run_id: @simulation_run.id,
        robot_id: loser.id,
        event_type: action == :REROUTE ? 'REROUTE' : 'YIELD',
        message: "#{loser.name} #{action == :REROUTE ? 'rerouted' : 'yielded'} to #{winner.name} at intersection (#{conflict_cell[0]},#{conflict_cell[1]}) [#{conflict_type}]",
        metadata: {
          conflict_type: conflict_type,
          winner_id: winner.id,
          loser_id: loser.id,
          action: action,
          cell: conflict_cell
        },
        tick: current_tick
      }
    end

    def crossing_conflict?(a_from, a_to, b_from, b_to)
      # Check if paths cross diagonally
      # (e.g., A from (0,0) to (1,1) while B from (1,0) to (0,1))
      # In grid, diagonal moves aren't standard, but perpendicular turns sharing a corner can conflict
      (a_from[0] == b_to[0] && a_to[0] == b_from[0] && a_from[1] == b_to[1] && a_to[1] == b_from[1])
    end

    def approaching_intersection?(target_a, target_b)
      # True if both targets are within 1 Manhattan step of each other
      (target_a[0] - target_b[0]).abs + (target_a[1] - target_b[1]).abs <= 1
    end
  end
end
