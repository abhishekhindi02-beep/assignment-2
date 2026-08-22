import { useProgressContext } from '@/context/ProgressContext';

export function useProgress() {
  return useProgressContext();
}

export default useProgress;
