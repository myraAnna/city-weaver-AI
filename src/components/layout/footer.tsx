'use client';

import React from 'react';
import { cn } from '@/utils';
import { Container } from './layout';

export interface FooterProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'landing';
}

const Footer = ({ className, variant = 'default' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer
        className={cn(
          'mt-auto py-4 text-center',
          'text-sm text-foreground-secondary',
          className
        )}
      >
        <Container>
          <p>© {currentYear} City Weaver AI. Made with ✨ for travelers.</p>
        </Container>
      </footer>
    );
  }

  if (variant === 'landing') {
    return (
      <footer
        className={cn(
          'mt-auto bg-background-secondary',
          'border-t border-border-subtle',
          className
        )}
      >
        <Container>
          <div className="py-12">
            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  {/* Logo */}
                  <div className="w-6 h-6">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id="footerLogoGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#00D4AA" />
                          <stop offset="100%" stopColor="#B794F6" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M4 20 L8 12 L12 20 L16 8 L20 16"
                        stroke="url(#footerLogoGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="1.5"
                        fill="url(#footerLogoGradient)"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-foreground">City Weaver AI</span>
                </div>
                <p className="text-foreground-secondary text-sm max-w-md">
                  Your AI travel companion that adapts as you explore.
                  Transform tour planning from fragmented chaos into an
                  interactive and enjoyable experience.
                </p>
              </div>

              {/* Links sections */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      How it works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#sample-plans"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Sample Plans
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Features
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#help"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      className="text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom section */}
            <div className="pt-8 border-t border-border-subtle">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-foreground-secondary">
                  © {currentYear} City Weaver AI. All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground-secondary">
                    Made with ✨ for travelers
                  </span>

                  {/* Social links placeholder */}
                  <div className="flex items-center gap-3">
                    <a
                      href="#twitter"
                      className="text-foreground-secondary hover:text-magic-teal transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a
                      href="#github"
                      className="text-foreground-secondary hover:text-magic-teal transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    );
  }

  // Default footer
  return (
    <footer
      className={cn(
        'mt-auto py-6',
        'border-t border-border-subtle',
        'bg-background-secondary/50',
        className
      )}
    >
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Copyright */}
          <p className="text-sm text-foreground-secondary">
            © {currentYear} City Weaver AI. All rights reserved.
          </p>

          {/* Right side - Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#privacy"
              className="text-foreground-secondary hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-foreground-secondary hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#help"
              className="text-foreground-secondary hover:text-foreground transition-colors"
            >
              Help
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };