import { Robot } from './robot';
import { Task } from './task';
import { Warehouse, Obstacle } from './warehouse';

export type SimulationMode = 'BASELINE' | 'DISTRIBUTED';
export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';

export interface SimulationEvent {
  id?: number;
  simulation_run_id: number;
  robot_id?: number | null;
  event_type: string;
  message: string;
  metadata?: Record<string, any>;
  tick: number;
  created_at?: string;
}

export interface SimulationMetrics {
  total_ticks: number;
  completed_tasks: number;
  collision_count: number;
  deadlock_count: number;
  reroute_count: number;
  total_waiting_ticks: number;
  robot_utilization: number;
  average_task_completion_time: number;
  throughput: number;
}

export interface SimulationRun {
  id: number;
  warehouse_id: number;
  mode: SimulationMode;
  status: SimulationStatus;
  started_at: string | null;
  ended_at: string | null;
  total_ticks: number;
  completed_tasks: number;
  collision_count: number;
  deadlock_count: number;
  completion_time: number;
  metrics: SimulationMetrics;
  created_at: string;
}

export interface SimulationStatePayload {
  simulation_run: SimulationRun;
  warehouse: Warehouse;
  robots: Robot[];
  tasks: Task[];
  obstacles: Obstacle[];
  events: SimulationEvent[];
  routes?: any[];
  metrics: SimulationMetrics;
}

export interface MetricsComparison {
  baseline: SimulationMetrics;
  distributed: SimulationMetrics;
  time_improvement_percentage: number;
  wait_reduction_percentage: number;
}
