import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';

type TabType = 'tasks' | 'amr' | 'cockpit';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  return (
    <div className="w-full relative bg-white text-[#212121] min-h-screen selection:bg-[#FF471D] selection:text-white font-sans">
      {/* Top Navigation Header: #212121, Text Only, Straight Edges */}
      <ResQWayHeader />

      {/* ============================================================== */}
      {/* HERO SECTION WITH WAREHOUSE FLOOR & TELEMETRY WIDGET CARD      */}
      {/* ============================================================== */}
      <section
        className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 min-h-[580px] sm:min-h-[640px] flex flex-col justify-center items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.55) 100%), url('/resqway_warehouse_hero.jpg')"
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10 py-6 sm:py-10">
          
          {/* Headline: Welcome to ResQWay */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-8 sm:mb-10 tracking-tight font-sans">
            Welcome to ResQWay
          </h1>

          {/* Centered 3-Tab Floating Widget Card: Rounded, Zero Strokes, Zero Shadows */}
          <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-none border-0 overflow-hidden bg-white text-left">
            
            {/* Top 3 Tabs Sitting Horizontally Across Card Top - No Borders */}
            <div className="grid grid-cols-3 bg-slate-100" role="tablist">
              
              {/* Tab 1: TASK QUEUE & REALLOCATION */}
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                role="tab"
                aria-selected={activeTab === 'tasks'}
                className={`py-3.5 sm:py-4 px-2 sm:px-3 flex items-center justify-center transition-all cursor-pointer border-0 rounded-none ${
                  activeTab === 'tasks'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-transparent text-[#102E39] hover:bg-slate-200/60 font-semibold'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight">
                  TASK QUEUE &amp; REALLOCATION
                </span>
              </button>

              {/* Tab 2: LIVE AMR */}
              <button
                type="button"
                onClick={() => setActiveTab('amr')}
                role="tab"
                aria-selected={activeTab === 'amr'}
                className={`py-3.5 sm:py-4 px-2 sm:px-4 flex items-center justify-center transition-all cursor-pointer border-0 rounded-none ${
                  activeTab === 'amr'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-transparent text-[#102E39] hover:bg-slate-200/60 font-semibold'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight">
                  LIVE AMR
                </span>
              </button>

              {/* Tab 3: EXECUTIVE COMMAND COCKPIT */}
              <button
                type="button"
                onClick={() => setActiveTab('cockpit')}
                role="tab"
                aria-selected={activeTab === 'cockpit'}
                className={`py-3.5 sm:py-4 px-2 sm:px-3 flex items-center justify-center transition-all cursor-pointer border-0 rounded-none ${
                  activeTab === 'cockpit'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-transparent text-[#102E39] hover:bg-slate-200/60 font-semibold'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight">
                  EXECUTIVE COMMAND COCKPIT
                </span>
              </button>

            </div>

            {/* Card Body */}
            <div className="p-5 sm:p-7 bg-white text-left">
              
              {/* Pane 1: TASK QUEUE & REALLOCATION */}
              {activeTab === 'tasks' && (
                <div className="space-y-4 text-left">
                  {/* Top Metric Row */}
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center space-x-2.5 text-left">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans text-left">
                        15
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 text-left">
                        ACTIVE ORDERS IN PIPELINE
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium text-right">
                      Dynamic Cost-Matrix Dispatch
                    </div>
                  </div>

                  {/* 3-Column Metric Box: All Text Left Aligned, Zero Strokes, Rounded */}
                  <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border-0 shadow-none text-left">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-left">
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 text-left font-sans">15</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Queued Orders</div>
                      </div>
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 text-left font-sans">100%</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Auto Allocated</div>
                      </div>
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-[#FF471D] leading-none mb-1 text-left font-sans">0</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Bottlenecks</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Status & Action Row */}
                  <div className="flex items-center justify-between pt-1 text-left">
                    <div className="flex items-center space-x-2 text-xs text-slate-500 text-left">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-left font-sans">Autonomous task reallocation upon corridor congestion</span>
                    </div>
                    <Link
                      to="/tasks"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-2 shadow-none border-0 transition-all cursor-pointer shrink-0"
                    >
                      <span>VIEW TASK QUEUE</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pane 2: LIVE AMR */}
              {activeTab === 'amr' && (
                <div className="space-y-4 text-left">
                  {/* Top Metric Row */}
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center space-x-2.5 text-left">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans text-left">
                        5
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 text-left">
                        DEPLOYED AMR FLEET
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium text-right">
                      100% Mesh Coverage &bull; 0 Collisions
                    </div>
                  </div>

                  {/* 3-Column Metric Box: All Text Left Aligned, Zero Strokes, Rounded */}
                  <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border-0 shadow-none text-left">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-left">
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 text-left font-sans">5 Units</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Active AMRs</div>
                      </div>
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 text-left font-sans">94% Avg</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Power Reserve</div>
                      </div>
                      <div className="px-2 sm:px-4 text-left">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 text-left font-sans">99.4%</div>
                        <div className="text-xs text-slate-500 font-normal text-left font-sans">Safety Clearance</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Status & Action Row */}
                  <div className="flex items-center justify-between pt-1 text-left">
                    <div className="flex items-center space-x-2 text-xs text-slate-500 text-left">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-left font-sans">Decentralized edge telemetry streaming via ActionCable</span>
                    </div>
                    <Link
                      to="/robots"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-2 shadow-none border-0 transition-all cursor-pointer shrink-0"
                    >
                      <span>VIEW LIVE AMR</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pane 3: EXECUTIVE COMMAND COCKPIT */}
              {activeTab === 'cockpit' && (
                <div className="space-y-4 text-left">
                  {/* Top Metric Row */}
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center space-x-2.5 text-left">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans text-left">
                        100%
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 text-left">
                        SPACE-TIME COORDINATOR
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium text-right">
                      4D Reservation Engine Active
                    </div>
                  </div>

                  {/* 4-Item Metric Box: Featuring ONLY Routes, Clearance, Blocked, In Transit */}
                  <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border-0 shadow-none text-left">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-left">
                      {/* 1: Routes */}
                      <div className="p-2 sm:px-3 text-left">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left mb-1 font-sans">
                          Routes
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 text-left font-sans">
                          5 / 5
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal text-left font-sans">
                          Active Corridors
                        </div>
                      </div>

                      {/* 2: Clearance */}
                      <div className="p-2 sm:px-3 text-left">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left mb-1 font-sans">
                          Clearance
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 text-left font-sans">
                          100%
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal text-left font-sans">
                          Zero Collisions
                        </div>
                      </div>

                      {/* 3: Blocked */}
                      <div className="p-2 sm:px-3 text-left">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left mb-1 font-sans">
                          Blocked
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 text-left font-sans">
                          0
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal text-left font-sans">
                          Nominal Paths
                        </div>
                      </div>

                      {/* 4: In Transit */}
                      <div className="p-2 sm:px-3 text-left">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left mb-1 font-sans">
                          In Transit
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-[#FF471D] leading-none mb-1 text-left font-sans">
                          12
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal text-left font-sans">
                          Dispatched Orders
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Status & Action Row */}
                  <div className="flex items-center justify-between pt-1 text-left">
                    <div className="flex items-center space-x-2 text-xs text-slate-500 text-left">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-left font-sans">Decentralized 4D multi-agent space-time reservations</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center space-x-2 shadow-none border-0 transition-all cursor-pointer shrink-0"
                    >
                      <span>OPEN COMMAND COCKPIT</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Scroll Indicator Under Card */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-white/80 space-y-1">
            <svg className="w-4 h-4 animate-bounce text-white/80" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* SPLIT PROMOTIONAL BANNER (#102E39 ESSENCE & WHITE)             */}
      {/* ============================================================== */}
      <section className="w-full bg-[#102E39]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[160px]">
          
          {/* Left 65% in Solid Petrol #102E39 */}
          <div className="lg:col-span-8 bg-[#102E39] text-white py-10 px-6 sm:px-12 lg:px-20 flex items-start space-x-6">
            <div className="hidden sm:block shrink-0 mt-1">
              <svg className="w-14 h-14 text-[#FF471D]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Edge-AI Distributed Fleet Coordination for Autonomous Mobile Robots
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-normal">
                SIH26123: Multi-robot 4D space-time path planning, decentralized conflict resolution, dynamic task bidding, and wait-for graph cycle deadlock dissolution.
              </p>
              <p className="text-xs text-white/70 pt-1 leading-relaxed">
                *High-throughput multi-agent simulation designed for smart warehouses, emergency depots, and high-density industrial facilities.
              </p>
              <p className="text-xs text-white font-bold">
                *100% Software-only simulation. Zero hardware dependencies.
              </p>
            </div>
          </div>

          {/* Right 35% in Crisp White with Solid Button: Rounded, Zero Strokes */}
          <div className="lg:col-span-4 bg-white py-10 px-8 sm:px-12 flex items-center justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-[#102E39] text-white hover:bg-[#FF471D] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center cursor-pointer shadow-none border-0"
            >
              LAUNCH SIMULATOR
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* CORE TECHNOLOGY STACK SECTION                                  */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading in Deep #212121 */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#212121] text-center mb-3 tracking-tight">
            Core Technology Stack
          </h2>
          <p className="text-sm text-slate-600 text-center max-w-2xl mx-auto mb-14 font-medium">
            Engineered with resilient, modern frameworks built for mission-critical logistics and real-time emergency telemetry.
          </p>

          {/* 7 Tech Stack Badges with crisp inline SVG icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 mb-20 text-center">
            
            {/* 1: Ruby on Rails 8 */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#FF471D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                  <path d="M2 9h20" />
                  <path d="M10 3l2 6-2 12" />
                  <path d="M14 3l-2 6 2 12" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                RUBY ON RAILS 8<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Full-Stack Core</span>
              </span>
            </Link>

            {/* 2: Python & PyTorch ML */}
            <Link to="/analytics" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#102E39] group-hover:text-[#FF471D] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5V8h5a2 2 0 0 1 2 2v2h2.5A4.5 4.5 0 0 0 21.5 7.5V7a5 5 0 0 0-5-5H12zm-1.5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm1.5 18a4.5 4.5 0 0 0 4.5-4.5V16h-5a2 2 0 0 1-2-2v-2H7A4.5 4.5 0 0 0 2.5 16.5V17a5 5 0 0 0 5 5H12zm1.5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                PYTHON &amp; ML<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Risk Predictor</span>
              </span>
            </Link>

            {/* 3: NOSTR Protocol */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#102E39] group-hover:text-[#FF471D] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="4" cy="6" r="2" />
                  <circle cx="20" cy="6" r="2" />
                  <circle cx="4" cy="18" r="2" />
                  <circle cx="20" cy="18" r="2" />
                  <path d="M6 7l4 3.5M14 10.5l4-3.5M6 17l4-3.5M14 13.5l4 3.5" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                NOSTR PROTOCOL<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Decentralized Mesh</span>
              </span>
            </Link>

            {/* 4: Active Mailer */}
            <Link to="/tasks" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#FF471D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="15" x="2" y="5" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                  <circle cx="19" cy="5" r="3" fill="#FF471D" stroke="white" strokeWidth={1.5} />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                ACTIVE MAILER<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Instant Alerting</span>
              </span>
            </Link>

            {/* 5: Hotwire & Stimulus */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#102E39] group-hover:text-[#FF471D] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                HOTWIRE TURBO<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Live Telemetry UI</span>
              </span>
            </Link>

            {/* 6: Tailwind CSS */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#FF471D]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                TAILWIND CSS<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Design System</span>
              </span>
            </Link>

            {/* 7: PostgreSQL Database */}
            <Link to="/analytics" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <svg className="w-8 h-8 text-[#102E39] group-hover:text-[#FF471D] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="8" ry="3" />
                  <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
                  <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                POSTGRESQL<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Spatial Data Store</span>
              </span>
            </Link>

          </div>

          {/* Two-Column Feature Showcase: Rounded, Zero Strokes, Zero Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Card 1: Autonomous 4D Space-Time Conflict Resolution */}
            <div className="flex flex-col bg-slate-50 rounded-2xl overflow-hidden shadow-none border-0 text-left">
              <div className="overflow-hidden">
                <img
                  src="/amr_conflict_resolution.jpg"
                  alt="Autonomous 4D Space-Time Conflict Resolution"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-2 text-left">
                <h3 className="text-2xl font-bold text-[#212121] text-left">
                  Autonomous 4D Space-Time Conflict Resolution
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Eliminate corridor congestion and multi-robot deadlock loops across high-density warehouse aisles. ResQWay reserves discrete space-time cells along dynamic A* trajectories, ensuring safe, sub-second route recalculation and zero physical collisions.
                </p>
              </div>
            </div>

            {/* Card 2: Dynamic Task Allocation & Priority Bidding */}
            <div className="flex flex-col bg-slate-50 rounded-2xl overflow-hidden shadow-none border-0 text-left">
              <div className="overflow-hidden">
                <img
                  src="/amr_task_allocation.jpg"
                  alt="Dynamic Task Allocation & Priority Bidding"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-2 text-left">
                <h3 className="text-2xl font-bold text-[#212121] text-left">
                  Dynamic Task Allocation &amp; Priority Bidding
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Maximize automated fulfillment velocity with dynamic cost-matrix task dispatch. Real-time reallocation seamlessly reroutes idle or lower-priority AMRs whenever urgent picks, replenishment orders, or corridor choke points occur.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* "YOUR BUSINESS RESOURCE" 3-COLUMN SECTION                      */}
      {/* ============================================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#212121] text-center mb-14 tracking-tight">
            Autonomous Logistics &amp; Fleet Resources
          </h2>

          {/* 3-Column Resource Grid: Rounded, Zero Strokes, Zero Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            
            {/* Card 1: Interactive 30x20 Floor Simulator */}
            <div className="flex flex-col justify-between bg-slate-50 p-6 sm:p-7 rounded-2xl border-0 shadow-none text-left">
              <div className="space-y-4 text-left">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/amr_floor_simulation.jpg"
                    alt="Interactive 30x20 Floor Simulator"
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121] text-left">
                  Interactive 30×20 Floor Simulator
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Step into our interactive 2D digital twin floor simulator to inspect real-time multi-robot path reservations, dynamically place corridor obstacles, and observe cycle deadlock dissolution live.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/simulation"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center text-left"
                >
                  <span>LAUNCH 30x20 SIMULATOR</span>
                  <svg className="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 2: Live Telemetry & AMR Diagnostics */}
            <div className="flex flex-col justify-between bg-slate-50 p-6 sm:p-7 rounded-2xl border-0 shadow-none text-left">
              <div className="space-y-4 text-left">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/amr_fleet_telemetry.jpg"
                    alt="Live Telemetry & AMR Diagnostics"
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121] text-left">
                  Live Telemetry &amp; AMR Diagnostics
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Monitor spatial coordinates, battery reserves, motor temperature, and active mission assignments for every deployed unit with decentralized ActionCable telemetry streaming.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/robots"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center text-left"
                >
                  <span>INSPECT AMR FLEET</span>
                  <svg className="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Card 3: Multi-Agent Coordination Benchmarks */}
            <div className="flex flex-col justify-between bg-slate-50 p-6 sm:p-7 rounded-2xl border-0 shadow-none text-left">
              <div className="space-y-4 text-left">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/amr_benchmarks_ai.jpg"
                    alt="Multi-Agent Coordination Benchmarks"
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121] text-left">
                  Coordination Benchmarks &amp; AI
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Evaluate our distributed reservation engine against traditional Stop-and-Wait baselines across wait-time latency, total transit duration, energy conservation, and throughput.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/analytics"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center text-left"
                >
                  <span>EXPLORE BENCHMARKS</span>
                  <svg className="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom 2-Column Wide Photo Cards: Rounded, Zero Strokes, Zero Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Card 1: Kinetic Energy & Battery Management */}
            <div className="flex flex-col bg-slate-50 p-6 sm:p-7 rounded-2xl border-0 shadow-none text-left">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/amr_energy_efficiency.jpg"
                  alt="Kinetic Energy & Battery Management"
                  className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="pt-5 space-y-2 text-left">
                <h3 className="text-2xl font-bold text-[#212121] text-left">
                  Kinetic Energy &amp; Battery Management
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Intelligent velocity profiling minimizes harsh acceleration and braking cycles, extending battery longevity and cutting automated facility power draw by up to 18.4%.
                </p>
                <Link
                  to="/analytics"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider mt-2 inline-block text-left"
                >
                  VIEW ENERGY TELEMETRY
                </Link>
              </div>
            </div>

            {/* Card 2: Unified Fleet Operations Cockpit */}
            <div className="flex flex-col bg-slate-50 p-6 sm:p-7 rounded-2xl border-0 shadow-none text-left">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/amr_cockpit_tablet.jpg"
                  alt="Unified Fleet Operations Cockpit"
                  className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="pt-5 space-y-2 text-left">
                <h3 className="text-2xl font-bold text-[#212121] text-left">
                  Unified Fleet Operations Cockpit
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-left">
                  Command your entire robotic facility from an executive dashboard. Track mission fulfillment in real time, clear bottlenecks with one click, and manage warehouse dispatch on any device.
                </p>
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider mt-2 inline-block text-left"
                >
                  EXPLORE LIVE COCKPIT
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Comprehensive Global Footer: 5 Columns, Straight Edges, No Shadows */}
      <ResQWayFooter />
    </div>
  );
};
