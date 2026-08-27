import { useState } from 'react';
import { MathInline } from '../math/MathBlock';
import { TrendingUp, Layers } from 'lucide-react';

export const GraphTranslationStudio = () => {
  const [time, setTime] = useState(3.0); // scrubber time 0..5
  const maxT = 5.0;

  // Scenario 1: Quadratic position s(t) = t^2 + t => v(t) = 2t + 1 => a(t) = 2
  // Scenario 2: Cubic position s(t) = -t^3/3 + 2t^2 => v(t) = -t^2 + 4t => a(t) = -2t + 4
  const [motionType, setMotionType] = useState('quadratic');

  // Compute values
  const getPhysicsAtT = (t) => {
    if (motionType === 'quadratic') {
      const s = t * t + t;
      const v = 2 * t + 1;
      const a = 2;
      return { s, v, a };
    } else {
      const s = -(Math.pow(t, 3) / 3) + 2 * t * t;
      const v = -t * t + 4 * t;
      const a = -2 * t + 4;
      return { s, v, a };
    }
  };

  const current = getPhysicsAtT(time);

  // Map graph type to physics object property ('s', 'v', 'a')
  const getPropKey = (type) => {
    if (type === 'position') return 's';
    if (type === 'velocity') return 'v';
    return 'a';
  };

  // Generate SVG curve paths
  const generateCurve = (type) => {
    const propKey = getPropKey(type);
    const points = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxT;
      const phys = getPhysicsAtT(t);
      points.push({ t, val: phys[propKey] });
    }
    return points;
  };

  const renderSingleGraph = (type, title, unit, color, minY, maxY, showTangent = false, showArea = false) => {
    const propKey = getPropKey(type);
    const points = generateCurve(type);
    const width = 280;
    const height = 140;
    const padding = 25;

    const mapX = (t) => padding + (t / maxT) * (width - 2 * padding);
    const mapY = (y) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);

    const pathD = points.reduce((acc, p, idx) => {
      const x = mapX(p.t);
      const y = Math.max(padding, Math.min(height - padding, mapY(p.val)));
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    // Area path for v-t graph
    let areaPathD = '';
    if (showArea && type === 'velocity') {
      const areaPoints = points.filter(p => p.t <= time);
      if (areaPoints.length > 0) {
        const startX = mapX(0);
        const zeroY = mapY(0);
        areaPathD = `M ${startX} ${zeroY} ` + areaPoints.map(p => `L ${mapX(p.t)} ${mapY(p.val)}`).join(' ') + ` L ${mapX(time)} ${zeroY} Z`;
      }
    }

    // Tangent line on s-t graph
    let tangentX1 = 0, tangentY1 = 0, tangentX2 = 0, tangentY2 = 0;
    if (showTangent && type === 'position') {
      const slope = current.v; // ds/dt = v
      const dt = 1.0; // 1 second span for tangent
      const t1 = Math.max(0, time - dt);
      const t2 = Math.min(maxT, time + dt);
      const s1 = current.s - slope * (time - t1);
      const s2 = current.s + slope * (t2 - time);

      tangentX1 = mapX(t1);
      tangentY1 = mapY(s1);
      tangentX2 = mapX(t2);
      tangentY2 = mapY(s2);
    }

    const currentVal = current[propKey] ?? 0;
    const curX = mapX(time);
    const curY = mapY(currentVal);

    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider">{title}</span>
          <span className={`font-semibold ${color}`}>
            {currentVal.toFixed(2)} {unit}
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          {/* Shaded Area under v-t graph */}
          {showArea && areaPathD && (
            <path d={areaPathD} fill="rgba(14, 165, 233, 0.15)" stroke="none" />
          )}

          {/* Axes */}
          <line x1={padding} y1={mapY(0)} x2={width - padding} y2={mapY(0)} stroke="#cbd5e1" strokeDasharray="3 3" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" className={color} />

          {/* Tangent line */}
          {showTangent && (
            <line x1={tangentX1} y1={tangentY1} x2={tangentX2} y2={tangentY2} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
          )}

          {/* Scrubber vertical line */}
          <line x1={curX} y1={padding} x2={curX} y2={height - padding} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Scrubber Dot */}
          <circle cx={curX} cy={curY} r="5" className={`fill-white ${color}`} stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1">
            <TrendingUp className="w-4 h-4" /> Signature Feature #2
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">GRAPH TRANSLATION STUDIO</h2>
          <p className="text-xs text-slate-600">
            See how the slope (gradient) and area under curves interconvert position, velocity, and acceleration graphs.
          </p>
        </div>

        {/* Motion preset selection */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setMotionType('quadratic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              motionType === 'quadratic' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Constant Accel (Parabola s-t)
          </button>
          <button
            onClick={() => setMotionType('cubic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              motionType === 'cubic' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Changing Accel (Cubic s-t)
          </button>
        </div>
      </div>

      {/* Time Scrubber */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Scrub Time t:</span>
        <input
          type="range"
          min="0"
          max={maxT}
          step="0.1"
          value={time}
          onChange={(e) => setTime(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 bg-slate-200"
        />
        <span className="text-xs font-bold text-indigo-700 w-16">{time.toFixed(1)} s</span>
      </div>

      {/* 3 Synchronized Graph Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSingleGraph('position', '1. Position-Time (s-t)', 'm', 'text-sky-600', -5, 35, true, false)}
        {renderSingleGraph('velocity', '2. Velocity-Time (v-t)', 'm/s', 'text-indigo-600', -5, 15, false, true)}
        {renderSingleGraph('acceleration', '3. Acceleration-Time (a-t)', 'm/s²', 'text-amber-600', -8, 8, false, false)}
      </div>

      {/* Mathematical Calculus / Gradient & Area Relationship Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Gradient (Slope) Interpretation
          </div>
          <div className="text-xs text-slate-700 leading-relaxed">
            • <span className="font-bold text-sky-700">Gradient of s-t graph</span> = Instantaneous Velocity <MathInline math="v = \\lim_{\\Delta t \\to 0}\\frac{\\Delta s}{\\Delta t}" />
            <br />
            • At <MathInline math={`t = ${time.toFixed(1)}s`} />, tangent line slope on s-t graph is exactly <span className="text-indigo-700 font-bold">{current.v.toFixed(2)} m/s</span>.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Area Under Curve Interpretation
          </div>
          <div className="text-xs text-slate-700 leading-relaxed">
            • <span className="font-bold text-indigo-700">Area under v-t graph</span> = Accumulated Displacement <MathInline math="\\Delta s = \\text{Area}" />
            <br />
            • Shaded area under v-t from t=0 to {time.toFixed(1)}s equals <span className="text-sky-700 font-bold">{current.s.toFixed(2)} m</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
