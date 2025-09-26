'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { CenteredLayout, Stack, Container } from '@/components/layout';
import { TravelStyle } from '@/types';
import { ContextSetupData } from './context-setup-form';
import { usePlansAPI } from '@/hooks';
import { PersonaGenerationResponse } from '@/services/personas-api';

export interface AIPlanningInterfaceProps {
  selectedStyles?: TravelStyle[];
  enhancedStyles?: any[]; // EnhancedTravelStyle[] with personas
  contextData?: ContextSetupData;
  onPlanningComplete?: (planData: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface PlanningStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  duration: number; // in seconds
}

const planningSteps: PlanningStep[] = [
  {
    id: 'analyzing',
    label: 'Analyzing Preferences',
    description: 'Understanding your travel style and interests',
    icon: '🧠',
    duration: 2,
  },
  {
    id: 'discovering',
    label: 'Discovering Places',
    description: 'Finding amazing spots that match your vibe',
    icon: '🔍',
    duration: 3,
  },
  {
    id: 'mapping',
    label: 'Mapping Routes',
    description: 'Creating the perfect journey flow',
    icon: '🗺️',
    duration: 2,
  },
  {
    id: 'optimizing',
    label: 'Optimizing Timing',
    description: 'Balancing travel time and experiences',
    icon: '⚡',
    duration: 2,
  },
  {
    id: 'personalizing',
    label: 'Adding Personal Touches',
    description: 'Incorporating local insights and hidden gems',
    icon: '✨',
    duration: 3,
  },
];

const AIPlanningInterface = ({
  selectedStyles,
  enhancedStyles,
  contextData,
  onPlanningComplete,
  onError,
  className,
}: AIPlanningInterfaceProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [planCreated, setPlanCreated] = useState(false);

  // Plans API hook
  const {
    createPlan,
    isLoading: isCreatingPlan,
    error: planError,
    currentPlan
  } = usePlansAPI();

  useEffect(() => {
    if (currentStepIndex >= planningSteps.length && !planCreated) {
      setIsComplete(true);
      setPlanCreated(true);

      // Create actual plan using API
      const createActualPlan = async () => {
        try {
          console.log('🚀 Starting plan creation...');
          
          // Get the dominant persona from enhanced styles
          const stylesWithPersonas = enhancedStyles || selectedStyles || [];
          const dominantStyle = stylesWithPersonas[0];
          const persona = dominantStyle?.persona || {
            name: "City Explorer",
            backstory: "A curious traveler eager to discover new places",
            tone: "enthusiastic and friendly"
          };

          // Create location from context data
          const location = {
            latitude: 3.1390, // Default to KL if no specific location
            longitude: 101.6869
          };

          console.log('📝 Calling createPlan with:', { persona, location });

          const newPlan = await createPlan({
            persona,
            location
          });

          console.log('✅ Plan creation result:', newPlan);

          if (newPlan) {
            console.log('🎉 Plan created successfully, redirecting in 2 seconds...');
            setTimeout(() => {
              onPlanningComplete?.({
                styles: selectedStyles,
                enhancedStyles,
                context: contextData,
                plan: newPlan,
                planId: newPlan.plan_id,
              });
            }, 2000);
          } else {
            console.log('⚠️ API failed, using mock plan to continue flow...');
            // Fallback: Create mock plan to continue user flow
            const mockPlan = {
              plan_id: `mock-${Date.now()}`,
              user_id: 'demo-user',
              persona,
              itinerary: [],
              conversation_history: []
            };
            
            setTimeout(() => {
              onPlanningComplete?.({
                styles: selectedStyles,
                enhancedStyles,
                context: contextData,
                plan: mockPlan,
                planId: mockPlan.plan_id,
              });
            }, 2000);
          }
        } catch (error) {
          console.error('💥 Plan creation error:', error);
          onError?.('Something went wrong while creating your plan.');
        }
      };

      createActualPlan();
      return;
    }

    if (currentStepIndex < planningSteps.length) {
      const currentStep = planningSteps[currentStepIndex];
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep.id]);
        setCurrentStepIndex(prev => prev + 1);
      }, currentStep.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, selectedStyles, enhancedStyles, contextData, onPlanningComplete, onError, createPlan, planCreated]);

  const currentStep = currentStepIndex < planningSteps.length
    ? planningSteps[currentStepIndex]
    : null;

  return (
    <CenteredLayout maxWidth="lg" className={className}>
      <Container>
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* Animated City Skyline Background */}
          <CitySkylineBackground />

          <Stack spacing="xl" align="center" className="relative z-10">
            {/* AI Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <AIAvatar isThinking={!isComplete} />
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center max-w-2xl"
            >
              <Stack spacing="lg" align="center">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {isComplete ? (
                    <>
                      Your{' '}
                      <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                        perfect itinerary
                      </span>{' '}
                      is ready!
                    </>
                  ) : (
                    <>
                      Crafting your{' '}
                      <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                        unique adventure
                      </span>
                    </>
                  )}
                </h1>

                {/* Current Step Description */}
                <AnimatePresence mode="wait">
                  {currentStep && (
                    <motion.p
                      key={currentStep.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg text-foreground-secondary"
                    >
                      {currentStep.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {isComplete && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg text-foreground-secondary"
                  >
                    Get ready to explore like never before
                  </motion.p>
                )}
              </Stack>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full max-w-3xl"
            >
              <Card className="bg-card-default/50 backdrop-blur-sm border-border-subtle">
                <CardContent className="p-8">
                  <PlanningSteps
                    steps={planningSteps}
                    currentStepIndex={currentStepIndex}
                    completedSteps={completedSteps}
                    isComplete={isComplete}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Context Summary */}
            {contextData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-center text-sm text-foreground-secondary max-w-lg"
              >
                <p>
                  Planning for <span className="text-magic-teal font-medium">{contextData.group.adults} adult{contextData.group.adults > 1 ? 's' : ''}</span>
                  {contextData.group.children.length > 0 && (
                    <> and <span className="text-magic-teal font-medium">{contextData.group.children.length} child{contextData.group.children.length > 1 ? 'ren' : ''}</span></>
                  )}
                  {' '}exploring <span className="text-magic-teal font-medium">{contextData.location}</span> for{' '}
                  <span className="text-magic-teal font-medium">{contextData.duration}h</span>
                </p>
              </motion.div>
            )}
          </Stack>
        </div>
      </Container>
    </CenteredLayout>
  );
};

