import { MathInline } from '../math/MathBlock';
import {
  DefinitionCallout,
  FormulaCard,
  ExamTipCallout,
  MisconceptionCard,
  NatureOfScience,
  TheoryOfKnowledge,
  KnowledgeTransfer
} from '../callouts/Callouts';
import { WorkedExampleCard, EquationSelector } from '../worked-examples/WorkedExampleCard';
import { MotionStudio } from '../interactive/MotionStudio';
import { PositionTracker } from '../interactive/PositionTracker';
import { GraphTranslationStudio } from '../interactive/GraphTranslationStudio';
import { ProjectileLab } from '../interactive/ProjectileLab';
import { VerticalMotionLab } from '../interactive/VerticalMotionLab';
import { DragTerminalLab } from '../interactive/DragTerminalLab';
import { MotionInvestigator } from '../interactive/MotionInvestigator';
import { MotionMission } from '../interactive/MotionMission';
import { ConceptCheck } from '../quizzes/ConceptCheck';
import { PracticeBank } from '../quizzes/PracticeBank';
import { SelfAssessment } from '../quizzes/SelfAssessment';
import { Sparkles, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

// -------------------------------------------------------------
// 01. HOME / CHAPTER LANDING VIEW
// -------------------------------------------------------------
export const HomeView = ({ onNavigate }) => {
  const { markSectionComplete } = useProgress();

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="p-8 rounded-3xl bg-white border border-sky-200 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Physics Web Module
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            MOTION IS A STORY.
          </h1>

          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            An object's position changes. Its velocity tells us how. Its acceleration tells us how velocity changes. Graphs let us see the entire story.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                markSectionComplete('intro');
                onNavigate('position');
              }}
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              Enter Motion Studio <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Tagline: "See motion. Measure motion. Understand motion."
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" /> Learning Objectives
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Distinguish displacement vs distance and speed vs velocity.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Define instantaneous velocity and acceleration as derivatives (gradients).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Solve constant-acceleration motion problems using the 4 kinematics (SUVAT) equations.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Analyse s-t, v-t, and a-t graphs using slope (gradient) and area under curves.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Describe 2D projectile trajectories using independent x and y components.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">•</span> Explain qualitative fluid resistance forces and terminal speed behavior.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" /> Guiding IB Questions
          </h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-indigo-800">1. Which equations describe the motion of an object?</p>
              <p className="text-slate-600 mt-1">Understanding when constant velocity vs constant acceleration formulas apply.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-indigo-800">2. How does graphical analysis help describe motion?</p>
              <p className="text-slate-600 mt-1">Extracting rate of change (gradient) and accumulated change (area) visually.</p>
            </div>
          </div>
        </div>
      </div>

      <MotionStudio />
    </div>
  );
};

// -------------------------------------------------------------
// 02. DISPLACEMENT & DISTANCE VIEW
// -------------------------------------------------------------
export const DisplacementDistanceView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Module 02 — Section 1.1</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Displacement & Distance
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Understanding 1D coordinate systems, position vectors, and the fundamental distinction between scalar distance and vector displacement.
        </p>
      </div>

      <DefinitionCallout
        term="Position"
        symbol="x, y, or s"
        definition="The coordinate location of a particle on a straight line relative to an arbitrarily chosen origin zero point."
        vector={true}
      />

      <DefinitionCallout
        term="Displacement"
        symbol="Δs = s_final - s_initial"
        definition="The overall change in position of a particle. Displacement is a vector quantity specifying both magnitude and directional sign."
        vector={true}
      />

      <DefinitionCallout
        term="Distance"
        symbol="d"
        definition="The actual total length of the path followed by a moving particle. Distance is a non-negative scalar quantity."
        vector={false}
      />

      <PositionTracker />

      <MisconceptionCard
        misconception="Distance and displacement are always equal in magnitude."
        reality="Distance equals displacement magnitude ONLY when motion occurs strictly in a single direction without reversing!"
        explanation="If a runner moves 12m East to +12m and then turns back 20m West to -8m, total distance is 12 + 20 = 32m, but net displacement is -8m."
      />

      <ConceptCheck
        id="check_dist_disp"
        question="A particle moves from initial position s_i = +10m to final position s_f = -5m. What is its displacement?"
        options={["-15 m", "+15 m", "5 m", "-5 m"]}
        correctIndex={0}
        explanation="Displacement Δs = s_final - s_initial = (-5m) - (+10m) = -15m (15 meters in the negative direction)."
      />
    </div>
  );
};

