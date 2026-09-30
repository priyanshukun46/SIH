import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ResQWayHeader } from '../components/shared/ResQWayHeader';
import { ResQWayFooter } from '../components/shared/ResQWayFooter';

type TabType = 'fleet' | 'routes' | 'incidents';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('fleet');

  return (
    <div className="w-full relative bg-white text-[#212121] min-h-screen selection:bg-[#FF471D] selection:text-white font-sans">
      {/* Top Navigation Header: #212121, Text Only, Straight Edges */}
      <ResQWayHeader />

      {/* ============================================================== */}
      {/* HERO SECTION WITH MOUNTAIN ROAD & TELEMETRY WIDGET CARD        */}
      {/* ============================================================== */}
      <section
        className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 min-h-[580px] sm:min-h-[640px] flex flex-col justify-center items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.48) 100%), url('/resqway_mountain_hero.jpg')"
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10 py-6 sm:py-10">
          
          {/* Headline: Welcome to ResQWay */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-8 sm:mb-10 tracking-tight font-sans">
            Welcome to ResQWay
          </h1>

          {/* Centered 3-Tab Floating Widget Card: Straight Edges, Zero Shadows */}
          <div className="w-full max-w-2xl mx-auto rounded-none shadow-none border border-slate-200 overflow-hidden bg-white text-left">
            
            {/* Top 3 Tabs Sitting Horizontally Across Card Top */}
            <div className="grid grid-cols-3 border-b border-slate-200" role="tablist">
              
              {/* Tab 1: SMART ROUTE */}
              <button
                type="button"
                onClick={() => setActiveTab('routes')}
                role="tab"
                aria-selected={activeTab === 'routes'}
                className={`py-3.5 sm:py-4 px-2 sm:px-4 flex items-center justify-center space-x-2 transition-all cursor-pointer border-r border-slate-200 rounded-none ${
                  activeTab === 'routes'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-white text-[#102E39] hover:bg-slate-50'
                }`}
              >
                <i className={`fas fa-route text-sm sm:text-base ${activeTab === 'routes' ? 'text-white' : 'text-[#102E39]'}`}></i>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center leading-none">
                  SMART ROUTE
                </span>
              </button>

              {/* Tab 2: LIVE FLEET (Default Active) */}
              <button
                type="button"
                onClick={() => setActiveTab('fleet')}
                role="tab"
                aria-selected={activeTab === 'fleet'}
                className={`py-3.5 sm:py-4 px-2 sm:px-4 flex items-center justify-center space-x-2 transition-all cursor-pointer rounded-none ${
                  activeTab === 'fleet'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-white text-[#102E39] hover:bg-slate-50'
                }`}
              >
                <i className={`fas fa-robot text-sm sm:text-base ${activeTab === 'fleet' ? 'text-white' : 'text-[#102E39]'}`}></i>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center leading-none">
                  LIVE FLEET
                </span>
              </button>

              {/* Tab 3: FIELD INCIDENCE */}
              <button
                type="button"
                onClick={() => setActiveTab('incidents')}
                role="tab"
                aria-selected={activeTab === 'incidents'}
                className={`py-3.5 sm:py-4 px-2 sm:px-4 flex items-center justify-center space-x-2 transition-all cursor-pointer border-l border-slate-200 rounded-none ${
                  activeTab === 'incidents'
                    ? 'bg-[#102E39] text-white font-bold'
                    : 'bg-white text-[#102E39] hover:bg-slate-50'
                }`}
              >
                <i className={`fas fa-triangle-exclamation text-sm sm:text-base ${activeTab === 'incidents' ? 'text-white' : 'text-[#102E39]'}`}></i>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center leading-none">
                  FIELD INCIDENCE
                </span>
              </button>

            </div>

            {/* Card Body */}
            <div className="p-5 sm:p-7 bg-white">
              
              {/* Pane 1: LIVE FLEET */}
              {activeTab === 'fleet' && (
                <div className="space-y-4">
                  {/* Top Metric Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans">
                        5
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        ACTIVE AMR FLEET
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      100% Mesh Coverage
                    </div>
                  </div>

                  {/* 3-Column Metric Box: Straight Edges, No Shadows */}
                  <div className="border border-slate-200 rounded-none p-3 sm:p-4 bg-white">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-left">
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 font-mono">5</div>
                        <div className="text-xs text-slate-500 font-normal">Active AMRs</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 font-mono">12</div>
                        <div className="text-xs text-slate-500 font-normal">Tasks Done</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 font-mono">99.4%</div>
                        <div className="text-xs text-slate-500 font-normal">Zero Collisions</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Status & Action Row */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>Real-time ActionCable telemetry active</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-none flex items-center space-x-2 shadow-none transition-all cursor-pointer shrink-0"
                    >
                      <span>VIEW LIVE FLEET</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pane 2: SMART ROUTE */}
              {activeTab === 'routes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans">
                        342
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        OPTIMIZED CORRIDORS
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      4D A* + CBS Engine Active
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-none p-3 sm:p-4 bg-white">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-left">
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 font-mono">0.42s</div>
                        <div className="text-xs text-slate-500 font-normal">Route Compute</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 font-mono">99.8%</div>
                        <div className="text-xs text-slate-500 font-normal">On-Time Transit</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#FF471D] leading-none mb-1 font-mono">18.4%</div>
                        <div className="text-xs text-slate-500 font-normal">Energy Saved</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>Dynamic obstacle &amp; congestion avoidance</span>
                    </div>
                    <Link
                      to="/simulation"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-none flex items-center space-x-2 shadow-none transition-all cursor-pointer shrink-0"
                    >
                      <span>CALCULATE SMART ROUTE</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pane 3: FIELD INCIDENCE */}
              {activeTab === 'incidents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#212121] tracking-tight font-sans">
                        0
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        ACTIVE DEADLOCKS
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Wait-For Graph DFS Active
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-none p-3 sm:p-4 bg-white">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-left">
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 font-mono">0</div>
                        <div className="text-xs text-slate-500 font-normal">Unresolved Stalls</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-[#212121] leading-none mb-1 font-mono">2</div>
                        <div className="text-xs text-slate-500 font-normal">Dynamic Detours</div>
                      </div>
                      <div className="px-2 sm:px-4">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 leading-none mb-1 font-mono">100%</div>
                        <div className="text-xs text-slate-500 font-normal">DFS Resolution</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>24/7 automated peer conflict arbitration</span>
                    </div>
                    <Link
                      to="/tasks"
                      className="bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-none flex items-center space-x-2 shadow-none transition-all cursor-pointer shrink-0"
                    >
                      <span>VIEW FIELD INCIDENTS</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Scroll Indicator Under Card */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-white/80 space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">SCROLL TO EXPLORE</span>
            <i className="fas fa-chevron-down text-xs animate-bounce"></i>
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
              <svg className="w-14 h-14 text-[#FF471D]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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

          {/* Right 35% in Crisp White with Outline Button: Straight Edges */}
          <div className="lg:col-span-4 bg-white py-10 px-8 sm:px-12 flex items-center justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-none border-2 border-[#102E39] text-[#102E39] hover:bg-[#102E39] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center cursor-pointer shadow-none"
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

          {/* 8 Tech Stack Badges in Clean Flat Style (No Drop Shadows, White Background, Straight Borders) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 mb-20 text-center">
            
            {/* 1: Ruby on Rails 8 */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-gem text-2xl text-[#FF471D]"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                RUBY ON RAILS 8<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Full-Stack Core</span>
              </span>
            </Link>

            {/* 2: Python & PyTorch ML */}
            <Link to="/analytics" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-brands fa-python text-2xl text-[#102E39] group-hover:text-[#FF471D] transition-colors"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                PYTHON &amp; ML<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Risk Predictor</span>
              </span>
            </Link>

            {/* 3: NOSTR Protocol */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-satellite-dish text-2xl text-[#102E39] group-hover:text-[#FF471D] transition-colors"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                NOSTR PROTOCOL<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Decentralized Mesh</span>
              </span>
            </Link>

            {/* 4: Active Mailer */}
            <Link to="/tasks" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-envelope-circle-check text-2xl text-[#FF471D]"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                ACTIVE MAILER<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Instant Alerting</span>
              </span>
            </Link>

            {/* 5: Hotwire & Stimulus */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-bolt text-2xl text-[#102E39] group-hover:text-[#FF471D] transition-colors"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                HOTWIRE TURBO<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Live Telemetry UI</span>
              </span>
            </Link>

            {/* 6: Tailwind CSS */}
            <Link to="/dashboard" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF471D] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-brands fa-css3-alt text-2xl text-[#FF471D]"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                TAILWIND CSS<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Design System</span>
              </span>
            </Link>

            {/* 7: Leaflet GIS Engine */}
            <Link to="/simulation" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-map-location-dot text-2xl text-[#102E39] group-hover:text-[#FF471D] transition-colors"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                LEAFLET GIS<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Spatial Engine</span>
              </span>
            </Link>

            {/* 8: PostgreSQL Database */}
            <Link to="/analytics" className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 rounded-full border-2 border-[#102E39] bg-white flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105 shadow-none">
                <i className="fa-solid fa-database text-2xl text-[#102E39] group-hover:text-[#FF471D] transition-colors"></i>
              </div>
              <span className="text-xs font-bold text-[#102E39] group-hover:text-[#FF471D] uppercase tracking-wider mt-4 leading-snug">
                POSTGRESQL<br /><span className="text-[10px] text-slate-500 font-normal normal-case block mt-0.5">Spatial Data Store</span>
              </span>
            </Link>

          </div>

          {/* Two-Column Feature Showcase: Straight Edges, No Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Card 1: North Eastern Logistics */}
            <div className="flex flex-col bg-white rounded-none overflow-hidden shadow-none border border-slate-200">
              <div className="overflow-hidden">
                <img
                  src="/fedex_us_shipping.jpg"
                  alt="Navigate High-Altitude Corridors with Ease"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold text-[#212121]">
                  Navigate High-Altitude Corridors with Ease
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  In dynamic terrain environments, having real-time clearance and topological compliance is crucial. ResQWay assists multi-modal fleets with predictive road risk intelligence, automated convoy routing, and live satellite dispatch.
                </p>
              </div>
            </div>

            {/* Card 2: Strategic Cross-Border Network */}
            <div className="flex flex-col bg-white rounded-none overflow-hidden shadow-none border border-slate-200">
              <div className="overflow-hidden">
                <img
                  src="/fedex_eu_market.jpg"
                  alt="Unlock Multi-Modal Logistics Corridors"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold text-[#212121]">
                  Unlock Multi-Modal Logistics Corridors
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Reach regional distribution depots with an integrated telemetry network that synchronizes air freighters, ocean vessels, and intermodal freight for unprecedented turnaround speeds.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* "YOUR BUSINESS RESOURCE" 3-COLUMN SECTION                      */}
      {/* ============================================================== */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#212121] text-center mb-14 tracking-tight">
            Your Logistics &amp; Emergency Resource
          </h2>

          {/* 3-Column Resource Grid: Straight Edges, Zero Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            
            {/* Card 1: New to ResQWay? */}
            <div className="flex flex-col justify-between bg-white p-6 rounded-none border border-slate-200 shadow-none">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-none">
                  <img
                    src="/fedex_resource_1.jpg"
                    alt="New to ResQWay?"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121]">
                  New to ResQWay?
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our Quick Start Onboarding guides you through setting up relief shipments, configuring telemetry API webhooks, and accessing tactical command.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center"
                >
                  <span>TRY INTERACTIVE DEMO</span>
                  <i className="fas fa-chevron-right ml-1 text-[10px]"></i>
                </Link>
              </div>
            </div>

            {/* Card 2: Simplify your Dispatch Logistics */}
            <div className="flex flex-col justify-between bg-white p-6 rounded-none border border-slate-200 shadow-none">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-none">
                  <img
                    src="/fedex_resource_2.jpg"
                    alt="Simplify your Dispatch Logistics"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121]">
                  Simplify your Dispatch Logistics
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comprehensive emergency dispatch workflows that free response teams to focus on life safety while autonomous routing takes care of choke points.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  to="/simulation"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center"
                >
                  <span>LAUNCH 30x20 SIMULATOR</span>
                  <i className="fas fa-chevron-right ml-1 text-[10px]"></i>
                </Link>
              </div>
            </div>

            {/* Card 3: AI Choke Point Avoidance */}
            <div className="flex flex-col justify-between bg-white p-6 rounded-none border border-slate-200 shadow-none">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-none">
                  <img
                    src="/fedex_resource_3.jpg"
                    alt="Predictive Risk Avoidance"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#212121]">
                  Predictive Risk Avoidance
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Learn about AI-powered telemetry models trained on landslide susceptibility, monsoon flooding vectors, and real-time citizen road blockages.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  to="/analytics"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider flex items-center"
                >
                  <span>EXPLORE PREDICTIONS</span>
                  <i className="fas fa-chevron-right ml-1 text-[10px]"></i>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom 2-Column Wide Photo Cards: Straight Edges, No Shadows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Card 1: Green Logistics Sustainability */}
            <div className="flex flex-col bg-white p-6 rounded-none border border-slate-200 shadow-none">
              <div className="overflow-hidden rounded-none">
                <img
                  src="/fedex_bottom_1.jpg"
                  alt="Sustainable logistics for tomorrow"
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
              <div className="pt-5 space-y-2">
                <h3 className="text-2xl font-bold text-[#212121]">
                  Sustainable logistics for tomorrow
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Discover how our carbon-neutral routing and renewable fleet initiatives reduce operational footprints across high-density logistics corridors.
                </p>
                <Link
                  to="/robots"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider mt-2 inline-block"
                >
                  LEARN ABOUT ESG &amp; FLEET
                </Link>
              </div>
            </div>

            {/* Card 2: Mobile Intelligence Smartphone */}
            <div className="flex flex-col bg-white p-6 rounded-none border border-slate-200 shadow-none">
              <div className="overflow-hidden rounded-none">
                <img
                  src="/fedex_bottom_2.jpg"
                  alt="Keep shipments at your fingertips"
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
              <div className="pt-5 space-y-2">
                <h3 className="text-2xl font-bold text-[#212121]">
                  Keep shipments at your fingertips
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Log into our responsive platform to track consignments in real time, receive predictive delay alerts, and redirect emergency shipments on the move.
                </p>
                <Link
                  to="/dashboard"
                  className="text-xs font-bold text-[#102E39] hover:text-[#FF471D] uppercase tracking-wider mt-2 inline-block"
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
