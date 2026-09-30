import React from 'react';
import { Robot } from '../../types/robot';
import { Task } from '../../types/task';

interface RobotCardProps {
  robot: Robot | null;
  tasks: Task[];
  allRobots: Robot[];
  onSelectRobot: (id: number) => void;
}

export const RobotCard: React.FC<RobotCardProps> = ({
  robot,
  tasks,
  allRobots,
  onSelectRobot
}) => {
  if (!robot) {
    return (
      <div className="bg-slate-50 rounded-xl p-5 text-center text-slate-400 text-xs font-sans">
        Select a robot on the grid to view details.
      </div>
    );
  }

  const currentTask = tasks.find((t) => t.id === robot.current_task_id);

  return (
    <div className="bg-[#F0F5F8] rounded-xl p-4 flex flex-col gap-3 font-sans text-xs text-slate-700">
      {/* Robot Selector */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {allRobots.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectRobot(r.id)}
            className={`px-2.5 py-1 text-xs transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg ${
              r.id === robot.id
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-500 bg-white hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
            <span>{r.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Robot Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: robot.color }} />
          <div>
            <h3 className="text-sm font-bold text-[#212121]">{robot.name}</h3>
            <span className="text-[10px] text-slate-400">ID #{robot.id}</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-white text-slate-600 uppercase rounded-full">
          {robot.status}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/70 rounded-lg p-2">
          <span className="text-[10px] text-slate-400 block">Position</span>
          <span className="text-[#212121] font-bold text-sm font-mono">
            {robot.position_x},{robot.position_y}
          </span>
        </div>
        <div className="bg-white/70 rounded-lg p-2">
          <span className="text-[10px] text-slate-400 block">Goal</span>
          <span className="text-[#212121] font-bold text-sm font-mono">
            {robot.target_x !== null ? `${robot.target_x},${robot.target_y}` : '—'}
          </span>
        </div>
        <div className="bg-white/70 rounded-lg p-2">
          <span className="text-[10px] text-slate-400 block">Battery</span>
          <span className="text-[#212121] font-bold text-sm font-mono">{robot.battery.toFixed(0)}%</span>
          <div className="mt-1 bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-slate-600 rounded-full" style={{ width: `${robot.battery}%` }} />
          </div>
        </div>
      </div>

      {/* Active Task */}
      <div className="bg-white/70 rounded-lg p-3 text-xs">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium block mb-1">Active Task</span>
        {currentTask ? (
          <div>
            <div className="text-[#212121] font-semibold">{currentTask.name}</div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono">
              [{currentTask.pickup_x},{currentTask.pickup_y}] &rarr; [{currentTask.destination_x},{currentTask.destination_y}]
            </div>
          </div>
        ) : (
          <div className="text-slate-400 italic">Standby</div>
        )}
      </div>
    </div>
  );
};
