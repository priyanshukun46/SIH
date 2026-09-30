class Obstacle < ApplicationRecord
  belongs_to :warehouse

  validates :x, :y, presence: true
  validates :width, :height, numericality: { greater_than: 0 }
  validates :obstacle_type, inclusion: { in: %w[SHELF BLOCKED_AISLE DYNAMIC] }

  scope :active, -> { where(active: true) }

  def covers?(query_x, query_y)
    active? &&
      query_x >= x && query_x < x + width &&
      query_y >= y && query_y < y + height
  end
end
