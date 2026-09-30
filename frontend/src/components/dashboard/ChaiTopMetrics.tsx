import React from 'react';
import { Robot } from '../../types/robot';
import { Task } from '../../types/task';
import { SimulationMetrics } from '../../types/simulation';
import { Obstacle } from '../../types/warehouse';

interface ChaiTopMetricsProps {
  robots: Robot[];
  tasks: Task[];
  obstacles: Obstacle[];
  metrics: SimulationMetrics;
}

export const ChaiTopMetrics: React.FC<ChaiTopMetricsProps> = ({
  robots,
  tasks,
  obstacles,
  metrics
}) => {
  const activeRoutesCount = robots.filter((r) => r.path && r.path.length > 0).length;
  const blockedAislesCount = obstacles.filter((o) => o.active && o.obstacle_type === 'BLOCKED_AISLE').length;
  const inTransitCount = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const clearanceIndex = Math.max(70, Math.min(100, 100 - metrics.collision_count * 10 - metrics.deadlock_count * 2));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      <div className="bg-[#FFF4F0] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#C23512] uppercase tracking-wider block">Routes</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">
            {activeRoutesCount}<span className="text-xs font-normal text-slate-400 ml-1">/ {robots.length}</span>
          </div>
        </div>
        <div className="w-9 h-9 text-[#FF471D] bg-[#FFE5DC] flex items-center justify-center text-sm rounded-lg">
          <i className="fas fa-route"></i>
        </div>
      </div>

      <div className="bg-[#FFFBEB] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#B45309] uppercase tracking-wider block">Blocked</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">{blockedAislesCount}</div>
        </div>
        <div className="w-9 h-9 text-[#D97706] bg-[#FEF3C7] flex items-center justify-center text-sm rounded-lg">
          <i className="fas fa-triangle-exclamation"></i>
        </div>
      </div>

      <div className="bg-[#ECFDF5] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#047857] uppercase tracking-wider block">Clearance</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">{clearanceIndex}%</div>
        </div>
        <div className="w-9 h-9 text-[#059669] bg-[#D1FAE5] flex items-center justify-center text-sm rounded-lg">
          <i className="fas fa-shield-halved"></i>
        </div>
      </div>

      <div className="bg-[#F0F5F8] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#102E39] uppercase tracking-wider block">In Transit</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">{inTransitCount}</div>
        </div>
        <div className="w-9 h-9 text-[#102E39] bg-[#DCE7ED] flex items-center justify-center text-sm rounded-lg">
          <i className="fas fa-box-open"></i>
        </div>
      </div>
    </div>
  );
};
