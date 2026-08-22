import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ProgressState } from '@/types';

const STORAGE_KEY = 'relativity-lab-progress';

const defaultProgress: ProgressState = {
  completedLessons: [],
  completedQuizzes: [],
  completedExamples: [],
  completedChallenges: [],
  reflectionStatus: {},
  lastVisited: '/',
  startedAt: new Date().toISOString(),
};

function normalizeId(id?: string): string {
  if (!id) return '';
  const trimmed = id.trim();
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.completedLessons)) {
        parsed.completedLessons = Array.from(
          new Set(parsed.completedLessons.map((l: string) => normalizeId(l)).filter(Boolean))
        );
      }
      return { ...defaultProgress, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...defaultProgress };
}

function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export interface ProgressContextType {
  progress: ProgressState;
  completeLesson: (id?: string) => void;
  markComplete: (id?: string) => void;
  markSectionComplete: (id?: string) => void;
  completeQuiz: (id: string) => void;
  completeExample: (id: string) => void;
  completeChallenge: (id: string) => void;
  setReflection: (id: string, status: 'not-yet' | 'nearly' | 'ready') => void;
  setLastVisited: (route: string) => void;
  resetProgress: () => void;
  completedCount: number;
  totalLessons: number;
  progressPercent: number;
  isLessonComplete: (id: string) => boolean;
  isQuizComplete: (id: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((rawId?: string) => {
    const id = normalizeId(rawId);
    if (!id) return;
    setProgress(prev => {
      const current = prev.completedLessons.map(normalizeId);
      if (current.includes(id)) return prev;
      return { ...prev, completedLessons: Array.from(new Set([...current, id])) };
    });
  }, []);

  const markComplete = completeLesson;
  const markSectionComplete = completeLesson;

  const completeQuiz = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.completedQuizzes.includes(id)) return prev;
      return { ...prev, completedQuizzes: [...prev.completedQuizzes, id] };
    });
  }, []);

  const completeExample = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.completedExamples.includes(id)) return prev;
      return { ...prev, completedExamples: [...prev.completedExamples, id] };
    });
  }, []);

  const completeChallenge = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(id)) return prev;
      return { ...prev, completedChallenges: [...prev.completedChallenges, id] };
    });
  }, []);

  const setReflection = useCallback((id: string, status: 'not-yet' | 'nearly' | 'ready') => {
    setProgress(prev => ({
      ...prev,
      reflectionStatus: { ...prev.reflectionStatus, [id]: status },
    }));
  }, []);

  const setLastVisited = useCallback((route: string) => {
    setProgress(prev => ({ ...prev, lastVisited: route }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress, startedAt: new Date().toISOString() };
    setProgress(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const totalLessons = 14;
  const uniqueLessons = Array.from(new Set(progress.completedLessons.map(normalizeId).filter(Boolean)));
  const completedCount = Math.min(uniqueLessons.length, totalLessons);
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const value: ProgressContextType = {
    progress,
    completeLesson,
    markComplete,
    markSectionComplete,
    completeQuiz,
    completeExample,
    completeChallenge,
    setReflection,
    setLastVisited,
    resetProgress,
    completedCount,
    totalLessons,
    progressPercent,
    isLessonComplete: (rawId: string) => uniqueLessons.includes(normalizeId(rawId)),
    isQuizComplete: (id: string) => progress.completedQuizzes.includes(id),
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
