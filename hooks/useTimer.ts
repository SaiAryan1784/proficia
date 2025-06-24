"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isExpired: boolean;
  timeSpent: number; // in seconds
  progress: number; // percentage (0-100)
}

export function useTimer(initialTimeInMinutes?: number) {
  const [state, setState] = useState<TimerState>({
    timeRemaining: initialTimeInMinutes ? initialTimeInMinutes * 60 : 0,
    isRunning: false,
    isExpired: false,
    timeSpent: 0,
    progress: 0,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef(initialTimeInMinutes ? initialTimeInMinutes * 60 : 0);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      timeRemaining: initialTimeRef.current,
      timeSpent: 0,
      progress: 0,
      isExpired: false,
    }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  useEffect(() => {
    if (state.isRunning && !state.isExpired) {
      intervalRef.current = setInterval(() => {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          return;
        }
        
        setState(prev => {
          const newTimeSpent = prev.timeSpent + 1;
          const newTimeRemaining = initialTimeInMinutes 
            ? Math.max(0, initialTimeRef.current - newTimeSpent)
            : 0;
          
          const progress = initialTimeInMinutes 
            ? ((initialTimeRef.current - newTimeRemaining) / initialTimeRef.current) * 100
            : (newTimeSpent / 3600) * 100; // For untimed tests, show progress based on time spent
          
          const isExpired = initialTimeInMinutes ? newTimeRemaining <= 0 : false;
          
          return {
            timeRemaining: newTimeRemaining,
            timeSpent: newTimeSpent,
            progress: Math.min(100, progress),
            isExpired,
            isRunning: !isExpired,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isExpired, initialTimeInMinutes]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = () => {
    if (!initialTimeInMinutes) return 'normal';
    
    const percentRemaining = (state.timeRemaining / initialTimeRef.current) * 100;
    
    if (percentRemaining <= 10) return 'critical';
    if (percentRemaining <= 25) return 'warning';
    return 'normal';
  };

  return {
    ...state,
    start,
    pause,
    stop,
    resume,
    formatTime: useCallback((seconds?: number) => formatTime(seconds ?? state.timeRemaining), [state.timeRemaining]),
    formatTimeSpent: useCallback(() => formatTime(state.timeSpent), [state.timeSpent]),
    timeStatus: getTimeStatus(),
  };
}
