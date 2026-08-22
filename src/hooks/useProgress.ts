import { useState, useEffect, useCallback } from 'react';
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

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch { /* ignore */ }
  return { ...defaultProgress };
}

function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((id?: string) => {
    if (!id) return;
    setProgress(prev => {
      if (prev.completedLessons.includes(id)) return prev;
      return { ...prev, completedLessons: [...prev.completedLessons, id] };
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
    setProgress({ ...defaultProgress, startedAt: new Date().toISOString() });
  }, []);

  const totalLessons = 14;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return {
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
    isLessonComplete: (id: string) => progress.completedLessons.includes(id),
    isQuizComplete: (id: string) => progress.completedQuizzes.includes(id),
  };
}

export default useProgress;
