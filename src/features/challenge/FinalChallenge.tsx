import React, { useState } from 'react';
import { SectionHeader, SectionWrapper } from '@/components/layout/SectionLayout';
import { CalloutCard } from '@/components/ui';
import { QuizCard, NumericQuiz } from '@/components/quiz/QuizCard';
import { useProgress } from '@/hooks/useProgress';

export const FinalChallenge: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const { markComplete } = useProgress();

  const handleCorrect = () => {
    if (currentStage < 9) {
      setCurrentStage(prev => prev + 1);
    } else {
      setCurrentStage(10); // Complete
      markComplete();
    }
  };

  const stages = [
    {
      type: 'mcq',
      question: "REFERENCE FRAMES: Which frame measures proper time for the spacecraft clock?",
      options: ["Earth frame", "Spacecraft frame", "Alpha Centauri frame", "Any inertial frame"],
      correctIndex: 1,
      explanation: "Proper time is always measured in the frame where the clock is at rest."
    },
    {
      type: 'numeric',
      question: "GAMMA: The spacecraft travels at 0.90c. Calculate γ.",
      answer: 2.294,
      tolerance: 0.01,
      explanation: "γ = 1 / √(1 - v²/c²) = 1 / √(1 - 0.9²) ≈ 2.294"
    },
    {
      type: 'numeric',
      question: "LORENTZ TRANSFORM: An event occurs at x=4.0 ly, t=5.0 yr in Earth frame. Find x' in spacecraft frame (v=0.9c).",
      answer: -1.147,
      tolerance: 0.1,
      explanation: "x' = γ(x - vt) = 2.294(4.0 - 0.9 * 5.0) = 2.294(4.0 - 4.5) = -1.147 ly"
    },
    {
      type: 'numeric',
      question: "TIME DILATION: Earth measures the journey takes 4.72 years. How long does the spacecraft clock read?",
      answer: 2.06,
      tolerance: 0.05,
      explanation: "Δt' = Δt / γ = 4.72 / 2.294 ≈ 2.06 years."
    },
    {
      type: 'numeric',
      question: "LENGTH CONTRACTION: Alpha Centauri is 4.25 ly from Earth. What distance does the spacecraft measure?",
      answer: 1.85,
      tolerance: 0.05,
      explanation: "L = L₀ / γ = 4.25 / 2.294 ≈ 1.85 ly."
    },
    {
      type: 'numeric',
      question: "VELOCITY ADDITION: The spacecraft launches a probe at 0.50c relative to itself. What speed does Earth measure (in c)?",
      answer: 0.965,
      tolerance: 0.01,
      explanation: "u = (v + u') / (1 + vu'/c²) = (0.90 + 0.50) / (1 + 0.90 * 0.50) = 1.40 / 1.45 ≈ 0.965c"
    },
    {
      type: 'mcq',
      question: "SIMULTANEITY: Two signals sent simultaneously in Earth frame from front and back of spacecraft. Are they simultaneous in spacecraft frame?",
      options: ["Yes", "No", "Depends on the observer's exact location"],
      correctIndex: 1,
      explanation: "Events that are simultaneous in one frame are not simultaneous in another frame moving relative to it."
    },
    {
      type: 'numeric',
      question: "SPACETIME: On a spacetime diagram (x vs ct), what angle does the spacecraft worldline make with the ct-axis (in degrees)?",
      answer: 41.98,
      tolerance: 0.5,
      explanation: "θ = arctan(v/c) = arctan(0.9) ≈ 41.98°"
    },
    {
      type: 'mcq',
      question: "LIGHT SIGNAL: A light signal is sent from Earth when the spacecraft departs. Can it reach Alpha Centauri before the spacecraft?",
      options: ["Yes, light is faster", "No, the spacecraft is moving at relativistic speeds", "They will arrive at the same time"],
      correctIndex: 0,
      explanation: "Light travels at c (1.0c), which is faster than the spacecraft's 0.90c."
    },
    {
      type: 'mcq',
      question: "INVARIANT: Calculate the spacetime interval between departure and arrival. Is it the same in both frames?",
      options: ["Yes, the interval is invariant", "No, it changes due to time dilation", "No, it changes due to length contraction"],
      correctIndex: 0,
      explanation: "The spacetime interval s² = (cΔt)² - (Δx)² is invariant across all inertial frames."
    }
  ];

  return (
    <SectionWrapper>
      <SectionHeader title="The Relativity Mission" subtitle="Prove your mastery of Special Relativity" />
      
      <div className="prose max-w-none text-slate-800 mb-8">
        <p>Scenario: A spacecraft travels from Earth to Alpha Centauri at relativistic speed. Solve the challenges to complete the mission.</p>
      </div>

      {currentStage === 10 ? (
        <CalloutCard type="success" title="RELATIVITY MISSION COMPLETE">
          <ul className="list-disc pl-5">
            {stages.map((stage, i) => (
              <li key={i} className="text-emerald-700">✓ {stage.question.split(':')[0]}</li>
            ))}
          </ul>
        </CalloutCard>
      ) : (
        <div className="space-y-6">
          {stages.map((stage, index) => {
            if (index > currentStage) {
              return (
                <div key={index} className="opacity-50 pointer-events-none p-4 border border-slate-200 rounded-lg bg-slate-100">
                  <h4 className="font-bold">Stage {index + 1}: Locked</h4>
                </div>
              );
            }
            if (index < currentStage) {
              return (
                <div key={index} className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                  <h4 className="font-bold text-emerald-700">✓ Stage {index + 1} Complete</h4>
                </div>
              );
            }
            
            // Active Stage
            return (
              <div key={index} className="p-4 border-2 border-violet-500 rounded-lg bg-white shadow-md transition-all">
                <h4 className="font-bold text-violet-700 mb-4">Stage {index + 1}</h4>
                {stage.type === 'mcq' ? (
                  <QuizCard
                    question={stage.question}
                    options={stage.options!}
                    correctIndex={stage.correctIndex!}
                    explanation={stage.explanation}
                    onCorrect={handleCorrect}
                  />
                ) : (
                  <NumericQuiz
                    question={stage.question}
                    targetValue={stage.answer!}
                    tolerance={stage.tolerance!}
                    explanation={stage.explanation}
                    onCorrect={handleCorrect}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <a href="#" className="text-blue-600">← Prev: Relativity Lab</a>
        <a href="#" className="text-blue-600">Next: Reflection →</a>
      </div>
    </SectionWrapper>
  );
};

export default FinalChallenge;
