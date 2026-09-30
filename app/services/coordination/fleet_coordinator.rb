# frozen_string_literal: true

module Coordination
  class FleetCoordinator
    attr_reader :warehouse, :simulation_run, :reservation_manager, :conflict_resolver, :task_allocator

    def initialize(warehouse:, simulation_run:)
      @warehouse = warehouse
      @simulation_run = simulation_run
      @reservation_manager = Coordination::ReservationManager.new
      @conflict_resolver = Coordination::ConflictResolver.new(
        simulation_run: simulation_run,
        mode: simulation_run.mode
      )
      @task_allocator = Coordination::TaskAllocator.new(warehouse: warehouse)
    end

    def coordinate_tick(agents, current_tick)
      # 1. Prune outdated reservations
      @reservation_manager.prune_before(current_tick)

      # 2. Collect proposed intentions from all agents
      # Each agent determines its intended move from its planned path
      agents.each do |agent|
        agent.determine_intent(current_tick, @reservation_manager)
      end

      # 3. Detect & resolve conflicts
      decisions = @conflict_resolver.resolve_conflicts(
        agents,
        current_tick,
        @reservation_manager,
        @warehouse
      )

      # 4. Deadlock detection and resolution
      deadlock_info = Simulation::DeadlockDetector.detect(agents, decisions)
      if deadlock_info[:deadlocked]
        handle_deadlock(deadlock_info, agents, decisions, current_tick)
      end

      # 5. Persist events from conflict resolver
      @conflict_resolver.events_to_create.each do |event_data|
        SimulationEvent.create!(event_data)
      end

      { decisions: decisions, deadlock: deadlock_info }
    end

    private

    def handle_deadlock(deadlock_info, agents, decisions, current_tick)
      breaker_id = deadlock_info[:breaker_robot_id]
      breaker_agent = agents.find { |a| a.id == breaker_id }
      return unless breaker_agent

      cycle_names = deadlock_info[:cycle_robot_ids].map do |id|
        ag = agents.find { |a| a.id == id }
        ag ? ag.name : "R#{id}"
      end.join(' -> ')

      # Force breaker agent to REROUTE
      decisions[breaker_id][:action] = :REROUTE
      decisions[breaker_id][:reason] = "Deadlock cycle detected (#{cycle_names}); selected as cycle breaker"

      SimulationEvent.create!(
        simulation_run_id: @simulation_run.id,
        robot_id: breaker_id,
        event_type: 'DEADLOCK_DETECTED',
        message: "Deadlock detected in cycle: #{cycle_names}. Breaking cycle via #{breaker_agent.name}",
        metadata: {
          cycle: deadlock_info[:cycle_robot_ids],
          breaker_id: breaker_id
        },
        tick: current_tick
      )
    end
  end
end
