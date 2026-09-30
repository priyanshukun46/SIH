export type RobotStatus =
  | 'IDLE'
  | 'MOVING'
  | 'WAITING'
  | 'BLOCKED'
  | 'REROUTING'
  | 'COMPLETED'
  | 'ERROR';

export interface Robot {
  id: number;
  warehouse_id?: number;
  name: string;
  position_x: number;
  position_y: number;
  target_x: number | null;
  target_y: number | null;
  battery: number;
  speed: number;
  status: RobotStatus;
  current_task_id: number | null;
  priority: number;
  color: string;
  heading?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  waiting_ticks?: number;
  path?: [number, number][];
  last_action?: 'MOVE' | 'WAIT' | 'REROUTE' | 'BLOCKED' | 'NONE';
}

export interface RobotStateHistory {
  id: number;
  robot_id: number;
  simulation_run_id: number;
  tick: number;
  position_x: number;
  position_y: number;
  velocity_x: number;
  velocity_y: number;
  battery: number;
  status: RobotStatus;
}
