import React from 'react';
import { SimulationRun } from '../../types/simulation';

interface SimulationControlsProps {
  simulationRun: SimulationRun | null;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: (mode?: 'BASELINE' | 'DISTRIBUTED') => void;
  onStep: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleBlockMode: () => void;
  blockModeActive: boolean;
  onOpenAddTask: () => void;
  onRunDemo: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulationRun,
  speed,
  onStart,
  onPause,
  onReset,
  onStep,
  onSetSpeed,
  onToggleBlockMode,
  blockModeActive,
  onOpenAddTask,
  onRunDemo
}) => {
  const isRunning = simulationRun?.status === 'RUNNING';
  const isBaseline = simulationRun?.mode === 'BASELINE';

  return (
    <div className="bg-slate-50 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
      {/* Playback */}
      <div className="flex items-center gap-1.5">
        {isRunning ? (
          <button onClick={onPause} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
            Pause
          </button>
        ) : (
          <button onClick={onStart} className="px-4 py-1.5 bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold rounded-lg transition-colors cursor-pointer">
            Start
          </button>
        )}

        <button onClick={onStep} disabled={isRunning} className="px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-lg transition-colors cursor-pointer font-mono">
          Step
        </button>

        <button onClick={() => onReset()} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer font-mono">
          Reset
        </button>

        {/* Speed */}
        <div className="flex items-center bg-white rounded-lg p-0.5 ml-1">
          <span className="text-[10px] text-slate-400 px-2 font-mono">Speed</span>
          {[0.5, 1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                speed === s ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="flex items-center bg-white rounded-lg p-0.5">
        <span className="text-[10px] text-slate-400 px-2 font-mono">Mode</span>
        <button
          onClick={() => onReset('BASELINE')}
          className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
            isBaseline ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Baseline
        </button>
        <button
          onClick={() => onReset('DISTRIBUTED')}
          className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
            !isBaseline ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Distributed
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleBlockMode}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
            blockModeActive
              ? 'bg-[#FF471D] text-white font-bold'
              : 'bg-white hover:bg-slate-100 text-slate-700'
          }`}
        >
          {blockModeActive ? 'Cancel' : 'Block'}
        </button>

        <button onClick={onOpenAddTask} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-mono transition-colors cursor-pointer">
          + Task
        </button>

        <button onClick={onRunDemo} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs font-mono transition-colors cursor-pointer">
          Demo
        </button>
      </div>
    </div>
  );
};
