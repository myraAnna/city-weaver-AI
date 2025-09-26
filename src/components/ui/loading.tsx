'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

// Basic Loading Spinner with magic gradient
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full border-2 border-transparent bg-gradient-to-r from-magic-teal to-magic-purple opacity-75" />
      <div className="absolute inset-1 rounded-full bg-background" />
    </div>
  );
};

// Magic Weaving Animation - for AI planning screen (per styles.md)
export interface WeavingLoaderProps {
  className?: string;
}

const WeavingLoader = ({ className }: WeavingLoaderProps) => {
  return (
    <div className={cn('relative w-64 h-64 mx-auto', className)}>
      {/* Animated weaving lines */}
      <svg
        viewBox="0 0 256 256"
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(0, 212, 170, 0.3))',
        }}
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(51, 51, 51, 0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="256" height="256" fill="url(#grid)" />

        {/* Animated weaving paths */}
        <motion.path
          d="M 50 50 Q 128 100 206 50 Q 128 150 50 206 Q 128 156 206 206"
          fill="none"
          stroke="url(#magicGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{
            pathLength: 1,
            opacity: [0.5, 1, 0.7, 1],
          }}
          transition={{
            pathLength: { duration: 3, ease: 'easeInOut' },
            opacity: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
          }}
        />

        <motion.path
          d="M 206 50 Q 128 25 50 100 Q 128 200 206 156 Q 128 75 50 156"
          fill="none"
          stroke="url(#magicGradient2)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.8, 0.5, 0.8],
          }}
          transition={{
            pathLength: { duration: 3.5, ease: 'easeInOut', delay: 0.5 },
            opacity: { duration: 2.5, repeat: Infinity, repeatType: 'reverse' },
          }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#B794F6" />
          </linearGradient>
          <linearGradient id="magicGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B794F6" />
            <stop offset="100%" stopColor="#00D4AA" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central pulsing dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple shadow-magic-soft" />
      </motion.div>
    </div>
  );
};

// Aurora Background Effect - for loading screens (per styles.md)
export interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const AuroraBackground = ({ children, className }: AuroraBackgroundProps) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Aurora effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 80% at 50% -20%, rgba(0, 212, 170, 0.3) 0%, transparent 70%),
              radial-gradient(ellipse 80% 80% at 80% 120%, rgba(183, 148, 246, 0.3) 0%, transparent 70%)
            `,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 60% 60% at 20% 80%, rgba(0, 212, 170, 0.4) 0%, transparent 70%),
              radial-gradient(ellipse 60% 60% at 90% 20%, rgba(183, 148, 246, 0.4) 0%, transparent 70%)
            `,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Progress Steps - for AI planning progress (per styles.md)
export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  className?: string;
}

const ProgressSteps = ({ steps, className }: ProgressStepsProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Status icon */}
          <div className="flex-shrink-0">
            {step.status === 'completed' ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center">
                <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : step.status === 'active' ? (
              <motion.div
                className="w-6 h-6 rounded-full border-2 border-magic-teal bg-magic-teal/20"
                animate={{
                  scale: [1, 1.1, 1],
                  borderColor: ['#00D4AA', '#B794F6', '#00D4AA'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-full h-full rounded-full bg-magic-teal/50" />
              </motion.div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-border-default bg-card-default" />
            )}
          </div>

          {/* Step label */}
          <span
            className={cn(
              'text-sm transition-colors',
              step.status === 'completed' ? 'text-foreground' :
              step.status === 'active' ? 'text-magic-teal font-medium' :
              'text-foreground-secondary'
            )}
          >
            {step.label}
          </span>

          {/* Active indicator */}
          {step.status === 'active' && (
            <motion.div
              className="ml-auto text-magic-teal"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Skeleton Loading Components
export interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

const Skeleton = ({ className, animate = true }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'bg-card-hover rounded-md',
        animate && 'animate-pulse',
        className
      )}
    />
  );
};

// Card Skeleton
const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('bg-card-default rounded-lg p-6 space-y-4', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};

export {
  LoadingSpinner,
  WeavingLoader,
  AuroraBackground,
  ProgressSteps,
  Skeleton,
  SkeletonCard,
};