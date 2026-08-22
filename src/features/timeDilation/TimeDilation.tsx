import { useState, useEffect, useRef } from 'react';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { FormulaCard } from '@/components/math/FormulaCard';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { StepReveal } from '@/components/ui/StepReveal';
import { QuizCard } from '@/components/quiz/QuizCard';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { useProgress } from '@/hooks/useProgress';
import { gamma, timeDilation, formatNumber } from '@/physics/relativity';

export default function TimeDilation() {
  const { markComplete } = useProgress();
  const [velocity, setVelocity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [properTime, setProperTime] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    markComplete('/time-dilation');
  }, [markComplete]);

  const currentGamma = gamma(velocity);
  const dilatedTime = timeDilation(properTime, velocity);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const animate = (time: number) => {
        const delta = (time - (lastTimeRef.current || time)) / 1000;
        setProperTime((prev) => prev + delta);
        lastTimeRef.current = time;
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setProperTime(0);
  };

  const gValue = formatNumber(currentGamma, 3);

  return (
    <SectionWrapper
      prev={{ to: '/lorentz-transformations', label: '04 Lorentz Transforms' }}
      next={{ to: '/length-contraction', label: '06 Length Contraction' }}
    >
      <SectionHeader
        section="6.2"
        title="Time Dilation"
        subtitle="Moving clocks run slower. How velocity affects the flow of time."
      />

      <div className="space-y-8">
        <FormulaCard
          name="Time Dilation Formula"
          latex="\Delta t = \gamma \Delta t_0 = \frac{\Delta t_0}{\sqrt{1 - v^2/c^2}}"
          description="Calculates the time interval measured by an observer moving at velocity v relative to the clock."
          symbols={[
            { symbol: '\\Delta t', meaning: 'Dilated time interval', unit: 's' },
            { symbol: '\\Delta t_0', meaning: 'Proper time interval', unit: 's' },
            { symbol: '\\gamma', meaning: 'Lorentz factor' },
            { symbol: 'v', meaning: 'Relative velocity', unit: 'c' }
          ]}
        />

        <CalloutCard type="definition" title="Proper Time">
          Proper time is the time interval between two events measured in the frame where the events occur at the <strong>SAME spatial location</strong>.
        </CalloutCard>

        <CalloutCard type="misconception">
          <strong>PROPER ≠ MORE CORRECT.</strong> Proper identifies the frame where two events happen at the same place, not a more accurate measurement.
        </CalloutCard>

        {/* INTERACTIVE VISUALIZER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-800">Dual Clock Visualization</h3>
            <p className="text-sm text-slate-600 mt-1">Compare a clock in its rest frame to how it appears from a moving frame.</p>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* Rest Frame Clock */}
              <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
                <div className="text-sm font-semibold text-navy-700 tracking-wide">REST FRAME CLOCK</div>
                <div className="text-xs text-slate-500 mb-2">(Measures Proper Time <InlineMath latex="\Delta t_0" />)</div>
                <div className="w-40 h-40 rounded-full border-4 border-navy-700 flex items-center justify-center relative bg-white shadow-inner">
                  {/* Simple analog hand */}
                  <div 
                    className="absolute w-1 h-16 bg-navy-700 origin-bottom rounded-full"
                    style={{ 
                      bottom: '50%', 
                      transform: `rotate(${(properTime % 60) * 6}deg)` 
                    }}
                  />
                  <div className="absolute w-3 h-3 rounded-full bg-navy-900 z-10" />
                </div>
                <div className="font-mono text-2xl text-navy-800 tabular-nums">
                  {formatNumber(properTime, 2)}s
                </div>
              </div>

              {/* Moving Frame Clock */}
              <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
                <div className="text-sm font-semibold text-violet-600 tracking-wide">MOVING FRAME CLOCK</div>
                <div className="text-xs text-slate-500 mb-2">(Measures Dilated Time <InlineMath latex="\Delta t" />)</div>
                <div className="w-40 h-40 rounded-full border-4 border-violet-600 flex items-center justify-center relative bg-white shadow-inner">
                  {/* Simple analog hand */}
                  <div 
                    className="absolute w-1 h-16 bg-violet-600 origin-bottom rounded-full"
                    style={{ 
                      bottom: '50%', 
                      transform: `rotate(${(dilatedTime % 60) * 6}deg)` 
                    }}
                  />
                  <div className="absolute w-3 h-3 rounded-full bg-violet-900 z-10" />
                </div>
                <div className="font-mono text-2xl text-violet-700 tabular-nums">
                  {formatNumber(dilatedTime, 2)}s
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="max-w-md mx-auto space-y-6">
              <ControlSlider
                label="Relative Velocity (v)"
                value={velocity}
                min={0}
                max={0.99}
                step={0.01}
                onChange={(v) => setVelocity(v)}
                unit="c"
              />
              
              <div className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-600">Lorentz Factor (<InlineMath latex="\gamma" />): <strong className="text-slate-900">{gValue}</strong></span>
                <span className="text-slate-600">Ratio <InlineMath latex="\Delta t / \Delta t_0" />: <strong className="text-slate-900">{gValue}</strong></span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-2 bg-navy-700 text-white font-medium rounded-lg hover:bg-navy-800 transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Worked Example</h3>
          <StepReveal
            steps={[
              {
                label: 'The Scenario',
                content: 'A spacecraft clock ticks once every 1.0s in its rest frame. The spacecraft moves at 0.90c relative to Earth. What is the time between ticks as measured by Earth?'
              },
              {
                label: 'Step 1: Identify proper time',
                content: <><InlineMath latex="\Delta t_0 = 1.0\text{s}" /> because the clock is stationary in the spacecraft frame (ticks happen at the same location).</>
              },
              {
                label: 'Step 2: Calculate Gamma',
                content: <><MathBlock latex="\gamma = \frac{1}{\sqrt{1 - 0.90^2}} = \frac{1}{\sqrt{1 - 0.81}} = 2.294" /></>
              },
              {
                label: 'Step 3: Apply Time Dilation Formula',
                content: <><MathBlock latex="\Delta t = \gamma \Delta t_0 = 2.294 \times 1.0\text{s}" /></>
              },
              {
                label: 'Conclusion',
                content: 'Earth measures 2.294s between ticks. The moving clock appears to run slower.'
              }
            ]}
          />
        </div>

        <CalloutCard type="science-context" title="GPS and Time Dilation">
          GPS satellites travel at about 14,000 km/h relative to Earth. Special relativity predicts their clocks lose about 7 microseconds per day. (General relativity also plays a role, making them gain 45 microseconds). The net difference of ~38μs/day must be corrected, otherwise GPS positioning would drift by 11km every day!
        </CalloutCard>

        <CalloutCard type="exam-tip">
          Always identify which frame measures proper time first. The proper time is <strong>ALWAYS the shorter interval</strong> (<InlineMath latex="\Delta t_0 \le \Delta t" />).
        </CalloutCard>

        <QuizCard
          question="A muon has a proper lifetime of 2.2μs. It travels at 0.95c. What lifetime does an Earth observer measure?"
          options={[
            { text: '2.2μs', isCorrect: false },
            { text: '0.69μs', isCorrect: false },
            { text: '7.05μs', isCorrect: true },
            { text: '9.8μs', isCorrect: false }
          ]}
          explanation="At 0.95c, γ = 3.203. The proper time is 2.2μs. Dilated time = γ × 2.2μs = 7.05μs."
        />
      </div>
    </SectionWrapper>
  );
}
