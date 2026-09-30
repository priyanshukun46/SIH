import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SimulationRun, SimulationMetrics } from '../../types/simulation';

interface ResQWayHeaderProps {
  simulationRun?: SimulationRun | null;
  metrics?: SimulationMetrics;
  robotCount?: number;
  activeTasksCount?: number;
  onRunDemo?: () => void;
}

export const ResQWayHeader: React.FC<ResQWayHeaderProps> = ({
  simulationRun,
  onRunDemo
}) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const isOpFleet = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/simulation' || location.pathname === '/robots';
  const isTactical = location.pathname === '/tasks';
  const isInsights = location.pathname === '/analytics';

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 3px orange accent line */}
      <div className="h-[3px] w-full bg-[#FF471D]"></div>

      <header
        ref={navRef}
        className="w-full bg-[#212121] border-b border-white/10 text-white shadow-none"
        style={{ backgroundColor: '#212121' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo Lockup */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2.5 group focus:outline-none">
                <img
                  src="/logo_icon.png"
                  alt="ResQWay"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  ResQ<span className="text-[#FF471D]">Way</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Menus: Text Only, No Icons (matching ResQWay) */}
            <nav className="hidden lg:flex items-center space-x-1 sm:space-x-3 text-sm font-medium">
              
              {/* Menu 1: Operational Fleet */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('operational')}
                  className={`px-3.5 py-2 flex items-center space-x-1.5 transition-colors focus:outline-none cursor-pointer rounded-none ${
                    isOpFleet
                      ? 'text-white border-b-2 border-[#FF471D] bg-white/5 font-semibold'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-sm">Operational Fleet</span>
                  <i className="fas fa-chevron-down text-[9px] text-white/70 ml-1"></i>
                </button>

                {openDropdown === 'operational' && (
                  <div className="absolute top-full left-0 mt-0.5 w-64 bg-white text-[#212121] rounded-none shadow-none border border-slate-300 py-1 z-50">
                    <div className="px-4 py-1.5 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Warehouse Operations</p>
                    </div>
                    <Link
                      to="/"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      ResQWay Home Overview
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Executive Command Cockpit
                    </Link>
                    <Link
                      to="/simulation"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Interactive 30x20 Floor Map
                    </Link>
                    <Link
                      to="/robots"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Live AMR Roster &amp; Health
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-[#FF471D] uppercase tracking-wider hover:bg-orange-50 transition-colors"
                    >
                      Launch Simulator &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Menu 2: Tactical Coordination */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('tactical')}
                  className={`px-3.5 py-2 flex items-center space-x-1.5 transition-colors focus:outline-none cursor-pointer rounded-none ${
                    isTactical
                      ? 'text-white border-b-2 border-[#FF471D] bg-white/5 font-semibold'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-sm">Tactical Coordination</span>
                  <i className="fas fa-chevron-down text-[9px] text-white/70 ml-1"></i>
                </button>

                {openDropdown === 'tactical' && (
                  <div className="absolute top-full left-0 mt-0.5 w-64 bg-white text-[#212121] rounded-none shadow-none border border-slate-300 py-1 z-50">
                    <div className="px-4 py-1.5 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Coordination Intelligence</p>
                    </div>
                    <Link
                      to="/tasks"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Task Queue &amp; Reallocation
                    </Link>
                    <Link
                      to="/simulation"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Dynamic Aisle Blocker &amp; Detours
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Space-Time Reservation Matrix
                    </Link>
                  </div>
                )}
              </div>

              {/* Menu 3: Insights and Simulations */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('insights')}
                  className={`px-3.5 py-2 flex items-center space-x-1.5 transition-colors focus:outline-none cursor-pointer rounded-none ${
                    isInsights
                      ? 'text-white border-b-2 border-[#FF471D] bg-white/5 font-semibold'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-sm">Insights and Simulations</span>
                  <i className="fas fa-chevron-down text-[9px] text-white/70 ml-1"></i>
                </button>

                {openDropdown === 'insights' && (
                  <div className="absolute top-full left-0 mt-0.5 w-64 bg-white text-[#212121] rounded-none shadow-none border border-slate-300 py-1 z-50">
                    <div className="px-4 py-1.5 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Benchmarks</p>
                    </div>
                    <Link
                      to="/analytics"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Baseline vs Distributed Comparison
                    </Link>
                    <Link
                      to="/analytics"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-[#FF471D] transition-colors"
                    >
                      Throughput &amp; Wait Metrics
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      to="/analytics"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-xs font-bold text-[#FF471D] uppercase tracking-wider hover:bg-orange-50 transition-colors"
                    >
                      Run Headless Benchmark &rarr;
                    </Link>
                  </div>
                )}
              </div>

            </nav>

            {/* Right Nav Action Controls: Minimal straight buttons */}
            <div className="flex items-center space-x-3">
              {onRunDemo && (
                <button
                  type="button"
                  onClick={onRunDemo}
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#FF471D] hover:bg-[#e03d15] text-white rounded-none shadow-none transition-colors cursor-pointer font-sans"
                >
                  SIH Demo Mode
                </button>
              )}

              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 text-xs font-bold border border-white/30 hover:border-white text-white rounded-none shadow-none transition-colors cursor-pointer font-sans"
              >
                Launch Simulator
              </Link>

              {simulationRun && (
                <div className="hidden sm:flex items-center px-2.5 py-1 border border-white/20 text-[11px] font-mono font-semibold rounded-none shadow-none text-slate-300">
                  <span className="w-1.5 h-1.5 bg-emerald-400 inline-block mr-1.5"></span>
                  <span>{simulationRun?.status || 'IDLE'}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </div>
  );
};
