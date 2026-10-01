import React, { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { HeroEssenceBanner } from '../components/shared/HeroEssenceBanner';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';
import { AddTaskModal } from '../components/dashboard/AddTaskModal';
import { Task } from '../types/task';
import { Robot } from '../types/robot';

export const TasksPage: React.FC = () => {
  const { simulationRun, tasks, robots, metrics, addTask, runDemo } = useSimulation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingTasks = tasks.filter((t: Task) => t.status === 'PENDING');
  const assignedTasks = tasks.filter((t: Task) => t.status === 'ASSIGNED' || t.status === 'REASSIGNED');
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED');

  const columns = [
    { title: 'Pending Queue', items: pendingTasks },
    { title: 'Assigned', items: assignedTasks },
    { title: 'In Transit', items: inProgressTasks },
    { title: 'Completed', items: completedTasks },
  ];

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
          title="Warehouse Task Fulfillment &amp; Allocation"
          subtitle="Real-time order queue with dynamic cost-matrix task dispatch and autonomous reassignment."
          onRunDemo={runDemo}
          robotCount={robots.length}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-sans text-[#212121]">
              Fulfillment Pipeline ({tasks.length} Orders)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking from pickup rack to dropoff staging
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#FF471D] hover:bg-[#e03d15] text-white rounded-none text-xs font-sans font-bold shadow-none transition-colors cursor-pointer"
          >
            + Dispatch New Order
          </button>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-none p-3 flex flex-col gap-2.5 min-h-[450px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold font-sans text-slate-800">{col.title}</span>
                <span className="px-2 py-0.5 border border-slate-300 bg-white text-slate-700 text-[10px] rounded-none">
                  {col.items.length}
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[550px] pr-1">
                {col.items.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-[11px] font-sans">
                    No orders in this stage
                  </div>
                ) : (
                  col.items.map((task: Task) => {
                    const assignedRobot = robots.find((r: Robot) => r.id === task.assigned_robot_id);

                    return (
                      <div
                        key={task.id}
                        className="bg-white border border-slate-200 p-2.5 rounded-none flex flex-col gap-2 shadow-none hover:border-slate-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">ORDER #{task.id}</span>
                          <span className="border border-slate-200 px-1.5 py-0.2 bg-slate-50 text-slate-700 text-[9px] font-bold">
                            P{task.priority}
                          </span>
                        </div>

                        <div className="font-semibold text-[#212121] text-xs font-sans">{task.name}</div>

                        <div className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 p-1.5 border border-slate-100">
                          <span>Pick [{task.pickup_x},{task.pickup_y}]</span>
                          <span>&rarr;</span>
                          <span>Drop [{task.destination_x},{task.destination_y}]</span>
                        </div>

                        {assignedRobot && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                            <span className="text-slate-400">Carrier:</span>
                            <div className="flex items-center gap-1.5 font-medium text-slate-700">
                              <span
                                className="w-2 h-2"
                                style={{ backgroundColor: assignedRobot.color }}
                              />
                              <span>{assignedRobot.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
      />

      <ResQWayFooter />
    </div>
  );
};
