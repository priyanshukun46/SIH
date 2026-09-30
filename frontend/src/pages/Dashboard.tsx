import React, { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { HeroEssenceBanner } from '../components/shared/HeroEssenceBanner';
import { ChaiTopMetrics } from '../components/dashboard/ChaiTopMetrics';
import { SimulationControls } from '../components/dashboard/SimulationControls';
import { WarehouseCanvas } from '../components/warehouse/WarehouseCanvas';
import { RobotCard } from '../components/dashboard/RobotCard';
import { EventLog } from '../components/dashboard/EventLog';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import { AddTaskModal } from '../components/dashboard/AddTaskModal';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';
import { Robot } from '../types/robot';
import { Task } from '../types/task';

export const Dashboard: React.FC = () => {
  const {
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
    start,
    pause,
    reset,
    step,
    setSpeed,
    blockAisle,
    runDemo,
    addTask
  } = useSimulation();

  const [blockModeActive, setBlockModeActive] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleBlockCell = (x: number, y: number) => {
    blockAisle(x, y, 2, 1);
    setBlockModeActive(false);
  };

  if (loading && !warehouse) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#FF471D] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">
            Connecting to AMR FleetSim Coordinator...
          </span>
        </div>
      </div>
    );
  }

  const selectedRobot = robots.find((r: Robot) => r.id === selectedRobotId) || robots[0] || null;

  return (
    <div className="min-h-screen bg-white text-[#212121] flex flex-col font-sans selection:bg-[#FF471D] selection:text-white">
      {/* ResQWay Signature Top Navigation Header */}
      <ResQWayHeader
        simulationRun={simulationRun}
        metrics={metrics}
        robotCount={robots.length}
        activeTasksCount={tasks.filter((t: Task) => t.status !== 'COMPLETED').length}
        onRunDemo={runDemo}
      />

      {/* Hero Essence Banner */}
      <div className="pt-[67px]">
        <HeroEssenceBanner
          title="Autonomous Mobile Robot Fleet Coordination"
          subtitle="Software-only simulation of multi-agent space-time reservations, dynamic conflict resolution, and task reallocation (SIH26123)."
          badgeText="SPACE-TIME RESERVATION • SIH26123"
          onRunDemo={runDemo}
          robotCount={robots.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">
        {/* Top 4 Minimal Metric Cards */}
        <ChaiTopMetrics
          robots={robots}
          tasks={tasks}
          obstacles={obstacles}
          metrics={metrics}
        />

        {/* Controls Bar */}
        <SimulationControls
          simulationRun={simulationRun}
          speed={speed}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onStep={step}
          onSetSpeed={setSpeed}
          onToggleBlockMode={() => setBlockModeActive(!blockModeActive)}
          blockModeActive={blockModeActive}
          onOpenAddTask={() => setIsAddTaskModalOpen(true)}
          onRunDemo={runDemo}
        />

        {/* Center Grid: Warehouse Canvas + Selected Robot Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1">
          <div className="lg:col-span-3 h-full flex flex-col">
            {warehouse && (
              <WarehouseCanvas
                warehouse={warehouse}
                robots={robots}
                tasks={tasks}
                obstacles={obstacles}
                selectedRobotId={selectedRobotId}
                onSelectRobot={setSelectedRobotId}
                onBlockCell={handleBlockCell}
                blockModeActive={blockModeActive}
              />
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <RobotCard
              robot={selectedRobot}
              tasks={tasks}
              allRobots={robots}
              onSelectRobot={setSelectedRobotId}
            />
          </div>
        </div>

        {/* Bottom Split: Event Log + Task Queue Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <EventLog events={events} />
          </div>
          <div className="lg:col-span-2">
            <TaskPanel tasks={tasks} robots={robots} />
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={addTask}
      />

      {/* 5-Column ResQWay Industrial Footer */}
      <ResQWayFooter />
    </div>
  );
};
