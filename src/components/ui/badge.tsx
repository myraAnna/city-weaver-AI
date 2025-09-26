'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default - subtle gray
        default: [
          'border-border-subtle bg-card-default text-foreground-secondary',
          'hover:bg-card-hover',
        ],

        // Magic - uses accent colors for important badges
        magic: [
          'border-transparent text-background',
          'bg-gradient-to-r from-magic-teal to-magic-purple',
          'shadow-magic-soft/50',
          'hover:shadow-magic-medium',
        ],

        // Success - for positive status
        success: [
          'border-transparent bg-success-500/20 text-success-500',
          'hover:bg-success-500/30',
        ],

        // Warning - for alerts and attention
        warning: [
          'border-transparent bg-warning-500/20 text-warning-500',
          'hover:bg-warning-500/30',
        ],

        // Error - for problems and restrictions
        error: [
          'border-transparent bg-error-500/20 text-error-500',
          'hover:bg-error-500/30',
        ],

        // Outline - subtle bordered style
        outline: [
          'text-foreground bg-transparent border-border-default',
          'hover:bg-card-hover hover:border-magic-teal/30',
        ],

        // Ghost - minimal background
        ghost: [
          'border-transparent bg-card-hover/30 text-foreground-secondary',
          'hover:bg-card-hover hover:text-foreground',
        ],

        // Live status badges (for real-time info)
        live: [
          'border-transparent text-magic-teal bg-magic-teal/20',
          'animate-glow-pulse',
          'shadow-magic-soft/30',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  pulse?: boolean; // For animated badges
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, icon, pulse, ...props }, ref) => {
    return (
      <div
        className={cn(
          badgeVariants({ variant, size }),
          pulse && 'animate-glow-pulse',
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// Specialized badge components for common use cases

// Status Badge - for venue status (open/closed/busy)
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'open' | 'closed' | 'busy' | 'quiet' | 'moderate';
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const getStatusConfig = (status: StatusBadgeProps['status']) => {
      switch (status) {
        case 'open':
          return { variant: 'success' as const, text: 'Open', icon: '🟢' };
        case 'closed':
          return { variant: 'error' as const, text: 'Closed', icon: '🔴' };
        case 'busy':
          return { variant: 'warning' as const, text: 'Busy', icon: '🟡' };
        case 'quiet':
          return { variant: 'success' as const, text: 'Quiet', icon: '🟢' };
        case 'moderate':
          return { variant: 'default' as const, text: 'Moderate', icon: '🟡' };
      }
    };

    const config = getStatusConfig(status);

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={<span className="text-xs">{config.icon}</span>}
        {...props}
      >
        {config.text}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Category Badge - for venue categories
export interface CategoryBadgeProps extends Omit<BadgeProps, 'variant'> {
  category: string;
}

const CategoryBadge = React.forwardRef<HTMLDivElement, CategoryBadgeProps>(
  ({ category, ...props }, ref) => {
    // Use magic variant for featured categories, outline for others
    const isFeatured = ['family-friendly', 'featured', 'recommended'].includes(
      category.toLowerCase()
    );

    return (
      <Badge
        ref={ref}
        variant={isFeatured ? 'magic' : 'outline'}
        size="sm"
        {...props}
      >
        {category}
      </Badge>
    );
  }
);

CategoryBadge.displayName = 'CategoryBadge';

// Live Badge - for real-time information
export interface LiveBadgeProps extends Omit<BadgeProps, 'variant' | 'pulse'> {
  children: React.ReactNode;
}

const LiveBadge = React.forwardRef<HTMLDivElement, LiveBadgeProps>(
  ({ children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="live"
        pulse
        icon={
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magic-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-magic-teal"></span>
          </span>
        }
        {...props}
      >
        {children}
      </Badge>
    );
  }
);

LiveBadge.displayName = 'LiveBadge';

export { Badge, badgeVariants, StatusBadge, CategoryBadge, LiveBadge };