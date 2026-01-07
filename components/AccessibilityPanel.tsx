"use client";
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { FaSun, FaMoon, FaTextHeight, FaAdjust } from 'react-icons/fa';

export default function AccessibilityPanel() {
  const { theme, fontSize, highContrast, toggleTheme, setFontSize, toggleHighContrast } = useTheme();

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">
        Display Settings
      </h3>

      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
            <span className="text-sm font-medium text-foreground">
              Theme
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary' : 'bg-secondary'
              }`}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FaTextHeight className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Font Size
            </span>
          </div>
          <div className="flex space-x-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${fontSize === size
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
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
            <FaAdjust className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              High Contrast
            </span>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${highContrast ? 'bg-primary' : 'bg-secondary'
              }`}
            role="switch"
            aria-checked={highContrast}
            aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {/* Quick Tips */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Keyboard Shortcuts
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div><kbd className="px-1 py-0.5 bg-muted rounded border border-border text-foreground">Tab</kbd> Navigate</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded border border-border text-foreground">Space</kbd> Select</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded border border-border text-foreground">Esc</kbd> Close</div>
          </div>
        </div>
      </div>
    </div>
  );
}
