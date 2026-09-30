# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_30_103000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "obstacles", force: :cascade do |t|
    t.bigint "warehouse_id", null: false
    t.integer "x", null: false
    t.integer "y", null: false
    t.integer "width", default: 1
    t.integer "height", default: 1
    t.string "obstacle_type", default: "SHELF"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["warehouse_id", "x", "y"], name: "index_obstacles_on_warehouse_id_and_x_and_y"
    t.index ["warehouse_id"], name: "index_obstacles_on_warehouse_id"
  end

  create_table "robot_states", force: :cascade do |t|
    t.bigint "robot_id", null: false
    t.bigint "simulation_run_id", null: false
    t.integer "tick", null: false
    t.integer "position_x", null: false
    t.integer "position_y", null: false
    t.float "velocity_x", default: 0.0
    t.float "velocity_y", default: 0.0
    t.float "battery"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_robot_states_on_robot_id"
    t.index ["simulation_run_id", "tick"], name: "index_robot_states_on_simulation_run_id_and_tick"
    t.index ["simulation_run_id"], name: "index_robot_states_on_simulation_run_id"
  end

  create_table "robots", force: :cascade do |t|
    t.bigint "warehouse_id", null: false
    t.string "name", null: false
    t.integer "position_x", default: 0, null: false
    t.integer "position_y", default: 0, null: false
    t.integer "target_x"
    t.integer "target_y"
    t.float "battery", default: 100.0
    t.float "speed", default: 1.0
    t.string "status", default: "IDLE", null: false
    t.bigint "current_task_id"
    t.integer "priority", default: 1
    t.string "color", default: "#3B82F6"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["current_task_id"], name: "index_robots_on_current_task_id"
    t.index ["warehouse_id"], name: "index_robots_on_warehouse_id"
  end

  create_table "routes", force: :cascade do |t|
    t.bigint "robot_id", null: false
    t.bigint "task_id"
    t.bigint "simulation_run_id", null: false
    t.jsonb "path", default: []
    t.string "status", default: "PLANNED"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_routes_on_robot_id"
    t.index ["simulation_run_id"], name: "index_routes_on_simulation_run_id"
    t.index ["task_id"], name: "index_routes_on_task_id"
  end

  create_table "simulation_events", force: :cascade do |t|
    t.bigint "simulation_run_id", null: false
    t.bigint "robot_id"
    t.string "event_type", null: false
    t.text "message", null: false
    t.jsonb "metadata", default: {}
    t.integer "tick", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["robot_id"], name: "index_simulation_events_on_robot_id"
    t.index ["simulation_run_id", "event_type"], name: "index_simulation_events_on_simulation_run_id_and_event_type"
    t.index ["simulation_run_id", "tick"], name: "index_simulation_events_on_simulation_run_id_and_tick"
    t.index ["simulation_run_id"], name: "index_simulation_events_on_simulation_run_id"
  end

  create_table "simulation_runs", force: :cascade do |t|
    t.bigint "warehouse_id", null: false
    t.string "mode", default: "DISTRIBUTED", null: false
    t.string "status", default: "IDLE", null: false
    t.datetime "started_at"
    t.datetime "ended_at"
    t.integer "total_ticks", default: 0
    t.integer "completed_tasks", default: 0
    t.integer "collision_count", default: 0
    t.integer "deadlock_count", default: 0
    t.float "completion_time", default: 0.0
    t.jsonb "metrics", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["warehouse_id"], name: "index_simulation_runs_on_warehouse_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "warehouse_id", null: false
    t.string "name", null: false
    t.integer "pickup_x", null: false
    t.integer "pickup_y", null: false
    t.integer "destination_x", null: false
    t.integer "destination_y", null: false
    t.integer "priority", default: 1
    t.string "status", default: "PENDING", null: false
    t.bigint "assigned_robot_id"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_robot_id"], name: "index_tasks_on_assigned_robot_id"
    t.index ["warehouse_id"], name: "index_tasks_on_warehouse_id"
  end

  create_table "warehouses", force: :cascade do |t|
    t.string "name", null: false
    t.integer "width", default: 30, null: false
    t.integer "height", default: 20, null: false
    t.jsonb "grid_data", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "obstacles", "warehouses"
  add_foreign_key "robot_states", "robots"
  add_foreign_key "robot_states", "simulation_runs"
  add_foreign_key "robots", "warehouses"
  add_foreign_key "routes", "robots"
  add_foreign_key "routes", "simulation_runs"
  add_foreign_key "simulation_events", "simulation_runs"
  add_foreign_key "simulation_runs", "warehouses"
  add_foreign_key "tasks", "warehouses"
end
