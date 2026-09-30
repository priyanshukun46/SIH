import React from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { HeroEssenceBanner } from '../components/shared/HeroEssenceBanner';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';
import { Robot } from '../types/robot';
import { Task } from '../types/task';

export const RobotsPage: React.FC = () => {
  const { simulationRun, robots, tasks, metrics, runDemo } = useSimulation();

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
          title="Autonomous Mobile Robot Fleet Roster"
          subtitle="Spatial telemetry, battery state, and active mission assignments for deployed AMR units."
          badgeText="MULTI-AGENT FLEET TELEMATICS • SIH26123"
          onRunDemo={runDemo}
          robotCount={robots.length}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-sans text-[#212121]">
              Fleet Status ({robots.length} Deployed Units)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Decentralised edge telemetry streaming every cycle via ActionCable
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-none">
            State: <strong className="text-slate-800 uppercase">{simulationRun?.status || 'IDLE'}</strong>
          </div>
        </div>

        {/* AMR Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {robots.map((robot: Robot) => {
            const currentTask = tasks.find((t: Task) => t.id === robot.current_task_id);

            return (
              <div
                key={robot.id}
                className="bg-white border border-slate-200 rounded-none shadow-none p-4 flex flex-col gap-3 font-mono text-xs hover:border-slate-400 transition-colors"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 border border-slate-300"
                      style={{ backgroundColor: robot.color }}
                    />
                    <div>
                      <h3 className="font-bold text-[#212121] text-sm font-sans">
                        {robot.name}
                      </h3>
                      <span className="text-[10px] text-slate-400">Node ID: AMR-0{robot.id}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-none text-[10px] font-bold border border-slate-300 text-slate-700 uppercase bg-slate-50">
                    {robot.status}
                  </span>
                </div>

                {/* Battery & Health */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-none flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-sans">Power Reserve</span>
                    <span className="font-bold text-[#212121]">{robot.battery.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-slate-700 transition-all rounded-none"
                      style={{ width: `${robot.battery}%` }}
                    />
                  </div>
                </div>

                {/* Spatial Position & Target */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-none flex flex-col">
                    <span className="text-[10px] text-slate-500 font-sans">Location</span>
                    <span className="text-[#212121] font-bold">[{robot.position_x}, {robot.position_y}]</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-none flex flex-col">
                    <span className="text-[10px] text-slate-500 font-sans">Destination</span>
                    <span className="text-[#212121] font-bold">
                      {robot.target_x !== null ? `[${robot.target_x}, ${robot.target_y}]` : 'Stationary'}
                    </span>
                  </div>
                </div>

                {/* Active Waypoints Remaining */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                  <span>Waypoints in Path:</span>
                  <span className="font-bold text-slate-700">{robot.path?.length || 0} steps</span>
                </div>

                {/* Assigned Task */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-none flex flex-col gap-1 text-[11px] mt-auto">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Order Assignment</span>
                  {currentTask ? (
                    <div>
                      <div className="text-[#212121] font-semibold font-sans">{currentTask.name}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        Pick [{currentTask.pickup_x},{currentTask.pickup_y}] &rarr; Drop [{currentTask.destination_x},{currentTask.destination_y}]
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic font-sans">Standby</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <ResQWayFooter />
    </div>
  );
};
