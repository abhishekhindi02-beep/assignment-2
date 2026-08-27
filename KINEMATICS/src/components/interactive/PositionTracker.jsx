import { useState } from 'react';
import { MathInline } from '../math/MathBlock';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';

export const PositionTracker = () => {
  const [pos, setPos] = useState(6);
  const [journeyStep, setJourneyStep] = useState(0);

  const journeys = [
    {
      title: "Journey 1: Single Direction Path",
      start: -4,
      end: 16,
      distance: 20,
      displacement: 20,
      description: "Object moves directly from -4m to +16m. Since direction does not change, distance = displacement magnitude!"
    },
    {
      title: "Journey 2: Direction Reversal Path",
      start: 12,
      intermediate: 20,
      end: 4,
      distance: 24,
      displacement: -8,
      description: "Object moves from 12m out to 20m (+8m) and turns around to end at 4m (-16m). Distance = 8 + 16 = 24m. Displacement = 4 - 12 = -8m!"
    }
  ];

  const currentJourney = journeys[journeyStep];

  return (
    <div className="my-6 p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-slate-950/90 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Compass className="w-4 h-4" /> Position Tracker & Journey Simulator
          </div>
          <h3 className="text-xl font-bold text-slate-100">1D Position & Number Line Axis</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setJourneyStep((journeyStep + 1) % journeys.length)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md"
          >
            Switch Journey <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Number Line Visualizer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1"><ArrowLeft className="w-3 h-3 text-rose-400" /> Negative Direction</span>
          <span className="flex items-center gap-1">Positive Direction <ArrowRight className="w-3 h-3 text-cyan-400" /></span>
        </div>

        {/* Number Line */}
        <div className="relative h-16 flex items-center my-4">
          <div className="absolute inset-x-0 h-1.5 bg-slate-800 rounded-full" />
          
          {[-10, -5, 0, 5, 10, 15].map((val) => {
            const pct = ((val - (-10)) / (15 - (-10))) * 100;
            return (
              <div key={val} className="absolute flex flex-col items-center" style={{ left: `${pct}%` }}>
                <div className={`w-0.5 ${val === 0 ? 'h-5 bg-cyan-400' : 'h-3 bg-slate-700'}`} />
                <span className="text-[10px] font-mono text-slate-500 mt-1">{val > 0 ? `+${val}` : val}m</span>
              </div>
            );
          })}

          {/* Interactive Drag Marker */}
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all duration-100"
            style={{ left: `${((pos - (-10)) / (15 - (-10))) * 100}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50 flex items-center justify-center font-bold text-slate-950 text-xs animate-bounce">
              ●
            </div>
            <span className="text-xs font-bold font-mono text-cyan-300 mt-1">x = {pos}m</span>
          </div>
        </div>

        {/* Position Slider */}
        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs text-slate-400 font-mono">Drag Marker:</span>
          <input
            type="range"
            min="-10"
            max="15"
            value={pos}
            onChange={(e) => setPos(parseInt(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800"
          />
          <span className="text-xs font-mono font-bold text-cyan-400 w-12">{pos} m</span>
        </div>
      </div>

      {/* Preset Journey Comparison Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-slate-200">{currentJourney.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{currentJourney.description}</p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400">Total Distance (Scalar)</span>
            <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">d = {currentJourney.distance} m</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400">Net Displacement (Vector)</span>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              <MathInline math={`\\Delta s = ${currentJourney.displacement > 0 ? '+' : ''}${currentJourney.displacement}\\text{ m}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
