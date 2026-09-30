# frozen_string_literal: true

module Simulation
  class ScenarioBuilder
    def self.build_default_warehouse
      warehouse = Warehouse.find_or_create_by!(name: "Smart Warehouse Alpha") do |w|
        w.width = 30
        w.height = 20
        w.grid_data = generate_grid(30, 20)
      end

      # Populate initial obstacles (shelves)
      create_shelves(warehouse)
      create_robots(warehouse)
      create_tasks(warehouse)

      warehouse
    end

    def self.generate_grid(width, height)
      grid = Array.new(height) { Array.new(width, Warehouse::CELL_FREE) }

      # Charging stations along left wall (x=0, y=2, 5, 8, 11, 14)
      [2, 5, 8, 11, 14].each do |y|
        grid[y][0] = Warehouse::CELL_CHARGING
      end

      # Pickup stations (x=5, 12, 19, 26, y=1)
      [5, 12, 19, 26].each do |x|
        grid[1][x] = Warehouse::CELL_PICKUP
      end

      # Delivery / Dropoff stations (x=5, 12, 19, 26, y=18)
      [5, 12, 19, 26].each do |x|
        grid[18][x] = Warehouse::CELL_DELIVERY
      end

      # Shelf clusters: rows of shelves
      # Aisles between rows: y=3..5 (shelf y=4), y=7..9 (shelf y=8), y=11..13 (shelf y=12), y=15..17 (shelf y=16)
      shelf_rows = [4, 8, 12, 16]
      shelf_rows.each do |sy|
        # Shelf pods separated by cross-aisles at x=8, 15, 22
        (3..7).each { |sx| grid[sy][sx] = Warehouse::CELL_SHELF }
        (10..14).each { |sx| grid[sy][sx] = Warehouse::CELL_SHELF }
        (17..21).each { |sx| grid[sy][sx] = Warehouse::CELL_SHELF }
        (24..28).each { |sx| grid[sy][sx] = Warehouse::CELL_SHELF }
      end

      grid
    end

    def self.create_shelves(warehouse)
      return if warehouse.obstacles.where(obstacle_type: 'SHELF').any?

      shelf_rows = [4, 8, 12, 16]
      shelf_rows.each do |sy|
        [[3, 5], [10, 5], [17, 5], [24, 5]].each do |sx, width|
          warehouse.obstacles.create!(
            x: sx,
            y: sy,
            width: width,
            height: 1,
            obstacle_type: 'SHELF',
            active: true
          )
        end
      end
    end

    def self.create_robots(warehouse)
      return if warehouse.robots.any?

      robot_configs = [
        { name: "AMR-01 (Apex)",   x: 0, y: 2,  color: "#3B82F6", priority: 3, battery: 100.0 },
        { name: "AMR-02 (Bolt)",   x: 0, y: 5,  color: "#10B981", priority: 2, battery: 95.0 },
        { name: "AMR-03 (Cipher)", x: 0, y: 8,  color: "#F59E0B", priority: 4, battery: 90.0 },
        { name: "AMR-04 (Dynamo)", x: 0, y: 11, color: "#8B5CF6", priority: 1, battery: 85.0 },
        { name: "AMR-05 (Echo)",   x: 0, y: 14, color: "#EC4899", priority: 5, battery: 98.0 }
      ]

      robot_configs.each do |cfg|
        warehouse.robots.create!(
          name: cfg[:name],
          position_x: cfg[:x],
          position_y: cfg[:y],
          color: cfg[:color],
          priority: cfg[:priority],
          battery: cfg[:battery],
          speed: 1.0,
          status: 'IDLE'
        )
      end
    end

    def self.create_tasks(warehouse)
      return if warehouse.tasks.any?

      task_configs = [
        { name: "Order #101: Electronics Tote", pickup: [5, 1], dest: [12, 18], priority: 4 },
        { name: "Order #102: Medical Supplies",  pickup: [12, 1], dest: [5, 18], priority: 5 },
        { name: "Order #103: Fasteners & Bolts", pickup: [19, 1], dest: [26, 18], priority: 2 },
        { name: "Order #104: Heavy Components",  pickup: [26, 1], dest: [19, 18], priority: 3 },
        { name: "Order #105: Priority Pallet",   pickup: [5, 1], dest: [26, 18], priority: 5 },
        { name: "Order #106: Packaging Rolls",   pickup: [12, 1], dest: [12, 18], priority: 1 },
        { name: "Order #107: Cold Storage Meds", pickup: [19, 1], dest: [5, 18], priority: 4 },
        { name: "Order #108: Tooling Kit",       pickup: [26, 1], dest: [12, 18], priority: 3 },
        { name: "Order #109: Raw Materials",     pickup: [5, 1], dest: [19, 18], priority: 2 },
        { name: "Order #110: Assembled Parts",   pickup: [12, 1], dest: [26, 18], priority: 4 },
        { name: "Order #111: Safety Equipment",  pickup: [19, 1], dest: [19, 18], priority: 1 },
        { name: "Order #112: High-Value Sensors",pickup: [26, 1], dest: [5, 18], priority: 5 },
        { name: "Order #113: Maintenance Spares",pickup: [5, 1], dest: [5, 18], priority: 2 },
        { name: "Order #114: Battery Cells",     pickup: [12, 1], dest: [12, 18], priority: 3 },
        { name: "Order #115: Urgent Dispatch",   pickup: [19, 1], dest: [12, 18], priority: 5 }
      ]

      task_configs.each do |tc|
        warehouse.tasks.create!(
          name: tc[:name],
          pickup_x: tc[:pickup][0],
          pickup_y: tc[:pickup][1],
          destination_x: tc[:dest][0],
          destination_y: tc[:dest][1],
          priority: tc[:priority],
          status: 'PENDING'
        )
      end
    end

    def self.reset_scenario(warehouse, mode: 'DISTRIBUTED')
      # Deactivate blocked aisles
      warehouse.obstacles.where(obstacle_type: 'BLOCKED_AISLE').destroy_all

      # Reset robots
      home_positions = [
        [0, 2], [0, 5], [0, 8], [0, 11], [0, 14]
      ]

      warehouse.robots.order(:id).each_with_index do |robot, idx|
        home = home_positions[idx % home_positions.size]
        robot.update!(
          position_x: home[0],
          position_y: home[1],
          target_x: nil,
          target_y: nil,
          status: 'IDLE',
          battery: 100.0,
          current_task_id: nil
        )
      end

      # Reset tasks
      warehouse.tasks.update_all(status: 'PENDING', assigned_robot_id: nil, completed_at: nil)

      # Create new SimulationRun
      sim_run = warehouse.simulation_runs.create!(
        mode: mode,
        status: 'IDLE',
        total_ticks: 0,
        completed_tasks: 0,
        collision_count: 0,
        deadlock_count: 0,
        metrics: {}
      )

      # Cleanup existing in-memory engine and build fresh
      Simulation::Engine.remove(sim_run.id)
      engine = Simulation::Engine.find_or_create(sim_run)

      { warehouse: warehouse, simulation_run: sim_run, engine: engine }
    end

    def self.seed_conflict_scenario(warehouse, mode: 'DISTRIBUTED')
      reset_result = reset_scenario(warehouse, mode: mode)
      sim_run = reset_result[:simulation_run]

      # Place AMR-01 at (8, 2) moving south towards intersection (8, 6)
      # Place AMR-02 at (4, 6) moving east towards intersection (8, 6)
      r1 = warehouse.robots.order(:id).first
      r2 = warehouse.robots.order(:id).second

      if r1 && r2
        r1.update!(position_x: 8, position_y: 2, status: 'IDLE')
        r2.update!(position_x: 4, position_y: 6, status: 'IDLE')

        # Create two tasks that intersect at (8, 6)
        task_r1 = warehouse.tasks.create!(
          name: "Conflict Test: North-to-South Route",
          pickup_x: 8, pickup_y: 3,
          destination_x: 8, destination_y: 10,
          priority: 3, status: 'PENDING'
        )

        task_r2 = warehouse.tasks.create!(
          name: "Conflict Test: West-to-East Route",
          pickup_x: 5, pickup_y: 6,
          destination_x: 12, destination_y: 6,
          priority: 5, status: 'PENDING'
        )

        engine = Simulation::Engine.find_or_create(sim_run)
      end

      sim_run
    end
  end
end