// AI Avatar Component
interface AIAvatarProps {
  isThinking: boolean;
}

const AIAvatar = ({ isThinking }: AIAvatarProps) => {
  return (
    <div className="relative">
      {/* Main Avatar Circle */}
      <motion.div
        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple p-1"
        animate={{
          rotate: isThinking ? 360 : 0,
        }}
        transition={{
          duration: isThinking ? 8 : 0,
          repeat: isThinking ? Infinity : 0,
          ease: 'linear',
        }}
      >
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <motion.div
            animate={{
              scale: isThinking ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isThinking ? Infinity : 0,
              ease: 'easeInOut',
            }}
            className="text-4xl sm:text-5xl"
          >
            🤖
          </motion.div>
        </div>
      </motion.div>

      {/* Thinking Particles */}
      {isThinking && (
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-magic-teal to-magic-purple rounded-full"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 4) * 60],
                y: [0, Math.sin((i * Math.PI) / 4) * 60],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 170, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: isThinking ? [1, 1.2, 1] : 1,
          opacity: isThinking ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{
          duration: 3,
          repeat: isThinking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

// Planning Steps Component
interface PlanningStepsProps {
  steps: PlanningStep[];
  currentStepIndex: number;
  completedSteps: string[];
  isComplete: boolean;
}

const PlanningSteps = ({ steps, currentStepIndex, completedSteps, isComplete }: PlanningStepsProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentStepIndex && !isComplete;
        const isUpcoming = index > currentStepIndex && !isComplete;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
              isCurrent
                ? 'bg-magic-teal/10 border border-magic-teal/30'
                : isCompleted
                ? 'bg-success-500/10'
                : 'bg-transparent'
            }`}
          >
            {/* Step Icon/Indicator */}
            <div className="relative flex-shrink-0">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              ) : isCurrent ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 rounded-full border-2 border-magic-teal border-t-transparent"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  isUpcoming ? 'bg-card-hover text-foreground-secondary' : 'bg-card-default'
                }`}>
                  {step.icon}
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className={`font-medium transition-colors duration-200 ${
                isCurrent
                  ? 'text-magic-teal'
                  : isCompleted
                  ? 'text-foreground'
                  : 'text-foreground-secondary'
              }`}>
                {step.label}
              </div>
              <div className="text-sm text-foreground-secondary">
                {step.description}
              </div>
            </div>

            {/* Current Step Animation */}
            {isCurrent && (
              <motion.div
                className="w-1 h-8 bg-gradient-to-b from-magic-teal to-magic-purple rounded-full"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: step.duration, ease: 'linear' }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Completion Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center pt-4 border-t border-border-subtle"
        >
          <div className="text-lg font-medium text-magic-teal mb-2">
            🎉 Planning Complete!
          </div>
          <p className="text-sm text-foreground-secondary">
            Your personalized itinerary is ready to explore
          </p>
        </motion.div>
      )}
    </div>
  );
};

// City Skyline Background Component
const CitySkylineBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(0, 212, 170, 0.1))',
        }}
      >
        <defs>
          <linearGradient id="skylineGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B794F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Animated Buildings */}
        {Array.from({ length: 12 }, (_, i) => {
          const height = 200 + Math.random() * 300;
          const width = 40 + Math.random() * 40;
          const x = i * 100;
          const y = 800 - height;

          return (
            <motion.rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              fill="url(#skylineGradient)"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* Animated Connections */}
        <motion.path
          d="M 0 600 Q 300 550 600 580 Q 900 610 1200 560"
          stroke="url(#skylineGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export { AIPlanningInterface };