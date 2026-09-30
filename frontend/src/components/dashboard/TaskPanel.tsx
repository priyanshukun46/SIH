import React from 'react';
import { Task } from '../../types/task';
import { Robot } from '../../types/robot';

interface TaskPanelProps {
  tasks: Task[];
  robots: Robot[];
}

export const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, robots }) => {
  return (
    <div className="bg-[#F8F9FA] rounded-xl p-4 flex flex-col font-sans text-xs text-slate-700 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#212121]">Tasks</span>
          <span className="text-[10px] text-slate-400 font-mono">{tasks.length}</span>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto max-h-48 space-y-1.5 pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-slate-400 italic">No tasks yet.</div>
        ) : (
          tasks.map((task) => {
            const assignedRobot = robots.find((r) => r.id === task.assigned_robot_id);
            return (
              <div key={task.id} className="bg-white rounded-lg p-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#212121] font-semibold text-xs truncate max-w-[140px]">
                      {task.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                      P{task.priority}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 uppercase text-slate-500 rounded-full">
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>[{task.pickup_x},{task.pickup_y}] &rarr; [{task.destination_x},{task.destination_y}]</span>
                  {assignedRobot ? (
                    <span className="font-medium text-slate-600">{assignedRobot.name.split(' ')[0]}</span>
                  ) : (
                    <span className="italic">—</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
