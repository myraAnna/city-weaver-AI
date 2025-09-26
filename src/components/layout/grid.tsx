'use client';

import React from 'react';
import { cn } from '@/utils';

// Main Grid Component
export interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean; // Auto-fit columns based on min width
  minColWidth?: string; // Minimum column width for auto-fit
}

const Grid = ({
  children,
  className,
  cols = { default: 1 },
  gap = 'md',
  autoFit = false,
  minColWidth = '300px',
}: GridProps) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Generate responsive column classes
  const getGridClasses = () => {
    if (autoFit) {
      return `grid-cols-[repeat(auto-fit,minmax(${minColWidth},1fr))]`;
    }

    const colClasses = [
      `grid-cols-${cols.default}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    ].filter(Boolean);

    return colClasses.join(' ');
  };

  return (
    <div
      className={cn(
        'grid',
        getGridClasses(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Card Grid - specifically for travel style cards (2x3 grid per styles.md)
export interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'personas' | 'stops' | 'general';
}

const CardGrid = ({ children, className, variant = 'general' }: CardGridProps) => {
  const variantClasses = {
    // 2x3 grid for persona selection (per styles.md)
    personas: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    // Vertical list for timeline stops
    stops: 'grid-cols-1 gap-4',
    // General flexible grid
    general: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  };

  return (
    <div
      className={cn(
        'grid',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Masonry Grid - for uneven content heights
export interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const MasonryGrid = ({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3 },
  gap = 'md',
}: MasonryGridProps) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colClasses = [
    `columns-${cols.default}`,
    cols.sm && `sm:columns-${cols.sm}`,
    cols.md && `md:columns-${cols.md}`,
    cols.lg && `lg:columns-${cols.lg}`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cn(
        colClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Flex Grid - for flexible layouts
export interface FlexGridProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const FlexGrid = ({
  children,
  className,
  direction = 'row',
  wrap = true,
  justify = 'start',
  align = 'start',
  gap = 'md',
}: FlexGridProps) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrap && 'flex-wrap',
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Auto Grid - automatically adjusts based on content
export interface AutoGridProps {
  children: React.ReactNode;
  className?: string;
  minColWidth?: number; // in pixels
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const AutoGrid = ({
  children,
  className,
  minColWidth = 280,
  gap = 'md',
}: AutoGridProps) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

// Timeline Grid - specialized for itinerary timeline
export interface TimelineGridProps {
  children: React.ReactNode;
  className?: string;
  showConnectors?: boolean;
}

const TimelineGrid = ({
  children,
  className,
  showConnectors = true,
}: TimelineGridProps) => {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline connector line */}
      {showConnectors && (
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-magic-teal via-magic-purple to-magic-teal opacity-70" />
      )}

      {/* Timeline items */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// Responsive Columns - for text content
export interface ResponsiveColumnsProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveColumns = ({
  children,
  className,
  cols = { default: 1, md: 2 },
  gap = 'md',
}: ResponsiveColumnsProps) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colClasses = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cn(
        'grid',
        colClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  Grid,
  CardGrid,
  MasonryGrid,
  FlexGrid,
  AutoGrid,
  TimelineGrid,
  ResponsiveColumns,
};