'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { CenteredLayout, Stack, Container, Grid } from '@/components/layout';
import { FormField } from '@/components/forms';
import { travelPersonas } from '@/data/travel-personas';
import { TravelStyle } from '@/types';
import { validateField, validationSchemas } from '@/utils/validation';
import { usePersonasAPI } from '@/hooks';

export interface StyleSelectionScreenProps {
  onStyleSelected?: (selectedStyles: TravelStyle[], enhancedStyles?: any[]) => void;
  onBack?: () => void;
  maxSelections?: number;
  location?: string; // Location for persona generation
  className?: string;
}

const StyleSelectionScreen = ({
  onStyleSelected,
  onBack,
  maxSelections = 3,
  location = 'your destination',
  className,
}: StyleSelectionScreenProps) => {
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([]);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Persona API hook
  const {
    isLoading: isGeneratingPersonas,
    error: personaError,
    generatePersonasForStyles,
    clearError: clearPersonaError
  } = usePersonasAPI();

  const handleStyleToggle = (style: TravelStyle) => {
    setSelectedStyles(prev => {
      const isSelected = prev.find(s => s.id === style.id);
      let newSelection: TravelStyle[];

      if (isSelected) {
        // Remove if already selected
        newSelection = prev.filter(s => s.id !== style.id);
      } else if (prev.length < maxSelections) {
        // Add if under limit
        newSelection = [...prev, style];
      } else {
        // Replace oldest selection if at limit
        newSelection = [...prev.slice(1), style];
      }

      // Validate the selection
      const validationError = validateField(newSelection, validationSchemas.styleSelection.selectedStyles);
      setError(validationError || '');

      return newSelection;
    });
  };

  const handleContinue = async () => {
    // Final validation before continuing
    const validationError = validateField(selectedStyles, validationSchemas.styleSelection.selectedStyles);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    clearPersonaError();
    setShowSuccess(true);

    try {
      // Generate personas for selected styles
      const enhancedStyles = await generatePersonasForStyles(selectedStyles, location);

      // Delay the callback to show success message, then proceed
      setTimeout(() => {
        onStyleSelected?.(selectedStyles, enhancedStyles);
      }, 800);
    } catch (err) {
      // If persona generation fails, continue with original styles
      setTimeout(() => {
        onStyleSelected?.(selectedStyles);
      }, 800);
    }
  };

  const isSelected = (styleId: string) => {
    return selectedStyles.some(s => s.id === styleId);
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
            className="text-center max-w-3xl mx-auto"
          >
            <Stack spacing="md" align="center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                What&apos;s your{' '}
                <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                  travel style?
                </span>
              </h1>

              <p className="text-lg text-foreground-secondary max-w-2xl leading-relaxed">
                Choose up to {maxSelections} styles that match your interests.
                This helps our AI craft the perfect itinerary just for you.
              </p>

              {/* Selection Counter */}
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <span>Selected: {selectedStyles.length}/{maxSelections}</span>
                {selectedStyles.length > 0 && (
                  <div className="flex gap-1">
                    {Array.from({ length: maxSelections }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          i < selectedStyles.length
                            ? 'bg-gradient-to-r from-magic-teal to-magic-purple'
                            : 'bg-border-default'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Stack>
          </motion.div>

          {/* Persona Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FormField error={error || personaError || undefined}>
              <Grid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap="lg">
              {travelPersonas.map((persona, index) => {
                const selected = isSelected(persona.id);

                return (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      interactive
                      selected={selected}
                      onClick={() => handleStyleToggle(persona)}
                      className="h-full cursor-pointer"
                      size="md"
                    >
                      <CardHeader>
                        {/* Icon and Title */}
                        <div className="flex items-center gap-3">
                          <div className="text-3xl" role="img" aria-label={persona.name}>
                            {persona.icon}
                          </div>
                          <CardTitle glowing={selected}>
                            {persona.name}
                          </CardTitle>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Stack spacing="md">
                          {/* Description */}
                          <CardDescription>
                            {persona.description}
                          </CardDescription>

                          {/* Examples */}
                          <div className="flex flex-wrap gap-1">
                            {persona.examples.slice(0, 3).map((example, i) => (
                              <span
                                key={i}
                                className={`inline-block px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                                  selected
                                    ? 'bg-magic-teal/20 text-magic-teal border border-magic-teal/30'
                                    : 'bg-card-hover text-foreground-secondary border border-border-subtle'
                                }`}
                              >
                                {example}
                              </span>
                            ))}
                            {persona.examples.length > 3 && (
                              <span className="inline-block px-2 py-1 text-xs text-foreground-secondary">
                                +{persona.examples.length - 3} more
                              </span>
                            )}
                          </div>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              </Grid>
            </FormField>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between max-w-lg mx-auto w-full"
          >
            {/* Back Button */}
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-foreground-secondary hover:text-foreground"
              >
                ← Back
              </Button>
            )}

            {/* Continue Button */}
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={selectedStyles.length === 0 || showSuccess || isGeneratingPersonas}
              loading={isGeneratingPersonas}
              className={`${
                selectedStyles.length === 0 || showSuccess || isGeneratingPersonas
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ml-auto`}
            >
              {isGeneratingPersonas
                ? 'Creating Your Personas...'
                : showSuccess
                ? 'Success!'
                : 'Continue'}
              {!showSuccess && (
                <motion.div
                  className="ml-2"
                  animate={{ x: selectedStyles.length > 0 ? [0, 4, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.div>
              )}
              {showSuccess && (
                <motion.div
                  className="ml-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  ✓
                </motion.div>
              )}
            </Button>
          </motion.div>

          {/* Selected Styles Summary */}
          {selectedStyles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="p-4 rounded-lg bg-card-hover border border-border-subtle">
                <p className="text-sm text-foreground-secondary mb-2">
                  Your selected travel styles:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedStyles.map((style) => (
                    <div
                      key={style.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-magic-teal/20 to-magic-purple/20 border border-magic-teal/30"
                    >
                      <span className="text-sm">{style.icon}</span>
                      <span className="text-sm font-medium text-foreground">
                        {style.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </Stack>
      </Container>
    </CenteredLayout>
  );
};

export { StyleSelectionScreen };