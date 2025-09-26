'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

// Success Animation Component
export interface SuccessAnimationProps {
  show: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  className?: string;
  variant?: 'checkmark' | 'celebration' | 'simple';
  autoHide?: boolean;
  duration?: number;
}

export const SuccessAnimation = ({
  show,
  title = 'Success!',
  message,
  onComplete,
  className,
  variant = 'checkmark',
  autoHide = true,
  duration = 3000
}: SuccessAnimationProps) => {
  React.useEffect(() => {
    if (show && autoHide) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onComplete]);

  const CheckmarkIcon = () => (
    <motion.div
      className="relative w-16 h-16 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
    >
      <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
        <motion.svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </div>
    </motion.div>
  );

  const CelebrationIcon = () => (
    <motion.div
      className="relative w-16 h-16 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 8, stiffness: 100 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-magic-teal/20 to-magic-purple/20 border-2 border-magic-teal">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-magic-teal to-magic-purple opacity-20" />
      </div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          ✨
        </motion.div>
      </div>
      {/* Confetti particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-magic-teal rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            x: Math.cos(i * 45 * Math.PI / 180) * 30,
            y: Math.sin(i * 45 * Math.PI / 180) * 30,
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeOut'
          }}
        />
      ))}
    </motion.div>
  );

  const SimpleIcon = () => (
    <motion.div
      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mx-auto"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </motion.div>
  );

  const getIcon = () => {
    switch (variant) {
      case 'celebration': return <CelebrationIcon />;
      case 'simple': return <SimpleIcon />;
      default: return <CheckmarkIcon />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn('text-center space-y-4', className)}
        >
          {getIcon()}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-green-500">{title}</h3>
            {message && (
              <p className="text-foreground-secondary text-sm mt-2">{message}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Error Animation Component
export interface ErrorAnimationProps {
  show: boolean;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
  variant?: 'shake' | 'bounce' | 'simple';
  showRetry?: boolean;
}

export const ErrorAnimation = ({
  show,
  title = 'Oops! Something went wrong',
  message,
  onRetry,
  onClose,
  className,
  variant = 'shake',
  showRetry = false
}: ErrorAnimationProps) => {
  const ShakeIcon = () => (
    <motion.div
      className="w-16 h-16 mx-auto"
      animate={show ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </motion.div>
  );

  const BounceIcon = () => (
    <motion.div
      className="w-16 h-16 mx-auto"
      animate={show ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
        <motion.div
          animate={show ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          ⚠️
        </motion.div>
      </div>
    </motion.div>
  );

  const SimpleIcon = () => (
    <motion.div
      className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: show ? 1 : 0 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </motion.div>
  );

  const getIcon = () => {
    switch (variant) {
      case 'bounce': return <BounceIcon />;
      case 'simple': return <SimpleIcon />;
      default: return <ShakeIcon />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn('text-center space-y-4', className)}
        >
          {getIcon()}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-red-500">{title}</h3>
            {message && (
              <p className="text-foreground-secondary text-sm mt-2">{message}</p>
            )}
          </motion.div>
          {(showRetry || onClose) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2 justify-center"
            >
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-foreground-muted text-background rounded-md hover:bg-foreground transition-colors"
                >
                  Close
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Notification Component
export interface ToastProps {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  duration?: number;
  className?: string;
}

export const Toast = ({
  show,
  type,
  title,
  message,
  onClose,
  position = 'top-right',
  duration = 4000,
  className
}: ToastProps) => {
  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/20 border-green-500/50',
          icon: '✅',
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-500/20 border-red-500/50',
          icon: '❌',
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/20 border-yellow-500/50',
          icon: '⚠️',
          iconColor: 'text-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-500/20 border-blue-500/50',
          icon: 'ℹ️',
          iconColor: 'text-blue-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={cn(
            'fixed z-50 max-w-md rounded-lg border backdrop-blur-sm',
            typeStyles.bg,
            getPositionClasses(),
            className
          )}
        >
          <div className="p-4 flex items-start gap-3">
            <div className={cn('flex-shrink-0 text-lg', typeStyles.iconColor)}>
              {typeStyles.icon}
            </div>
            <div className="flex-1">
              {title && (
                <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              )}
              <p className="text-foreground-secondary text-sm">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-foreground-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Status Indicator Component
export interface StatusIndicatorProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator = ({ status, className, size = 'md' }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const statusConfig = {
    idle: { color: 'bg-gray-400', animation: null },
    loading: { color: 'bg-magic-teal', animation: 'animate-spin' },
    success: { color: 'bg-green-500', animation: 'animate-bounce' },
    error: { color: 'bg-red-500', animation: 'animate-pulse' }
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center',
        sizeClasses[size],
        config.color,
        config.animation,
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
    >
      {status === 'success' && (
        <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {status === 'error' && (
        <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </motion.div>
  );
};

export default {
  SuccessAnimation,
  ErrorAnimation,
  Toast,
  StatusIndicator
};