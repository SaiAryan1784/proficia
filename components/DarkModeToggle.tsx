"use client";
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext-new';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'switch';
  showLabel?: boolean;
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  size = 'md', 
  variant = 'button',
  showLabel = false,
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const buttonSizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  if (variant === 'switch') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className={`
            relative inline-flex items-center justify-center
            w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${theme === 'dark' 
              ? 'bg-blue-600' 
              : 'bg-gray-300'
            }
          `}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span
            className={`
              inline-block w-4 h-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
              ${theme === 'dark' ? 'translate-x-3' : '-translate-x-3'}
            `}
          />
          <FiSun 
            size={12} 
            className={`absolute left-1 text-yellow-500 transition-opacity duration-200 ${
              theme === 'dark' ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <FiMoon 
            size={12} 
            className={`absolute right-1 text-blue-200 transition-opacity duration-200 ${
              theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          ${buttonSizes[size]}
          rounded-lg transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${theme === 'dark' 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 border border-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }
          flex items-center justify-center shadow-sm
        `}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <FiSun size={iconSizes[size]} />
        ) : (
          <FiMoon size={iconSizes[size]} />
        )}
      </button>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </div>
  );
};

export default DarkModeToggle;
