"use client";
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { FaSun, FaMoon, FaTextHeight, FaAdjust } from 'react-icons/fa';

export default function AccessibilityPanel() {
  const { theme, fontSize, highContrast, toggleTheme, setFontSize, toggleHighContrast } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Accessibility Settings
      </h3>
      
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FaTextHeight className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Size
            </span>
          </div>
          <div className="flex space-x-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  fontSize === size
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={fontSize === size}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaAdjust className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast
            </span>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              highContrast ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={highContrast}
            aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Keyboard Navigation Help */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keyboard Navigation
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> - Navigate between elements</div>
            <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd> - Activate buttons</div>
            <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> - Submit forms</div>
            <div><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> - Close modals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
