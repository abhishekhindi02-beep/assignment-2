import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { MathBlock, InlineMath } from '@/components/math/MathBlock';
import { CalloutCard } from '@/components/ui/CalloutCard';
import { ControlSlider } from '@/components/ui/ControlSlider';
import { StepReveal } from '@/components/ui/StepReveal';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useProgress } from '@/hooks/useProgress';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Monitor, Train } from 'lucide-react';

export default function Simultaneity() {
  const { markSectionComplete } = useProgress();
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState<'ground' | 'train'>('ground');
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(0.5); // Animation speed
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    markSectionComplete('/simultaneity');
  }, [markSectionComplete]);

  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - time * (1000 / speed);
      const animate = (now: number) => {
        let t = (now - startTime) * (speed / 1000);
        if (t > 100) {
          t = 100;
          setIsPlaying(false);
        }
        setTime(t);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  // Positions and animation logic
  const v = 0.5; // Train speed for visual purposes
  const c = 1; // Speed of light for visual purposes
  
  // Events
  // Ground frame: lightning strikes occur at t=20 simultaneously at x=-30 and x=30
  // Train length = 60
  
  const strikeTimeGround = 20;
  
  const trainPosGround = time * v; // train moves right
  const A_posGround = trainPosGround - 30; // back of train
  const B_posGround = trainPosGround + 30; // front of train
  
  // Lightning strikes at ground frame time = 20
  const strikesVisible = time >= strikeTimeGround && time <= strikeTimeGround + 10;
  
  // Light waves
  const lightRadiusA = time > strikeTimeGround ? (time - strikeTimeGround) * c : 0;
  const lightRadiusB = time > strikeTimeGround ? (time - strikeTimeGround) * c : 0;
  const A_strikePosGround = -30 + (strikeTimeGround * v);
  const B_strikePosGround = 30 + (strikeTimeGround * v);

  // Train frame: events are not simultaneous.
  // Delta t' = -gamma * v * Delta x / c^2
  // Lightning at B (front) happens BEFORE lightning at A (back) in the train frame.
  const strikeTimeTrainB = 10;
  const strikeTimeTrainA = 30;
  const strikesVisibleTrainB = time >= strikeTimeTrainB && time <= strikeTimeTrainB + 10;
  const strikesVisibleTrainA = time >= strikeTimeTrainA && time <= strikeTimeTrainA + 10;

  const lightRadiusTrainA = time > strikeTimeTrainA ? (time - strikeTimeTrainA) * c : 0;
  const lightRadiusTrainB = time > strikeTimeTrainB ? (time - strikeTimeTrainB) * c : 0;

  return (
    <SectionWrapper>
      <SectionHeader 
        title="6.2 — Relativity of Simultaneity" 
        subtitle="Events simultaneous in one frame may not be simultaneous in another"
      />

      <div className="space-y-6">
        <CalloutCard type="warning" title="The Core Concept">
          <p className="font-medium text-slate-800 text-lg">
            Events that are simultaneous in one inertial frame are NOT necessarily simultaneous in another frame moving relative to the first.
          </p>
          <p className="mt-2 text-slate-600">
            Simultaneity is relative, not absolute. This is a profound consequence of the invariant speed of light.
          </p>
        </CalloutCard>

        {/* Flagship Train Animation */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Train className="w-6 h-6 mr-2 text-violet-400" />
              The Train Experiment
            </h3>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => { setFrame('ground'); handleReset(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${frame === 'ground' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Ground Observer
              </button>
              <button 
                onClick={() => { setFrame('train'); handleReset(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${frame === 'train' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Train Observer
              </button>
            </div>
          </div>

          <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex flex-col justify-center">
            
            {/* GROUND FRAME ANIMATION */}
            {frame === 'ground' && (
              <>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2"></div>
                
                {/* Train in ground frame */}
                <div 
                  className="absolute h-16 w-60 border-2 border-slate-600 rounded-lg bg-slate-800/50 flex items-center justify-center top-1/2 -translate-y-1/2 transition-all duration-75"
                  style={{ left: `calc(50% + ${trainPosGround}px - 120px)` }}
                >
                  <div className="absolute w-2 h-2 bg-emerald-400 rounded-full"></div> {/* Observer T */}
                  <span className="absolute -bottom-6 text-xs text-emerald-400 font-bold">T</span>
                </div>

                {/* Ground Observer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mx-auto"></div>
                  <span className="text-xs text-amber-500 font-bold">G</span>
                </div>

                {/* Light Waves Ground */}
                {lightRadiusA > 0 && (
                  <div 
                    className="absolute rounded-full border-2 border-amber-300 top-1/2 -translate-y-1/2 opacity-70"
                    style={{ 
                      width: lightRadiusA * 2, height: lightRadiusA * 2, 
                      left: `calc(50% + ${A_strikePosGround}px - ${lightRadiusA}px)` 
                    }}
                  />
                )}
                {lightRadiusB > 0 && (
                  <div 
                    className="absolute rounded-full border-2 border-violet-400 top-1/2 -translate-y-1/2 opacity-70"
                    style={{ 
                      width: lightRadiusB * 2, height: lightRadiusB * 2, 
                      left: `calc(50% + ${B_strikePosGround}px - ${lightRadiusB}px)` 
                    }}
                  />
                )}

                {/* Lightning Strikes Ground */}
                {strikesVisible && (
                  <>
                    <div className="absolute text-yellow-300 w-8 h-8 top-1/4 -translate-y-1/2" style={{ left: `calc(50% + ${A_strikePosGround}px - 16px)` }}>⚡</div>
                    <div className="absolute text-yellow-300 w-8 h-8 top-1/4 -translate-y-1/2" style={{ left: `calc(50% + ${B_strikePosGround}px - 16px)` }}>⚡</div>
                  </>
                )}
              </>
            )}

            {/* TRAIN FRAME ANIMATION */}
            {frame === 'train' && (
              <>
                {/* Train is stationary */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 opacity-30"></div>
                <div 
                  className="absolute h-16 w-60 border-2 border-slate-600 rounded-lg bg-slate-800/50 flex items-center justify-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                >
                  <div className="absolute w-2 h-2 bg-emerald-400 rounded-full"></div> {/* Observer T */}
                  <span className="absolute -bottom-6 text-xs text-emerald-400 font-bold">T</span>
                </div>

                {/* Ground Observer moves left */}
                <div 
                  className="absolute top-1/2 translate-y-8"
                  style={{ left: `calc(50% - ${time * v}px)` }}
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full mx-auto"></div>
                  <span className="text-xs text-amber-500 font-bold">G</span>
                </div>

                {/* Light Waves Train */}
                {lightRadiusTrainA > 0 && (
                  <div 
                    className="absolute rounded-full border-2 border-amber-300 top-1/2 -translate-y-1/2 opacity-70"
                    style={{ 
                      width: lightRadiusTrainA * 2, height: lightRadiusTrainA * 2, 
                      left: `calc(50% - 120px - ${lightRadiusTrainA}px)` 
                    }}
                  />
                )}
                {lightRadiusTrainB > 0 && (
                  <div 
                    className="absolute rounded-full border-2 border-violet-400 top-1/2 -translate-y-1/2 opacity-70"
                    style={{ 
                      width: lightRadiusTrainB * 2, height: lightRadiusTrainB * 2, 
                      left: `calc(50% + 120px - ${lightRadiusTrainB}px)` 
                    }}
                  />
                )}

                {/* Lightning Strikes Train */}
                {strikesVisibleTrainA && (
                  <div className="absolute text-yellow-300 w-8 h-8 top-1/4 -translate-y-1/2" style={{ left: `calc(50% - 120px - 16px)` }}>⚡</div>
                )}
                {strikesVisibleTrainB && (
                  <div className="absolute text-yellow-300 w-8 h-8 top-1/4 -translate-y-1/2" style={{ left: `calc(50% + 120px - 16px)` }}>⚡</div>
                )}
              </>
            )}

          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center space-x-3">
              <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button onClick={handleReset} className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow w-full">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Timeline</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={time} 
                onChange={(e) => { setTime(Number(e.target.value)); setIsPlaying(false); }}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500" 
              />
            </div>
            
            <div className="w-48 hidden md:block">
              <ControlSlider
                label="Animation Speed"
                value={speed}
                min={0.1} max={2} step={0.1}
                onChange={setSpeed}
              />
            </div>
          </div>
          
          <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm text-slate-300 leading-relaxed border border-slate-700">
            {frame === 'ground' ? (
              <p>
                <strong className="text-amber-400">Ground Frame Perspective:</strong> The lightning strikes simultaneously. As the light travels toward observer T, the train moves forward. T runs <em>into</em> the light from the front, and runs <em>away</em> from the light at the back. Thus, T receives the front signal first.
              </p>
            ) : (
              <p>
                <strong className="text-emerald-400">Train Frame Perspective:</strong> Observer T is stationary and exactly halfway between the ends. If T receives the light from the front <em>before</em> the light from the back, and the light speed is constant, the front strike <strong>must have occurred first</strong>.
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Mathematical Explanation</h3>
          <p className="text-slate-700 mb-4">
            The Lorentz transformation for time is:
          </p>
          <div className="my-4">
            <MathBlock math="\Delta t' = \gamma \left( \Delta t - \frac{v \Delta x}{c^2} \right)" />
          </div>
          <p className="text-slate-700">
            If two events are simultaneous in frame <InlineMath math="S" /> (<InlineMath math="\Delta t = 0" />) but separated by distance <InlineMath math="\Delta x" />, then in frame <InlineMath math="S'" />:
          </p>
          <div className="my-4">
            <MathBlock math="\Delta t' = -\gamma \frac{v \Delta x}{c^2}" />
          </div>
          <p className="text-slate-700">
            Because <InlineMath math="\Delta t' \neq 0" />, the events are NOT simultaneous in <InlineMath math="S'" />. The spatial separation <InlineMath math="\Delta x" /> in one frame creates a time separation <InlineMath math="\Delta t'" /> in another frame!
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Worked Example 6.10</h3>
          <p className="text-slate-700 mb-4">
            A train of proper length <InlineMath math="L_0 = 300\text{ m}" /> moves at <InlineMath math="v = 0.98c" />. Two lightning bolts strike the ends of the train simultaneously in the <em>train's</em> frame. What is the time difference between the strikes as measured by an observer on the ground?
          </p>
          
          <StepReveal steps={[
            {
              title: "Identify given values and frame",
              content: <p>Frame <InlineMath math="S'" /> (train): <InlineMath math="\Delta t' = 0" />, <InlineMath math="\Delta x' = 300\text{ m}" />.<br />Velocity: <InlineMath math="v = 0.98c" />.</p>
            },
            {
              title: "Calculate gamma (γ)",
              content: <MathBlock math="\gamma = \frac{1}{\sqrt{1 - 0.98^2}} \approx 5.025" />
            },
            {
              title: "Apply Lorentz transformation for time",
              content: <MathBlock math="\Delta t = \gamma \left( \Delta t' + \frac{v \Delta x'}{c^2} \right) = \gamma \left( 0 + \frac{v \Delta x'}{c^2} \right)" />
            },
            {
              title: "Calculate the time difference",
              content: (
                <div className="space-y-2">
                  <MathBlock math="\Delta t = 5.025 \times \frac{(0.98c)(300\text{ m})}{c^2} = 5.025 \times \frac{0.98 \times 300}{c}" />
                  <p className="text-sm text-slate-600 text-center">Using <InlineMath math="c = 3 \times 10^8\text{ m/s}" />:</p>
                  <MathBlock math="\Delta t \approx 4.92 \times 10^{-6}\text{ s} = 4.92\text{ }\mu\text{s}" />
                  <p className="font-semibold text-slate-800 text-center mt-2">The ground observer measures the strikes happening nearly 5 microseconds apart.</p>
                </div>
              )
            }
          ]} />
        </div>

        <CalloutCard type="error" title="Common Misconception">
          <p>
            "Simultaneity is just about signal delays or the time it takes light to reach your eyes."
          </p>
          <hr className="my-3 border-red-200" />
          <p className="font-medium text-slate-800 mb-2">Correction:</p>
          <p>
            Simultaneity is a fundamental consequence of how spacetime works. Even after subtracting all light travel times and signal delays, observers in different frames genuinely disagree on which events happen at the same time. The structure of time itself is relative!
          </p>
        </CalloutCard>

        <div className="mt-8">
          <QuizCard
            question="Two supernovas occur simultaneously in Earth's frame. A spaceship travels from Earth towards Supernova A at high speed. According to the spaceship's frame, which supernova occurs first?"
            options={[
              { id: "a", text: "They occur simultaneously.", isCorrect: false, explanation: "Simultaneity is relative." },
              { id: "b", text: "Supernova A occurs first.", isCorrect: true, explanation: "Using Δt' = -γvΔx/c², the event located in the direction of motion (positive x) happens at a negative t' (earlier time) relative to the origin." },
              { id: "c", text: "Supernova B occurs first.", isCorrect: false, explanation: "The event you are moving towards happens earlier in your frame." },
              { id: "d", text: "It depends on the exact speed of the spaceship.", isCorrect: false, explanation: "The specific time difference depends on the speed, but the order of events does not (as long as v > 0)." }
            ]}
          />
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
          <Link to="/velocity-addition" className="flex items-center text-slate-600 hover:text-violet-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Velocity Addition
          </Link>
          <Link to="/muon-decay" className="flex items-center text-slate-600 hover:text-violet-600 transition-colors font-medium">
            Muon Decay
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
