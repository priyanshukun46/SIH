class RobotState < ApplicationRecord
  belongs_to :robot
  belongs_to :simulation_run

  validates :tick, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :position_x, :position_y, presence: true
end
