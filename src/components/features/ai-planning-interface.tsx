'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { CenteredLayout, Stack, Container } from '@/components/layout';
import { TravelStyle } from '@/types';
import { ContextSetupData } from './context-setup-form';
import { usePlansAPI } from '@/hooks';

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
  const [isWaitingForAPI, setIsWaitingForAPI] = useState(false);

  // Plans API hook
  const {
    createPlan,
    isLoading: isCreatingPlan,
    error: planError,
    currentPlan
  } = usePlansAPI();

  useEffect(() => {
    console.log('🔄 useEffect triggered:', {
      currentStepIndex,
      totalSteps: planningSteps.length,
      planCreated,
      isComplete
    });

    if (currentStepIndex >= planningSteps.length && !planCreated) {
      console.log('✨ All steps completed, starting plan creation...');
      setIsComplete(true);
      setPlanCreated(true);
      setIsWaitingForAPI(true);

      // Create actual plan using API
      const createActualPlan = async () => {
        try {
          console.log('🚀 Starting plan creation...');
          console.log('📊 Input data:', {
            selectedStyles,
            enhancedStyles,
            contextData
          });
          
          // Extract interests from selected styles
          const styles = enhancedStyles || selectedStyles || [];
          console.log('🎭 Selected styles:', styles);

          // Combine interests from all selected styles
          const interests = styles.flatMap(style => [style.name, ...style.examples])
            .map(interest => interest.replace(/[\x00-\x1F\x7F]/g, '')) // Clean control characters
            .filter(interest => interest.trim().length > 0); // Remove empty strings
          console.log('💡 Combined interests:', interests);

          // Get location name and coordinates from context data
          const location_name = contextData?.location || "";
          const location = {
            latitude: contextData?.coordinates?.latitude || 0,
            longitude: contextData?.coordinates?.longitude || 0
          };

          // Validate that we have location data before proceeding
          if (!location_name.trim()) {
            throw new Error('Location is required. Please go back and select a location.');
          }
          console.log('📍 Location name:', location_name);
          console.log('📍 Location coordinates:', location);

          console.log('🔍 VERIFICATION BEFORE API CALL:');
          console.log('  📊 contextData:', contextData);
          console.log('  📝 interests array:', interests);
          console.log('  🏷️ location_name:', location_name);
          console.log('  📍 location coordinates:', location);
          console.log('  🔄 data structure check:', {
            interestsLength: interests.length,
            locationNameType: typeof location_name,
            locationNameValue: location_name,
            latitudeType: typeof location.latitude,
            latitudeValue: location.latitude,
            longitudeType: typeof location.longitude,
            longitudeValue: location.longitude
          });

          const requestPayload = {
            interests,
            location_name,
            location
          };
          console.log('🎯 FINAL REQUEST PAYLOAD:', JSON.stringify(requestPayload, null, 2));

          const newPlan = await createPlan(requestPayload);

          console.log('✅ Plan creation result:', newPlan);
          console.log('🔍 Plan type:', typeof newPlan);
          console.log('🔍 Plan keys:', newPlan ? Object.keys(newPlan) : 'null');

          if (newPlan) {
            console.log('🎉 Plan created successfully, redirecting immediately...');
            setIsWaitingForAPI(false);
            console.log('📦 Preparing callback data:', {
              styles: selectedStyles,
              enhancedStyles,
              context: contextData,
              plan: newPlan,
              planId: newPlan.plan_id,
            });

            // Small delay to show completion message before redirect
            setTimeout(() => {
              onPlanningComplete?.({
                styles: selectedStyles,
                enhancedStyles,
                context: contextData,
                plan: newPlan,
                planId: newPlan.plan_id,
              });
            }, 1500);
          } else {
            console.log('⚠️ API returned null, staying in waiting state...');
            setIsWaitingForAPI(false);
            onError?.('Failed to create your plan. Please try again.');
          }
        } catch (error) {
          console.error('💥 Plan creation error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('💥 Error details:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
          });
          setIsWaitingForAPI(false);
          onError?.('The API is taking longer than expected. Please try again or check your connection.');
        }
      };

      createActualPlan();
      return;
    }

    if (currentStepIndex < planningSteps.length) {
      const currentStep = planningSteps[currentStepIndex];
      console.log(`⏳ Starting step ${currentStepIndex + 1}/${planningSteps.length}: ${currentStep.label}`);
      
      const timer = setTimeout(() => {
        console.log(`✅ Completed step: ${currentStep.label}`);
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
                  {isWaitingForAPI ? (
                    <>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Generating your{' '}
                        <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                          perfect itinerary
                        </span>
                      </motion.span>
                    </>
                  ) : isComplete ? (
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

                {isComplete && !isWaitingForAPI && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg text-foreground-secondary"
                  >
                    Get ready to explore like never before
                  </motion.p>
                )}

                {isWaitingForAPI && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg text-foreground-secondary"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      This may take up to 2-3 minutes as we discover amazing places for you...
                    </motion.span>
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
                    isComplete={isComplete && !isWaitingForAPI}
                    isWaitingForAPI={isWaitingForAPI}
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
                  <span className="text-magic-teal font-medium">
                    {Math.ceil((new Date(contextData.endDate).getTime() - new Date(contextData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day{Math.ceil((new Date(contextData.endDate).getTime() - new Date(contextData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 !== 1 ? 's' : ''}
                  </span>
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
  isWaitingForAPI?: boolean;
}

const PlanningSteps = ({ steps, currentStepIndex, completedSteps, isComplete, isWaitingForAPI }: PlanningStepsProps) => {
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
      {isComplete && !isWaitingForAPI && (
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

      {/* Waiting for API Message */}
      {isWaitingForAPI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center pt-4 border-t border-border-subtle"
        >
          <div className="text-lg font-medium text-magic-teal mb-2">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⏳ Connecting to AI Travel Assistant...
            </motion.span>
          </div>
          <p className="text-sm text-foreground-secondary">
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            >
              This process typically takes 2-3 minutes as we research the best places for you
            </motion.span>
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