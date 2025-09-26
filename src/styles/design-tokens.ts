// City Weaver AI Design Tokens
// Based on styles.md - Dark mode first, magic-inspired design system

export const designTokens = {
  // Color System
  colors: {
    // Dark Mode First - Core Colors
    background: {
      primary: '#0A0A0A', // Deep near-black
      secondary: '#111111', // Slightly lighter for cards
      tertiary: '#1a1a1a', // Hover states
    },

    // Text & Foreground
    foreground: {
      primary: '#F5F5F5', // Off-white primary text
      secondary: '#888888', // Secondary text
      muted: '#333333', // Subtle elements
    },

    // Magic Gradient (Teal to Lavender) - The "magic" color
    magic: {
      teal: '#00D4AA',
      purple: '#B794F6',
      gradient: 'linear-gradient(135deg, #00D4AA 0%, #B794F6 100%)',
    },

    // UI Elements
    card: {
      default: '#111111',
      hover: '#1a1a1a',
      selected: '#222222',
    },

    border: {
      default: '#333333',
      subtle: '#222222',
      magic: 'transparent', // For gradient borders
    },

    input: {
      background: '#111111',
      focus: '#1a1a1a',
      border: '#333333',
    },

    // Semantic Colors
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },

  // Typography System
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },

    // Font Sizes with Line Heights
    fontSize: {
      xs: { size: '12px', lineHeight: '16px' },
      sm: { size: '14px', lineHeight: '20px' },
      base: { size: '16px', lineHeight: '24px' },
      lg: { size: '18px', lineHeight: '28px' },
      xl: { size: '20px', lineHeight: '32px' },
      '2xl': { size: '24px', lineHeight: '36px' },
      '3xl': { size: '30px', lineHeight: '40px' },
      '4xl': { size: '36px', lineHeight: '48px' },
      '5xl': { size: '48px', lineHeight: '56px' },
    },

    // Font Weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    // Letter Spacing (for headings)
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },

  // Spacing Scale (8px based)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Shadows for Dark Mode
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.25)',

    // Magic shadows with glow effects
    magic: {
      soft: '0 0 20px rgba(0, 212, 170, 0.3), 0 0 40px rgba(183, 148, 246, 0.2)',
      medium: '0 0 30px rgba(0, 212, 170, 0.5), 0 0 60px rgba(183, 148, 246, 0.3)',
      strong: '0 0 40px rgba(0, 212, 170, 0.7), 0 0 80px rgba(183, 148, 246, 0.4)',
    },
  },

  // Animation & Transition
  animations: {
    // Durations
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },

    // Easing functions
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      magic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Custom bounce
    },

    // Hover transforms
    hover: {
      lift: 'translateY(-2px)',
      scale: 'scale(1.02)',
      glow: 'brightness(1.1)',
    },
  },

  // Breakpoints for Responsive Design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    tooltip: 1700,
  },
} as const;

// Export individual token categories for easier imports
export const { colors, typography, spacing, borderRadius, shadows, animations, breakpoints, zIndex } = designTokens;

// Utility function to create magic gradient backgrounds
export const createMagicGradient = (opacity = 1) => ({
  background: `linear-gradient(135deg, rgba(0, 212, 170, ${opacity}) 0%, rgba(183, 148, 246, ${opacity}) 100%)`,
});

// Utility function to create magic border
export const createMagicBorder = (width = '1px') => ({
  border: `${width} solid transparent`,
  backgroundImage: `linear-gradient(135deg, #00D4AA 0%, #B794F6 100%)`,
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
});