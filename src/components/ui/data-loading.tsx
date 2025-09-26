'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, WeavingLoader, Skeleton, SkeletonCard } from './loading';
import { cn } from '@/utils';

export interface DataLoadingProps {
  isLoading: boolean;
  loadingType?: 'spinner' | 'skeleton' | 'weaving' | 'cards' | 'text' | 'search';
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const DataLoading = ({
  isLoading,
  loadingType = 'spinner',
  loadingText,
  children,
  className,
  delay = 0
}: DataLoadingProps) => {
  const [showLoading, setShowLoading] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  const LoadingComponent = () => {
    switch (loadingType) {
      case 'weaving':
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <WeavingLoader />
            {loadingText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground-secondary text-center max-w-md"
              >
                {loadingText}
              </motion.p>
            )}
          </div>
        );

      case 'skeleton':
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        );

      case 'cards':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className={`h-4 ${i % 2 === 0 ? 'w-full' : 'w-3/4'}`} />
            ))}
          </div>
        );

      case 'search':
        return (
          <SearchLoadingAnimation loadingText={loadingText} />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <LoadingSpinner size="lg" />
            {loadingText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground-secondary text-center"
              >
                {loadingText}
              </motion.p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingComponent />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Search Loading Animation
interface SearchLoadingAnimationProps {
  loadingText?: string;
}

const SearchLoadingAnimation = ({ loadingText }: SearchLoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-2 h-2 bg-magic-teal rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-magic-purple rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div
          className="w-2 h-2 bg-magic-teal rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      {loadingText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-foreground-secondary text-sm text-center"
        >
          {loadingText}
        </motion.p>
      )}
    </div>
  );
};

// Button Loading State
export interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const ButtonLoading = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  className,
  variant = 'spinner'
}: ButtonLoadingProps) => {
  const LoadingIcon = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-current rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <motion.div
            className="w-4 h-4 bg-current rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        );
      default:
        return <LoadingSpinner size="sm" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('flex items-center gap-2', className)}
        >
          <LoadingIcon />
          <span>{loadingText}</span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Progress Loading for file uploads or long processes
export interface ProgressLoadingProps {
  progress: number;
  isLoading: boolean;
  label?: string;
  className?: string;
}

export const ProgressLoading = ({
  progress,
  isLoading,
  label,
  className
}: ProgressLoadingProps) => {
  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('space-y-2', className)}
    >
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">{label}</span>
          <span className="text-foreground font-medium">{Math.round(displayProgress)}%</span>
        </div>
      )}
      <div className="w-full bg-card-hover rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-magic-teal to-magic-purple rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

// Loading Overlay for entire sections
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  blur?: boolean;
}

export const LoadingOverlay = ({
  isLoading,
  children,
  loadingText,
  className,
  blur = true
}: LoadingOverlayProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              {loadingText && (
                <p className="text-foreground-secondary text-center">
                  {loadingText}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn(isLoading && blur && 'filter blur-sm transition-all duration-300')}>
        {children}
      </div>
    </div>
  );
};

export default DataLoading;