import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { useProgress } from '@/hooks/useProgress';
import { gamma, relativisticVelocityAdd, formatNumber } from '@/physics/relativity';
import { Lightbulb, Rocket, Zap, ChevronDown, ChevronUp, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EinsteinsPostulates() {
  const { markComplete } = useProgress();
  const [rocketV, setRocketV] = useState(0.5);
  const [showMM, setShowMM] = useState(false);
  const [gammaV, setGammaV] = useState(0.5);

  const currentGamma = gamma(gammaV);
  const galileanSpeed = 1 + rocketV; 
  const relSpeed = relativisticVelocityAdd(1, rocketV);

  // SVG graph data for Gamma vs v/c
  const generateGraphPath = () => {
    let path = '';
    for (let v = 0; v <= 0.999; v += 0.01) {
      const g = gamma(v);
      const x = (v / 1) * 100; // 0 to 100%
      const y = 100 - (Math.min(g, 25) / 25) * 100; // scale 1-25 to 0-100%
      if (v === 0) path += `M ${x} ${y}`;
      else path += ` L ${x} ${y}`;
    }
    return path;
  };

  const currentGammaX = (gammaV / 1) * 100;
  const currentGammaY = 100 - (Math.min(currentGamma, 25) / 25) * 100;

  return (
    <SectionWrapper>
      <SectionHeader title="6.1 — Einstein's Postulates" />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-navy-100 text-navy-800 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold">1</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Principle of Relativity</h3>
          <p className="text-slate-700 text-lg">
            All laws of physics are the same in all inertial frames of reference.
          </p>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Constancy of the Speed of Light</h3>
          <p className="text-slate-700 text-lg">
            The speed of light in vacuum is the same for all inertial observers, regardless of the motion of the source or observer.
          </p>
        </div>
      </div>

      <CalloutCard 
        type="key-concept"
        title="The speed of light is invariant"
        content="It is the same in every inertial frame. You cannot catch up to a light beam, and a moving flashlight doesn't shoot 'faster' light."
      />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Rocket className="text-violet-600" /> Test the Postulates
        </h3>
        <p className="text-slate-600 mb-6">
          A rocket moves at velocity <InlineMath math="v" /> and fires a laser beam forward at speed <InlineMath math="c" />. What speed does a ground observer measure for the light beam?
        </p>

        <ControlSlider 
          label="Rocket Velocity (v)"
          value={rocketV}
          onChange={setRocketV}
          min={0}
          max={0.95}
          step={0.01}
          unit="c"
        />

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-700 mb-2">Galilean Prediction (Wrong)</h4>
            <div className="text-2xl font-mono text-slate-800">
              {formatNumber(galileanSpeed, 2)}c
            </div>
            <p className="text-sm text-slate-500 mt-1">c + v = {formatNumber(galileanSpeed, 2)}c</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-emerald-200">
            <h4 className="font-semibold text-emerald-700 mb-2">Relativistic Result (Correct)</h4>
            <div className="text-2xl font-mono text-slate-800 font-bold">
              {formatNumber(relSpeed, 2)}c
            </div>
            <p className="text-sm text-slate-500 mt-1">Light is always c.</p>
          </div>
        </div>
      </div>

      <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden">
        <button 
          onClick={() => setShowMM(!showMM)}
          className="w-full flex justify-between items-center bg-slate-100 p-4 hover:bg-slate-200 transition-colors"
        >
          <span className="font-bold text-slate-800 flex items-center gap-2">
            Science in Context: The Michelson-Morley Experiment
          </span>
          {showMM ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showMM && (
          <div className="p-6 bg-white text-slate-700">
            <p className="mb-4">
              In 1887, Albert Michelson and Edward Morley attempted to measure the Earth's velocity relative to the "luminiferous aether" — the theoretical medium thought to carry light waves.
            </p>
            <p>
              They expected light to travel at different speeds depending on whether it moved with or against the Earth's motion. Their result? Zero difference. The speed of light was constant in all directions. This "failed" experiment became a foundational piece of evidence for Einstein's postulates.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="text-amber-500" /> Gamma Factor (<InlineMath math="\gamma" />) Explorer
        </h3>
        
        <p className="text-slate-600 mb-6">
          The Lorentz factor <InlineMath math="\gamma" /> appears in almost every relativistic equation. It describes how much time, length, and mass are affected by speed.
        </p>

        <ControlSlider 
          label="Velocity (v)"
          value={gammaV}
          onChange={setGammaV}
          min={0}
          max={0.999}
          step={0.001}
          unit="c"
        />

        <div className="flex flex-col md:flex-row gap-8 mt-6">
          <div className="flex-1 bg-slate-50 rounded-lg p-4 flex flex-col justify-center items-center">
            <div className="text-sm text-slate-500 mb-2">Current Values</div>
            <div className="text-lg">v = {formatNumber(gammaV, 3)}c</div>
            <div className="text-lg">β = {formatNumber(gammaV, 3)}</div>
            <div className="text-3xl font-bold text-violet-600 mt-2">γ = {formatNumber(currentGamma, 3)}</div>
          </div>
          
          <div className="flex-1 h-48 bg-white border border-slate-200 rounded-lg relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0">
              {/* Axes */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Gamma Curve */}
              <path d={`M 0 96 L 100 96`} stroke="#f1f5f9" strokeWidth="1" fill="none" />
              <path d={generateGraphPath()} stroke="#7c3aed" strokeWidth="2" fill="none" />
              
              {/* Current Point */}
              <circle cx={currentGammaX} cy={currentGammaY} r="3" fill="#ef4444" />
            </svg>
            <div className="absolute bottom-1 left-1 text-[10px] text-slate-400">0</div>
            <div className="absolute bottom-1 right-1 text-[10px] text-slate-400">1.0c</div>
            <div className="absolute top-1 left-1 text-[10px] text-slate-400">γ=25</div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 rounded-tl-lg">v (c)</th>
                <th className="px-4 py-2">0</th>
                <th className="px-4 py-2">0.5</th>
                <th className="px-4 py-2">0.8</th>
                <th className="px-4 py-2">0.9</th>
                <th className="px-4 py-2">0.95</th>
                <th className="px-4 py-2">0.99</th>
                <th className="px-4 py-2 rounded-tr-lg">0.999</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-2 font-bold bg-slate-50">γ</td>
                <td className="px-4 py-2">1.000</td>
                <td className="px-4 py-2">1.155</td>
                <td className="px-4 py-2">1.667</td>
                <td className="px-4 py-2">2.294</td>
                <td className="px-4 py-2">3.203</td>
                <td className="px-4 py-2">7.089</td>
                <td className="px-4 py-2">22.366</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8 flex gap-4">
        <AlertTriangle className="text-orange-500 shrink-0" />
        <div>
          <h4 className="font-bold text-orange-800">Exam Tip</h4>
          <p className="text-orange-700">
            Remember that <InlineMath math="\gamma \geq 1" /> always! If you ever calculate a gamma factor less than 1, you've made a mistake (usually flipping the minus sign or the fraction). At everyday speeds, <InlineMath math="\gamma \approx 1" />.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
        <Link to="/galilean" className="flex items-center gap-2 text-slate-600 hover:text-navy-600 font-medium">
          <ChevronLeft size={20} /> Galilean Relativity
        </Link>
        <button onClick={() => markComplete('/einsteins-postulates')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-200 transition-colors">
          Mark Complete
        </button>
        <Link to="/lorentz" className="flex items-center gap-2 text-slate-600 hover:text-navy-600 font-medium">
          Lorentz Transformations <ChevronRight size={20} />
        </Link>
      </div>

    </SectionWrapper>
  );
}
