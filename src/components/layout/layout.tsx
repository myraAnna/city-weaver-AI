'use client';

import React from 'react';
import { cn } from '@/utils';
import { AuroraBackground } from '@/components/ui';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  withAurora?: boolean; // Optional aurora background effect
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Layout = ({
  children,
  className,
  withAurora = false,
  maxWidth = 'xl',
  padding = 'md',
}: LayoutProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  const layoutContent = (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground',
        'flex flex-col',
        className
      )}
    >
      <div
        className={cn(
          'flex-1 mx-auto w-full',
          maxWidthClasses[maxWidth],
          paddingClasses[padding]
        )}
      >
        {children}
      </div>
    </div>
  );

  // Wrap with aurora background if requested
  if (withAurora) {
    return (
      <AuroraBackground className="min-h-screen">
        {layoutContent}
      </AuroraBackground>
    );
  }

  return layoutContent;
};

// Container Component - for content sections
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
}

const Container = ({
  children,
  className,
  size = 'lg',
  center = false,
}: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full',
  };

  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

// Section Component - for page sections with proper spacing
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'secondary' | 'card';
}

const Section = ({
  children,
  className,
  spacing = 'md',
  background = 'default',
}: SectionProps) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const backgroundClasses = {
    default: 'bg-background',
    secondary: 'bg-background-secondary',
    card: 'bg-card',
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};

// Centered Layout - for onboarding screens and single-column layouts
export interface CenteredLayoutProps {
  children: React.ReactNode;
  className?: string;
  withAurora?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
}

const CenteredLayout = ({
  children,
  className,
  withAurora = false,
  maxWidth = 'md',
}: CenteredLayoutProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  const layoutContent = (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground',
        'flex items-center justify-center',
        'px-4 py-8',
        className
      )}
    >
      <div className={cn('w-full', maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );

  if (withAurora) {
    return (
      <AuroraBackground className="min-h-screen">
        {layoutContent}
      </AuroraBackground>
    );
  }

  return layoutContent;
};

// Stack Layout - for vertical content stacking with proper spacing
export interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const Stack = ({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
}: StackProps) => {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
};

export { Layout, Container, Section, CenteredLayout, Stack };