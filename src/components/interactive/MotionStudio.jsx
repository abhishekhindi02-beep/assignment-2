import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, RotateCcw, Play, Pause, Info } from 'lucide-react';
import { MathInline } from '../math/MathBlock';

export const MotionStudio = () => {
  const [initialPosition, setInitialPosition] = useState(0); // m
  const [initialVelocity, setInitialVelocity] = useState(10); // m/s
  const [acceleration, setAcceleration] = useState(2); // m/s^2
  const [time, setTime] = useState(0); // s
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState('accelerated');

  const maxTime = 10;
  const animationRef = useRef(null);

  // Physics values at current time
  const position = initialPosition + initialVelocity * time + 0.5 * acceleration * time * time;
  const velocity = initialVelocity + acceleration * time;

  const runAnimation = useCallback(() => {
    setTime((prevTime) => {
      if (prevTime >= maxTime) {
        setIsPlaying(false);
        return maxTime;
      }
      return prevTime + 0.04;
    });
  }, [maxTime]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(runAnimation);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, runAnimation]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const handlePresetChange = (type) => {
    setIsPlaying(false);
    setTime(0);
    setPreset(type);
    if (type === 'uniform') {
      setInitialPosition(0);
      setInitialVelocity(8);
      setAcceleration(0);
    } else if (type === 'accelerated') {
      setInitialPosition(-10);
      setInitialVelocity(2);
      setAcceleration(3);
    } else if (type === 'decelerated') {
      setInitialPosition(-20);
      setInitialVelocity(25);
      setAcceleration(-4);
    } else if (type === 'reversal') {
      setInitialPosition(-30);
      setInitialVelocity(20);
      setAcceleration(-5);
    }
  };

  // Generate SVG plot paths (t from 0 to 10)
  const generateGraphPoints = (type) => {
    const points = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const tVal = (i / steps) * maxTime;
      let yVal = 0;
      if (type === 'position') {
        yVal = initialPosition + initialVelocity * tVal + 0.5 * acceleration * tVal * tVal;
      } else if (type === 'velocity') {
        yVal = initialVelocity + acceleration * tVal;
      } else if (type === 'acceleration') {
        yVal = acceleration;
      }
      points.push({ t: tVal, y: yVal });
    }
    return points;
  };

  const renderSvgGraph = (type, title, unit, colorClass, minY, maxY) => {
    const points = generateGraphPoints(type);
    const width = 300;
    const height = 120;
    const padding = 20;

    const mapX = (t) => padding + (t / maxTime) * (width - 2 * padding);
    const mapY = (y) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding);

    const pathD = points.reduce((acc, p, idx) => {
      const x = mapX(p.t);
      const y = Math.max(padding, Math.min(height - padding, mapY(p.y)));
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    // Current point on graph
    let currentYVal = position;
    if (type === 'velocity') currentYVal = velocity;
    if (type === 'acceleration') currentYVal = acceleration;

    const currentX = mapX(time);
    const currentY = Math.max(padding, Math.min(height - padding, mapY(currentYVal)));

    return (
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-slate-700 uppercase tracking-wider">{title}</span>
          <span className={`font-semibold ${colorClass}`}>
            {currentYVal.toFixed(1)} {unit}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          {/* Zero line */}
          {minY < 0 && maxY > 0 && (
            <line
              x1={padding}
              y1={mapY(0)}
              x2={width - padding}
              y2={mapY(0)}
              stroke="#cbd5e1"
              strokeDasharray="4 4"
            />
          )}
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" className={colorClass} />

          {/* Current scrubber dot */}
          <circle cx={currentX} cy={currentY} r="5" className={`fill-white ${colorClass}`} stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  // Physical car position mapping (-50m to +150m)
  const trackMin = -50;
  const trackMax = 150;
  const carPercent = Math.max(0, Math.min(100, ((position - trackMin) / (trackMax - trackMin)) * 100));

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" /> Signature Feature #1
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">MOTION STUDIO</h2>
          <p className="text-xs text-slate-600">
            Control object motion in real-time. See position, velocity, acceleration, and matching graphs update simultaneously.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { id: 'uniform', label: 'Constant Velocity' },
            { id: 'accelerated', label: 'Speeding Up' },
            { id: 'decelerated', label: 'Slowing Down' },
            { id: 'reversal', label: 'Motion Reversal' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetChange(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preset === p.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Physical Motion Visualization Track */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span className="font-semibold">Number Line Axis (x-axis)</span>
          <span className="font-semibold text-sky-700">t = {time.toFixed(2)} s</span>
        </div>

        {/* Number line track */}
        <div className="relative h-20 my-2 flex items-center">
          <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full" />
          
          {/* Tick marks */}
          {[-50, -25, 0, 25, 50, 75, 100, 125, 150].map((val) => {
            const pct = ((val - trackMin) / (trackMax - trackMin)) * 100;
            return (
              <div key={val} className="absolute flex flex-col items-center" style={{ left: `${pct}%` }}>
                <div className={`w-0.5 h-3 ${val === 0 ? 'bg-sky-600 h-5' : 'bg-slate-400'}`} />
                <span className="text-[10px] font-semibold text-slate-500 mt-1">{val}m</span>
              </div>
            );
          })}

          {/* Animated Object (Car/Particle) */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${carPercent}%` }}
          >
            {/* Vector arrow indicator */}
            <div className="text-sky-600 flex items-center mb-1">
              <span className="text-[10px] font-bold mr-1">v = {velocity.toFixed(1)}m/s</span>
              <span className={`transform transition-transform ${velocity < 0 ? 'rotate-180 text-rose-600' : ''}`}>➔</span>
            </div>

            {/* Car Icon / Circle */}
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border-2 ${
                velocity >= 0 ? 'bg-sky-500 border-sky-300 text-white' : 'bg-rose-500 border-rose-300 text-white'
              }`}>
                🏎️
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1">
              x = {position.toFixed(1)}m
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Initial Position (<MathInline math="s_i" />)</span>
            <span className="font-bold text-sky-700">{initialPosition} m</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={initialPosition}
            onChange={(e) => {
              setInitialPosition(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Initial Velocity (<MathInline math="u" />)</span>
            <span className="font-bold text-sky-700">{initialVelocity} m/s</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            value={initialVelocity}
            onChange={(e) => {
              setInitialVelocity(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Acceleration (<MathInline math="a" />)</span>
            <span className="font-bold text-amber-700">{acceleration} m/s²</span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={acceleration}
            onChange={(e) => {
              setAcceleration(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-amber-600 bg-slate-200"
          />
        </div>
      </div>

      {/* Playback Controls & Time Scrubber */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Motion' : 'Start Motion'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" /> Reset Time
          </button>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Scrub t:</span>
          <input
            type="range"
            min="0"
            max={maxTime}
            step="0.1"
            value={time}
            onChange={(e) => {
              setIsPlaying(false);
              setTime(parseFloat(e.target.value));
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
          <span className="text-xs font-bold text-sky-700 w-12">{time.toFixed(1)}s</span>
        </div>
      </div>

      {/* Synchronized Live Motion Graphs (s-t, v-t, a-t) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSvgGraph('position', 'Position-Time (s-t)', 'm', 'text-sky-600', -60, 160)}
        {renderSvgGraph('velocity', 'Velocity-Time (v-t)', 'm/s', 'text-indigo-600', -40, 60)}
        {renderSvgGraph('acceleration', 'Acceleration-Time (a-t)', 'm/s²', 'text-amber-600', -12, 12)}
      </div>

      {/* Formula Connection Banner */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-3">
        <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
        <div>
          <span className="font-bold">Active Kinematics Formula: </span>
          <MathInline math={`s(t) = ${initialPosition} + (${initialVelocity})t + \\frac{1}{2}(${acceleration})t^2`} />
          <span className="ml-2 font-semibold text-slate-700">➔ Instantaneous Position at t={time.toFixed(1)}s is {position.toFixed(1)}m</span>
        </div>
      </div>
    </div>
  );
};
