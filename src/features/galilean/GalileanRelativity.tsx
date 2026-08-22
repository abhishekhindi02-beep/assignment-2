import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import MathBlock, { InlineMath } from '@/components/math/MathBlock';
import FormulaCard from '@/components/math/FormulaCard';
import CalloutCard from '@/components/ui/CalloutCard';
import ControlSlider from '@/components/ui/ControlSlider';
import QuizCard from '@/components/quiz/QuizCard';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import useProgress from '@/hooks/useProgress';

export default function GalileanRelativity() {
  const { markComplete } = useProgress();

  // Train Experiment State
  const [trainVel, setTrainVel] = useState(50); // km/h
  const [ballVel, setBallVel] = useState(10); // m/s (using simplified math for demo purposes, assume same units conceptually for the addition below, but let's strictly convert or label if needed. Actually, let's keep units uniform: both in m/s to avoid confusion).

  // Let's reset sliders to use m/s for both to make u = u' + v straightforward mathematically for the user.
  const [v, setV] = useState(20); // Train vel (m/s)
  const [uPrime, setUPrime] = useState(10); // Ball vel rel to train (m/s)
  const u = v + uPrime;

  // The Speed of Light Problem State
  const [lightTrainV, setLightTrainV] = useState(0.5); // c

  const handleQuizCorrect = () => {
    markComplete('galilean-relativity');
  };

  return (
    <SectionWrapper
      prev={{ to: '/reference-frames', label: '01 Reference Frames' }}
      next={{ to: '/einsteins-postulates', label: "03 Einstein's Postulates" }}
    >
      <SectionHeader title="6.1 — Galilean Relativity" />

      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Intro */}
        <section className="space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed">
            Named after Galileo Galilei, Galilean relativity describes how coordinates and velocities transform between different inertial reference frames at everyday speeds. It's the "common sense" physics we experience daily.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Galilean Transformation Equations</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-4">
              <MathBlock math="x' = x - vt" className="text-2xl" />
              <MathBlock math="t' = t" className="text-2xl" />
            </div>
            <p className="text-slate-600 text-center mt-4">
              Notice that time is absolute: <InlineMath math="t' = t" />. Everyone agrees on the ticking of a clock.
            </p>
          </div>

          <FormulaCard
            title="Galilean Velocity Addition"
            formula="u = u' + v"
            description="How to add velocities when changing reference frames."
            variables={[
              { symbol: "u", definition: "Velocity measured by stationary ground observer (Frame S)" },
              { symbol: "u'", definition: "Velocity measured by moving observer (Frame S')" },
              { symbol: "v", definition: "Velocity of the moving frame S' relative to S" }
            ]}
          />
        </section>

        {/* Interactive Train Experiment */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">Interactive: The Moving Train</h2>
          <p className="text-slate-700">
            A passenger throws a ball forward inside a moving train. Adjust the train's speed (<InlineMath math="v" />) and the throw speed (<InlineMath math="u'" />).
          </p>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-inner border border-slate-800">
            {/* SVG Visual */}
            <div className="relative w-full h-[200px] bg-slate-800 rounded-xl overflow-hidden mb-8">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                {/* Tracks */}
                <line x1="0" y1="160" x2="600" y2="160" stroke="#475569" strokeWidth="4" />
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={i} x1={i * 30 + 15} y1="160" x2={i * 30 + 5} y2="170" stroke="#475569" strokeWidth="2" />
                ))}

                {/* Ground Observer */}
                <circle cx="50" cy="140" r="10" fill="#1e3a5f" />
                <rect x="45" y="150" width="10" height="20" fill="#1e3a5f" />
                <text x="30" y="190" fill="#94a3b8" fontSize="12" fontWeight="bold">S (Ground)</text>

                {/* Train (Frame S') */}
                <g transform={`translate(${v * 3}, 0)`}>
                  <rect x="100" y="80" width="200" height="70" fill="#7c3aed" rx="8" />
                  <rect x="120" y="90" width="40" height="30" fill="#1e293b" rx="4" />
                  <rect x="180" y="90" width="40" height="30" fill="#1e293b" rx="4" />
                  <rect x="240" y="90" width="40" height="30" fill="#1e293b" rx="4" />
                  
                  {/* Wheels */}
                  <circle cx="130" cy="155" r="8" fill="#cbd5e1" />
                  <circle cx="270" cy="155" r="8" fill="#cbd5e1" />

                  <text x="175" y="175" fill="#a78bfa" fontSize="12" fontWeight="bold">S' (Train v = {v} m/s)</text>

                  {/* Ball inside train */}
                  <g transform={`translate(${100 + uPrime * 2}, 110)`}>
                    <circle cx="0" cy="0" r="6" fill="#f59e0b" />
                    {/* Velocity vector of ball in train */}
                    <line x1="6" y1="0" x2={6 + uPrime} y2="0" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x={10 + uPrime} y="5" fill="#f59e0b" fontSize="12" fontWeight="bold">u' = {uPrime}</text>
                  </g>
                </g>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ControlSlider
                label="Train Velocity (v) [m/s]"
                value={v}
                min={0}
                max={50}
                step={1}
                onChange={setV}
              />
              <ControlSlider
                label="Ball Velocity in Train (u') [m/s]"
                value={uPrime}
                min={0}
                max={30}
                step={1}
                onChange={setUPrime}
              />
            </div>

            {/* Readouts */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center">
                <div className="text-violet-400 text-sm font-bold uppercase tracking-wide mb-1">Train Observer Measures</div>
                <div className="text-3xl font-mono text-white">u' = {uPrime} <span className="text-lg">m/s</span></div>
              </div>
              <div className="text-2xl text-slate-500 font-light">+</div>
              <div className="text-center">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-1">Train Speed</div>
                <div className="text-3xl font-mono text-slate-300">v = {v} <span className="text-lg">m/s</span></div>
              </div>
              <div className="text-2xl text-slate-500 font-light">=</div>
              <div className="text-center bg-slate-900 px-6 py-3 rounded-xl shadow-lg border border-slate-700">
                <div className="text-emerald-400 text-sm font-bold uppercase tracking-wide mb-1">Ground Observer Measures</div>
                <div className="text-4xl font-mono text-white text-shadow">u = {u} <span className="text-xl">m/s</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* The Speed of Light Problem Reveal */}
        <section className="mt-16 pt-16 border-t-2 border-slate-200">
          <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-64 h-64 text-red-600" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-6 relative z-10">THE SPEED OF LIGHT PROBLEM</h2>
            
            <p className="text-xl text-slate-800 mb-8 relative z-10 leading-relaxed font-medium">
              What happens if our train moves at 0.8c, and the passenger turns on a flashlight instead of throwing a ball? The light moves at <strong>c</strong> relative to the train.
            </p>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 relative z-10">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Galilean Prediction:</p>
              <MathBlock math="u = c + 0.8c = 1.8c" className="text-3xl text-red-600 font-bold" />
              <p className="mt-4 text-slate-700">
                According to Galileo, the ground observer should see light moving at 1.8 times the speed of light. 
              </p>
            </div>

            <CalloutCard type="warning" title="Experimental Reality">
              In the late 19th century, scientists measured the speed of light from moving sources (like stars and the moving Earth). They found that the ground observer <em>always</em> measures exactly <strong>c</strong>, never 1.8c. 
            </CalloutCard>

            <div className="mt-8 p-6 bg-red-600 text-white rounded-2xl shadow-lg text-center relative z-10">
              <h4 className="text-2xl font-black mb-2">Something fundamental has to change.</h4>
              <p className="text-red-100 text-base max-w-xl mx-auto">
                If the speed of light is invariant in all frames, our assumption that time is absolute (<InlineMath math="t' = t" />) must be wrong. Proceed to the next section to explore Einstein's Postulates.
              </p>
            </div>
          </div>
        </section>

        {/* Knowledge Check */}
        <section className="pt-8">
          <QuizCard
            question="A train moves at 30 m/s. A passenger throws a ball at 20 m/s in the direction of motion. What speed does a ground observer measure?"
            options={[
              { id: 'a', text: '50 m/s', correct: true, explanation: "Correct! u = u' + v = 20 + 30 = 50 m/s." },
              { id: 'b', text: '30 m/s', correct: false, explanation: "This is just the train's velocity." },
              { id: 'c', text: '20 m/s', correct: false, explanation: "This is the velocity relative to the train." },
              { id: 'd', text: '10 m/s', correct: false, explanation: "You subtracted instead of adding. The ball was thrown in the direction of motion." }
            ]}
            onCorrect={handleQuizCorrect}
          />
        </section>
      </div>
    </SectionWrapper>
  );
}
