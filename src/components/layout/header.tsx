'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { Container } from './layout';

export interface HeaderProps {
  className?: string;
  variant?: 'default' | 'transparent' | 'minimal';
  showNav?: boolean;
  showBack?: boolean;
  onBackClick?: () => void;
  title?: string;
}

const Header = ({
  className,
  variant = 'default',
  showNav = false,
  showBack = false,
  onBackClick,
  title,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const variantClasses = {
    default: 'bg-background/80 backdrop-blur-md border-b border-border-subtle',
    transparent: 'bg-transparent',
    minimal: 'bg-background',
  };

  const navItems = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Sample Plans', href: '#sample-plans' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        variantClasses[variant],
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center gap-4">
            {showBack ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* City Weaver AI Logo */}
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Logo icon - abstract city/weaving pattern */}
                  <div className="relative w-8 h-8">
                    <svg
                      viewBox="0 0 32 32"
                      className="w-full h-full"
                      fill="none"
                    >
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient
                          id="logoGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#00D4AA" />
                          <stop offset="100%" stopColor="#B794F6" />
                        </linearGradient>
                      </defs>

                      {/* Abstract city weaving pattern */}
                      <path
                        d="M6 26 L12 16 L18 26 L24 12 L30 22"
                        stroke="url(#logoGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <path
                        d="M2 20 L8 12 L14 20 L20 8 L26 18"
                        stroke="url(#logoGradient)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.6"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="2"
                        fill="url(#logoGradient)"
                        opacity="0.8"
                      />
                    </svg>
                  </div>

                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-foreground">
                      City Weaver AI
                    </h1>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Page title (when showing back button) */}
            {title && (
              <h1 className="text-lg font-semibold text-foreground">
                {title}
              </h1>
            )}
          </div>

          {/* Right side - Navigation or Actions */}
          <div className="flex items-center gap-4">
            {showNav && (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && showNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border-subtle bg-background/95 backdrop-blur-md"
          >
            <Container>
              <nav className="py-4 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-foreground-secondary hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Progress Header - for multi-step flows
export interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
  onBackClick?: () => void;
  className?: string;
}

const ProgressHeader = ({
  currentStep,
  totalSteps,
  title,
  onBackClick,
  className,
}: ProgressHeaderProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-background/80 backdrop-blur-md',
        'border-b border-border-subtle',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Back button */}
          {onBackClick && (
            <Button variant="ghost" size="sm" onClick={onBackClick} className="p-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          )}

          {/* Title and step info */}
          <div className="flex-1 text-center">
            {title && (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            )}
            <p className="text-sm text-foreground-secondary">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Skip button (optional) */}
          <div className="w-16 flex justify-end">
            <Button variant="ghost" size="sm" className="text-foreground-secondary">
              Skip
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-card-default">
          <motion.div
            className="h-full bg-gradient-to-r from-magic-teal to-magic-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </Container>
    </header>
  );
};

// Chat Header - for chat interface
export interface ChatHeaderProps {
  title?: string;
  onClose?: () => void;
  className?: string;
}

const ChatHeader = ({
  title = 'Modify Your Plan',
  onClose,
  className,
}: ChatHeaderProps) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between p-4',
        'border-b border-border-subtle',
        'bg-card-default',
        className
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      )}
    </header>
  );
};

export { Header, ProgressHeader, ChatHeader };