import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowRight, BookOpen, Clock, Activity } from 'lucide-react';
import ControlSlider from '@/components/ui/ControlSlider';

export default function Landing() {
  const [velocity, setVelocity] = useState(0);

  // For the worldline, v = 0 means straight up (x=0). 
  // v = 0.9c means steep slope. Angle = atan(v) if c=1.
  // We'll map v to an angle in the SVG.
  // x-axis is horizontal, ct-axis is vertical.
  const worldlineX = 200 + velocity * 150; // max 0.9 * 150 = 135
  const worldlineY = 50; // top of the graph

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Sidebar toggle */}
      <header className="p-4 flex items-center justify-between max-w-7xl mx-auto">
        <button className="p-2 rounded hover:bg-slate-200 transition-colors" aria-label="Toggle Sidebar">
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        <div className="font-bold tracking-widest text-navy">RELATIVITY LAB</div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-navy leading-tight tracking-tight">
              RELATIVITY <br /> <span className="text-violet-600">LAB</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-slate-600 font-light">
              Explore the physics of space, time and motion.
            </p>
          </div>

          <Link 
            to="/reference-frames" 
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-violet-700 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-violet-200"
          >
            ENTER THE LAB
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero Interactive Diagram */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 mb-4 uppercase">Spacetime Explorer Preview</h3>
          
          <div className="relative w-full max-w-[400px] aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner mb-6">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              
              {/* Light Cone (45 degrees) */}
              <line x1="50" y1="50" x2="350" y2="350" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <line x1="350" y1="50" x2="50" y2="350" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              
              {/* Axes */}
              <line x1="200" y1="350" x2="200" y2="50" stroke="white" strokeWidth="2" /> {/* ct axis */}
              <line x1="50" y1="200" x2="350" y2="200" stroke="white" strokeWidth="2" /> {/* x axis */}
              
              {/* Axis Labels */}
              <text x="210" y="60" fill="white" fontSize="14" fontFamily="monospace">ct</text>
              <text x="340" y="220" fill="white" fontSize="14" fontFamily="monospace">x</text>

              {/* Worldline */}
              <line 
                x1="200" y1="200" 
                x2={worldlineX} y2={worldlineY} 
                stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" 
              />
              <circle cx="200" cy="200" r="4" fill="white" />
              <text x={worldlineX + 10} y={worldlineY + 10} fill="#7c3aed" fontSize="14" fontWeight="bold">v = {velocity.toFixed(2)}c</text>
            </svg>
          </div>

          <div className="w-full max-w-[400px]">
            <ControlSlider
              label="Frame Velocity (v/c)"
              value={velocity}
              min={0}
              max={0.9}
              step={0.01}
              onChange={setVelocity}
            />
          </div>
        </div>
      </main>

      {/* Chapters & Objectives */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Course Overview</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Master the fundamentals of Special Relativity through interactive simulations and visual physics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Chapter 6.1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">6.1 Reference Frames</h3>
              <p className="text-slate-600 mb-4">Understand observers, coordinate systems, and Galilean transformation basics.</p>
            </div>

            {/* Chapter 6.2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">6.2 Postulates of SR</h3>
              <p className="text-slate-600 mb-4">Discover Einstein's two postulates and the breakdown of absolute time.</p>
            </div>

            {/* Chapter 6.3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">6.3 Time & Length</h3>
              <p className="text-slate-600 mb-4">Calculate time dilation and length contraction using the Lorentz factor.</p>
            </div>
          </div>

          <div className="bg-navy text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <h3 className="text-2xl font-bold mb-6">Learning Objectives</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                <span>Define inertial reference frames and events in spacetime.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Apply Galilean velocity addition and identify its limits.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Evaluate scenarios using Einstein's postulates of Special Relativity.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Compute relativistic effects on time intervals and proper length.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
