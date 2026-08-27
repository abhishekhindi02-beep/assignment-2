import { useState } from 'react';
import { Trophy, Award, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const MotionMission = () => {
  const { updateMissionScore } = useProgress();

  const [currentStage, setCurrentStage] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const stages = [
    {
      stage: 1,
      title: "Stage 1: Position & Displacement",
      question: "A cyclist travels 12 km East, turns around, and cycles 20 km West. What is their final displacement?",
      options: ["-8 km (West)", "+32 km (East)", "+8 km (East)", "-32 km (West)"],
      correct: 0,
      explanation: "Displacement is change in position: Δs = s_final - s_initial = (+12 km) - 20 km = -8 km (8 km West)."
    },
    {
      stage: 2,
      title: "Stage 2: Speed vs Velocity",
      question: "In the round-trip motion above taking 2.0 hours total, what is the cyclist's average speed vs average velocity?",
      options: [
        "Average speed = 16 km/h; Average velocity = -4.0 km/h",
        "Average speed = -4.0 km/h; Average velocity = 16 km/h",
        "Average speed = 32 km/h; Average velocity = 0 km/h",
        "Average speed = 8.0 km/h; Average velocity = -8.0 km/h"
      ],
      correct: 0,
      explanation: "Average speed = Total Distance / Time = (12+20)/2 = 16 km/h. Average velocity = Displacement / Time = (-8)/2 = -4.0 km/h."
    },
    {
      stage: 3,
      title: "Stage 3: SUVAT Acceleration",
      question: "A sports car accelerates from u = 5.0 m/s to v = 25 m/s over a displacement of Δs = 60 m. What is its acceleration?",
      options: ["a = 5.0 m/s²", "a = 2.5 m/s²", "a = 4.0 m/s²", "a = 10 m/s²"],
      correct: 0,
      explanation: "Use v² = u² + 2aΔs => 25² = 5² + 2a(60) => 625 = 25 + 120a => 600 = 120a => a = 5.0 m/s²."
    },
    {
      stage: 4,
      title: "Stage 4: Kinematics Equation Selection",
      question: "A rocket engine shuts off, and the rocket coasts upward under gravity (g = 9.81 m/s²). Which equation directly gives time to reach apex without needing displacement?",
      options: [
        "v = u + at",
        "v² = u² + 2aΔs",
        "Δs = ut + ½at²",
        "Δs = ((u+v)/2)t"
      ],
      correct: 0,
      explanation: "At apex, vertical velocity v = 0. Substituting into v = u + at gives 0 = u - gt => t = u/g directly!"
    },
    {
      stage: 5,
      title: "Stage 5: Position-Time Concavity",
      question: "On a position-time graph (s-t), what does a parabola that opens downward (concave down) indicate?",
      options: [
        "Negative acceleration (a < 0)",
        "Positive acceleration (a > 0)",
        "Constant velocity (a = 0)",
        "Zero velocity at all times"
      ],
      correct: 0,
      explanation: "Concave down curves on s-t graphs have decreasing gradients, indicating negative acceleration (a < 0)."
    },
    {
      stage: 6,
      title: "Stage 6: Area Under Velocity-Time Curve",
      question: "On a v-t graph, a triangle with base 4 s and height 12 m/s represents an object's motion. What is the displacement?",
      options: ["24 m", "48 m", "12 m", "3 m"],
      correct: 0,
      explanation: "Area of triangle = ½ * base * height = ½ * 4 * 12 = 24 m."
    },
    {
      stage: 7,
      title: "Stage 7: Projectile Velocity Components",
      question: "A soccer ball is kicked at u = 20 m/s at an angle θ = 30° to the horizontal. What are the horizontal (u_x) and vertical (u_y) initial components?",
      options: [
        "u_x = 17.3 m/s, u_y = 10.0 m/s",
        "u_x = 10.0 m/s, u_y = 17.3 m/s",
        "u_x = 20.0 m/s, u_y = 0 m/s",
        "u_x = 14.1 m/s, u_y = 14.1 m/s"
      ],
      correct: 0,
      explanation: "u_x = u cos(30°) = 20 * 0.866 = 17.3 m/s. u_y = u sin(30°) = 20 * 0.5 = 10.0 m/s."
    },
    {
      stage: 8,
      title: "Stage 8: Projectile Apex Kinetic Energy",
      question: "A cannonball is launched with initial kinetic energy K at an angle of 60° to the horizontal. What is its kinetic energy at the highest point of its trajectory?",
      options: ["K / 4", "K / 2", "Zero", "3K / 4"],
      correct: 0,
      explanation: "At apex, v_y = 0 so total speed is v_x = u cos(60°) = 0.5 u. KE_apex = ½ m (0.5 u)² = ¼ (½ m u²) = K / 4."
    },
    {
      stage: 9,
      title: "Stage 9: Air Resistance Trajectory Impact",
      question: "How does fluid resistance (air resistance) alter a projectile's trajectory compared to a vacuum parabolic path?",
      options: [
        "Smaller maximum height, shorter range, asymmetrical trajectory, and steeper landing angle.",
        "Symmetrical trajectory with larger range.",
        "Identical trajectory but slower flight time.",
        "Parabolic path with higher apex."
      ],
      correct: 0,
      explanation: "Air resistance constantly opposes velocity, reducing both range and apex while causing an asymmetrical steeper descent."
    },
    {
      stage: 10,
      title: "Stage 10: Terminal Speed Equilibrium",
      question: "A skydiver of mass m falls through air with linear drag force F = kv. What condition defines terminal speed v_T?",
      options: [
        "F_drag = mg => Acceleration becomes zero (a = 0) and speed stays constant at v_T = mg/k.",
        "F_drag = 0 => Speed reaches light speed.",
        "Acceleration reaches maximum value g.",
        "Velocity reaches zero."
      ],
      correct: 0,
      explanation: "Terminal speed occurs when drag force balances weight (kv_T = mg), producing zero net force and zero acceleration!"
    }
  ];

  const currentData = stages[currentStage];

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitStage = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setUserAnswers((prev) => ({
      ...prev,
      [currentStage]: selectedOption
    }));
  };

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Calculate final score
      let score = 0;
      stages.forEach((stg, i) => {
        if (userAnswers[i] === stg.correct) score += 10;
      });
      setIsFinished(true);
      updateMissionScore(score, true);
    }
  };

  const handleRestartMission = () => {
    setCurrentStage(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsFinished(false);
  };

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4" /> Signature Feature #7
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">THE MOTION MISSION</h2>
          <p className="text-xs text-slate-600">
            10-Stage integrated final challenge covering the complete Chapter 1 Kinematics curriculum.
          </p>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-2">
            <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all rounded-full"
                style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-sky-700">
              {currentStage + 1}/{stages.length}
            </span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Stage Question Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              {currentData.title}
            </span>
            <h3 className="text-base font-bold text-slate-900">{currentData.question}</h3>

            <div className="space-y-2 pt-2">
              {currentData.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentData.correct;

                let style = "border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium";
                if (isSelected) {
                  style = "border-sky-500 bg-sky-50 text-sky-900 font-bold";
                }
                if (isSubmitted) {
                  if (isCorrect) {
                    style = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                  } else if (isSelected && !isCorrect) {
                    style = "border-rose-500 bg-rose-50 text-rose-900 font-medium";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${style}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission and Navigation Controls */}
          <div className="flex items-center justify-between">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitStage}
                disabled={selectedOption === null}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedOption !== null
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95"
              >
                {currentStage < stages.length - 1 ? 'Next Stage' : 'Complete Mission'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Explanation Modal */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1 animate-fadeIn">
              <span className="font-bold text-sky-700">Solution Analysis: </span>
              <span>{currentData.explanation}</span>
            </div>
          )}
        </div>
      ) : (
        /* Final Mission Completed Score Screen */
        <div className="p-8 text-center space-y-6 bg-slate-50 rounded-2xl border border-sky-200 animate-fadeIn">
          <Award className="w-16 h-16 text-sky-600 mx-auto animate-bounce" />
          <h2 className="text-3xl font-extrabold text-slate-900">MOTION MISSION COMPLETED!</h2>

          {(() => {
            let finalScore = 0;
            stages.forEach((stg, i) => {
              if (userAnswers[i] === stg.correct) finalScore += 10;
            });

            return (
              <div className="space-y-2">
                <div className="text-4xl font-black text-sky-700">
                  {finalScore} / 100 PTS
                </div>
                <p className="text-sm text-slate-600">
                  {finalScore >= 80
                    ? "Exceptional physics mastery! You are fully exam-ready for Chapter 1 Kinematics."
                    : "Great effort! Review weak modules and attempt the mission again to reach 100%."}
                </p>
              </div>
            );
          })()}

          <button
            onClick={handleRestartMission}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-xs"
          >
            <RotateCcw className="w-4 h-4" /> Re-attempt Motion Mission
          </button>
        </div>
      )}
    </div>
  );
};
