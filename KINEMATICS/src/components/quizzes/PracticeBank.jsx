import { useState } from 'react';
import { MathBlock } from '../math/MathBlock';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const PracticeBank = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const questions = [
    {
      id: 'p1',
      category: 'foundations',
      categoryLabel: 'Motion Foundations',
      title: 'Average Speed of Remainder Journey',
      problem: 'A car must be driven a distance of 120 km in 2.5 h. During the first 1.5 h, the average speed was 70 km/h. Calculate the average speed required for the remainder of the journey.',
      solutionMath: 'v_{\\text{remainder}} = \\frac{120 - (70 \\times 1.5)}{2.5 - 1.5} = \\frac{120 - 105}{1.0} = 15 \\text{ km/h}',
      explanation: 'First compute the distance covered in the first 1.5 hours: d1 = 70 * 1.5 = 105 km. Remaining distance = 120 - 105 = 15 km. Remaining time = 2.5 - 1.5 = 1.0 h. Average speed needed = 15 / 1.0 = 15 km/h.'
    },
    {
      id: 'p2',
      category: 'suvat',
      categoryLabel: 'Kinematics Equations',
      title: 'Deceleration and Reaction Time',
      problem: 'A car is travelling at 40.0 m/s. The driver sees an emergency ahead and 0.50 s later slams on the brakes (deceleration a = -4.0 m/s²). Calculate: (a) total distance to stop, and (b) stopping distance without reaction time.',
      solutionMath: '(a) \\, d_{\\text{total}} = (40 \\times 0.5) + \\frac{0^2 - 40^2}{2(-4)} = 20 + 200 = 220 \\text{ m}',
      explanation: 'During 0.5s reaction time, car moves at constant 40 m/s: d_reaction = 40 * 0.5 = 20 m. Braking distance: v² = u² + 2ad => 0 = 40² + 2(-4)d_brake => d_brake = 200 m. Total = 220 m. Without reaction time = 200 m.'
    },
    {
      id: 'p3',
      category: 'suvat',
      categoryLabel: 'Kinematics Equations',
      title: 'Two Particles Falling with Time Delay',
      problem: 'Two balls are dropped from rest from the same height. Ball Y is dropped 1.00 s after Ball X. Find the distance separating the two balls 2.00 s after Ball Y is dropped.',
      solutionMath: '\\Delta y = y_X(3) - y_Y(2) = \\frac{1}{2}(9.81)(3^2) - \\frac{1}{2}(9.81)(2^2) = 44.14 - 19.62 = 24.5 \\text{ m}',
      explanation: 'When Y has been falling for 2.0 s, X has been falling for t = 3.0 s. Distance X = 0.5 * g * 3² = 4.5g. Distance Y = 0.5 * g * 2² = 2g. Separation = 2.5g = 24.5 m.'
    },
    {
      id: 'p4',
      category: 'projectile',
      categoryLabel: 'Projectile Motion',
      title: 'Angled Launch Maximum Height & Range',
      problem: 'A projectile is launched with speed u = 25.0 m/s at θ = 32.0° above horizontal (g = 9.81 m/s²). Determine: (a) maximum height reached, and (b) total range.',
      solutionMath: 'y_{\\max} = \\frac{(25 \\sin 32^\\circ)^2}{2(9.81)} = 8.95 \\text{ m}, \\quad R = \\frac{25^2 \\sin 64^\\circ}{9.81} = 57.3 \\text{ m}',
      explanation: 'Vertical velocity component u_y = 25 sin(32°) = 13.25 m/s. y_max = u_y² / (2g) = 8.95 m. Range R = u² sin(2θ) / g = 57.3 m.'
    },
    {
      id: 'p5',
      category: 'drag',
      categoryLabel: 'Fluid Resistance',
      title: 'Linear Drag Mass Determination',
      problem: 'A falling object experiences air resistance F = 0.653v. If its terminal speed is measured to be 30.0 m/s, determine the mass of the object (g = 9.81 m/s²).',
      solutionMath: 'mg = kv_T \\implies m = \\frac{k v_T}{g} = \\frac{0.653 \\times 30.0}{9.81} \\approx 2.0 \\text{ kg}',
      explanation: 'At terminal speed, air resistance equals weight force: kv_T = mg. Solving for m: m = (0.653 * 30.0) / 9.81 = 2.0 kg.'
    }
  ];

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="my-8 p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-1">
            <BookOpen className="w-4 h-4" /> Practice Suite
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">CHAPTER PRACTICE BANK</h2>
          <p className="text-xs text-slate-600">
            Categorized IB-style practice problems from basic foundations to multi-stage kinematics equations and projectiles.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex-wrap">
          {[
            { id: 'all', label: 'All Problems' },
            { id: 'foundations', label: 'Foundations' },
            { id: 'suvat', label: 'SUVAT Equations' },
            { id: 'projectile', label: 'Projectiles' },
            { id: 'drag', label: 'Fluid Resistance' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedCategory === cat.id ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;

          return (
            <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                  {q.categoryLabel}
                </span>
                <h3 className="text-sm font-bold text-slate-900 flex-1 ml-3">{q.title}</h3>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{q.problem}</p>

              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 transition-colors pt-1"
              >
                {isExpanded ? 'Hide Solution' : 'Reveal Worked Solution'}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isExpanded && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 animate-fadeIn">
                  <div className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Worked Calculation
                  </div>
                  <MathBlock math={q.solutionMath} />
                  <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
