export type TaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'REASSIGNED'
  | 'COMPLETED';

export interface Task {
  id: number;
  warehouse_id: number;
  name: string;
  pickup_x: number;
  pickup_y: number;
  destination_x: number;
  destination_y: number;
  priority: number;
  status: TaskStatus;
  assigned_robot_id: number | null;
  created_at: string;
  completed_at: string | null;
  assigned_robot?: {
    id: number;
    name: string;
    color: string;
  };
}
