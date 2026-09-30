export interface Obstacle {
  id: number;
  warehouse_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  obstacle_type: 'SHELF' | 'BLOCKED_AISLE' | 'DYNAMIC';
  active: boolean;
}

export interface Warehouse {
  id: number;
  name: string;
  width: number;
  height: number;
  grid_data: number[][];
  created_at: string;
  updated_at: string;
}

export const CELL_TYPES = {
  FREE: 0,
  SHELF: 1,
  PICKUP: 2,
  DELIVERY: 3,
  CHARGING: 4,
} as const;
