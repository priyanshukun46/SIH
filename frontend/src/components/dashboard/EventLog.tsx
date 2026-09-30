import React, { useState } from 'react';
import { SimulationEvent } from '../../types/simulation';

interface EventLogProps {
  events: SimulationEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CONFLICTS') return ev.event_type === 'CONFLICT' || ev.event_type === 'YIELD' || ev.event_type === 'WAIT' || ev.event_type.includes('DEADLOCK');
    if (filterType === 'TASKS') return ev.event_type.includes('TASK') || ev.event_type === 'REROUTE' || ev.event_type === 'AISLE_BLOCKED';
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] rounded-xl p-4 flex flex-col h-full font-sans text-xs text-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#212121]">Event Log</span>
          <span className="text-[10px] text-slate-400 font-mono">{filteredEvents.length}</span>
        </div>
        <div className="flex items-center gap-1">
          {['ALL', 'CONFLICTS', 'TASKS'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-0.5 text-[10px] transition-colors cursor-pointer rounded-lg ${
                filterType === f
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-500 bg-white hover:bg-slate-100'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto max-h-48 space-y-1 pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-6 text-slate-400 italic text-[11px]">
            No events yet.
          </div>
        ) : (
          filteredEvents.map((ev, idx) => (
            <div
              key={ev.id || `${ev.tick}-${idx}`}
              className="flex items-start gap-2 p-1.5 text-[11px]"
            >
              <span className="text-slate-400 font-mono shrink-0">
                T+{ev.tick.toString().padStart(3, '0')}
              </span>
              <span className="px-1.5 py-0.5 bg-slate-200/60 text-slate-600 text-[9px] uppercase shrink-0 font-medium rounded-full">
                {ev.event_type}
              </span>
              <span className="text-slate-600 leading-normal flex-1">
                {ev.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
