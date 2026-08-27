/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

const STORAGE_KEY = 'kinematics_lab_progress_v1';

const initialProgress = {
  completedSections: [], // e.g. ['1.1', '1.2']
  completedQuizzes: {},  // e.g. { 'check-1': true }
  selfAssessment: {},   // e.g. { '1.1': 'ready' }
  missionScore: 0,
  missionCompleted: false,
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProgress;
    } catch {
      return initialProgress;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [progress]);

  const markSectionComplete = (sectionId) => {
    setProgress((prev) => {
      if (prev.completedSections.includes(sectionId)) return prev;
      return {
        ...prev,
        completedSections: [...prev.completedSections, sectionId]
      };
    });
  };

  const setQuizCompleted = (quizId, score) => {
    setProgress((prev) => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [quizId]: score
      }
    }));
  };

  const updateSelfAssessment = (itemId, rating) => {
    setProgress((prev) => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        [itemId]: rating
      }
    }));
  };

  const updateMissionScore = (score, isComplete) => {
    setProgress((prev) => ({
      ...prev,
      missionScore: Math.max(prev.missionScore, score),
      missionCompleted: prev.missionCompleted || isComplete
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markSectionComplete,
        setQuizCompleted,
        updateSelfAssessment,
        updateMissionScore,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
