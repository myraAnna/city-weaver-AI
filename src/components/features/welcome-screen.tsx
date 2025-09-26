'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { CenteredLayout, Stack, Container } from '@/components/layout';

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
            <CityIllustration />
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
                Your AI travel companion that{' '}
                <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                  adapts
                </span>{' '}
                as you explore
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-foreground-secondary max-w-xl leading-relaxed">
                Transform tour planning from fragmented chaos into an interactive
                and enjoyable experience. City Weaver AI crafts personalized
                itineraries that evolve with your journey.
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
                  <span>Real-time adaptation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple" />
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple" />
                  <span>Conversational planning</span>
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

// City Illustration Component
const CityIllustration = () => {
  return (
    <div className="relative w-80 h-80 sm:w-96 sm:h-96">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0, 212, 170, 0.2))',
        }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#B794F6" />
          </linearGradient>

          <linearGradient id="buildingGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#333333" />
          </linearGradient>

          {/* Animated gradient for the weaving paths */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA">
              <animate
                attributeName="stop-opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#7C3AED">
              <animate
                attributeName="stop-opacity"
                values="1;0.6;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#B794F6">
              <animate
                attributeName="stop-opacity"
                values="0.8;1;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* City Skyline */}
        {/* Building 1 */}
        <rect
          x="50"
          y="250"
          width="40"
          height="120"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.02;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Building 2 */}
        <rect
          x="100"
          y="200"
          width="35"
          height="170"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.01;1"
            dur="5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Building 3 - Tallest */}
        <rect
          x="145"
          y="150"
          width="45"
          height="220"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.03;1"
            dur="6s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Building 4 */}
        <rect
          x="200"
          y="180"
          width="38"
          height="190"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.01;1"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Building 5 */}
        <rect
          x="250"
          y="220"
          width="42"
          height="150"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.02;1"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Building 6 */}
        <rect
          x="300"
          y="240"
          width="35"
          height="130"
          fill="url(#buildingGradient)"
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.01;1"
            dur="5.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Windows with subtle glow */}
        {/* Building 1 windows */}
        <rect x="58" y="270" width="6" height="8" fill="#00D4AA" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="72" y="290" width="6" height="8" fill="#B794F6" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
        </rect>

        {/* Building 2 windows */}
        <rect x="108" y="230" width="6" height="8" fill="#00D4AA" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <rect x="120" y="250" width="6" height="8" fill="#B794F6" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" />
        </rect>

        {/* AI Weaving Paths - The Magic Element */}
        <g stroke="url(#pathGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round">
          {/* Main weaving path */}
          <path d="M 60 300 Q 120 250 180 280 Q 240 320 300 270">
            <animate
              attributeName="stroke-dasharray"
              values="0 300;150 150;300 0;0 300"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>

          {/* Secondary path */}
          <path d="M 80 320 Q 140 280 200 310 Q 260 340 320 300" opacity="0.7">
            <animate
              attributeName="stroke-dasharray"
              values="0 280;140 140;280 0;0 280"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Tertiary connecting path */}
          <path d="M 100 280 Q 160 240 220 270 Q 280 300 340 260" opacity="0.5">
            <animate
              attributeName="stroke-dasharray"
              values="0 260;130 130;260 0;0 260"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Central AI Core - Pulsing dot */}
        <circle cx="200" cy="290" r="4" fill="url(#cityGradient)">
          <animate
            attributeName="r"
            values="4;8;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.6;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Floating particles */}
        <g fill="url(#cityGradient)" opacity="0.6">
          <circle cx="120" cy="200" r="2">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 5 -10; 0 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="280" cy="220" r="1.5">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; -8 -12; 0 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="180" r="1">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 3 -15; 0 0"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
};

export { WelcomeScreen };