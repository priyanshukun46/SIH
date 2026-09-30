class Route < ApplicationRecord
  belongs_to :robot
  belongs_to :task, optional: true
  belongs_to :simulation_run, optional: true

  validates :status, inclusion: { in: %w[PLANNED ACTIVE COMPLETED CANCELLED] }

  def waypoints
    path || []
  end
end
