"use client";
import React from 'react';
import { useTimer } from '@/hooks/useTimer';
import { FaClock } from 'react-icons/fa';

interface TimerProps {
  timeLimit?: number; // in minutes
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export default function Timer({ 
  timeLimit, 
  onTimeUp, 
  autoStart = false
}: TimerProps) {
  const timer = useTimer(timeLimit);

  React.useEffect(() => {
    if (autoStart) {
      timer.start();
    }
  }, [autoStart, timer.start]); // timer.start is memoized

  React.useEffect(() => {
    if (timer.isExpired && onTimeUp) {
      onTimeUp();
    }
  }, [timer.isExpired, onTimeUp]);

  const getStatusColor = () => {
    switch (timer.timeStatus) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <FaClock className={`text-xl ${getStatusColor()}`} />
        
        <div className="flex-1">
          {timeLimit ? (
            <>
              <div className={`text-xl font-mono font-bold ${getStatusColor()}`}>
                {timer.formatTime()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Time remaining
              </div>
            </>
          ) : (
            <>
              <div className="text-xl font-mono font-bold text-gray-700 dark:text-gray-300">
                {timer.formatTimeSpent()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Time elapsed
              </div>
            </>
          )}
        </div>
      </div>

      {timer.isExpired && (
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200 text-sm font-medium">
          ⚠️ Time&apos;s up!
        </div>
      )}
    </div>
  );
}
