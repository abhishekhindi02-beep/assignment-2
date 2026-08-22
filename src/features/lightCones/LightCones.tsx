import React, { useState, useRef, useEffect } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import CalloutCard from '@/components/ui/CalloutCard';
import { QuizCard } from '@/components/quiz/QuizCard';
import ControlSlider from '@/components/ui/ControlSlider';
import { 
  classifyInterval, 
  spacetimeInterval, 
  isCausallyConnected,
  primedXAxisAngle,
  gamma,
  formatNumber
} from '@/physics/relativity';

export default function LightCones() {
  const [testEvent, setTestEvent] = useState({ x: 2, ct: 3 });
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const SVG_SIZE = 400;
  const CENTER = SVG_SIZE / 2;
  const SCALE = 40; // 40px = 1 unit

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateTestEvent(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateTestEvent(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const updateTestEvent = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = (px - CENTER) / SCALE;
    const ct = (CENTER - py) / SCALE;
    setTestEvent({ x, ct });
  };

  const interval = spacetimeInterval(testEvent.ct, testEvent.x);
  const classification = classifyInterval(testEvent.ct, testEvent.x);
  const causal = isCausallyConnected(testEvent.ct, testEvent.x);

  const [velocity, setVelocity] = useState(0.5);
  const alpha = primedXAxisAngle(velocity);

  return (
    <SectionWrapper
      prev={{ to: "/spacetime-diagrams", label: "10 Spacetime Diagrams" }}
      next={{ to: "/worldlines", label: "12 Worldlines" }}
    >
      <SectionHeader title="6.3 — Light Cones & Causality" subtitle="The Structure of Spacetime" />

      <div className="prose prose-slate max-w-none mb-8">
        <p>
          Because nothing can travel faster than light, the 45° paths of photons emitted from or arriving at an event 
          create a natural boundary in spacetime known as a <strong>light cone</strong>.
        </p>
      </div>

      <CalloutCard type="info" title="Definition" className="mb-8">
        The light cone of an event divides spacetime into causally connected and causally disconnected regions.
      </CalloutCard>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-12 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Causality Explorer</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} 
              className="bg-white border border-slate-300 rounded-lg shadow-inner cursor-pointer max-w-[400px] touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Regions */}
              <polygon points={`${CENTER},${CENTER} ${CENTER - 200},${CENTER - 200} ${CENTER + 200},${CENTER - 200}`} className="fill-amber-100/50" />
              <polygon points={`${CENTER},${CENTER} ${CENTER - 200},${CENTER + 200} ${CENTER + 200},${CENTER + 200}`} className="fill-blue-100/50" />
              
              <text x={CENTER} y={40} className="fill-amber-800 text-xs font-bold text-anchor-middle text-center" textAnchor="middle">FUTURE</text>
              <text x={CENTER} y={55} className="fill-amber-800/70 text-[10px] text-anchor-middle" textAnchor="middle">(can be influenced)</text>
              
              <text x={CENTER} y={SVG_SIZE - 55} className="fill-blue-800 text-xs font-bold text-anchor-middle" textAnchor="middle">PAST</text>
              <text x={CENTER} y={SVG_SIZE - 40} className="fill-blue-800/70 text-[10px] text-anchor-middle" textAnchor="middle">(can influence)</text>

              <text x={40} y={CENTER} className="fill-slate-400 text-xs font-bold">ELSEWHERE</text>
              <text x={SVG_SIZE - 90} y={CENTER} className="fill-slate-400 text-xs font-bold">ELSEWHERE</text>

              {/* Axes */}
              <line x1={0} y1={CENTER} x2={SVG_SIZE} y2={CENTER} className="stroke-slate-300" strokeWidth="1" />
              <line x1={CENTER} y1={0} x2={CENTER} y2={SVG_SIZE} className="stroke-slate-300" strokeWidth="1" />
              
              {/* Light cone lines */}
              <line x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={0} className="stroke-amber-500" strokeWidth="2" strokeDasharray="4 4" />
              <line x1={0} y1={0} x2={SVG_SIZE} y2={SVG_SIZE} className="stroke-amber-500" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Origin Event E */}
              <circle cx={CENTER} cy={CENTER} r="6" className="fill-slate-800" />
              <text x={CENTER + 10} y={CENTER + 20} className="fill-slate-800 font-bold text-sm">E</text>
              
              {/* Test Event */}
              <line 
                x1={CENTER} y1={CENTER} 
                x2={CENTER + testEvent.x * SCALE} y2={CENTER - testEvent.ct * SCALE} 
                className={causal ? "stroke-green-500" : "stroke-red-500"} 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              <circle 
                cx={CENTER + testEvent.x * SCALE} 
                cy={CENTER - testEvent.ct * SCALE} 
                r="6" 
                className={causal ? "fill-green-500" : "fill-red-500"} 
              />
              <text 
                x={CENTER + testEvent.x * SCALE + 10} 
                y={CENTER - testEvent.ct * SCALE - 10} 
                className={`${causal ? "fill-green-700" : "fill-red-700"} font-bold text-sm bg-white`}
              >
                L ({formatNumber(testEvent.x, 1)}, {formatNumber(testEvent.ct, 1)})
              </text>
            </svg>
            <p className="text-sm text-slate-500 mt-2">Drag event L around the diagram.</p>
          </div>
          
          <div className="flex flex-col gap-4 justify-center">
            <div className={`p-4 rounded-lg border ${causal ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h4 className={`text-lg font-bold mb-2 ${causal ? 'text-green-800' : 'text-red-800'}`}>
                {causal ? 'Causally Connected to E' : 'Cannot be causally connected to E'}
              </h4>
              <p className="text-sm mb-4">
                Interval Type: <strong>{classification.toUpperCase()}</strong>
              </p>
              <MathBlock math={`(\\Delta s)^2 = (c\\Delta t)^2 - (\\Delta x)^2`} />
              <MathBlock math={`(\\Delta s)^2 = (${formatNumber(testEvent.ct, 1)})^2 - (${formatNumber(testEvent.x, 1)})^2 = ${formatNumber(interval, 2)}`} />
              
              <div className="mt-4 text-sm">
                {interval > 0 && <p className="text-green-700">Since <InlineMath math="(\Delta s)^2 > 0" />, a signal traveling slower than light can connect these events.</p>}
                {interval < 0 && <p className="text-red-700">Since <InlineMath math="(\Delta s)^2 < 0" />, light would need to travel faster than c to connect these events. <strong>Nothing can travel faster than light. Events outside the light cone cannot influence or be influenced by E.</strong></p>}
                {Math.abs(interval) < 0.01 && <p className="text-amber-600">Since <InlineMath math="(\Delta s)^2 = 0" />, exactly a light signal can connect these events.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Length Contraction on Diagram</h3>
          <p className="text-sm text-slate-700 mb-4">
            A moving rod's length is measured by marking the positions of its ends <em>simultaneously</em>. 
            Simultaneous in <InlineMath math="S" /> means a horizontal line. Simultaneous in <InlineMath math="S'" /> means a line parallel to the <InlineMath math="x'" /> axis.
          </p>
          <ControlSlider
            label="Velocity v/c"
            value={velocity}
            min={0}
            max={0.9}
            step={0.05}
            onChange={setVelocity}
          />
          <div className="mt-6 flex justify-center">
            <svg width="250" height="250" viewBox="0 0 250 250" className="bg-white border rounded">
              {/* S Axes */}
              <line x1="20" y1="230" x2="230" y2="230" stroke="#94a3b8" />
              <line x1="20" y1="230" x2="20" y2="20" stroke="#94a3b8" />
              
              {/* Rod Worldlines (moving) */}
              <line x1="20" y1="230" x2={20 + 200*Math.sin(alpha)} y2={230 - 200*Math.cos(alpha)} stroke="#3b82f6" strokeWidth="2" />
              <line x1="120" y1="230" x2={120 + 200*Math.sin(alpha)} y2={230 - 200*Math.cos(alpha)} stroke="#3b82f6" strokeWidth="2" />
              
              {/* Measurement in S (horizontal) */}
              <line x1="20" y1="130" x2={20 + 100*Math.tan(alpha)} y2="130" stroke="#ef4444" strokeWidth="3" />
              <text x="30" y="125" className="text-[10px] fill-red-600">L (Contracted)</text>
              
              {/* Measurement in S' (tilted) */}
              <line 
                x1="20" y1="130" 
                x2={120 + 100*Math.sin(alpha)} 
                y2={130 - 100*Math.tan(alpha)} 
                stroke="#8b5cf6" strokeWidth="3" 
              />
              <text x="60" y="90" className="text-[10px] fill-violet-600 transform -rotate-12">L₀ (Proper)</text>
            </svg>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Time Dilation & Simultaneity</h3>
          <p className="text-sm text-slate-700 mb-4">
            Events that are simultaneous (horizontal) in <InlineMath math="S" /> are not simultaneous in <InlineMath math="S'" />. 
            A moving clock's ticks happen along its tilted worldline.
          </p>
          <div className="mt-14 flex justify-center">
            <svg width="250" height="250" viewBox="0 0 250 250" className="bg-white border rounded">
              {/* S Axes */}
              <line x1="125" y1="250" x2="125" y2="0" stroke="#94a3b8" />
              <line x1="0" y1="125" x2="250" y2="125" stroke="#94a3b8" />
              
              {/* Moving Clock Worldline */}
              <line x1="125" y1="250" x2={125 + 250*Math.sin(alpha)} y2={250 - 250*Math.cos(alpha)} stroke="#3b82f6" strokeWidth="2" />
              
              {/* Tick 1 */}
              <circle cx="125" cy="125" r="4" fill="#3b82f6" />
              
              {/* Tick 2 */}
              <circle cx={125 + 80*Math.sin(alpha)} cy={125 - 80*Math.cos(alpha)} r="4" fill="#3b82f6" />
              
              {/* Simultaneity in S */}
              <line x1="0" y1={125 - 80*Math.cos(alpha)} x2="250" y2={125 - 80*Math.cos(alpha)} stroke="#ef4444" strokeDasharray="4 4" />
              <circle cx="125" cy={125 - 80*Math.cos(alpha)} r="4" fill="#ef4444" />
              
              <text x="135" y={125 - 80*Math.cos(alpha) + 15} className="text-[10px] fill-red-600">Dilated Time Δt</text>
              <text x={125 + 80*Math.sin(alpha) + 10} y={125 - 80*Math.cos(alpha) - 10} className="text-[10px] fill-blue-600">Proper Time Δτ</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <QuizCard
          question="Event A happens at (x=0, ct=0). Event B happens at (x=5, ct=3). Can Event A cause Event B?"
          options={[
            { id: 'a', text: 'Yes, because B happens after A.', isCorrect: false },
            { id: 'b', text: 'Yes, because the interval is timelike.', isCorrect: false },
            { id: 'c', text: 'No, because the interval is spacelike (Δx > cΔt).', isCorrect: true, explanation: 'The interval is (3)² - (5)² = 9 - 25 = -16, which is spacelike. A signal would need to travel faster than light.' },
            { id: 'd', text: 'No, because they occur at different locations.', isCorrect: false }
          ]}
        />
      </div>

    </SectionWrapper>
  );
}
