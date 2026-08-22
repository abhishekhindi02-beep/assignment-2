import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { StepReveal } from '@/components/ui/StepReveal';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useProgress } from '@/hooks/useProgress';
import { gamma, lorentzX, lorentzT, inverseLorentzX, inverseLorentzT, spacetimeInterval, classifyInterval, formatNumber } from '@/physics/relativity';
import { ArrowRightLeft, Clock, MapPin, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LorentzTransformations() {
  const { markComplete } = useProgress();
  
  const [mode, setMode] = useState<'forward' | 'inverse'>('forward');
  const [v, setV] = useState(0.5);
  
  const [x, setX] = useState(10);
  const [t, setT] = useState(5);
  
  const [xPrime, setXPrime] = useState(10);
  const [tPrime, setTPrime] = useState(5);

  const C_M_S = 299792458; // For display purposes in real units if needed, but assuming x in m, t in s

  // Transformer logic
  const g = gamma(v);
  const calculatedXPrime = lorentzX(x, t, v);
  const calculatedTPrime = lorentzT(t, x, v);
  const calculatedX = inverseLorentzX(xPrime, tPrime, v);
  const calculatedT = inverseLorentzT(tPrime, xPrime, v);

  // Interval checker
  const [intX, setIntX] = useState(300000000); // 1 light second
  const [intT, setIntT] = useState(1);
  const [intV, setIntV] = useState(0.8);
  
  const intXPrime = lorentzX(intX, intT, intV);
  const intTPrime = lorentzT(intT, intX, intV);
  
  const intervalS = spacetimeInterval(intT, intX);
  const intervalSPrime = spacetimeInterval(intTPrime, intXPrime);
  const intervalType = classifyInterval(intT, intX);

  return (
    <SectionWrapper
      prev={{ to: '/einsteins-postulates', label: "03 Einstein's Postulates" }}
      next={{ to: '/time-dilation', label: '05 Time Dilation' }}
    >
      <SectionHeader title="6.1 — Lorentz Transformations" />

      <p className="text-lg text-slate-700 mb-6">
        To ensure the speed of light remains constant for all observers, our equations for space and time must change. The Galilean transformations are replaced by the Lorentz transformations.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <FormulaCard 
          title="Forward Transformations (S → S')"
          description="Find coordinates in moving frame S'"
          formula={`\\begin{aligned} x' &= \\gamma(x - vt) \\\\ t' &= \\gamma(t - \\frac{vx}{c^2}) \\end{aligned}`}
        />
        <FormulaCard 
          title="Inverse Transformations (S' → S)"
          description="Find coordinates in rest frame S"
          formula={`\\begin{aligned} x &= \\gamma(x' + vt') \\\\ t &= \\gamma(t' + \\frac{vx'}{c^2}) \\end{aligned}`}
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="text-violet-600" /> Lorentz Event Transformer
          </h3>
          <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button 
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'forward' ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setMode('forward')}
            >
              S → S'
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === 'inverse' ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setMode('inverse')}
            >
              S' → S
            </button>
          </div>
        </div>

        <ControlSlider 
          label="Relative Velocity (v)"
          value={v}
          onChange={setV}
          min={0}
          max={0.99}
          step={0.01}
          unit="c"
        />
        <div className="text-center text-sm text-slate-500 mt-2 mb-6">
          <InlineMath math={`\\gamma = ${formatNumber(g, 3)}`} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`p-5 rounded-xl border-2 transition-colors ${mode === 'forward' ? 'border-navy-600 bg-white' : 'border-slate-200 bg-slate-100'}`}>
            <h4 className="font-bold text-navy-800 mb-4 flex items-center gap-2">
              Frame S (Rest)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position x</label>
                <input 
                  type="number" 
                  value={mode === 'forward' ? x : formatNumber(calculatedX, 4)}
                  onChange={(e) => mode === 'forward' && setX(Number(e.target.value))}
                  disabled={mode === 'inverse'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:text-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time t</label>
                <input 
                  type="number" 
                  value={mode === 'forward' ? t : formatNumber(calculatedT, 4)}
                  onChange={(e) => mode === 'forward' && setT(Number(e.target.value))}
                  disabled={mode === 'inverse'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border-2 transition-colors ${mode === 'inverse' ? 'border-violet-600 bg-white' : 'border-slate-200 bg-slate-100'}`}>
            <h4 className="font-bold text-violet-800 mb-4 flex items-center gap-2">
              Frame S' (Moving)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position x'</label>
                <input 
                  type="number" 
                  value={mode === 'inverse' ? xPrime : formatNumber(calculatedXPrime, 4)}
                  onChange={(e) => mode === 'inverse' && setXPrime(Number(e.target.value))}
                  disabled={mode === 'forward'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:text-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time t'</label>
                <input 
                  type="number" 
                  value={mode === 'inverse' ? tPrime : formatNumber(calculatedTPrime, 4)}
                  onChange={(e) => mode === 'inverse' && setTPrime(Number(e.target.value))}
                  disabled={mode === 'forward'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-emerald-100 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Info className="text-emerald-500 opacity-20" size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-900 mb-2">The Spacetime Interval</h3>
          <p className="text-slate-600 mb-4">
            While space (<InlineMath math="\Delta x" />) and time (<InlineMath math="\Delta t" />) change between frames, the spacetime interval (<InlineMath math="\Delta s" />) is <strong>invariant</strong>.
          </p>
          <MathBlock math="(\Delta s)^2 = (c\Delta t)^2 - (\Delta x)^2" />
          
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-bold text-emerald-800 text-center mb-4 tracking-wider text-sm uppercase">
              Space Changes • Time Changes • Interval Stays The Same
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500">Δx (m)</label>
                <input type="number" value={intX} onChange={e => setIntX(Number(e.target.value))} className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Δt (s)</label>
                <input type="number" value={intT} onChange={e => setIntT(Number(e.target.value))} className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-slate-500">v (c)</label>
                <input type="number" value={intV} onChange={e => setIntV(Number(e.target.value))} step="0.01" min="0" max="0.99" className="w-full p-1 border rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xs text-slate-500">Frame S Interval (Δs²)</div>
                <div className="font-mono text-emerald-700 font-bold">{formatNumber(intervalS, 2)}</div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="text-xs text-slate-500">Frame S' Interval (Δs'²)</div>
                <div className="font-mono text-emerald-700 font-bold">{formatNumber(intervalSPrime, 2)}</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {intervalType} Interval
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Worked Example</h3>
        <StepReveal 
          steps={[
            {
              title: "Problem Statement",
              content: "A lightning strike occurs at x = 3500 m and t = 5.0 μs in Frame S. Frame S' moves in the +x direction at 0.80c relative to S. Find the coordinates of the strike in Frame S'."
            },
            {
              title: "Step 1: Calculate γ",
              content: <MathBlock math="\gamma = \frac{1}{\sqrt{1 - 0.80^2}} = \frac{1}{\sqrt{0.36}} = 1.667" />
            },
            {
              title: "Step 2: Apply position transformation",
              content: <MathBlock math="x' = \gamma(x - vt) = 1.667(3500 - (0.8 \times 3 \times 10^8)(5.0 \times 10^{-6})) = 1.667(3500 - 1200)" />
            },
            {
              title: "Step 3: Calculate final position",
              content: <MathBlock math="x' = 1.667(2300) = 3834 \text{ m}" />
            },
            {
              title: "Step 4: Apply time transformation",
              content: <MathBlock math="t' = \gamma(t - \frac{vx}{c^2}) = 1.667(5.0 \times 10^{-6} - \frac{0.8 \times 3500}{3 \times 10^8})" />
            },
            {
              title: "Step 5: Calculate final time",
              content: <MathBlock math="t' = 1.667(5.0 \times 10^{-6} - 9.33 \times 10^{-6}) = -7.22 \text{ \mu s}" />
            }
          ]}
        />
      </div>

      <CalloutCard 
        type="warning"
        title="Misconception Check"
        content="At low speeds (v << c), Lorentz transformations reduce to Galilean transformations. γ approaches 1, and the vx/c² term in the time equation becomes essentially zero, leaving t' = t and x' = x - vt."
      />

      <div className="mt-8 mb-12">
        <QuizCard 
          question="If a spaceship (S') passes Earth (S) at 0.9c, how does an event's spacetime interval measured by S compare to the interval measured by S'?"
          options={[
            "The interval measured by S is longer.",
            "The interval measured by S' is longer.",
            "They measure exactly the same spacetime interval.",
            "The interval depends on the specific coordinates of the event."
          ]}
          correctIndex={2}
          explanation="The spacetime interval is an invariant quantity. No matter what inertial frame you are in, the computed spacetime interval between two events will be identical."
        />
      </div>

    </SectionWrapper>
  );
}
