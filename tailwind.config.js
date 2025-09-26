/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Mode First Colors
        background: {
          DEFAULT: '#0A0A0A', // Deep near-black
          secondary: '#111111',
        },
        foreground: {
          DEFAULT: '#F5F5F5', // Off-white primary text
          secondary: '#888888', // Secondary text
          muted: '#333333', // Borders and subtle elements
        },
        // Magic Gradient Colors (Teal to Lavender)
        magic: {
          teal: '#00D4AA',
          purple: '#B794F6',
          gradient: 'linear-gradient(135deg, #00D4AA 0%, #B794F6 100%)',
        },
        // Secondary Colors
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Semantic Colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Card and UI Colors (adapted for dark mode)
        card: {
          DEFAULT: '#111111', // Slightly lighter than main background
          hover: '#1a1a1a',
          selected: '#222222',
        },
        border: {
          DEFAULT: '#333333',
          subtle: '#222222',
        },
        input: {
          DEFAULT: '#111111',
          focus: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '32px' }],
        '2xl': ['24px', { lineHeight: '36px' }],
        '3xl': ['30px', { lineHeight: '40px' }],
        '4xl': ['36px', { lineHeight: '48px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'magic-shimmer': 'magicShimmer 3s linear infinite',
        'aurora-glow': 'auroraGlow 4s ease-in-out infinite',
        'weave-line': 'weaveLine 2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 212, 170, 0.3), 0 0 40px rgba(183, 148, 246, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 212, 170, 0.5), 0 0 60px rgba(183, 148, 246, 0.3)'
          },
        },
        magicShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        auroraGlow: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
            opacity: '0.3'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: '0.6'
          },
        },
        weaveLine: {
          '0%': {
            strokeDasharray: '0 100',
            opacity: '0.5'
          },
          '100%': {
            strokeDasharray: '100 0',
            opacity: '1'
          },
        },
      },
    },
  },
  plugins: [],
}