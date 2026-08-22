/** Types for the Relativity Lab application */

export interface Section {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  route: string;
  lessons: string[];
  icon: string;
}

export interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
  symbols: { symbol: string; meaning: string; unit?: string }[];
  section: string;
  usage: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  type: 'multiple-choice' | 'numeric' | 'conceptual' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  latex?: string;
}

export interface WorkedExample {
  id: string;
  section: string;
  title: string;
  scenario: string;
  steps: WorkedStep[];
  finalAnswer: string;
}

export interface WorkedStep {
  label: string;
  description: string;
  latex?: string;
  explanation?: string;
}

export interface Misconception {
  id: string;
  section: string;
  myth: string;
  correction: string;
  explanation: string;
}

export interface ExamTip {
  id: string;
  section: string;
  tip: string;
  context?: string;
}

export interface ProgressState {
  completedLessons: string[];
  completedQuizzes: string[];
  completedExamples: string[];
  completedChallenges: string[];
  reflectionStatus: Record<string, 'not-yet' | 'nearly' | 'ready'>;
  lastVisited: string;
  startedAt: string;
}

export interface SpacetimeEvent {
  x: number;
  ct: number;
  label?: string;
  color?: string;
}

export interface Worldline {
  events: SpacetimeEvent[];
  velocity: number; // as fraction of c
  label?: string;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export type IntervalType = 'timelike' | 'spacelike' | 'lightlike';

export interface TransformResult {
  x: number;
  t: number;
  xPrime: number;
  tPrime: number;
  gamma: number;
  velocity: number;
}
