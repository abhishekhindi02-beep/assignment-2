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
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider">{title}</span>
          <span className={`font-mono font-bold ${colorClass}`}>
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
              stroke="#334155"
              strokeDasharray="4 4"
            />
          )}
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" className={colorClass} />

          {/* Current scrubber dot */}
          <circle cx={currentX} cy={currentY} r="5" className={`fill-slate-950 ${colorClass}`} stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  // Physical car position mapping (-50m to +150m)
  const trackMin = -50;
  const trackMax = 150;
  const carPercent = Math.max(0, Math.min(100, ((position - trackMin) / (trackMax - trackMin)) * 100));

  return (
    <div className="my-8 p-6 rounded-3xl glass-panel border border-cyan-500/40 bg-slate-950/90 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" /> Signature Feature #1
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">MOTION STUDIO</h2>
          <p className="text-xs text-slate-400">
            Control object motion in real-time. See position, velocity, acceleration, and matching graphs update simultaneously.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
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
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Physical Motion Visualization Track */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Number Line Axis (x-axis)</span>
          <span className="font-mono text-cyan-400">t = {time.toFixed(2)} s</span>
        </div>

        {/* Number line track */}
        <div className="relative h-20 my-2 flex items-center">
          <div className="absolute inset-x-0 h-2 bg-slate-800 rounded-full" />
          
          {/* Tick marks */}
          {[-50, -25, 0, 25, 50, 75, 100, 125, 150].map((val) => {
            const pct = ((val - trackMin) / (trackMax - trackMin)) * 100;
            return (
              <div key={val} className="absolute flex flex-col items-center" style={{ left: `${pct}%` }}>
                <div className={`w-0.5 h-3 ${val === 0 ? 'bg-cyan-400 h-5' : 'bg-slate-700'}`} />
                <span className="text-[10px] font-mono text-slate-500 mt-1">{val}m</span>
              </div>
            );
          })}

          {/* Animated Object (Car/Particle) */}
          <div
            className="absolute transition-all duration-75 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${carPercent}%` }}
          >
            {/* Vector arrow indicator */}
            <div className="text-cyan-400 flex items-center mb-1 animate-pulse">
              <span className="text-[10px] font-mono font-bold mr-1">v = {velocity.toFixed(1)}m/s</span>
              <span className={`transform transition-transform ${velocity < 0 ? 'rotate-180 text-rose-400' : ''}`}>➔</span>
            </div>

            {/* Car Icon / Circle */}
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg border-2 ${
                velocity >= 0 ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-cyan-500/50' : 'bg-rose-500 border-rose-300 text-slate-950 shadow-rose-500/50'
              }`}>
                🏎️
              </div>
            </div>
            <span className="text-[11px] font-bold font-mono text-slate-200 mt-1">
              x = {position.toFixed(1)}m
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Initial Position (<MathInline math="s_i" />)</span>
            <span className="font-mono text-cyan-400">{initialPosition} m</span>
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
            className="w-full accent-cyan-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Initial Velocity (<MathInline math="u" />)</span>
            <span className="font-mono text-cyan-400">{initialVelocity} m/s</span>
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
            className="w-full accent-cyan-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Acceleration (<MathInline math="a" />)</span>
            <span className="font-mono text-amber-400">{acceleration} m/s²</span>
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
            className="w-full accent-amber-400 bg-slate-800"
          />
        </div>
      </div>

      {/* Playback Controls & Time Scrubber */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Motion' : 'Start Motion'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Time
          </button>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Scrub t:</span>
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
            className="w-full accent-cyan-400 bg-slate-800"
          />
          <span className="text-xs font-mono font-bold text-cyan-400 w-12">{time.toFixed(1)}s</span>
        </div>
      </div>

      {/* Synchronized Live Motion Graphs (s-t, v-t, a-t) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSvgGraph('position', 'Position-Time (s-t)', 'm', 'text-cyan-400', -60, 160)}
        {renderSvgGraph('velocity', 'Velocity-Time (v-t)', 'm/s', 'text-indigo-400', -40, 60)}
        {renderSvgGraph('acceleration', 'Acceleration-Time (a-t)', 'm/s²', 'text-amber-400', -12, 12)}
      </div>

      {/* Formula Connection Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
        <div>
          <span className="font-bold">Active Kinematics Formula: </span>
          <MathInline math={`s(t) = ${initialPosition} + (${initialVelocity})t + \\frac{1}{2}(${acceleration})t^2`} />
          <span className="ml-2 font-mono text-slate-400">➔ Instantaneous Position at t={time.toFixed(1)}s is {position.toFixed(1)}m</span>
        </div>
      </div>
    </div>
  );
};
