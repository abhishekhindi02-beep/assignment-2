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
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-slate-800 uppercase tracking-wider">{title}</span>
          <span className={`font-semibold ${colorClass}`}>
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
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" className={colorClass} />

          {/* Scrubber marker dot */}
          <circle cx={curX} cy={curY} r="5" className={`fill-white ${colorClass}`} stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    );
  };

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-rose-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Wind className="w-4 h-4" /> Signature Feature #5
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">DRAG & TERMINAL SPEED LAB</h2>
          <p className="text-xs text-slate-600">
            Observe how fluid resistance balances weight force (<MathInline math="F_{\text{drag}} = mg" />) causing acceleration to reach zero while speed approaches terminal velocity.
          </p>
        </div>

        {/* Drag Model Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setDragPower(1);
              setTime(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              dragPower === 1 ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Low Speed (<MathInline math="F = kv" />)
          </button>
          <button
            onClick={() => {
              setDragPower(2);
              setTime(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              dragPower === 2 ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            High Speed (<MathInline math="F = kv^2" />)
          </button>
        </div>
      </div>

      {/* Main Falling Animation & Force Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Falling Skydiver/Sphere Tube */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-between relative min-h-[300px]">
          <div className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-rose-600" /> Freefall with Air Drag Tube
          </div>

          <div className="w-full flex justify-around items-center h-52 relative">
            {/* Air flow particle lines */}
            <div className="absolute inset-y-0 inset-x-12 flex justify-between pointer-events-none opacity-40">
              <div className="w-0.5 h-full bg-sky-400 animate-pulse" />
              <div className="w-0.5 h-full bg-sky-400 animate-pulse" />
              <div className="w-0.5 h-full bg-sky-400 animate-pulse" />
            </div>

            {/* Falling Object */}
            <div className="relative flex flex-col items-center">
              {/* Drag Force Vector (Upward Rose Arrow) */}
              <div className="flex flex-col items-center text-rose-600">
                <span className="text-[10px] font-bold">F_drag = {current.Fdrag.toFixed(1)} N</span>
                <span className="text-xs">▲</span>
                <div
                  className="w-1 bg-rose-500 rounded-full transition-all"
                  style={{ height: `${Math.min(60, current.Fdrag * 2.5)}px` }}
                />
              </div>

              {/* Falling Object Circle */}
              <div className="w-12 h-12 rounded-full bg-rose-500 border-2 border-rose-300 shadow-md flex items-center justify-center text-xl my-1 text-white font-bold">
                🪂
              </div>

              {/* Weight Force Vector (Downward Amber Arrow) */}
              <div className="flex flex-col items-center text-amber-700">
                <div className="w-1 h-10 bg-amber-500 rounded-full" />
                <span className="text-xs">▼</span>
                <span className="text-[10px] font-bold">W = mg = {(mass * g).toFixed(1)} N</span>
              </div>
            </div>
          </div>

          <div className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-center text-xs">
            <span className="text-slate-600 font-semibold">Terminal Speed: </span>
            <span className="text-rose-700 font-bold">{terminalSpeed.toFixed(1)} m/s</span>
          </div>
        </div>

        {/* Live Graphs (v-t and a-t) */}
        <div className="space-y-4">
          {renderDragGraph('v', 'Speed-Time (v-t)', 'm/s', 'text-rose-600', Math.max(35, terminalSpeed * 1.2))}
          {renderDragGraph('a', 'Acceleration-Time (a-t)', 'm/s²', 'text-amber-600', 12)}
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Mass (<MathInline math="m" />)</span>
            <span className="font-bold text-sky-700">{mass} kg</span>
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
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Drag Constant (<MathInline math="k" />)</span>
            <span className="font-bold text-rose-700">{dragK}</span>
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
            className="w-full accent-rose-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Gravity (<MathInline math="g" />)</span>
            <span className="font-bold text-amber-700">{g} m/s²</span>
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
            className="w-full accent-amber-600 bg-slate-200"
          />
        </div>
      </div>

      {/* Play Controls & Scrubber */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Drop' : 'Start Freefall'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Scrub t:</span>
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
            className="w-full accent-rose-600 bg-slate-200"
          />
          <span className="text-xs font-bold text-rose-700 w-12">{time.toFixed(1)}s</span>
        </div>
      </div>

      {/* Misconception Highlight Callout */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-rose-700">CRITICAL CONCEPTUAL REMINDER: </span>
          When the falling object reaches terminal speed, acceleration becomes zero (<MathInline math="a = 0" />). <span className="underline">Zero acceleration does NOT mean the object stops moving!</span> It means the object continues falling at a constant, maximum terminal velocity <MathInline math={`v_T = \\frac{mg}{k} = ${terminalSpeed.toFixed(1)}\\text{ m/s}`} />.
        </div>
      </div>
    </div>
  );
};
