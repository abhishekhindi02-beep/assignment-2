import { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Eye, Play, Pause, RotateCcw, Compass } from 'lucide-react';
import { MathInline } from '../math/MathBlock';
import {
  calcProjectileState,
  calcProjectileMaxHeight,
  calcProjectileFlightTime,
  calcProjectileRange,
  simulateProjectileWithDrag
} from '../../physics/engine';

export const ProjectileLab = () => {
  const [speed, setSpeed] = useState(25); // m/s
  const [angle, setAngle] = useState(45); // deg
  const [height, setHeight] = useState(0); // m
  const [gravity, setGravity] = useState(9.81); // m/s^2
  const [time, setTime] = useState(0); // s
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [enableDrag, setEnableDrag] = useState(false);
  const [dragK] = useState(0.02);
  const [compareDrop, setCompareDrop] = useState(false);

  const animationRef = useRef(null);

  const tFlight = calcProjectileFlightTime(speed, angle, gravity, height);
  const range = calcProjectileRange(speed, angle, gravity, height);
  const maxHeight = calcProjectileMaxHeight(speed, angle, gravity, height);

  const currentState = calcProjectileState(speed, angle, time, gravity, height);

  const runAnimation = useCallback(() => {
    setTime((prev) => {
      if (prev >= tFlight) {
        setIsPlaying(false);
        return tFlight;
      }
      return prev + 0.04;
    });
  }, [tFlight]);

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

  // Trajectory SVG drawing coordinates
  const svgWidth = 600;
  const svgHeight = 320;
  const padding = 40;

  // Scale map
  const maxScaledX = Math.max(100, range * 1.15);
  const maxScaledY = Math.max(40, maxHeight * 1.3);

  const mapX = (x) => padding + (x / maxScaledX) * (svgWidth - 2 * padding);
  const mapY = (y) => svgHeight - padding - (y / maxScaledY) * (svgHeight - 2 * padding);

  // Vacuum trajectory points
  const trajPoints = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const tVal = (i / steps) * tFlight;
    const st = calcProjectileState(speed, angle, tVal, gravity, height);
    trajPoints.push(st);
  }

  const pathD = trajPoints.reduce((acc, p, idx) => {
    const px = mapX(p.x);
    const py = mapY(p.y);
    return idx === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
  }, '');

  // Air resistance points if enabled
  const dragPoints = enableDrag ? simulateProjectileWithDrag(speed, angle, dragK, 1, gravity) : [];
  const dragPathD = dragPoints.reduce((acc, p, idx) => {
    const px = mapX(p.x);
    const py = mapY(p.y);
    return idx === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
  }, '');

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" /> Signature Feature #3 & #4
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">PROJECTILE LAB</h2>
          <p className="text-xs text-slate-600">
            Interactive 2D trajectory simulation with real-time vector component inspector, gravity presets, and air resistance.
          </p>
        </div>

        {/* Planet Gravity Presets */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { label: 'Earth (1g)', g: 9.81 },
            { label: 'Planet (2g)', g: 19.62 },
            { label: 'Moon (0.16g)', g: 1.62 },
            { label: 'Mars (0.38g)', g: 3.71 }
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setGravity(p.g);
                setTime(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                gravity === p.g ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Viewport (SVG Trajectory) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-800">Trajectory Canvas</span>
            <button
              onClick={() => setShowVectors(!showVectors)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                showVectors ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" /> Vectors {showVectors ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setEnableDrag(!enableDrag)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                enableDrag ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              Air Resistance {enableDrag ? 'ON' : 'OFF'}
            </button>
          </div>
          <span className="font-semibold text-sky-700">Flight Time: {tFlight.toFixed(2)} s</span>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-72 overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={mapY(0)} x2={svgWidth - padding} y2={mapY(0)} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="2" />

          {/* Vacuum Trajectory Curve (Cyan) */}
          <path d={pathD} fill="none" stroke="#0284c7" strokeWidth="3" />

          {/* Drag Trajectory Curve (Rose, if enabled) */}
          {enableDrag && dragPathD && (
            <path d={dragPathD} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="5 5" />
          )}

          {/* Apex Dot (Highest Point) */}
          <circle cx={mapX(range / 2)} cy={mapY(maxHeight)} r="4" fill="#d97706" />
          <text x={mapX(range / 2)} y={mapY(maxHeight) - 8} fill="#d97706" fontSize="10" textAnchor="middle" fontWeight="bold">
            y_max = {maxHeight.toFixed(1)}m
          </text>

          {/* Target Landing Point */}
          <circle cx={mapX(range)} cy={mapY(0)} r="5" fill="#059669" />
          <text x={mapX(range)} y={mapY(0) + 14} fill="#059669" fontSize="10" textAnchor="middle" fontWeight="bold">
            Range R = {range.toFixed(1)}m
          </text>

          {/* Current Projectile Position & Vectors */}
          {(() => {
            const cx = mapX(currentState.x);
            const cy = mapY(currentState.y);
            const vecScale = 1.2;

            return (
              <g>
                {/* Projectile ball */}
                <circle cx={cx} cy={cy} r="7" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />

                {/* Vector Arrows */}
                {showVectors && (
                  <>
                    {/* Horizontal Velocity Vx (Cyan) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx + currentState.vx * vecScale}
                      y2={cy}
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    {/* Vertical Velocity Vy (Indigo) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy - currentState.vy * vecScale}
                      stroke="#7c3aed"
                      strokeWidth="2.5"
                    />
                    {/* Resultant Velocity V (Emerald) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx + currentState.vx * vecScale}
                      y2={cy - currentState.vy * vecScale}
                      stroke="#059669"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                    {/* Gravity vector (Amber downward) */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx}
                      y2={cy + 25}
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                  </>
                )}
              </g>
            );
          })()}

          {/* Dropped Ball Comparison (If Compare Drop toggled) */}
          {compareDrop && (
            <g>
              <line x1={padding} y1={mapY(height)} x2={padding} y2={mapY(0)} stroke="#94a3b8" strokeDasharray="3 3" />
              <circle
                cx={padding}
                cy={mapY(Math.max(0, height - 0.5 * gravity * time * time))}
                r="7"
                fill="#e11d48"
                stroke="#fda4af"
                strokeWidth="2"
              />
              <text x={padding - 15} y={mapY(height) + 15} fill="#e11d48" fontSize="9" textAnchor="end font-bold">
                Object A (Dropped)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Control Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Launch Speed (<MathInline math="u" />)</span>
            <span className="font-bold text-sky-700">{speed} m/s</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={speed}
            onChange={(e) => {
              setSpeed(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Launch Angle (<MathInline math="\theta" />)</span>
            <span className="font-bold text-sky-700">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => {
              setAngle(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Launch Height (<MathInline math="y_0" />)</span>
            <span className="font-bold text-sky-700">{height} m</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={height}
            onChange={(e) => {
              setHeight(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Gravity (<MathInline math="g" />)</span>
            <span className="font-bold text-amber-700">{gravity} m/s²</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="0.5"
            value={gravity}
            onChange={(e) => {
              setGravity(parseFloat(e.target.value));
              setTime(0);
            }}
            className="w-full accent-amber-600 bg-slate-200"
          />
        </div>
      </div>

      {/* Playback Controls & Special Demo Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Flight' : 'Launch Projectile'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareDrop(!compareDrop)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              compareDrop ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-200 text-slate-600'
            }`}
          >
            Drop vs Launch Experiment ({compareDrop ? 'Active' : 'Off'})
          </button>
        </div>

        <div className="flex-1 max-w-xs flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">t:</span>
          <input
            type="range"
            min="0"
            max={tFlight}
            step="0.05"
            value={time}
            onChange={(e) => {
              setIsPlaying(false);
              setTime(parseFloat(e.target.value));
            }}
            className="w-full accent-sky-600 bg-slate-200"
          />
          <span className="text-xs font-bold text-sky-700 w-12">{time.toFixed(2)}s</span>
        </div>
      </div>

      {/* Signature Feature #4: VECTOR INSPECTOR Side Panel */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
          <Compass className="w-4 h-4" /> Live Vector Inspector (t = {time.toFixed(2)}s)
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">Horizontal Velocity (v_x)</div>
          <div className="text-lg font-bold text-sky-700 mt-1">
            {currentState.vx.toFixed(2)} m/s
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Constant (a_x = 0)</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">Vertical Velocity (v_y)</div>
          <div className="text-lg font-bold text-indigo-700 mt-1">
            {currentState.vy.toFixed(2)} m/s
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Decreases by g each sec</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">Resultant Speed (|v|)</div>
          <div className="text-lg font-bold text-emerald-700 mt-1">
            {currentState.speed.toFixed(2)} m/s
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            <MathInline math="\sqrt{v_x^2 + v_y^2}" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">Position Vector (x, y)</div>
          <div className="text-sm font-bold text-amber-700 mt-1">
            ({currentState.x.toFixed(1)}m, {currentState.y.toFixed(1)}m)
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Angle: {currentState.currentAngleDeg.toFixed(1)}°
          </div>
        </div>
      </div>
    </div>
  );
};
