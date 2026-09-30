# frozen_string_literal: true

puts "== Seeding AMR FleetSim Warehouse, Robots, and Tasks =="

warehouse = Simulation::ScenarioBuilder.build_default_warehouse

puts "Warehouse: #{warehouse.name} (#{warehouse.width}x#{warehouse.height})"
puts "Robots: #{warehouse.robots.count} active AMRs"
puts "Tasks: #{warehouse.tasks.count} warehouse orders"
puts "Obstacles (Shelves): #{warehouse.obstacles.count} units"

# Create initial simulation run
sim_run = warehouse.simulation_runs.create!(
  mode: 'DISTRIBUTED',
  status: 'IDLE',
  total_ticks: 0,
  completed_tasks: 0,
  metrics: {}
)

puts "Initial Simulation Run ##{sim_run.id} created (Mode: DISTRIBUTED)"
puts "== Seed complete! =="
