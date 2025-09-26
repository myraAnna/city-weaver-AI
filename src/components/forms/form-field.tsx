'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
}

const FormField = ({
  children,
  label,
  error,
  required,
  className,
  description,
}: FormFieldProps) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {description && (
        <p className="text-xs text-foreground-secondary mb-3">
          {description}
        </p>
      )}

      <div className="relative">
        {children}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Success Message Component
export interface SuccessMessageProps {
  message: string;
  className?: string;
}

const SuccessMessage = ({ message, className }: SuccessMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3',
        className
      )}
    >
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-green-400 text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// Loading State Component
export interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({ message = 'Loading...', className }: LoadingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('flex items-center justify-center gap-3 py-8', className)}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 border-2 border-magic-teal border-t-transparent rounded-full"
      />
      <span className="text-foreground-secondary">{message}</span>
    </motion.div>
  );
};

// Form Container with Submit State
export interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  className?: string;
}

const FormContainer = ({
  children,
  onSubmit,
  isSubmitting,
  isValid,
  className,
}: FormContainerProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting && isValid) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <fieldset disabled={isSubmitting} className="w-full">
        {children}
      </fieldset>
    </form>
  );
};

export { FormField, SuccessMessage, LoadingState, FormContainer };