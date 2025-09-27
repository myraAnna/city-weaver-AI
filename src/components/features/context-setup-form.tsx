'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { CenteredLayout, Stack, Container, Grid } from '@/components/layout';
import { LocationInput } from '@/components/forms';
import { Input } from '@/components/ui';
import { TravelGroup } from '@/types';
import { useFormValidation, validationSchemas } from '@/utils/validation';

export interface ContextSetupFormProps {
  onFormSubmit?: (data: ContextSetupData) => void;
  onBack?: () => void;
  className?: string;
}

export interface ContextSetupData {
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  group: TravelGroup;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
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


const ContextSetupForm = ({
  onFormSubmit,
  onBack,
  className,
}: ContextSetupFormProps) => {
  console.log('🎨 ContextSetupForm - Component rendering');
  
  // Memoize initial data to prevent recreation on every render
  const initialData = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      location: '',
      'group.adults': 2,
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      budget: 100,
    };
  }, []);

  const {
    data: formData,
    errors,
    setFieldValue,
    setFieldTouched,
    validateAllFields,
  } = useFormValidation(initialData, validationSchemas.contextSetup);

  const [currentStep, setCurrentStep] = useState(0);
  const [mobilityNeeds, setMobilityNeeds] = useState<string[]>([]);
  const [children, setChildren] = useState<{ age: number }[]>([]);

  console.log('📊 ContextSetupForm - Current step:', currentStep);
  console.log('📝 ContextSetupForm - Form data:', formData);

  const steps = [
    'Location',
    'Group Details',
    'Dates & Budget',
    'Accessibility'
  ];

  const [selectedLocationData, setSelectedLocationData] = useState<{
    name: string;
    coordinates?: { latitude: number; longitude: number };
  }>({ name: '' });

  const handleLocationChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
    setSelectedLocationData(prev => ({ ...prev, name: value as string }));
  };

  const handleLocationSelect = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    setFieldValue('location', location);
    setSelectedLocationData({ name: location, coordinates });
    console.log('🎯 Context Form - Location selected:', location);
    console.log('📍 Context Form - Coordinates:', coordinates);
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
        setFieldTouched('startDate');
        setFieldTouched('endDate');
        setFieldTouched('budget');
        return !errors.startDate && !errors.endDate && !errors.budget &&
               formData.startDate && formData.endDate && formData.budget > 0 &&
               new Date(formData.startDate) <= new Date(formData.endDate);
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
        location: selectedLocationData.name || formData.location,
        coordinates: selectedLocationData.coordinates,
        group: {
          adults: formData['group.adults'],
          children,
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        mobilityNeeds,
      };

      console.log('📋 ContextSetupForm - Final form data being submitted:');
      console.log('🗺️ Location value:', finalData.location);
      console.log('📍 Coordinates:', finalData.coordinates);
      console.log('📊 Complete final data:', finalData);

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
        return formData.startDate && formData.endDate && formData.budget > 0 &&
               !errors.startDate && !errors.endDate && !errors.budget &&
               new Date(formData.startDate) <= new Date(formData.endDate);
      case 3:
        return true;
      default:
        return false;
    }
  };

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
            <div className="flex items-center gap-2 sm:gap-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-gradient-to-r from-magic-teal to-magic-purple text-white shadow-lg scale-110'
                          : 'bg-card-hover text-foreground-secondary border-2 border-border-default'
                      }`}
                    >
                      {index < currentStep ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className={`mt-2 text-xs font-medium text-center transition-colors duration-200 ${
                      index <= currentStep ? 'text-foreground' : 'text-foreground-secondary'
                    }`}>
                      {step}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-[3px] mx-2 transition-all duration-300 rounded-full ${
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
          <div>
            <Card size="lg">
              <CardHeader>
                <CardTitle>{steps[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={currentStep === 0 ? 'block' : 'hidden'}>
                  <Stack spacing="md">
                    <LocationInput
                      label="Where would you like to explore?"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      onLocationSelect={handleLocationSelect}
                      onBlur={handleLocationBlur}
                      error={errors.location}
                      required
                      className="placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />

                    <p className="text-sm text-foreground-secondary">
                      💡 Try searching for specific neighborhoods, landmarks, or areas you want to explore
                    </p>
                  </Stack>
                </div>

                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                  <Stack spacing="lg">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Number of Adults*
                      </label>
                      <div className="flex items-center justify-between p-4 bg-card-hover rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">Adults</span>
                          <span className="text-xs text-foreground-secondary">18+ yrs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFieldChange('group.adults', Math.max(1, formData['group.adults'] - 1))}
                            disabled={formData['group.adults'] <= 1}
                            className="w-8 h-8 rounded-full p-0"
                          >
                            −
                          </Button>
                          <span className="min-w-[2rem] text-center text-foreground font-medium">
                            {formData['group.adults']}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFieldChange('group.adults', Math.min(8, formData['group.adults'] + 1))}
                            disabled={formData['group.adults'] >= 8}
                            className="w-8 h-8 rounded-full p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      {errors['group.adults'] && (
                        <p className="mt-1 text-sm text-red-400">{errors['group.adults']}</p>
                      )}
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
                              className="p-3 bg-card-hover rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground">Child {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeChild(index)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  ✕
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-foreground-secondary">Age</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChildAgeChange(index, Math.max(0, child.age - 1))}
                                    disabled={child.age <= 0}
                                    className="w-6 h-6 rounded-full p-0 text-xs"
                                  >
                                    −
                                  </Button>
                                  <span className="min-w-[1.5rem] text-center text-sm text-foreground font-medium">
                                    {child.age}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChildAgeChange(index, Math.min(17, child.age + 1))}
                                    disabled={child.age >= 17}
                                    className="w-6 h-6 rounded-full p-0 text-xs"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Grid>
                      )}
                    </div>
                  </Stack>
                </div>

                <div className={currentStep === 2 ? 'block' : 'hidden'}>
                  <Stack spacing="lg">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Travel Dates
                      </label>
                      <p className="text-sm text-foreground-secondary mb-4">
                        Select your start and end dates for the trip
                      </p>
                      <Grid cols={{ default: 2 }} gap="md">
                        <div>
                          <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => handleFieldChange('startDate', e.target.value)}
                            onBlur={() => handleFieldBlur('startDate')}
                            error={errors.startDate}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            style={{ color: 'rgb(136 136 136)' }}
                            className="placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => handleFieldChange('endDate', e.target.value)}
                            onBlur={() => handleFieldBlur('endDate')}
                            error={errors.endDate}
                            required
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            style={{ color: 'rgb(136 136 136)' }}
                            className="placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          />
                        </div>
                      </Grid>
                      {formData.startDate && formData.endDate && (
                        <div className="mt-3 p-3 bg-card-hover rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            <span>📅</span>
                            <span>
                              Trip duration: {
                                Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                              } day{
                                Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 !== 1 ? 's' : ''
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Budget per Person (RM)*"
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={(e) => handleFieldChange('budget', parseFloat(e.target.value) || 0)}
                        onBlur={() => handleFieldBlur('budget')}
                        error={errors.budget}
                        placeholder="Enter budget amount"
                        min={1}
                        step={1}
                        style={{ color: 'rgb(136 136 136)' }}
                        className="placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>
                  </Stack>
                </div>

                <div className={currentStep === 3 ? 'block' : 'hidden'}>
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
                </div>
              </CardContent>
            </Card>
          </div>

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