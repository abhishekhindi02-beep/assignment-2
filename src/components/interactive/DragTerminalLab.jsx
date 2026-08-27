import { useState, useEffect } from 'react';
import { MathInline } from '../math/MathBlock';
import { Wind, Gauge, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';
import { calcTerminalSpeedLinear, simulateFreefallWithDrag } from '../../physics/engine';

export const DragTerminalLab = () => {
  const [mass, setMass] = useState(2.0); // kg
  const [dragK, setDragK] = useState(0.653); // k constant
  const [g, setG] = useState(9.81);
  const [dragPower, setDragPower] = useState(1); // 1 for F=kv, 2 for F=kv^2
  const [time, setTime] = useState(0); // s
  const [isPlaying, setIsPlaying] = useState(false);

  const tMax = 12;
  const terminalSpeed = calcTerminalSpeedLinear(mass, g, dragK);

  // Run simulation steps
  const simulationPoints = simulateFreefallWithDrag(mass, dragK, g, dragPower, tMax, 0.1);

  // Current state at scrubber time
  const currentIndex = Math.min(simulationPoints.length - 1, Math.floor((time / tMax) * simulationPoints.length));
  const current = simulationPoints[currentIndex] || simulationPoints[0];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev >= tMax) {
            setIsPlaying(false);
            return tMax;
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, time]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  // Render SVG graphs for Drag Lab
  const renderDragGraph = (type, title, unit, colorClass, maxY) => {
    const width = 280;
    const height = 130;
    const padding = 20;

    const mapX = (t) => padding + (t / tMax) * (width - 2 * padding);
    const mapY = (val) => height - padding - (val / maxY) * (height - 2 * padding);

    const pathD = simulationPoints.reduce((acc, p, idx) => {
      const x = mapX(p.t);
      const y = Math.max(padding, Math.min(height - padding, mapY(p[type])));
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    const curX = mapX(current.t);
    const curY = Math.max(padding, Math.min(height - padding, mapY(current[type])));

    return (
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider">{title}</span>
          <span className={`font-mono font-bold ${colorClass}`}>
            {current[type].toFixed(2)} {unit}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          {/* Terminal velocity horizontal line on speed graph */}
          {type === 'v' && (
            <line
              x1={padding}
              y1={mapY(terminalSpeed)}
              x2={width - padding}
              y2={mapY(terminalSpeed)}
              stroke="#ef4444"
              strokeDasharray="4 4"
            />
          )}

          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" className={colorClass} />

          {/* Scrubber marker dot */}
          <circle cx={curX} cy={curY} r="5" className={`fill-slate-950 ${colorClass}`} stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  return (
    <div className="my-8 p-6 rounded-3xl glass-panel border border-rose-500/40 bg-slate-950/90 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Wind className="w-4 h-4" /> Signature Feature #5
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">DRAG & TERMINAL SPEED LAB</h2>
          <p className="text-xs text-slate-400">
            Observe how fluid resistance balances weight force (<MathInline math="F_{\text{drag}} = mg" />) causing acceleration to reach zero while speed approaches terminal velocity.
          </p>
        </div>

        {/* Drag Model Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setDragPower(1);
              setTime(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              dragPower === 1 ? 'bg-rose-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Low Speed (<MathInline math="F = kv" />)
          </button>
          <button
            onClick={() => {
              setDragPower(2);
              setTime(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              dragPower === 2 ? 'bg-rose-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Speed (<MathInline math="F = kv^2" />)
          </button>
        </div>
      </div>

      {/* Main Falling Animation & Force Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Falling Skydiver/Sphere Tube */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-between relative min-h-[300px]">
          <div className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-rose-400" /> Freefall with Air Drag Tube
          </div>

          <div className="w-full flex justify-around items-center h-52 relative">
            {/* Air flow particle lines */}
            <div className="absolute inset-y-0 inset-x-12 flex justify-between pointer-events-none opacity-30">
              <div className="w-0.5 h-full bg-cyan-400/40 animate-pulse" />
              <div className="w-0.5 h-full bg-cyan-400/40 animate-pulse" />
              <div className="w-0.5 h-full bg-cyan-400/40 animate-pulse" />
            </div>

            {/* Falling Object */}
            <div className="relative flex flex-col items-center">
              {/* Drag Force Vector (Upward Rose Arrow) */}
              <div className="flex flex-col items-center text-rose-400">
                <span className="text-[10px] font-mono font-bold">F_drag = {current.Fdrag.toFixed(1)} N</span>
                <span className="text-xs">▲</span>
                <div
                  className="w-1 bg-rose-500 rounded-full transition-all"
                  style={{ height: `${Math.min(60, current.Fdrag * 2.5)}px` }}
                />
              </div>

              {/* Falling Object Circle */}
              <div className="w-12 h-12 rounded-full bg-rose-500 border-2 border-rose-300 shadow-xl shadow-rose-500/40 flex items-center justify-center text-xl my-1 text-slate-950 font-bold">
                🪂
              </div>

              {/* Weight Force Vector (Downward Amber Arrow) */}
              <div className="flex flex-col items-center text-amber-400">
                <div className="w-1 h-10 bg-amber-400 rounded-full" />
                <span className="text-xs">▼</span>
                <span className="text-[10px] font-mono font-bold">W = mg = {(mass * g).toFixed(1)} N</span>
              </div>
            </div>
          </div>

          <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono">
            <span className="text-slate-400">Terminal Speed: </span>
            <span className="text-rose-400 font-bold">{terminalSpeed.toFixed(1)} m/s</span>
          </div>
        </div>

        {/* Live Graphs (v-t and a-t) */}
        <div className="space-y-4">
          {renderDragGraph('v', 'Speed-Time (v-t)', 'm/s', 'text-rose-400', Math.max(35, terminalSpeed * 1.2))}
          {renderDragGraph('a', 'Acceleration-Time (a-t)', 'm/s²', 'text-amber-400', 12)}
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Mass (<MathInline math="m" />)</span>
            <span className="font-mono text-cyan-400">{mass} kg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={mass}
            onChange={(e) => {
              setMass(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-cyan-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Drag Constant (<MathInline math="k" />)</span>
            <span className="font-mono text-rose-400">{dragK}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={dragK}
            onChange={(e) => {
              setDragK(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-rose-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>Gravity (<MathInline math="g" />)</span>
            <span className="font-mono text-amber-400">{g} m/s²</span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.5"
            value={g}
            onChange={(e) => {
              setG(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-amber-400 bg-slate-800"
          />
        </div>
      </div>

      {/* Play Controls & Scrubber */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Drop' : 'Start Freefall'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Scrub t:</span>
          <input
            type="range"
            min="0"
            max={tMax}
            step="0.1"
            value={time}
            onChange={(e) => {
              setIsPlaying(false);
              setTime(parseFloat(e.target.value));
            }}
            className="w-full accent-rose-400 bg-slate-800"
          />
          <span className="text-xs font-mono font-bold text-rose-400 w-12">{time.toFixed(1)}s</span>
        </div>
      </div>

      {/* Misconception Highlight Callout */}
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-rose-400">CRITICAL CONCEPTUAL REMINDER: </span>
          When the falling object reaches terminal speed, acceleration becomes zero (<MathInline math="a = 0" />). <span className="underline">Zero acceleration does NOT mean the object stops moving!</span> It means the object continues falling at a constant, maximum terminal velocity <MathInline math={`v_T = \\frac{mg}{k} = ${terminalSpeed.toFixed(1)}\\text{ m/s}`} />.
        </div>
      </div>
    </div>
  );
};
