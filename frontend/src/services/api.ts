import { Warehouse, Obstacle } from '../types/warehouse';
import { Robot } from '../types/robot';
import { Task } from '../types/task';
import { SimulationRun, SimulationMetrics, SimulationEvent } from '../types/simulation';

const BASE_URL = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.error || parsed.message || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Warehouses
  getWarehouses: (): Promise<Warehouse[]> =>
    fetch(`${BASE_URL}/warehouses`).then((res) => handleResponse<Warehouse[]>(res)),

  getWarehouse: (id: number): Promise<{
    warehouse: Warehouse;
    robots: Robot[];
    tasks: Task[];
    obstacles: Obstacle[];
    simulation_runs: SimulationRun[];
  }> => fetch(`${BASE_URL}/warehouses/${id}`).then((res) => handleResponse(res)),

  // Robots
  getRobots: (warehouseId?: number): Promise<Robot[]> => {
    const url = warehouseId ? `${BASE_URL}/robots?warehouse_id=${warehouseId}` : `${BASE_URL}/robots`;
    return fetch(url).then((res) => handleResponse<Robot[]>(res));
  },

  getRobot: (id: number): Promise<{
    robot: Robot;
    recent_states: any[];
    recent_routes: any[];
  }> => fetch(`${BASE_URL}/robots/${id}`).then((res) => handleResponse(res)),

  // Tasks
  getTasks: (warehouseId?: number): Promise<Task[]> => {
    const url = warehouseId ? `${BASE_URL}/tasks?warehouse_id=${warehouseId}` : `${BASE_URL}/tasks`;
    return fetch(url).then((res) => handleResponse<Task[]>(res));
  },

  createTask: (data: {
    warehouse_id: number;
    name: string;
    pickup_x: number;
    pickup_y: number;
    destination_x: number;
    destination_y: number;
    priority: number;
  }): Promise<Task> =>
    fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: data })
    }).then((res) => handleResponse<Task>(res)),

  // Simulations
  createSimulation: (warehouseId: number, mode: 'BASELINE' | 'DISTRIBUTED' = 'DISTRIBUTED'): Promise<{
    simulation_run: SimulationRun;
    robots: Robot[];
    message: string;
  }> =>
    fetch(`${BASE_URL}/simulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warehouse_id: warehouseId, mode })
    }).then((res) => handleResponse(res)),

  getSimulation: (id: number): Promise<{
    simulation_run: SimulationRun;
    warehouse: Warehouse;
    robots: Robot[];
    tasks: Task[];
    obstacles: Obstacle[];
    events: SimulationEvent[];
    metrics: SimulationMetrics;
  }> => fetch(`${BASE_URL}/simulations/${id}`).then((res) => handleResponse(res)),

  startSimulation: (id: number): Promise<{ status: string; simulation_run: SimulationRun }> =>
    fetch(`${BASE_URL}/simulations/${id}/start`, { method: 'POST' }).then((res) => handleResponse(res)),

  pauseSimulation: (id: number): Promise<{ status: string; simulation_run: SimulationRun }> =>
    fetch(`${BASE_URL}/simulations/${id}/pause`, { method: 'POST' }).then((res) => handleResponse(res)),

  resetSimulation: (id: number, mode?: string): Promise<{
    status: string;
    simulation_run: SimulationRun;
    robots: Robot[];
  }> =>
    fetch(`${BASE_URL}/simulations/${id}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    }).then((res) => handleResponse(res)),

  stepSimulation: (id: number): Promise<{ step_result: any; simulation_run: SimulationRun }> =>
    fetch(`${BASE_URL}/simulations/${id}/step`, { method: 'POST' }).then((res) => handleResponse(res)),

  setSpeed: (id: number, speed: number): Promise<{ speed: number; message: string }> =>
    fetch(`${BASE_URL}/simulations/${id}/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed })
    }).then((res) => handleResponse(res)),

  blockAisle: (id: number, x: number, y: number, width: number = 2, height: number = 1): Promise<{
    result: any;
    obstacles: Obstacle[];
    message: string;
  }> =>
    fetch(`${BASE_URL}/simulations/${id}/block_aisle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, width, height })
    }).then((res) => handleResponse(res)),

  getSimulationMetrics: (id: number): Promise<{ simulation_run: SimulationRun; metrics: SimulationMetrics }> =>
    fetch(`${BASE_URL}/simulations/${id}/metrics`).then((res) => handleResponse(res)),

  runDemo: (): Promise<{
    simulation_run: SimulationRun;
    blocked_aisle: any;
    current_tick: number;
    robots: Robot[];
    metrics: SimulationMetrics;
    events: SimulationEvent[];
    message: string;
  }> => fetch(`${BASE_URL}/simulations/demo`, { method: 'POST' }).then((res) => handleResponse(res)),

  // Analytics & Comparative Benchmarks
  compareMetrics: (baselineId?: number, distributedId?: number): Promise<any> => {
    let url = `${BASE_URL}/metrics/compare`;
    if (baselineId && distributedId) {
      url += `?baseline_run_id=${baselineId}&distributed_run_id=${distributedId}`;
    }
    return fetch(url).then((res) => handleResponse(res));
  },

  benchmarkMetrics: (): Promise<any> => fetch(`${BASE_URL}/metrics/benchmark`).then((res) => handleResponse(res)),
};
