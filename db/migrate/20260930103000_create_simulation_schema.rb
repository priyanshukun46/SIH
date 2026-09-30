class CreateSimulationSchema < ActiveRecord::Migration[8.1]
  def change
    create_table :warehouses do |t|
      t.string :name, null: false
      t.integer :width, null: false, default: 30
      t.integer :height, null: false, default: 20
      t.jsonb :grid_data, default: []

      t.timestamps
    end

    create_table :simulation_runs do |t|
      t.references :warehouse, null: false, foreign_key: true, index: true
      t.string :mode, null: false, default: 'DISTRIBUTED'
      t.string :status, null: false, default: 'IDLE'
      t.datetime :started_at
      t.datetime :ended_at
      t.integer :total_ticks, default: 0
      t.integer :completed_tasks, default: 0
      t.integer :collision_count, default: 0
      t.integer :deadlock_count, default: 0
      t.float :completion_time, default: 0.0
      t.jsonb :metrics, default: {}

      t.timestamps
    end

    create_table :robots do |t|
      t.references :warehouse, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.integer :position_x, null: false, default: 0
      t.integer :position_y, null: false, default: 0
      t.integer :target_x
      t.integer :target_y
      t.float :battery, default: 100.0
      t.float :speed, default: 1.0
      t.string :status, null: false, default: 'IDLE'
      t.bigint :current_task_id, index: true
      t.integer :priority, default: 1
      t.string :color, default: '#3B82F6'

      t.timestamps
    end

    create_table :tasks do |t|
      t.references :warehouse, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.integer :pickup_x, null: false
      t.integer :pickup_y, null: false
      t.integer :destination_x, null: false
      t.integer :destination_y, null: false
      t.integer :priority, default: 1
      t.string :status, null: false, default: 'PENDING'
      t.bigint :assigned_robot_id, index: true
      t.datetime :completed_at

      t.timestamps
    end

    create_table :robot_states do |t|
      t.references :robot, null: false, foreign_key: true, index: true
      t.references :simulation_run, null: false, foreign_key: true, index: true
      t.integer :tick, null: false
      t.integer :position_x, null: false
      t.integer :position_y, null: false
      t.float :velocity_x, default: 0.0
      t.float :velocity_y, default: 0.0
      t.float :battery
      t.string :status

      t.timestamps
    end
    add_index :robot_states, [:simulation_run_id, :tick]

    create_table :obstacles do |t|
      t.references :warehouse, null: false, foreign_key: true, index: true
      t.integer :x, null: false
      t.integer :y, null: false
      t.integer :width, default: 1
      t.integer :height, default: 1
      t.string :obstacle_type, default: 'SHELF'
      t.boolean :active, default: true

      t.timestamps
    end
    add_index :obstacles, [:warehouse_id, :x, :y]

    create_table :routes do |t|
      t.references :robot, null: false, foreign_key: true, index: true
      t.bigint :task_id, index: true
      t.references :simulation_run, null: false, foreign_key: true, index: true
      t.jsonb :path, default: []
      t.string :status, default: 'PLANNED'

      t.timestamps
    end

    create_table :simulation_events do |t|
      t.references :simulation_run, null: false, foreign_key: true, index: true
      t.bigint :robot_id, index: true
      t.string :event_type, null: false
      t.text :message, null: false
      t.jsonb :metadata, default: {}
      t.integer :tick, default: 0

      t.timestamps
    end
    add_index :simulation_events, [:simulation_run_id, :tick]
    add_index :simulation_events, [:simulation_run_id, :event_type]
  end
end
