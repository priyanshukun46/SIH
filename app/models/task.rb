class Task < ApplicationRecord
  STATUSES = %w[PENDING ASSIGNED IN_PROGRESS BLOCKED REASSIGNED COMPLETED].freeze

  belongs_to :warehouse
  belongs_to :assigned_robot, class_name: 'Robot', foreign_key: :assigned_robot_id, optional: true
  has_many :routes, dependent: :nullify

  validates :name, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :pickup_x, :pickup_y, :destination_x, :destination_y, presence: true

  def pickup_position
    [pickup_x, pickup_y]
  end

  def destination_position
    [destination_x, destination_y]
  end

  def pending?
    status == 'PENDING'
  end

  def assigned?
    status == 'ASSIGNED'
  end

  def in_progress?
    status == 'IN_PROGRESS'
  end

  def completed?
    status == 'COMPLETED'
  end

  def blocked?
    status == 'BLOCKED'
  end
end
