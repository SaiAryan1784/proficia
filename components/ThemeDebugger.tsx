"use client";
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeDebugger() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-200 dark:bg-yellow-800 p-2 rounded shadow-lg z-50">
      <p className="text-xs font-mono">
        Current theme: <strong>{theme}</strong>
      </p>
      <p className="text-xs font-mono">
        HTML class: <strong>{typeof document !== 'undefined' ? document.documentElement.className : 'SSR'}</strong>
      </p>
    </div>
  );
}
