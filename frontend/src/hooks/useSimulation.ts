import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { cableService } from '../services/websocket';
import {
  SimulationRun,
  SimulationMetrics,
  SimulationEvent
} from '../types/simulation';
import { Warehouse, Obstacle } from '../types/warehouse';
import { Robot } from '../types/robot';
import { Task } from '../types/task';

export function useSimulation(simulationId?: number) {
  const [simulationRun, setSimulationRun] = useState<SimulationRun | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    total_ticks: 0,
    completed_tasks: 0,
    collision_count: 0,
    deadlock_count: 0,
    reroute_count: 0,
    total_waiting_ticks: 0,
    robot_utilization: 0,
    average_task_completion_time: 0,
    throughput: 0
  });

  const [selectedRobotId, setSelectedRobotId] = useState<number | null>(null);
  const [speed, setSpeedState] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isSubscribedRef = useRef(false);

  // Initial load
  const loadSimulation = useCallback(async (id?: number) => {
    try {
      setLoading(true);
      setError(null);

      // If id is provided, fetch it; otherwise fetch default warehouse to get latest run
      let runId = id;
      if (!runId) {
        const warehouses = await api.getWarehouses();
        const defaultWh = warehouses[0];
        if (defaultWh) {
          const whDetail = await api.getWarehouse(defaultWh.id);
          const latestRun = whDetail.simulation_runs?.[0];
          if (latestRun) {
            runId = latestRun.id;
          } else {
            // Create a new simulation run
            const newRunRes = await api.createSimulation(defaultWh.id, 'DISTRIBUTED');
            runId = newRunRes.simulation_run.id;
          }
        }
      }

      if (!runId) throw new Error("No simulation run available");

      const data = await api.getSimulation(runId);
      setSimulationRun(data.simulation_run);
      setWarehouse(data.warehouse);
      setRobots(data.robots || []);
      setTasks(data.tasks || []);
      setObstacles(data.obstacles || []);
      setEvents(data.events || []);
      if (data.metrics) setMetrics(data.metrics);
      if (data.robots && data.robots.length > 0 && selectedRobotId === null) {
        setSelectedRobotId(data.robots[0].id);
      }
    } catch (err: any) {
      console.error("Failed to load simulation:", err);
      setError(err.message || "Failed to load simulation");
    } finally {
      setLoading(false);
    }
  }, [selectedRobotId]);

  useEffect(() => {
    loadSimulation(simulationId);
  }, [simulationId, loadSimulation]);

  // WebSocket subscription
  useEffect(() => {
    if (!simulationRun?.id) return;

    const sub = cableService.subscribeToSimulation(simulationRun.id, (payload: any) => {
      if (payload.type === 'simulation_tick') {
        const tickData = payload.data;
        if (tickData.agents) {
          setRobots(tickData.agents);
        }
        if (tickData.metrics) {
          setMetrics(tickData.metrics);
        }
        if (tickData.events && tickData.events.length > 0) {
          setEvents((prev) => [...tickData.events, ...prev].slice(0, 100));
        }
        setSimulationRun((prev) =>
          prev
            ? {
                ...prev,
                total_ticks: tickData.tick,
                status: tickData.all_completed ? 'COMPLETED' : prev.status,
                completed_tasks: tickData.metrics?.completed_tasks ?? prev.completed_tasks,
                collision_count: tickData.metrics?.collision_count ?? prev.collision_count,
                deadlock_count: tickData.metrics?.deadlock_count ?? prev.deadlock_count,
                metrics: tickData.metrics || prev.metrics
              }
            : null
        );
      } else if (payload.type === 'aisle_blocked') {
        setObstacles((prev) => [...prev, payload.obstacle]);
        if (payload.affected_robots?.length > 0) {
          setEvents((prev) => [
            {
              simulation_run_id: simulationRun.id,
              event_type: 'AISLE_BLOCKED',
              message: `Aisle blocked! AMRs ${payload.affected_robots.join(', ')} rerouting`,
              tick: payload.tick,
              created_at: new Date().toISOString()
            },
            ...prev
          ]);
        }
      }
    });

    isSubscribedRef.current = true;

    return () => {
      cableService.unsubscribe();
      isSubscribedRef.current = false;
    };
  }, [simulationRun?.id]);

  // Controls
  const start = async () => {
    if (!simulationRun) return;
    try {
      const res = await api.startSimulation(simulationRun.id);
      setSimulationRun(res.simulation_run);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const pause = async () => {
    if (!simulationRun) return;
    try {
      const res = await api.pauseSimulation(simulationRun.id);
      setSimulationRun(res.simulation_run);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const reset = async (mode?: 'BASELINE' | 'DISTRIBUTED') => {
    if (!simulationRun) return;
    try {
      const res = await api.resetSimulation(simulationRun.id, mode);
      setSimulationRun(res.simulation_run);
      setRobots(res.robots || []);
      setEvents([]);
      // Reload full state
      await loadSimulation(res.simulation_run.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const step = async () => {
    if (!simulationRun) return;
    try {
      const res = await api.stepSimulation(simulationRun.id);
      if (res.step_result?.agents) setRobots(res.step_result.agents);
      if (res.step_result?.metrics) setMetrics(res.step_result.metrics);
      setSimulationRun(res.simulation_run);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const setSpeed = async (newSpeed: number) => {
    if (!simulationRun) return;
    try {
      await api.setSpeed(simulationRun.id, newSpeed);
      setSpeedState(newSpeed);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const blockAisle = async (x: number, y: number, width: number = 2, height: number = 1) => {
    if (!simulationRun) return;
    try {
      const res = await api.blockAisle(simulationRun.id, x, y, width, height);
      if (res.obstacles) setObstacles(res.obstacles);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const runDemo = async () => {
    try {
      setLoading(true);
      const res = await api.runDemo();
      setSimulationRun(res.simulation_run);
      setRobots(res.robots || []);
      setMetrics(res.metrics);
      if (res.events) setEvents(res.events);
      await loadSimulation(res.simulation_run.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: {
    name: string;
    pickup_x: number;
    pickup_y: number;
    destination_x: number;
    destination_y: number;
    priority: number;
  }) => {
    if (!warehouse) return;
    try {
      const newTask = await api.createTask({
        warehouse_id: warehouse.id,
        ...taskData
      });
      setTasks((prev) => [...prev, newTask]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    simulationRun,
    warehouse,
    robots,
    tasks,
    obstacles,
    events,
    metrics,
    selectedRobotId,
    setSelectedRobotId,
    speed,
    loading,
    error,
    start,
    pause,
    reset,
    step,
    setSpeed,
    blockAisle,
    runDemo,
    addTask,
    reload: loadSimulation
  };
}
