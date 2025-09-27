'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Slider } from '@/components/ui';
import { FormField } from './form-field';
import { ValidationRule, validateField } from '@/utils/validation';
import { useDebouncedAutocomplete } from '@/hooks';

export interface ValidatedInputProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (name: string, value: string | number) => void;
  onBlur?: (name: string) => void;
  validationRules?: ValidationRule[];
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'slider';
  placeholder?: string;
  description?: string;
  className?: string;
  // Slider-specific props
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  // Search-specific props
  onSearch?: (value: string) => void;
  suggestions?: string[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ValidatedInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  validationRules = [],
  error,
  required,
  type = 'text',
  placeholder,
  description,
  className,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  onSearch,
  suggestions = [],
  leftIcon,
  rightIcon,
}: ValidatedInputProps) => {
  const [localError, setLocalError] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (newValue: string | number) => {
    onChange(name, newValue);

    // Validate on change if field has been touched
    if (touched && validationRules.length > 0) {
      const validationError = validateField(newValue, validationRules);
      setLocalError(validationError || '');
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setShowSuggestions(false);
    onBlur?.(name);

    // Validate on blur
    if (validationRules.length > 0) {
      const validationError = validateField(value, validationRules);
      setLocalError(validationError || '');
    }
  };

  const handleFocus = () => {
    if (type === 'search' && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(name, suggestion);
    setShowSuggestions(false);
  };

  const displayError = error || localError;
  const hasError = Boolean(displayError);

  const renderInput = () => {
    const commonProps = {
      value: value as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder,
      className: hasError ? 'border-red-400 focus:border-red-400' : '',
      leftIcon,
      rightIcon,
    };

    switch (type) {
      case 'search':
        return (
          <div className="relative">
            <Input
              {...commonProps}
              onChange={(e) => {
                commonProps.onChange?.(e);
                onSearch?.(e.target.value);
              }}
              style={{ color: 'rgb(136 136 136)' }}
              className="bg-input-default placeholder:text-gray-500 dark:placeholder:text-gray-400"
              leftIcon={
                <svg
                  className="h-4 w-4 text-foreground-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card-default border border-border-default rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-card-hover transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-sm text-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-foreground-secondary">📍</span>
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        );

      case 'slider':
        return (
          <Slider
            value={value as number}
            onChange={(newValue) => handleChange(newValue)}
            min={min}
            max={max}
            step={step}
            formatValue={formatValue}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            min={min}
            max={max}
            step={step}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <FormField
      label={label}
      error={displayError}
      required={required}
      description={description}
      className={className}
    >
      {renderInput()}
    </FormField>
  );
};

// Specialized components for common use cases
export interface LocationInputProps extends Omit<ValidatedInputProps, 'type'> {
  onLocationSelect?: (location: string, coordinates?: { latitude: number; longitude: number }) => void;
}

export const LocationInput = ({ onLocationSelect, onSearch, ...props }: LocationInputProps) => {
  const {
    autocompleteResults,
    isLoading,
    error,
    setQuery,
    clearAutocomplete,
    getLocationForResult
  } = useDebouncedAutocomplete(300);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (query: string) => {
    onSearch?.(query);
    setQuery(query);

    if (query.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      clearAutocomplete();
    }
  };

  const handleLocationSelect = (location: string) => {
    console.log('🎯 LocationInput - User selected:', location);
    console.log('📝 LocationInput - Saving to form field:', props.name);

    const locationData = getLocationForResult(location);
    console.log('📍 LocationInput - Found coordinates:', locationData?.coordinates);

    props.onChange(props.name, location);
    onLocationSelect?.(location, locationData?.coordinates);
    setShowSuggestions(false);
    clearAutocomplete();
  };

  // autocompleteResults is already an array of strings (display_name from Nominatim)
  const suggestions = autocompleteResults;

  // Enhanced input with loading and error states
  const enhancedProps = {
    ...props,
    rightIcon: isLoading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-magic-teal border-t-transparent" />
    ) : (
      <span className="text-foreground-secondary">📍</span>
    )
  };

  return (
    <div className="relative">
      <ValidatedInput
        {...enhancedProps}
        type="search"
        onSearch={handleSearch}
        suggestions={showSuggestions ? suggestions : []}
        placeholder={props.placeholder || "Enter city, district, or area..."}
        validationRules={props.validationRules || [
          { required: true, message: 'Location is required' },
          { minLength: 2, message: 'Location must be at least 2 characters' },
        ]}
      />

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 z-10"
        >
          {error}
        </motion.div>
      )}

      {/* Enhanced Suggestions with prediction data */}
      {showSuggestions && autocompleteResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-4 bg-card-default border border-border-default rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto w-full"
        >
          {autocompleteResults.map((location, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-4 text-left hover:bg-card-hover transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-border-subtle last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-foreground-secondary flex-shrink-0">📍</span>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-foreground line-clamp-2">
                    {location}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export interface BudgetSliderProps extends Omit<ValidatedInputProps, 'type' | 'formatValue'> {
  currency?: string;
}

export const BudgetSlider = ({ currency = 'RM', ...props }: BudgetSliderProps) => {
  const formatBudget = (value: number) => `${currency}${value}`;

  return (
    <ValidatedInput
      {...props}
      type="slider"
      formatValue={formatBudget}
      validationRules={props.validationRules || [
        { required: true, message: 'Budget is required' },
        { min: 10, max: 1000, message: 'Budget must be between RM10 and RM1000' },
      ]}
    />
  );
};

export interface DurationSliderProps extends Omit<ValidatedInputProps, 'type' | 'formatValue'> {
  unit?: string;
}

export const DurationSlider = ({ unit = 'h', ...props }: DurationSliderProps) => {
  const formatDuration = (value: number) => `${value}${unit}`;

  return (
    <ValidatedInput
      {...props}
      type="slider"
      formatValue={formatDuration}
      validationRules={props.validationRules || [
        { required: true, message: 'Duration is required' },
        { min: 1, max: 24, message: 'Duration must be between 1 and 24 hours' },
      ]}
    />
  );
};

export { ValidatedInput };