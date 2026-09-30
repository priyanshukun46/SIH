# frozen_string_literal: true

module Simulation
  class MetricsCollector
    attr_accessor :total_ticks, :completed_tasks, :collision_count,
                  :deadlock_count, :reroute_count, :total_waiting_ticks,
                  :task_completion_times, :robot_active_ticks, :total_robot_ticks

    def initialize
      @total_ticks = 0
      @completed_tasks = 0
      @collision_count = 0
      @deadlock_count = 0
      @reroute_count = 0
      @total_waiting_ticks = 0
      @task_completion_times = []
      @robot_active_ticks = 0
      @total_robot_ticks = 0
    end

    def record_tick(agents, collisions: [], deadlock: false, reroutes: 0)
      @total_ticks += 1
      @collision_count += collisions.size
      @deadlock_count += 1 if deadlock
      @reroute_count += reroutes

      agents.each do |agent|
        @total_robot_ticks += 1
        if agent.status == 'MOVING'
          @robot_active_ticks += 1
        elsif agent.status == 'WAITING' || agent.status == 'BLOCKED'
          @total_waiting_ticks += 1
        end
      end
    end

    def record_task_completed(duration_ticks)
      @completed_tasks += 1
      @task_completion_times << duration_ticks
    end

    def robot_utilization_rate
      return 0.0 if @total_robot_ticks.zero?
      ((@robot_active_ticks.to_f / @total_robot_ticks) * 100).round(2)
    end

    def average_task_completion_time
      return 0.0 if @task_completion_times.empty?
      (@task_completion_times.sum.to_f / @task_completion_times.size).round(2)
    end

    def throughput
      return 0.0 if @total_ticks.zero?
      ((@completed_tasks.to_f / @total_ticks) * 100).round(2)
    end

    def to_h
      {
        total_ticks: @total_ticks,
        completed_tasks: @completed_tasks,
        collision_count: @collision_count,
        deadlock_count: @deadlock_count,
        reroute_count: @reroute_count,
        total_waiting_ticks: @total_waiting_ticks,
        robot_utilization: robot_utilization_rate,
        average_task_completion_time: average_task_completion_time,
        throughput: throughput
      }
    end

    def self.compare(baseline_metrics, distributed_metrics)
      b_time = (baseline_metrics[:total_ticks] || baseline_metrics['total_ticks'] || 1).to_f
      d_time = (distributed_metrics[:total_ticks] || distributed_metrics['total_ticks'] || 1).to_f

      b_wait = (baseline_metrics[:total_waiting_ticks] || baseline_metrics['total_waiting_ticks'] || 1).to_f
      d_wait = (distributed_metrics[:total_waiting_ticks] || distributed_metrics['total_waiting_ticks'] || 1).to_f

      time_improvement = b_time > 0 ? (((b_time - d_time) / b_time) * 100).round(2) : 0.0
      wait_reduction = b_wait > 0 ? (((b_wait - d_wait) / b_wait) * 100).round(2) : 0.0

      {
        baseline: baseline_metrics,
        distributed: distributed_metrics,
        time_improvement_percentage: time_improvement,
        wait_reduction_percentage: wait_reduction
      }
    end
  end
end
