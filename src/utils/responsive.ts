// Responsive design utilities and helper functions
import { type ClassValue, clsx } from 'clsx';

export type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// Breakpoint utilities
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Generate responsive class names
export const generateResponsiveClasses = (
  prefix: string,
  value: ResponsiveValue<string | number>
): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${prefix}-${value}`;
  }

  const classes: string[] = [];

  // Add base class (xs)
  if (value.xs !== undefined) {
    classes.push(`${prefix}-${value.xs}`);
  }

  // Add responsive classes
  Object.entries(value).forEach(([breakpoint, val]) => {
    if (breakpoint !== 'xs' && val !== undefined) {
      classes.push(`${breakpoint}:${prefix}-${val}`);
    }
  });

  return classes.join(' ');
};

// Grid utilities
export const generateGridClasses = (
  cols: ResponsiveValue<number>
): string => {
  if (typeof cols === 'number') {
    return `grid-cols-${cols}`;
  }

  const classes: string[] = [];

  if (cols.xs !== undefined) {
    classes.push(`grid-cols-${cols.xs}`);
  }
  if (cols.sm !== undefined) {
    classes.push(`sm:grid-cols-${cols.sm}`);
  }
  if (cols.md !== undefined) {
    classes.push(`md:grid-cols-${cols.md}`);
  }
  if (cols.lg !== undefined) {
    classes.push(`lg:grid-cols-${cols.lg}`);
  }
  if (cols.xl !== undefined) {
    classes.push(`xl:grid-cols-${cols.xl}`);
  }
  if (cols['2xl'] !== undefined) {
    classes.push(`2xl:grid-cols-${cols['2xl']}`);
  }

  return classes.join(' ');
};

// Gap utilities
export const generateGapClasses = (
  gap: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>
): string => {
  const gapMap = {
    xs: '1',
    sm: '2',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
  };

  if (typeof gap === 'string') {
    return `gap-${gapMap[gap]}`;
  }

  const classes: string[] = [];

  if (gap.xs !== undefined) {
    classes.push(`gap-${gapMap[gap.xs]}`);
  }
  if (gap.sm !== undefined) {
    classes.push(`sm:gap-${gapMap[gap.sm]}`);
  }
  if (gap.md !== undefined) {
    classes.push(`md:gap-${gapMap[gap.md]}`);
  }
  if (gap.lg !== undefined) {
    classes.push(`lg:gap-${gapMap[gap.lg]}`);
  }
  if (gap.xl !== undefined) {
    classes.push(`xl:gap-${gapMap[gap.xl]}`);
  }
  if (gap['2xl'] !== undefined) {
    classes.push(`2xl:gap-${gapMap[gap['2xl']]}`);
  }

  return classes.join(' ');
};

// Spacing utilities
export const generateSpacingClasses = (
  property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr',
  value: ResponsiveValue<string | number>
): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${property}-${value}`;
  }

  const classes: string[] = [];

  if (value.xs !== undefined) {
    classes.push(`${property}-${value.xs}`);
  }
  if (value.sm !== undefined) {
    classes.push(`sm:${property}-${value.sm}`);
  }
  if (value.md !== undefined) {
    classes.push(`md:${property}-${value.md}`);
  }
  if (value.lg !== undefined) {
    classes.push(`lg:${property}-${value.lg}`);
  }
  if (value.xl !== undefined) {
    classes.push(`xl:${property}-${value.xl}`);
  }
  if (value['2xl'] !== undefined) {
    classes.push(`2xl:${property}-${value['2xl']}`);
  }

  return classes.join(' ');
};

// Text size utilities
export const generateTextSizeClasses = (
  size: ResponsiveValue<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'>
): string => {
  if (typeof size === 'string') {
    return `text-${size}`;
  }

  const classes: string[] = [];

  if (size.xs !== undefined) {
    classes.push(`text-${size.xs}`);
  }
  if (size.sm !== undefined) {
    classes.push(`sm:text-${size.sm}`);
  }
  if (size.md !== undefined) {
    classes.push(`md:text-${size.md}`);
  }
  if (size.lg !== undefined) {
    classes.push(`lg:text-${size.lg}`);
  }
  if (size.xl !== undefined) {
    classes.push(`xl:text-${size.xl}`);
  }
  if (size['2xl'] !== undefined) {
    classes.push(`2xl:text-${size['2xl']}`);
  }

  return classes.join(' ');
};

