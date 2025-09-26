'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { CenteredLayout, Stack, Container, Grid } from '@/components/layout';
import { LocationInput, BudgetSlider, DurationSlider, ValidatedInput } from '@/components/forms';
import { TravelGroup } from '@/types';
import { useFormValidation, validationSchemas, ValidationErrors } from '@/utils/validation';

export interface ContextSetupFormProps {
  onFormSubmit?: (data: ContextSetupData) => void;
  onBack?: () => void;
  className?: string;
}

export interface ContextSetupData {
  location: string;
  group: TravelGroup;
  duration: number; // in hours
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'full-day';
  budget: number; // per person in local currency
  mobilityNeeds: string[];
  mustInclude?: string[];
}

const mobilityOptions = [
  { id: 'wheelchair-accessible', label: 'Wheelchair accessible', icon: '♿' },
  { id: 'limited-walking', label: 'Limited walking', icon: '🚶‍♂️' },
  { id: 'no-stairs', label: 'Avoid stairs', icon: '🚫' },
  { id: 'public-transport', label: 'Public transport friendly', icon: '🚌' },
  { id: 'elderly-friendly', label: 'Elderly friendly', icon: '👴' },
  { id: 'stroller-friendly', label: 'Stroller friendly', icon: '👶' },
];

const timeOfDayOptions = [
  { id: 'morning', label: 'Morning', description: '6AM - 12PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', description: '12PM - 6PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', description: '6PM - 12AM', icon: '🌆' },
  { id: 'full-day', label: 'Full Day', description: '6AM - 10PM', icon: '🌍' },
];

