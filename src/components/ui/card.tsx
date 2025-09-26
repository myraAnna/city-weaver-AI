'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const cardVariants = cva(
  // Base styles - Dark mode first, no borders by default (per styles.md)
  'relative rounded-lg transition-all duration-300 group overflow-hidden',
  {
    variants: {
      variant: {
        // Default card - clean background, defined by content and spacing
        default: [
          'bg-card-default',
          'hover:bg-card-hover hover:-translate-y-1',
          'hover:shadow-magic-soft/30',
        ],

        // Interactive card - for selections (travel styles)
        interactive: [
          'bg-card-default cursor-pointer',
          'hover:bg-card-hover hover:-translate-y-1',
          'hover:shadow-magic-soft/40',
          // Magic gradient border on hover (per styles.md)
          'hover:before:opacity-100',
          'before:absolute before:inset-0 before:rounded-lg before:p-[1px]',
          'before:bg-gradient-to-r before:from-magic-teal before:to-magic-purple',
          'before:opacity-0 before:transition-opacity before:duration-300',
          'before:-z-10',
          // Content overlay to hide the gradient background
          'after:absolute after:inset-[1px] after:rounded-lg after:bg-card-default',
          'after:-z-10',
          'hover:after:bg-card-hover',
        ],

        // Selected state for interactive cards
        selected: [
          'bg-card-selected cursor-pointer',
          'shadow-magic-medium',
          // Solid magic border when selected
          'before:absolute before:inset-0 before:rounded-lg before:p-[1px]',
          'before:bg-gradient-to-r before:from-magic-teal before:to-magic-purple',
          'before:opacity-100',
          'before:-z-10',
          // Content overlay
          'after:absolute after:inset-[1px] after:rounded-lg after:bg-card-selected',
          'after:-z-10',
        ],

        // Stop card - hangs off timeline (per styles.md)
        stop: [
          'bg-card-default border-0', // No borders by default
          'hover:shadow-magic-soft/40 hover:-translate-y-1',
          // Subtle glowing edge on hover
          'hover:ring-1 hover:ring-magic-teal/30',
        ],

        // Ghost card - transparent
        ghost: [
          'bg-transparent',
          'hover:bg-card-hover/50',
        ],
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  selected?: boolean;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, children, selected, interactive, onClick, ...props }, ref) => {
    // Determine variant based on props
    let finalVariant = variant;
    if (interactive && selected) {
      finalVariant = 'selected';
    } else if (interactive) {
      finalVariant = 'interactive';
    }

    return (
      <div
        className={cn(cardVariants({ variant: finalVariant, size, className }))}
        ref={ref}
        onClick={onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  glowing?: boolean; // For selected cards (per styles.md)
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, glowing, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold text-foreground leading-none tracking-tight',
          glowing && 'text-shadow-glow', // Custom text glow effect
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Description Component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-foreground-secondary', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-foreground', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, cardVariants, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };