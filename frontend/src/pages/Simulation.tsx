import React, { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { HeroEssenceBanner } from '../components/shared/HeroEssenceBanner';
import { SimulationControls } from '../components/dashboard/SimulationControls';
import { WarehouseCanvas } from '../components/warehouse/WarehouseCanvas';
import { AddTaskModal } from '../components/dashboard/AddTaskModal';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';
import { Task } from '../types/task';

export const SimulationPage: React.FC = () => {
  const {
    simulationRun,
    warehouse,
    robots,
    tasks,
    obstacles,
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
          <div className="w-8 h-8 border-2 border-[#FF471D] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Loading Floor Grid...</span>
        </div>
      </div>
    );
  }

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
          title="30x20 Space-Time Simulation Floor"
          subtitle="Full-screen spatial visualization of autonomous mobile robots and dynamic blocked corridors."
          badgeText="INTERACTIVE 2D FLOOR MAP • SIH26123"
          onRunDemo={runDemo}
          robotCount={robots.length}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">
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

        <div className="flex-1 border border-slate-200 rounded-none bg-white p-2 flex items-center justify-center shadow-none">
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
      </main>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={addTask}
      />

      <ResQWayFooter />
    </div>
  );
};