const ContextSetupForm = ({
  onFormSubmit,
  onBack,
  className,
}: ContextSetupFormProps) => {
  const initialData = {
    location: '',
    'group.adults': 2,
    duration: 6,
    budget: 100,
  };

  const {
    data: formData,
    errors,
    setFieldValue,
    setFieldTouched,
    validateAllFields,
    isValid,
  } = useFormValidation(initialData, validationSchemas.contextSetup);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<ContextSetupData['timeOfDay']>('full-day');
  const [mobilityNeeds, setMobilityNeeds] = useState<string[]>([]);
  const [children, setChildren] = useState<{ age: number }[]>([]);

  const steps = [
    'Location',
    'Group Details',
    'Timing & Budget',
    'Accessibility'
  ];

  const handleLocationChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  const handleLocationBlur = (name: string) => {
    setFieldTouched(name);
  };

  const handleFieldChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
  };

  const handleFieldBlur = (name: string) => {
    setFieldTouched(name);
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const updatedChildren = children.map((child, i) =>
      i === index ? { age: Math.max(0, Math.min(17, age)) } : child
    );
    setChildren(updatedChildren);
  };

  const addChild = () => {
    setChildren(prev => [...prev, { age: 8 }]);
  };

  const removeChild = (index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const handleTimeOfDayChange = (newTimeOfDay: ContextSetupData['timeOfDay']) => {
    setTimeOfDay(newTimeOfDay);

    // Adjust duration based on time of day
    const defaultDurations = {
      morning: 4,
      afternoon: 5,
      evening: 4,
      'full-day': 8,
    };

    setFieldValue('duration', defaultDurations[newTimeOfDay]);
  };

  const toggleMobilityNeed = (needId: string) => {
    setMobilityNeeds(prev =>
      prev.includes(needId)
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const isCurrentStepValid = validateCurrentStep();

    if (!isCurrentStepValid) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack?.();
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        setFieldTouched('location');
        return !errors.location && formData.location.trim().length > 2;
      case 1:
        setFieldTouched('group.adults');
        return !errors['group.adults'] && formData['group.adults'] > 0;
      case 2:
        setFieldTouched('duration');
        setFieldTouched('budget');
        return !errors.duration && !errors.budget && formData.duration > 0 && formData.budget > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const isFormValid = validateAllFields();

    if (isFormValid) {
      const finalData: ContextSetupData = {
        location: formData.location,
        group: {
          adults: formData['group.adults'],
          children,
        },
        duration: formData.duration,
        timeOfDay,
        budget: formData.budget,
        mobilityNeeds,
      };

      onFormSubmit?.(finalData);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.location.trim().length > 2 && !errors.location;
      case 1:
        return formData['group.adults'] > 0 && !errors['group.adults'];
      case 2:
        return formData.duration > 0 && formData.budget > 0 && !errors.duration && !errors.budget;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const formatBudget = (value: number) => `RM${value}`;
  const formatDuration = (value: number) => `${value}h`;

  return (
    <CenteredLayout maxWidth="lg" className={className}>
      <Container>
        <Stack spacing="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Stack spacing="md" align="center">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Tell us about your{' '}
                <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                  adventure
                </span>
              </h1>

              <p className="text-lg text-foreground-secondary max-w-2xl">
                Help us create the perfect itinerary by sharing a few details about your trip.
              </p>
            </Stack>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-magic-teal to-magic-purple text-white'
                        : 'bg-card-hover text-foreground-secondary'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-[2px] mx-2 transition-colors duration-200 ${
                        index < currentStep
                          ? 'bg-gradient-to-r from-magic-teal to-magic-purple'
                          : 'bg-border-default'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Steps */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card size="lg">
              <CardHeader>
                <CardTitle>{steps[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && (
                  <Stack spacing="md">
                    <LocationInput
                      label="Where would you like to explore?"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      onBlur={handleLocationBlur}
                      error={errors.location}
                      required
                    />

                    <p className="text-sm text-foreground-secondary">
                      💡 Try searching for specific neighborhoods, landmarks, or areas you want to explore
                    </p>
                  </Stack>
                )}

                {currentStep === 1 && (
                  <Stack spacing="lg">
                    <div>
                      <ValidatedInput
                        label="Number of Adults"
                        name="group.adults"
                        value={formData['group.adults']}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        type="slider"
                        min={1}
                        max={8}
                        step={1}
                        error={errors['group.adults']}
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">
                          Children (Ages 0-17)
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addChild}
                          className="text-magic-teal hover:text-magic-teal"
                        >
                          + Add Child
                        </Button>
                      </div>

                      {children.length === 0 ? (
                        <div className="text-center py-6 text-foreground-secondary">
                          No children in your group
                        </div>
                      ) : (
                        <Grid cols={{ default: 2 }} gap="md">
                          {children.map((child, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-3 bg-card-hover rounded-lg"
                            >
                              <div className="flex-1">
                                <ValidatedInput
                                  label={`Child ${index + 1} Age`}
                                  name={`child-${index}-age`}
                                  value={child.age}
                                  onChange={(_, age) => handleChildAgeChange(index, age as number)}
                                  type="slider"
                                  min={0}
                                  max={17}
                                  step={1}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChild(index)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                        </Grid>
                      )}
                    </div>
                  </Stack>
                )}

                {currentStep === 2 && (
                  <Stack spacing="lg">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Time of Day
                      </label>
                      <Grid cols={{ default: 2 }} gap="md">
                        {timeOfDayOptions.map((option) => (
                          <Card
                            key={option.id}
                            interactive
                            selected={timeOfDay === option.id}
                            onClick={() => handleTimeOfDayChange(option.id as ContextSetupData['timeOfDay'])}
                            className="cursor-pointer"
                            size="sm"
                          >
                            <CardContent>
                              <div className="text-center">
                                <div className="text-2xl mb-2">{option.icon}</div>
                                <div className="text-sm font-medium text-foreground">
                                  {option.label}
                                </div>
                                <div className="text-xs text-foreground-secondary">
                                  {option.description}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </Grid>
                    </div>

                    <div>
                      <DurationSlider
                        label="Trip Duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        min={1}
                        max={12}
                        step={0.5}
                        error={errors.duration}
                        required
                      />
                    </div>

                    <div>
                      <BudgetSlider
                        label="Budget per Person"
                        name="budget"
                        value={formData.budget}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        min={20}
                        max={500}
                        step={10}
                        error={errors.budget}
                        required
                      />
                    </div>
                  </Stack>
                )}

                {currentStep === 3 && (
                  <Stack spacing="lg">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Mobility & Accessibility Needs
                      </label>
                      <p className="text-sm text-foreground-secondary mb-4">
                        Select any accessibility requirements for your group (optional)
                      </p>

                      <Grid cols={{ default: 2 }} gap="md">
                        {mobilityOptions.map((option) => {
                          const isSelected = mobilityNeeds.includes(option.id);
                          return (
                            <Card
                              key={option.id}
                              interactive
                              selected={isSelected}
                              onClick={() => toggleMobilityNeed(option.id)}
                              className="cursor-pointer"
                              size="sm"
                            >
                              <CardContent>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{option.icon}</span>
                                  <span className="text-sm font-medium text-foreground">
                                    {option.label}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Grid>

                      {mobilityNeeds.length > 0 && (
                        <div className="mt-4 p-3 bg-card-hover rounded-lg">
                          <p className="text-sm text-foreground-secondary mb-2">Selected:</p>
                          <div className="flex flex-wrap gap-2">
                            {mobilityNeeds.map((needId) => {
                              const option = mobilityOptions.find(opt => opt.id === needId);
                              return option ? (
                                <Badge key={needId} variant="outline">
                                  {option.icon} {option.label}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <Button
              variant="ghost"
              onClick={prevStep}
              className="text-foreground-secondary hover:text-foreground"
            >
              ← {currentStep === 0 ? 'Back' : 'Previous'}
            </Button>

            <Button
              size="lg"
              onClick={nextStep}
              disabled={!canProceed()}
              className={`${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentStep === steps.length - 1 ? 'Create Itinerary' : 'Continue'}
              {currentStep !== steps.length - 1 && (
                <motion.div
                  className="ml-2"
                  animate={{ x: canProceed() ? [0, 4, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.div>
              )}
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </CenteredLayout>
  );
};

export { ContextSetupForm };