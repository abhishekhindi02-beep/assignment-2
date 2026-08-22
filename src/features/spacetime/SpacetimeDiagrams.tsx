import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import CalloutCard from '@/components/ui/CalloutCard';
import ControlSlider from '@/components/ui/ControlSlider';
import { QuizCard } from '@/components/quiz/QuizCard';
import { primedAxisScale, primedXAxisAngle, formatNumber } from '@/physics/relativity';

export default function SpacetimeDiagrams() {
  const [velocity, setVelocity] = useState<number>(0.5);
  const [eventCoords, setEventCoords] = useState<{ x: number; ct: number } | null>(null);

  const SVG_SIZE = 400;
  const CENTER = SVG_SIZE / 2;
  const SCALE = 40; // 40px = 1 unit

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = (px - CENTER) / SCALE;
    const ct = (CENTER - py) / SCALE;
    setEventCoords({ x, ct });
  };

  const alpha = primedXAxisAngle(velocity);
  const scaleSPrime = primedAxisScale(velocity);

  // Axis lines
  const axisLength = 180; // slightly less than 200 to keep it inside
  
  // Grid lines
  const gridLines = [];
  for (let i = -4; i <= 4; i++) {
    gridLines.push(
      <g key={i} className="text-slate-200 stroke-current">
        <line x1={CENTER - axisLength} y1={CENTER - i * SCALE} x2={CENTER + axisLength} y2={CENTER - i * SCALE} strokeWidth="1" />
        <line x1={CENTER + i * SCALE} y1={CENTER - axisLength} x2={CENTER + i * SCALE} y2={CENTER + axisLength} strokeWidth="1" />
      </g>
    );
  }

  // Draw unit ticks on primed axes
  const primedTicks = [];
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    // x' ticks
    const tickLen = 4;
    const xTickDist = i * SCALE * scaleSPrime;
    const pxPrime = Math.cos(alpha) * xTickDist;
    const pyPrime = -Math.sin(alpha) * xTickDist;
    // perp vector for tick
    const pDx = -Math.sin(alpha) * tickLen;
    const pDy = -Math.cos(alpha) * tickLen;
    primedTicks.push(
      <line key={`xtick-${i}`} 
        x1={CENTER + pxPrime - pDx} y1={CENTER + pyPrime - pDy} 
        x2={CENTER + pxPrime + pDx} y2={CENTER + pyPrime + pDy} 
        className="stroke-violet-600" strokeWidth="2" />
    );
    // ct' ticks
    const ctTickDist = i * SCALE * scaleSPrime;
    const pxCt = Math.sin(alpha) * ctTickDist;
    const pyCt = -Math.cos(alpha) * ctTickDist;
    const cDx = Math.cos(alpha) * tickLen;
    const cDy = -Math.sin(alpha) * tickLen;
    primedTicks.push(
      <line key={`cttick-${i}`}
        x1={CENTER + pxCt - cDx} y1={CENTER + pyCt - cDy}
        x2={CENTER + pxCt + cDx} y2={CENTER + pyCt + cDy}
        className="stroke-violet-600" strokeWidth="2" />
    );
  }

  return (
    <SectionWrapper
      prev={{ to: "/muon-decay", label: "09 Muon Decay" }}
      next={{ to: "/light-cones", label: "11 Light Cones" }}
    >
      <SectionHeader title="6.3 — Spacetime Diagrams" subtitle="Visualizing Events and Worldlines" />

      <div className="prose prose-slate max-w-none mb-8">
        <p>
          A <strong>spacetime diagram</strong> (or Minkowski diagram) is a powerful tool to visualize relativity. 
          We plot space (the <strong>x-axis</strong>, horizontally) against time. 
          To make the units match, we multiply time <InlineMath math="t" /> by the speed of light <InlineMath math="c" />, 
          giving us the <strong>ct-axis</strong> (vertically). 
        </p>
        <p>
          In these units, light travels exactly 1 unit of distance for every 1 unit of <InlineMath math="ct" />. 
          As a result, a photon's path (its <em>worldline</em>) is always a <strong>45° line</strong>.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Interactive Spacetime Diagram Studio</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} 
              className="bg-white border border-slate-300 rounded-lg shadow-inner cursor-crosshair max-w-[400px]"
              onClick={handleSvgClick}
            >
              {gridLines}
              
              {/* Light Cones */}
              <line x1={CENTER - axisLength} y1={CENTER + axisLength} x2={CENTER + axisLength} y2={CENTER - axisLength} className="stroke-amber-500" strokeWidth="2" strokeDasharray="4 4" />
              <line x1={CENTER - axisLength} y1={CENTER - axisLength} x2={CENTER + axisLength} y2={CENTER + axisLength} className="stroke-amber-500" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* S Axes (navy) */}
              <line x1={CENTER - axisLength} y1={CENTER} x2={CENTER + axisLength} y2={CENTER} className="stroke-navy/80 stroke-slate-800" strokeWidth="2" />
              <line x1={CENTER} y1={CENTER + axisLength} x2={CENTER} y2={CENTER - axisLength} className="stroke-navy/80 stroke-slate-800" strokeWidth="2" />
              <text x={CENTER + axisLength - 10} y={CENTER + 20} className="fill-slate-800 text-xs font-bold">x</text>
              <text x={CENTER - 20} y={CENTER - axisLength + 10} className="fill-slate-800 text-xs font-bold">ct</text>
              
              {/* S' Axes (violet) */}
              <g className="stroke-violet-600">
                {/* x' axis */}
                <line 
                  x1={CENTER - Math.cos(alpha) * axisLength} 
                  y1={CENTER - Math.sin(-alpha) * axisLength} 
                  x2={CENTER + Math.cos(alpha) * axisLength} 
                  y2={CENTER + Math.sin(-alpha) * axisLength} 
                  strokeWidth="2" 
                />
                {/* ct' axis */}
                <line 
                  x1={CENTER - Math.sin(alpha) * axisLength} 
                  y1={CENTER + Math.cos(-alpha) * axisLength} 
                  x2={CENTER + Math.sin(alpha) * axisLength} 
                  y2={CENTER - Math.cos(-alpha) * axisLength} 
                  strokeWidth="2" 
                />
              </g>
              {primedTicks}
              
              <text 
                x={CENTER + Math.cos(alpha) * axisLength - 15} 
                y={CENTER + Math.sin(-alpha) * axisLength + 20} 
                className="fill-violet-600 text-xs font-bold"
              >x'</text>
              <text 
                x={CENTER + Math.sin(alpha) * axisLength - 20} 
                y={CENTER - Math.cos(-alpha) * axisLength + 15} 
                className="fill-violet-600 text-xs font-bold"
              >ct'</text>

              {/* Worldlines */}
              {/* Stationary object */}
              <line x1={CENTER - 2*SCALE} y1={CENTER + axisLength} x2={CENTER - 2*SCALE} y2={CENTER - axisLength} className="stroke-emerald-600" strokeWidth="3" opacity="0.6" />
              <text x={CENTER - 2*SCALE + 5} y={CENTER - axisLength + 30} className="fill-emerald-700 text-[10px]">Stationary (v=0)</text>

              {/* Moving object (follows ct' axis) */}
              <line 
                x1={CENTER} 
                y1={CENTER} 
                x2={CENTER + Math.sin(alpha) * axisLength} 
                y2={CENTER - Math.cos(-alpha) * axisLength} 
                className="stroke-blue-500" strokeWidth="3" 
              />
              
              {/* Impossible FTL */}
              <line 
                x1={CENTER} y1={CENTER} 
                x2={CENTER + axisLength} y2={CENTER - axisLength/2} 
                className="stroke-red-500" strokeWidth="2" strokeDasharray="6 4" 
              />
              <text x={CENTER + axisLength - 90} y={CENTER - axisLength/2 + 20} className="fill-red-600 text-[10px] font-bold">IMPOSSIBLE: v &gt; c</text>
              
              {/* Event Marker */}
              {eventCoords && (
                <g>
                  <circle cx={CENTER + eventCoords.x * SCALE} cy={CENTER - eventCoords.ct * SCALE} r="5" className="fill-amber-500" />
                  <text 
                    x={CENTER + eventCoords.x * SCALE + 10} 
                    y={CENTER - eventCoords.ct * SCALE - 10} 
                    className="fill-slate-700 text-xs bg-white"
                  >
                    E ({formatNumber(eventCoords.x, 1)}, {formatNumber(eventCoords.ct, 1)})
                  </text>
                </g>
              )}
            </svg>
            <p className="text-sm text-slate-500 mt-2">Click diagram to place an event.</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">Moving Reference Frame (S')</h4>
              <ControlSlider
                label="Velocity v/c"
                value={velocity}
                min={0}
                max={0.99}
                step={0.01}
                onChange={setVelocity}
              />
              <div className="mt-4 text-sm text-slate-700">
                <p>The <span className="text-violet-600 font-bold">S' axes</span> tilt inward toward the light cone as <InlineMath math="v \to c" />.</p>
                <p className="mt-2">Angle of tilt: <InlineMath math="\theta = \arctan(v/c)" /></p>
                <div className="mt-2 bg-slate-100 p-2 rounded">
                  <InlineMath math={`\\tan(\\theta) = \\frac{\\Delta x}{c\\Delta t} = \\frac{v}{c} = ${formatNumber(velocity, 2)}`} />
                </div>
              </div>
            </div>

            <CalloutCard type="warning" title="Non-Euclidean Geometry">
              Do not measure the primed axes with an ordinary ruler. Spacetime diagram geometry is NOT Euclidean. 
              Because the interval <InlineMath math="(\Delta s)^2 = (c\Delta t)^2 - (\Delta x)^2" /> has a minus sign, 
              the "visual length" on the screen does not equal the physical proper length.
            </CalloutCard>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <h4 className="font-medium text-indigo-900 mb-2">Primed Axis Scale</h4>
              <p className="text-sm text-indigo-800 mb-2">
                1 unit on the <InlineMath math="x'" /> axis corresponds to a visual length factor on the screen of:
              </p>
              <MathBlock math={`\\text{Scale Factor} = \\sqrt{\\frac{1+v^2/c^2}{1-v^2/c^2}} = ${formatNumber(scaleSPrime, 2)}`} />
              <p className="text-xs text-indigo-700 mt-2">
                Notice the tick marks on the violet axes spread out as <InlineMath math="v" /> increases!
              </p>
            </div>
          </div>
        </div>
      </div>

      <CalloutCard type="tip" title="Exam Tip" className="mb-8">
        On spacetime diagrams, <strong>steeper worldlines = slower objects</strong>. 
        A completely vertical line is stationary (moving through time, not space). 
        A 45° line is light speed. Lines flatter than 45° represent faster-than-light travel, which is impossible.
      </CalloutCard>

      <div className="mb-12">
        <QuizCard
          question="On a spacetime diagram, an object moves such that its worldline is tilted at 30° from the vertical ct-axis. What is its speed?"
          options={[
            { id: 'a', text: 'v = c * sin(30°)', isCorrect: false },
            { id: 'b', text: 'v = c * cos(30°)', isCorrect: false },
            { id: 'c', text: 'v = c * tan(30°)', isCorrect: true, explanation: 'The angle θ from the ct-axis is given by tan(θ) = Δx / (cΔt) = v/c. Therefore v = c * tan(30°).' },
            { id: 'd', text: 'v = c', isCorrect: false }
          ]}
        />
      </div>

    </SectionWrapper>
  );
}
