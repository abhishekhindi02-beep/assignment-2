import { useState } from 'react';
import { MathBlock, MathInline } from '../math/MathBlock';
import { ArrowUp, ArrowDown, Shield } from 'lucide-react';

export const VerticalMotionLab = () => {
  const [positiveDir, setPositiveDir] = useState('up'); // 'up' or 'down'
  const [initialVel] = useState(20); // m/s magnitude upward
  const [cliffHeight] = useState(25); // m
  const [g] = useState(9.81);
  const [time, setTime] = useState(2.0); // s

  const isUpPositive = positiveDir === 'up';

  const uSign = isUpPositive ? initialVel : -initialVel;
  const aSign = isUpPositive ? -g : g;

  const position = uSign * time + 0.5 * aSign * time * time;

  const maxH = (initialVel * initialVel) / (2 * g);
  const tApex = initialVel / g;

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4" /> Educational Feature
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">SIGN CONVENTION VISUALIZER & VERTICAL LAB</h2>
          <p className="text-xs text-slate-600">
            See how choosing Upward vs Downward as the positive direction changes equation signs while preserving exact physical reality.
          </p>
        </div>

        {/* Sign Convention Toggle Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setPositiveDir('up')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              isUpPositive ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" /> Upwards = Positive
          </button>
          <button
            onClick={() => setPositiveDir('down')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              !isUpPositive ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" /> Downwards = Positive
          </button>
        </div>
      </div>

      {/* Main Diagram & Formula Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Graphic */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center relative min-h-[260px]">
          <div className="absolute top-3 left-3 text-xs text-amber-700 font-bold">
            Convention: {isUpPositive ? '↑ Positive (+y)' : '↓ Positive (+y)'}
          </div>

          {/* Cliff Representation */}
          <div className="w-full flex items-center justify-center h-48 relative">
            {/* Sea level */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-sky-100 border-t border-sky-300 flex items-center justify-center text-[10px] text-sky-800 font-semibold">
              Sea Level (y = {isUpPositive ? -cliffHeight : cliffHeight}m)
            </div>

            {/* Cliff */}
            <div className="absolute top-10 left-12 w-24 bottom-6 bg-slate-300 border-r border-slate-400 rounded-tl-lg" />

            {/* Thrown Ball */}
            <div className="absolute top-10 left-32 flex flex-col items-center -translate-x-1/2">
              <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-300 shadow-md flex items-center justify-center text-xs font-bold text-white">
                ●
              </div>
              <span className="text-[10px] font-bold text-amber-800 mt-1">
                y = {position.toFixed(1)}m
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Formulas & Values */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Symbolic Equation Updates
          </h4>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-2">
            <div>
              <span className="text-slate-500 font-semibold">Initial Velocity: </span>
              <MathInline math={`u = ${uSign > 0 ? '+' : ''}${uSign.toFixed(1)} \\text{ m/s}`} />
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Acceleration: </span>
              <MathInline math={`a = ${aSign > 0 ? '+' : ''}${aSign.toFixed(2)} \\text{ m/s}^2`} />
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold">Position Equation: </span>
              <MathBlock math={`y(t) = (${uSign.toFixed(1)})t + \\frac{1}{2}(${aSign.toFixed(2)})t^2`} />
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Velocity Equation: </span>
              <MathBlock math={`v(t) = (${uSign.toFixed(1)}) + (${aSign.toFixed(2)})t`} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span className="font-bold">Key Insight: </span>
            Whether upwards is positive or negative, the ball reaches max height at <span className="font-bold">{tApex.toFixed(2)}s</span> and achieves max height above cliff of <span className="font-bold">{maxH.toFixed(1)}m</span>.
          </div>
        </div>
      </div>

      {/* Scrubber */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-600">Scrub Time t:</span>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={time}
          onChange={(e) => setTime(parseFloat(e.target.value))}
          className="w-full accent-amber-600 bg-slate-200"
        />
        <span className="text-xs font-bold text-amber-700 w-16">{time.toFixed(1)} s</span>
      </div>
    </div>
  );
};
