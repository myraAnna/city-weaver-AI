'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive, useViewportHeight } from '@/hooks/use-responsive';
import { cn } from '@/utils';

export interface MobileLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  safeArea?: boolean;
}

export const MobileLayout = ({
  children,
  header,
  footer,
  className,
  fullHeight = true,
  safeArea = true,
}: MobileLayoutProps) => {
  const { isMobile, height } = useResponsive();
  useViewportHeight(); // Set up viewport height CSS custom properties

  if (!isMobile) {
    // On desktop, render children normally
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'flex flex-col w-full',
        fullHeight && 'h-screen min-h-screen',
        safeArea && 'pb-safe pl-safe pr-safe',
        className
      )}
      style={{
        height: fullHeight ? `calc(${height}px)` : undefined,
        minHeight: fullHeight ? `calc(${height}px)` : undefined,
      }}
    >
      {/* Header */}
      {header && (
        <div className="flex-shrink-0 bg-background border-b border-border-default">
          {header}
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-default',
          '-webkit-overflow-scrolling-touch' // Smooth scrolling on iOS
        )}
      >
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <div className="flex-shrink-0 bg-background border-t border-border-default">
          {footer}
        </div>
      )}
    </div>
  );
};

// Mobile-optimized Stack component
export interface MobileStackProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MobileStack = ({
  children,
  spacing = 'md',
  padding = 'md',
  className,
}: MobileStackProps) => {
  const spacingMap = {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };

  const paddingMap = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        spacingMap[spacing],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

// Mobile-friendly Card component
export interface MobileCardProps {
  children: React.ReactNode;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MobileCard = ({
  children,
  interactive,
  selected,
  onClick,
  className,
}: MobileCardProps) => {
  const { isMobile } = useResponsive();

  return (
    <motion.div
      className={cn(
        'bg-card-default border border-border-default rounded-lg overflow-hidden',
        interactive && cn(
          'cursor-pointer transition-all duration-200',
          isMobile
            ? 'active:bg-card-hover active:scale-[0.98]' // Touch feedback
            : 'hover:bg-card-hover hover:shadow-md'
        ),
        selected && 'ring-2 ring-magic-teal bg-card-hover border-magic-teal/30',
        isMobile && 'min-h-[44px] tap-highlight-transparent',
        className
      )}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// Bottom Sheet component for mobile
export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
  className?: string;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  className,
}: BottomSheetProps) => {
  const vh = useViewportHeight();

  const heightMap = {
    auto: 'max-h-[80vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-background rounded-t-2xl border-t border-border-default',
              'shadow-2xl overflow-hidden',
              heightMap[height],
              'pb-safe', // Safe area padding
              className
            )}
            style={{
              maxHeight: height === 'auto' ? vh * 0.8 : undefined,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="w-8 h-1 bg-border-default rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-4 pb-2 border-b border-border-subtle">
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mobile Navigation Bar
export interface MobileNavBarProps {
  title?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const MobileNavBar = ({
  title,
  onBack,
  actions,
  className,
}: MobileNavBarProps) => {
  return (
    <nav
      className={cn(
        'flex items-center justify-between h-14 px-4',
        'bg-background/80 backdrop-blur-md',
        'border-b border-border-default',
        'sticky top-0 z-30',
        className
      )}
    >
      {/* Left Side */}
      <div className="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full',
              'text-foreground-secondary hover:text-foreground',
              'hover:bg-card-hover transition-colors duration-200',
              'min-h-[44px] min-w-[44px]' // Touch target
            )}
          >
            ←
          </button>
        )}
      </div>

      {/* Center */}
      {title && (
        <h1 className="text-lg font-semibold text-foreground text-center flex-1 px-4">
          {title}
        </h1>
      )}

      {/* Right Side */}
      <div className="flex items-center">
        {actions}
      </div>
    </nav>
  );
};

// Swipe gestures hook for mobile
export const useSwipeGestures = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) => {
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.x || !touchStart.y) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setTouchStart({ x: 0, y: 0 });
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};