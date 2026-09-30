class Warehouse < ApplicationRecord
  has_many :robots, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :obstacles, dependent: :destroy
  has_many :simulation_runs, dependent: :destroy

  validates :name, presence: true
  validates :width, :height, presence: true, numericality: { greater_than: 0 }

  CELL_FREE = 0
  CELL_SHELF = 1
  CELL_PICKUP = 2
  CELL_DELIVERY = 3
  CELL_CHARGING = 4

  def cell_type(x, y)
    return CELL_SHELF if x < 0 || x >= width || y < 0 || y >= height
    return CELL_SHELF if active_obstacle_at?(x, y)

    if grid_data.is_a?(Array) && grid_data[y] && grid_data[y][x]
      grid_data[y][x].to_i
    else
      CELL_FREE
    end
  end

  def traversable?(x, y)
    return false if x < 0 || x >= width || y < 0 || y >= height
    return false if active_obstacle_at?(x, y)

    type = cell_type(x, y)
    type != CELL_SHELF
  end

  def active_obstacle_set
    @active_obstacle_set ||= Set.new(obstacles.where(active: true).pluck(:x, :y))
  end

  def reload_active_obstacles!
    @active_obstacle_set = Set.new(obstacles.where(active: true).pluck(:x, :y))
  end

  def active_obstacle_at?(x, y)
    active_obstacle_set.include?([x, y])
  end
end
