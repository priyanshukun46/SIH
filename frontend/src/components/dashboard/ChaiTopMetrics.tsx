import React from 'react';
import { Robot } from '../../types/robot';
import { Task } from '../../types/task';
import { SimulationMetrics } from '../../types/simulation';
import { Obstacle } from '../../types/warehouse';

// Heroicons (outline 24x24)
const MapIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const CubeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

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
      {/* Card 1: Active Routes */}
      <div className="bg-[#FFF4F0] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#C23512] uppercase tracking-wider block">Routes</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">
            {activeRoutesCount}<span className="text-xs font-normal text-slate-400 ml-1">/ {robots.length}</span>
          </div>
        </div>
        <div className="w-10 h-10 text-[#FF471D] bg-[#FFE5DC] flex items-center justify-center rounded-lg">
          <MapIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Blocked Aisles */}
      <div className="bg-[#FFFBEB] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#B45309] uppercase tracking-wider block">Blocked</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">{blockedAislesCount}</div>
        </div>
        <div className="w-10 h-10 text-[#D97706] bg-[#FEF3C7] flex items-center justify-center rounded-lg">
          <ExclamationTriangleIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Clearance Index */}
      <div className="bg-[#ECFDF5] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#047857] uppercase tracking-wider block">Clearance</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">{clearanceIndex}%</div>
        </div>
        <div className="w-10 h-10 text-[#059669] bg-[#D1FAE5] flex items-center justify-center rounded-lg">
          <ShieldCheckIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Card 4: Fulfillment Queue */}
      <div className="bg-[#F0F5F8] p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#102E39] uppercase tracking-wider block">In Transit</span>
          <div className="text-2xl font-bold text-[#212121] font-mono mt-0.5">{inTransitCount}</div>
        </div>
        <div className="w-10 h-10 text-[#102E39] bg-[#DCE7ED] flex items-center justify-center rounded-lg">
          <CubeIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
