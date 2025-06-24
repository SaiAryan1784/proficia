"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseNavigationGuardOptions {
  enabled: boolean;
  onNavigationAttempt: () => void;
}

export function useNavigationGuard({ enabled, onNavigationAttempt }: UseNavigationGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const isGuardEnabled = useRef(false);
  const originalPush = useRef<typeof router.push>();

  useEffect(() => {
    isGuardEnabled.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Store original router push
    if (!originalPush.current) {
      originalPush.current = router.push.bind(router);
    }

    // Override router.push to intercept programmatic navigation
    const interceptPush = (href: string, options?: any) => {
      if (isGuardEnabled.current) {
        onNavigationAttempt();
        return Promise.resolve(true);
      }
      return originalPush.current!(href, options);
    };

    // Type assertion to override the method
    (router as any).push = interceptPush;

    // Handle browser navigation (back/forward buttons)
    const handlePopState = (e: PopStateEvent) => {
      if (isGuardEnabled.current) {
        e.preventDefault();
        onNavigationAttempt();
        // Push current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Handle page refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGuardEnabled.current) {
        e.preventDefault();
        return '';
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Push initial state for back button handling
    window.history.pushState(null, '', window.location.href);

    return () => {
      // Restore original router.push
      if (originalPush.current) {
        (router as any).push = originalPush.current;
      }
      
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, onNavigationAttempt, router]);

  // Return a function to bypass the guard
  const bypassGuard = (href: string) => {
    isGuardEnabled.current = false;
    if (originalPush.current) {
      originalPush.current(href);
    } else {
      router.push(href);
    }
  };

  return { bypassGuard };
}
