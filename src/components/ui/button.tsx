'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const buttonVariants = cva(
  // Base styles - following dark mode first design
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        // Primary - Magic gradient CTA button
        primary: [
          'text-background font-semibold',
          'bg-gradient-to-r from-magic-teal to-magic-purple',
          'hover:shadow-lg hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-md',
          'focus-visible:ring-magic-teal',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-magic-teal/20 before:to-magic-purple/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
        ],

        // Secondary - Subtle outline with magic hover
        secondary: [
          'text-foreground bg-transparent border border-border-default',
          'hover:bg-card-hover hover:border-magic-teal/50',
          'hover:shadow-magic-soft hover:-translate-y-0.5',
          'active:translate-y-0',
          'focus-visible:ring-foreground-muted',
        ],

        // Ghost - Minimal with magic glow on hover
        ghost: [
          'text-foreground-secondary bg-transparent',
          'hover:bg-card-hover hover:text-foreground',
          'hover:shadow-magic-soft/50',
          'focus-visible:ring-foreground-muted',
        ],

        // Outline - Clean border that glows on interaction
        outline: [
          'text-foreground bg-transparent border border-border-default',
          'hover:border-magic-teal/70 hover:shadow-magic-soft',
          'hover:text-foreground hover:-translate-y-0.5',
          'focus-visible:ring-magic-teal',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
        xl: 'h-12 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, loading, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };