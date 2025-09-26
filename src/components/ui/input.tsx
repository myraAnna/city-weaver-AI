'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const inputVariants = cva(
  // Base styles - Dark mode first
  'flex w-full rounded-lg border bg-input-default text-foreground transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-secondary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'border-border-default',
          'focus-visible:border-magic-teal/50',
          'focus-visible:bg-input-focus',
          'focus-visible:shadow-magic-soft/30',
          'hover:border-border-default/80',
        ],
        search: [
          'border-border-default',
          'focus-visible:border-magic-teal/70',
          'focus-visible:bg-input-focus',
          'focus-visible:shadow-magic-soft/40',
          'pl-10', // Space for search icon
        ],
        ghost: [
          'border-transparent bg-transparent',
          'focus-visible:border-magic-teal/50',
          'focus-visible:bg-input-default',
          'hover:bg-card-hover',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-3 py-2',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant, size }),
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'variant'> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearch?.(e.target.value);
    };

    return (
      <Input
        ref={ref}
        variant="search"
        leftIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Slider Component
export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onChange, min = 0, max = 100, step = 1, label, className, formatValue }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {label && (
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
            <span className="text-sm text-foreground-secondary">
              {formatValue ? formatValue(value) : value}
            </span>
          </div>
        )}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="w-full h-2 bg-card-default rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #00D4AA 0%, #B794F6 ${percentage}%, #333333 ${percentage}%, #333333 100%)`,
            }}
          />
        </div>
        <style jsx>{`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00D4AA 0%, #B794F6 100%);
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 212, 170, 0.3);
            transition: all 0.3s ease;
          }

          .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(0, 212, 170, 0.5);
          }

          .slider-thumb::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00D4AA 0%, #B794F6 100%);
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(0, 212, 170, 0.3);
            transition: all 0.3s ease;
          }

          .slider-thumb::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(0, 212, 170, 0.5);
          }
        `}</style>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Input, inputVariants, SearchInput, Slider };