// -------------------------------------------------------------
// 03. SPEED & VELOCITY VIEW
// -------------------------------------------------------------
export const SpeedVelocityView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Module 03 — Section 1.1</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Speed & Velocity
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Distinguishing average speed from average velocity, uniform motion equations, and area under velocity-time graphs.
        </p>
      </div>

      <DefinitionCallout
        term="Average Velocity"
        symbol="v_avg = Δs / Δt"
        definition="The net displacement achieved divided by the total time taken. Velocity is a vector quantity."
        vector={true}
      />

      <DefinitionCallout
        term="Average Speed"
        symbol="Average Speed = Total Distance / Total Time"
        definition="The total path length travelled divided by total elapsed time. Average speed is a scalar quantity."
        vector={false}
      />

      <FormulaCard
        title="Uniform Motion Position Formula"
        formula="s = s_i + vt"
        condition="Applies ONLY when velocity v is constant (a = 0)"
        variables={{
          s: 'Final position (m)',
          s_i: 'Initial position (m)',
          v: 'Constant velocity (m/s)',
          t: 'Elapsed time (s)'
        }}
        derivation="From v = (s - s_i)/t => s - s_i = vt => s = s_i + vt. Graphically, position vs time is a straight line, and velocity vs time is a horizontal line!"
      />

      <ExamTipCallout>
        Remember: the area under a velocity-time graph equals the displacement (<MathInline math="\Delta s = \text{Area under } v\text{-}t" />). In uniform motion, this area is simply a rectangle of height <MathInline math="v" /> and width <MathInline math="t" />!
      </ExamTipCallout>

      <WorkedExampleCard
        exampleId="WORKED EXAMPLE 1.1"
        title="Cyclists Meeting Problem"
        problem="Two cyclists A and B start moving at the same time. Initial position of A is 0 km with velocity +20 km/h. Initial position of B is 150 km away, cycling at velocity -30 km/h. Determine when and where they meet."
        steps={[
          {
            stepTitle: "Write Position Functions",
            description: "Write position equations for both cyclists using s = s_i + vt.",
            math: "s_A = 0 + 20t, \\quad s_B = 150 - 30t"
          },
          {
            stepTitle: "Set Positions Equal",
            description: "They meet when s_A = s_B.",
            math: "20t = 150 - 30t \\implies 50t = 150 \\implies t = 3.0 \\text{ hours}"
          },
          {
            stepTitle: "Find Meeting Position & Displacements",
            description: "Substitute t = 3.0h back into either position equation.",
            math: "s = 20 \\times 3.0 = 60 \\text{ km}. \\quad \\Delta s_A = +60 \\text{ km}, \\quad \\Delta s_B = -90 \\text{ km}."
          }
        ]}
        finalAnswer="t = 3.0 \\text{ h}, \\quad s = 60 \\text{ km}"
      />

      <ConceptCheck
        id="check_speed_vel"
        question="An object travels from point A to B at 15 m/s and returns from B to A at 30 m/s. What is the average speed for the round trip?"
        options={["20 m/s", "22.5 m/s", "0 m/s", "15 m/s"]}
        correctIndex={0}
        explanation="Let d be distance A to B. Outward time t1 = d/15, return time t2 = d/30. Total distance = 2d. Total time = d/15 + d/30 = 3d/30 = d/10. Average speed = 2d / (d/10) = 20 m/s!"
      />
    </div>
  );
};

// -------------------------------------------------------------
// 04. ACCELERATION VIEW
// -------------------------------------------------------------
export const AccelerationView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Module 04 — Section 1.2</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Acceleration & Rate of Change of Velocity
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Defining average vs instantaneous acceleration, gradient of velocity-time curves, and positive vs negative acceleration.
        </p>
      </div>

      <DefinitionCallout
        term="Average Acceleration"
        symbol="a_avg = Δv / Δt"
        definition="The change in velocity divided by the total time taken for that change."
        vector={true}
      />

      <DefinitionCallout
        term="Instantaneous Acceleration"
        symbol="a = lim (Δt→0) Δv/Δt"
        definition="The rate of change of velocity at an exact instant of time. Graphically, it is the gradient of a velocity-time graph."
        vector={true}
      />

      <MisconceptionCard
        misconception="Negative acceleration always means an object is slowing down."
        reality="Negative acceleration means acceleration is directed towards the negative direction!"
        explanation="If an object has negative velocity (moving left) AND negative acceleration, it is actually SPEEDING UP in the negative direction!"
      />

      <WorkedExampleCard
        exampleId="WORKED EXAMPLE 1.2"
        title="Particle Instantaneously Brought to Rest"
        problem="A particle has an initial velocity u = 12 m/s and moves with constant acceleration a = -3.0 m/s². Determine the time at which the particle stops instantaneously."
        steps={[
          {
            stepTitle: "Identify Given Quantities",
            description: "u = 12 m/s, a = -3.0 m/s², v = 0 m/s (instantaneous rest).",
            math: "u = 12 \\text{ m/s}, \\quad a = -3.0 \\text{ m/s}^2, \\quad v = 0 \\text{ m/s}"
          },
          {
            stepTitle: "Apply Formula v = u + at",
            description: "Substitute known values into v = u + at and solve for t.",
            math: "0 = 12 + (-3.0)t \\implies 3.0t = 12 \\implies t = 4.0 \\text{ s}"
          }
        ]}
        finalAnswer="t = 4.0 \\text{ s}"
      />

      <ConceptCheck
        id="check_accel"
        question="A fighter jet accelerates from v1 = 2.0 m/s to v2 = 8.0 m/s in a time of 3.0 s. What is its average acceleration?"
        options={["2.0 m/s²", "3.0 m/s²", "6.0 m/s²", "18.0 m/s²"]}
        correctIndex={0}
        explanation="Average acceleration a = (v2 - v1)/t = (8.0 - 2.0)/3.0 = 6.0/3.0 = 2.0 m/s²."
      />
    </div>
  );
};

// -------------------------------------------------------------
// 05. KINEMATICS EQUATIONS VIEW
// -------------------------------------------------------------
export const KinematicsEquationsView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Module 05 — Section 1.2</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Kinematics Equations & Free Fall
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          The four fundamental SUVAT equations for constant acceleration, equation selection tools, and vertical motion under gravity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormulaCard title="Equation 1 (No Displacement)" formula="v = u + at" condition="Constant Acceleration" />
        <FormulaCard title="Equation 2 (No Acceleration)" formula="\Delta s = \left(\frac{u+v}{2}\right)t" condition="Constant Acceleration" />
        <FormulaCard title="Equation 3 (No Final Velocity)" formula="\Delta s = ut + \frac{1}{2}at^2" condition="Constant Acceleration" />
        <FormulaCard title="Equation 4 (No Time)" formula="v^2 = u^2 + 2a\Delta s" condition="Constant Acceleration" />
      </div>

      <EquationSelector />

      <VerticalMotionLab />

      <WorkedExampleCard
        exampleId="WORKED EXAMPLE 1.9"
        title="Vertical Throw From Cliff"
        problem="An object is thrown vertically upwards with u = 20 m/s from a cliff edge 25 m above the sea. Determine: (a) maximum height above cliff, and (b) total time to hit the sea (g = 10 m/s²)."
        steps={[
          {
            stepTitle: "Find Maximum Height",
            description: "At max height, v = 0. Use v² = u² - 2gy.",
            math: "0 = 20^2 - 2(10)y \\implies 20y = 400 \\implies y = 20 \\text{ m}"
          },
          {
            stepTitle: "Set Up Sea Level Position",
            description: "At sea level, y = -25 m. Use y = ut - ½gt².",
            math: "-25 = 20t - 5t^2 \\implies 5t^2 - 20t - 25 = 0 \\implies t^2 - 4t - 5 = 0"
          },
          {
            stepTitle: "Solve Quadratic Equation",
            description: "Factorize (t - 5)(t + 1) = 0. Choose positive root.",
            math: "t = 5.0 \\text{ seconds}"
          }
        ]}
        finalAnswer="y_{\\max} = 20 \\text{ m}, \\quad t = 5.0 \\text{ s}"
      />
    </div>
  );
};

// -------------------------------------------------------------
// 06. MOTION GRAPHS & TRANSLATION VIEW
// -------------------------------------------------------------
export const MotionGraphsView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Module 06 — Section 1.3</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Motion Graphs & Graph Translation Studio
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Analyzing gradients (derivatives) and areas (integrals) to convert between s-t, v-t, and a-t graphs.
        </p>
      </div>

      <GraphTranslationStudio />

      <TheoryOfKnowledge
        question="How do we determine motion when acceleration is NOT constant?"
        discussion="When acceleration changes with time, constant-acceleration SUVAT equations fail! We must rely on graphical calculus: calculating instantaneous velocity as the gradient of s-t, acceleration as gradient of v-t, and displacement as area under v-t!"
      />

      <ConceptCheck
        id="check_graphs"
        question="What does the gradient of a position-against-time (s-t) graph represent?"
        options={["Instantaneous Velocity", "Acceleration", "Displacement", "Total Distance"]}
        correctIndex={0}
        explanation="The slope (gradient) of an s-t graph equals rate of change of position, which is instantaneous velocity (v = ds/dt)!"
      />
    </div>
  );
};

// -------------------------------------------------------------
// 07. PROJECTILE MOTION & LAB VIEW
// -------------------------------------------------------------
export const ProjectileMotionView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Module 07 — Section 1.4</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Projectile Motion & Projectile Lab
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Analyzing 2D trajectories using independent horizontal (constant velocity) and vertical (free fall) motion components.
        </p>
      </div>

      <FormulaCard
        title="Horizontal and Vertical Motion Decomposition"
        formula="u_x = u\cos\theta, \\quad u_y = u\sin\theta, \\quad x(t) = ut\cos\theta, \\quad y(t) = ut\sin\theta - \\frac{1}{2}gt^2"
        condition="Neglecting Air Resistance"
        variables={{
          u_x: 'Constant horizontal velocity (m/s)',
          u_y: 'Initial vertical velocity (m/s)',
          x: 'Horizontal displacement (m)',
          y: 'Vertical height (m)'
        }}
      />

      <ProjectileLab />

      <KnowledgeTransfer
        title="Parabolic Motion in Uniform Electric Fields"
        connection="Just as a gravitational field exerts a constant downward force (F = mg) producing parabolic projectile trajectories, an electric charge in a uniform electric field experiences a constant electrostatic force (F = qE) producing identical parabolic arcs!"
        topicLink="IB Physics Chapter 19 Connection"
      />
    </div>
  );
};

// -------------------------------------------------------------
// 08. FLUID RESISTANCE & TERMINAL SPEED VIEW
// -------------------------------------------------------------
export const FluidResistanceView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-rose-700 uppercase tracking-widest">Module 08 — Qualitative Physics</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Fluid Resistance & Terminal Speed
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Linear (F = kv) and quadratic (F = kv²) drag forces, terminal velocity equilibrium, and asymmetric projectile paths.
        </p>
      </div>

      <DragTerminalLab />

      <NatureOfScience title="The Simple and the Complex">
        Careful observation of motion leads to simple constant-acceleration equations. However, real-world motion like a falling leaf is complex due to changing air resistance, orientation shifts, and wind turbulence. Learning physics principles in simple contexts allows us to apply them to complex systems!
      </NatureOfScience>
    </div>
  );
};

// -------------------------------------------------------------
// 09. MOTION INVESTIGATOR VIEW
// -------------------------------------------------------------
export const MotionInvestigatorView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-violet-700 uppercase tracking-widest">Module 09 — Data Inquiry</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Motion Investigator
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Mini-lab for inferring qualitative motion features directly from graph curves and data before calculating.
        </p>
      </div>

      <MotionInvestigator />
    </div>
  );
};

// -------------------------------------------------------------
// 10. PRACTICE BANK VIEW
// -------------------------------------------------------------
export const PracticeBankView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Module 10 — Practice Suite</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Complete Practice Bank
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Comprehensive IB Physics practice bank categorized by topic with full worked calculations.
        </p>
      </div>

      <PracticeBank />
    </div>
  );
};

// -------------------------------------------------------------
// 11. FINAL MOTION MISSION VIEW
// -------------------------------------------------------------
export const MotionMissionView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">Module 11 — Final Challenge</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          The Motion Mission
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Integrated 10-stage end-of-chapter assessment testing your complete mastery of Kinematics.
        </p>
      </div>

      <MotionMission />
    </div>
  );
};

// -------------------------------------------------------------
// 12. REFLECTION & SELF-ASSESSMENT VIEW
// -------------------------------------------------------------
export const ReflectionView = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Module 12 — Evaluation</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Self-Assessment & Chapter Reflection
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Interactive syllabus objective checklist and deep conceptual reflection prompts.
        </p>
      </div>

      <SelfAssessment />
    </div>
  );
};
