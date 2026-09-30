class SimulationEvent < ApplicationRecord
  belongs_to :simulation_run
  belongs_to :robot, optional: true

  validates :event_type, presence: true
  validates :message, presence: true

  EVENT_TYPES = %w[
    CONFLICT
    YIELD
    WAIT
    REROUTE
    DEADLOCK_DETECTED
    DEADLOCK_RESOLVED
    TASK_ASSIGNED
    TASK_REASSIGNED
    TASK_COMPLETED
    AISLE_BLOCKED
    SIMULATION_STARTED
    SIMULATION_PAUSED
    SIMULATION_RESET
    SIMULATION_COMPLETED
  ].freeze
end