// Container utilities
export const getContainerClasses = (maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): string => {
  const baseClasses = ['w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8'];

  if (maxWidth) {
    baseClasses.push(`max-w-screen-${maxWidth}`);
  }

  return baseClasses.join(' ');
};

// Flexbox utilities
export const generateFlexClasses = (
  direction?: ResponsiveValue<'row' | 'col' | 'row-reverse' | 'col-reverse'>,
  justify?: ResponsiveValue<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>,
  align?: ResponsiveValue<'start' | 'end' | 'center' | 'stretch' | 'baseline'>,
  wrap?: ResponsiveValue<'wrap' | 'nowrap' | 'wrap-reverse'>
): string => {
  const classes: string[] = ['flex'];

  if (direction) {
    if (typeof direction === 'string') {
      classes.push(`flex-${direction}`);
    } else {
      Object.entries(direction).forEach(([breakpoint, value]) => {
        if (value !== undefined) {
          const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
          classes.push(`${prefix}flex-${value}`);
        }
      });
    }
  }

  if (justify) {
    if (typeof justify === 'string') {
      classes.push(`justify-${justify}`);
    } else {
      Object.entries(justify).forEach(([breakpoint, value]) => {
        if (value !== undefined) {
          const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
          classes.push(`${prefix}justify-${value}`);
        }
      });
    }
  }

  if (align) {
    if (typeof align === 'string') {
      classes.push(`items-${align}`);
    } else {
      Object.entries(align).forEach(([breakpoint, value]) => {
        if (value !== undefined) {
          const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
          classes.push(`${prefix}items-${value}`);
        }
      });
    }
  }

  if (wrap) {
    if (typeof wrap === 'string') {
      classes.push(`flex-${wrap}`);
    } else {
      Object.entries(wrap).forEach(([breakpoint, value]) => {
        if (value !== undefined) {
          const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
          classes.push(`${prefix}flex-${value}`);
        }
      });
    }
  }

  return classes.join(' ');
};

// Display utilities
export const generateDisplayClasses = (
  display: ResponsiveValue<'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'hidden'>
): string => {
  if (typeof display === 'string') {
    return display === 'hidden' ? 'hidden' : `${display}`;
  }

  const classes: string[] = [];

  Object.entries(display).forEach(([breakpoint, value]) => {
    if (value !== undefined) {
      const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
      const className = value === 'hidden' ? 'hidden' : value;
      classes.push(`${prefix}${className}`);
    }
  });

  return classes.join(' ');
};

// Safe area utilities for mobile devices
export const getSafeAreaClasses = (): string => {
  return [
    'pb-safe', // padding-bottom: env(safe-area-inset-bottom)
    'pl-safe', // padding-left: env(safe-area-inset-left)
    'pr-safe', // padding-right: env(safe-area-inset-right)
  ].join(' ');
};

// Touch-friendly sizing utilities
export const getTouchFriendlyClasses = (): string => {
  return [
    'min-h-[44px]', // Minimum touch target size
    'min-w-[44px]',
    'tap-highlight-transparent', // Remove tap highlight on mobile
  ].join(' ');
};

// Responsive helper function
export const responsive = (
  base: ClassValue,
  sm?: ClassValue,
  md?: ClassValue,
  lg?: ClassValue,
  xl?: ClassValue,
  xxl?: ClassValue
): string => {
  const classes: ClassValue[] = [base];

  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  if (xxl) classes.push(`2xl:${xxl}`);

  return clsx(classes);
};

// Export utility function to combine responsive classes
export const cn = (...classes: ClassValue[]): string => {
  return clsx(classes);
};