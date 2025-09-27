'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { CenteredLayout, Stack, Container } from '@/components/layout';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any;
    }
  }
}

export interface WelcomeScreenProps {
  onStartPlanning?: () => void;
  onHowItWorks?: () => void;
  onSamplePlans?: () => void;
  className?: string;
}

const WelcomeScreen = ({
  onStartPlanning,
  onHowItWorks,
  onSamplePlans,
  className,
}: WelcomeScreenProps) => {
  const handleStartPlanning = () => {
    onStartPlanning?.();
  };


  return (
    <CenteredLayout withAurora maxWidth="lg" className={className}>
      <Container center>
        <Stack spacing="xl" align="center">

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="w-80 h-80 sm:w-96 sm:h-40 flex items-center justify-center">
              <div className="text-6xl">🏙️</div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-2xl"
          >
            <Stack spacing="lg" align="center">
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Malaysian travel{' '}
                <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                  kawan
                </span>{' '}
                for every adventure
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-foreground-secondary max-w-xl leading-relaxed">
                Experience Malaysia through the eyes of a local. Your personal kawan
                transforms travel planning into an immersive, story-driven journey
                with authentic Malaysian insights and cultural connections.
              </p>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 text-sm text-foreground-secondary"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple" />
                  <span>Local Malaysian persona</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple" />
                  <span>Story-driven experiences</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple" />
                  <span>Cultural immersion</span>
                </div>
              </motion.div>
            </Stack>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-sm"
          >
            <Button
              size="lg"
              className="w-full text-lg font-semibold py-4"
              onClick={handleStartPlanning}
            >
              Get Started
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.div>
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-8 text-sm"
          >
            <button
              onClick={onHowItWorks}
              className="text-foreground-secondary hover:text-foreground transition-colors underline underline-offset-4 hover:no-underline"
            >
              How it works
            </button>
            <span className="text-border-default">|</span>
            <button
              onClick={onSamplePlans}
              className="text-foreground-secondary hover:text-foreground transition-colors underline underline-offset-4 hover:no-underline"
            >
              Sample Plans
            </button>
          </motion.div>
        </Stack>
      </Container>

    </CenteredLayout>
  );
};


export { WelcomeScreen };