// Custom hook for responsive design utilities
import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ScreenSize = Breakpoint;

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export interface UseResponsiveReturn {
  currentBreakpoint: Breakpoint;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isSmallMobile: boolean;
  width: number;
  height: number;
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isOnly: (breakpoint: Breakpoint) => boolean;
}

export const useResponsive = (): UseResponsiveReturn => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const currentBreakpoint = getCurrentBreakpoint(windowSize.width);

  const isAbove = (breakpoint: Breakpoint): boolean => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return windowSize.width < breakpoints[breakpoint];
  };

  const isOnly = (breakpoint: Breakpoint): boolean => {
    const breakpointKeys = Object.keys(breakpoints) as Breakpoint[];
    const currentIndex = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[currentIndex + 1];

    if (!nextBreakpoint) {
      return windowSize.width >= breakpoints[breakpoint];
    }

    return (
      windowSize.width >= breakpoints[breakpoint] &&
      windowSize.width < breakpoints[nextBreakpoint]
    );
  };

  return {
    currentBreakpoint,
    isDesktop: isAbove('lg'),
    isTablet: isAbove('md') && isBelow('lg'),
    isMobile: isBelow('md'),
    isSmallMobile: isBelow('sm'),
    width: windowSize.width,
    height: windowSize.height,
    isAbove,
    isBelow,
    isOnly,
  };
};

// Hook for responsive values
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
  const { currentBreakpoint } = useResponsive();

  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Find the largest breakpoint that's <= current and has a value
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }

  return undefined;
};

// Hook for media query matching
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Predefined media queries
export const usePreferredMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: no-preference)');
};

export const useIsTouchDevice = (): boolean => {
  return useMediaQuery('(pointer: coarse)');
};

export const useIsPortrait = (): boolean => {
  return useMediaQuery('(orientation: portrait)');
};

export const useIsLandscape = (): boolean => {
  return useMediaQuery('(orientation: landscape)');
};

// Viewport height utilities (safe area for mobile)
export const useViewportHeight = () => {
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateVh = () => {
      setVh(window.innerHeight);
      // Update CSS custom property for viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    updateVh();
    window.addEventListener('resize', updateVh);
    window.addEventListener('orientationchange', updateVh);

    return () => {
      window.removeEventListener('resize', updateVh);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, []);

  return vh;
};