import React from 'react';
import { Link } from 'react-router-dom';

interface HeroEssenceBannerProps {
  title?: string;
  subtitle?: string;
  onRunDemo?: () => void;
  robotCount?: number;
}

export const HeroEssenceBanner: React.FC<HeroEssenceBannerProps> = ({
  title = "AMR Fleet Coordinator",
  subtitle = "Multi-agent path planning with dynamic conflict resolution.",
  onRunDemo,
  robotCount = 5
}) => {
  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <div className="text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9">
            <div className="flex items-center gap-2 text-slate-500">
              <Link to="/" className="hover:text-[#FF471D] transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <span className="text-[#212121] font-medium">Fleet Simulation</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
              <span>Simulation Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-[#102E39] text-white py-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {title}
              </h1>

              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {subtitle}
              </p>

              <div className="flex items-center gap-3 pt-1">
                {onRunDemo && (
                  <button
                    onClick={onRunDemo}
                    className="px-5 py-2 text-xs font-bold bg-[#FF471D] hover:bg-[#e03d15] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Run Demo
                  </button>
                )}
                <Link
                  to="/analytics"
                  className="px-5 py-2 text-xs font-medium bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors"
                >
                  Benchmarks &rarr;
                </Link>
              </div>
            </div>

            {/* Compact Telematics Card */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="w-full max-w-[280px] bg-white/5 backdrop-blur-sm p-4 rounded-xl text-xs font-mono space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>FLEET STATUS</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    ONLINE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block">FLEET</span>
                    <span className="text-sm font-bold text-white">{robotCount}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block">STATUS</span>
                    <span className="text-sm font-bold text-emerald-400">OK</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 block">SAFE</span>
                    <span className="text-sm font-bold text-[#FF471D]">100%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
