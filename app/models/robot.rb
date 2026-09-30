class Robot < ApplicationRecord
  STATUSES = %w[IDLE MOVING WAITING BLOCKED REROUTING COMPLETED ERROR].freeze

  belongs_to :warehouse
  belongs_to :current_task, class_name: 'Task', foreign_key: :current_task_id, optional: true
  has_many :robot_states, dependent: :destroy
  has_many :routes, dependent: :destroy
  has_many :simulation_events, foreign_key: :robot_id, dependent: :nullify

  validates :name, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :battery, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :speed, numericality: { greater_than: 0 }

  def current_position
    [position_x, position_y]
  end

  def target_position
    return nil if target_x.nil? || target_y.nil?
    [target_x, target_y]
  end

  def idle?
    status == 'IDLE'
  end

  def blocked?
    status == 'BLOCKED'
  end

  def moving?
    status == 'MOVING'
  end

  def waiting?
    status == 'WAITING'
  end

  def rerouting?
    status == 'REROUTING'
  end
end
