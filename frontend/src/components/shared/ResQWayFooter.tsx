import React from 'react';
import { Link } from 'react-router-dom';

export const ResQWayFooter: React.FC = () => {
  return (
    <footer
      className="bg-[#212121] border-t border-white/10 text-slate-400 text-xs pt-16 pb-12 w-full mt-auto font-sans"
      style={{ backgroundColor: '#212121' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 5 Column Grid matching ResQWay Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Platform & Architecture */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Platform &amp; Core</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors inline-block">
                  About ResQWay FleetSim
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  30x20 Space-Time Floor Map
                </Link>
              </li>
              <li>
                <Link to="/robots" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Multi-Robot Telemetry
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Comparative Benchmark Suite
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Wait-For Graph Cycle DFS
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Anti-Starvation Priority Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Fleet Management */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Fleet &amp; Robots</p>
            <ul className="space-y-2">
              <li>
                <Link to="/robots" className="text-[#FF471D] font-bold hover:underline transition-colors inline-block">
                  Active Fleet (5 AMRs Online)
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Dynamic Task Dispatcher
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Dynamic Obstacle Detours
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors inline-block">
                  ActionCable WebSocket Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordination Intelligence */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Edge AI Coordination</p>
            <ul className="space-y-2">
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Head-On &amp; Swap Conflict Avoidance
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors inline-block">
                  4D Space-Time Coordinate Reservations
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Baseline vs Distributed Engine
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Autonomous Task Reassignment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Docs */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Resources &amp; Docs</p>
            <ul className="space-y-2">
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors inline-block">
                  System Architecture Specs
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Fleet Utilization Indices
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Warehouse Shelf Grid Layout
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="text-slate-400 hover:text-white transition-colors inline-block">
                  Charging Bays &amp; Dropoffs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Deployment Mode */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Deployment Mode</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-300">
                <svg className="w-4 h-4 text-[#FF471D]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <rect width="14" height="14" x="5" y="5" rx="2" />
                  <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
                </svg>
                <span className="font-medium">Software-Only Sim</span>
              </div>

              <div className="relative">
                <select
                  aria-label="Simulation Environment Mode"
                  defaultValue="Distributed Edge-AI"
                  className="w-full bg-[#1b1b1b] border border-white/20 text-slate-200 text-xs rounded-none py-2 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#FF471D] transition-colors cursor-pointer"
                >
                  <option value="Distributed Edge-AI">Distributed Edge-AI</option>
                  <option value="Baseline Centralized">Baseline Centralized</option>
                  <option value="Headless Benchmark">Headless Benchmark</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Logo & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-slate-500">
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo_icon.png"
              alt="ResQWay"
              className="h-6 w-auto object-contain"
            />
            <span className="text-sm font-black tracking-tight text-white">
              ResQ<span className="text-[#FF471D]">Way</span>
            </span>
            <span className="text-[11px] text-slate-500 ml-2">
              &copy; 2026 ResQWay FleetSim. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span>SIH26123 Autonomous AMR Fleet Simulator</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400 font-semibold">Edge-AI Smart Warehouse Logistics</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
