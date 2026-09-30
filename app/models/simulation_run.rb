class SimulationRun < ApplicationRecord
  MODES = %w[BASELINE DISTRIBUTED].freeze
  STATUSES = %w[IDLE RUNNING PAUSED COMPLETED ERROR].freeze

  belongs_to :warehouse
  has_many :robot_states, dependent: :destroy
  has_many :routes, dependent: :destroy
  has_many :simulation_events, dependent: :destroy

  validates :mode, inclusion: { in: MODES }
  validates :status, inclusion: { in: STATUSES }

  def running?
    status == 'RUNNING'
  end

  def paused?
    status == 'PAUSED'
  end

  def completed?
    status == 'COMPLETED'
  end

  def distributed?
    mode == 'DISTRIBUTED'
  end

  def baseline?
    mode == 'BASELINE'
  end
end
