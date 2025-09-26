// Responsive breakpoint utilities
// Mobile-first approach following Tailwind's breakpoint system

export const breakpoints = {
  sm: 640,    // Small devices (phones in landscape)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (small laptops)
  xl: 1280,   // Extra large devices (large laptops)
  '2xl': 1536, // 2X large devices (large monitors)
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to get current breakpoint
export const useBreakpoint = () => {
  if (typeof window === 'undefined') return 'sm';

  const width = window.innerWidth;

  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

// Check if current screen is at or above breakpoint
export const isBreakpoint = (bp: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[bp];
};

// Media query helpers
export const mediaQuery = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,

  // Max-width queries
  maxSm: `(max-width: ${breakpoints.sm - 1}px)`,
  maxMd: `(max-width: ${breakpoints.md - 1}px)`,
  maxLg: `(max-width: ${breakpoints.lg - 1}px)`,
  maxXl: `(max-width: ${breakpoints.xl - 1}px)`,
  max2xl: `(max-width: ${breakpoints['2xl'] - 1}px)`,
} as const;

// Responsive value helper - returns different values based on breakpoint
export const responsive = <T>(values: {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T => {
  if (typeof window === 'undefined') return values.default;

  const width = window.innerWidth;
  let currentBp: Breakpoint = 'sm';

  if (width >= breakpoints['2xl']) currentBp = '2xl';
  else if (width >= breakpoints.xl) currentBp = 'xl';
  else if (width >= breakpoints.lg) currentBp = 'lg';
  else if (width >= breakpoints.md) currentBp = 'md';
  else currentBp = 'sm';

  // Return the most specific breakpoint value
  switch (currentBp) {
    case '2xl':
      return values['2xl'] ?? values.xl ?? values.lg ?? values.md ?? values.sm ?? values.default;
    case 'xl':
      return values.xl ?? values.lg ?? values.md ?? values.sm ?? values.default;
    case 'lg':
      return values.lg ?? values.md ?? values.sm ?? values.default;
    case 'md':
      return values.md ?? values.sm ?? values.default;
    case 'sm':
      return values.sm ?? values.default;
    default:
      return values.default;
  }
};

// CSS classes for hiding/showing at breakpoints
export const responsiveClasses = {
  // Show only on mobile
  mobileOnly: 'block sm:hidden',

  // Show on tablet and up
  tabletUp: 'hidden sm:block',

  // Show on desktop and up
  desktopUp: 'hidden lg:block',

  // Hide on mobile
  hideMobile: 'hidden sm:block',

  // Hide on tablet
  hideTablet: 'block sm:hidden lg:block',

  // Hide on desktop
  hideDesktop: 'block lg:hidden',
};

// Common responsive grid column configurations
export const gridCols = {
  // Card grids
  cards: {
    default: 1,
    sm: 2,
    lg: 3,
  },

  // Travel persona cards (2x3 grid per styles.md)
  personas: {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 3, // Maintain 3 columns for personas
  },

  // Feature grids
  features: {
    default: 1,
    md: 2,
    xl: 3,
  },

  // Content columns
  content: {
    default: 1,
    lg: 2,
  },

  // Timeline (always single column)
  timeline: {
    default: 1,
  },
} as const;

// Responsive spacing values
export const spacing = {
  container: {
    default: 'px-4',
    sm: 'px-6',
    lg: 'px-8',
  },

  section: {
    default: 'py-8',
    sm: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  },

  gap: {
    sm: {
      default: 'gap-3',
      md: 'gap-4',
    },
    md: {
      default: 'gap-4',
      md: 'gap-6',
    },
    lg: {
      default: 'gap-6',
      md: 'gap-8',
    },
  },
} as const;

// Device detection utilities
export const device = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoints.md;
  },

  isTablet: (): boolean => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= breakpoints.md && width < breakpoints.lg;
  },

  isDesktop: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.lg;
  },

  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
};

// Responsive text sizes
export const textSizes = {
  hero: {
    default: 'text-3xl',
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
  },

  heading: {
    default: 'text-2xl',
    sm: 'text-3xl',
    md: 'text-4xl',
  },

  subheading: {
    default: 'text-xl',
    sm: 'text-2xl',
  },

  body: {
    default: 'text-sm',
    sm: 'text-base',
  },

  small: {
    default: 'text-xs',
    sm: 'text-sm',
  },
};

// Animation helpers for different screen sizes
export const animations = {
  // Reduce motion on mobile for performance
  motion: {
    default: 'motion-safe:animate-fade-in',
    lg: 'motion-safe:animate-slide-up',
  },

  // Different hover effects based on device
  hover: {
    touch: 'active:scale-95', // Touch devices
    pointer: 'hover:scale-105 hover:-translate-y-1', // Pointer devices
  },
};

const breakpointUtils = {
  breakpoints,
  mediaQuery,
  responsive,
  responsiveClasses,
  gridCols,
  spacing,
  device,
  textSizes,
  animations,
};

export default breakpointUtils;