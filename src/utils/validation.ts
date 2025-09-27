// Form validation utilities and rules
import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      return rule.message;
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return rule.message;
      }
      if (rule.max !== undefined && value > rule.max) {
        return rule.message;
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message;
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

export const validateForm = (
  formData: Record<string, any>,
  validationSchema: Record<string, ValidationRule[]>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const fieldValue = formData[fieldName];
    const error = validateField(fieldValue, rules);

    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
};

// Common validation rules
export const commonRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    required: true,
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Must be at least ${length} characters long`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Must be no more than ${length} characters long`,
  }),

  numberRange: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `Must be between ${min} and ${max}`,
  }),

  positiveNumber: (message = 'Must be a positive number'): ValidationRule => ({
    min: 0.01,
    message,
  }),

  location: (message = 'Please enter a valid location'): ValidationRule => ({
    minLength: 3,
    custom: (value: string) => {
      // Basic location validation - could be enhanced with geocoding API
      return typeof value === 'string' && value.trim().length >= 3;
    },
    message,
  }),
};

// Form validation schemas for different forms
export const validationSchemas = {
  contextSetup: {
    location: [
      commonRules.required('Please enter a destination'),
      commonRules.location(),
    ],
    'group.adults': [
      commonRules.required('Number of adults is required'),
      commonRules.numberRange(1, 10, 'Adults must be between 1 and 10'),
    ],
    duration: [
      commonRules.required('Trip duration is required'),
      commonRules.numberRange(1, 24, 'Duration must be between 1 and 24 hours'),
    ],
    budget: [
      commonRules.required('Budget is required'),
      commonRules.numberRange(10, 1000, 'Budget must be between RM10 and RM1000'),
    ],
  },

  styleSelection: {
    selectedStyles: [
      {
        required: true,
        custom: (value: any[]) => Array.isArray(value) && value.length > 0,
        message: 'Please select at least one travel style',
      },
      {
        custom: (value: any[]) => Array.isArray(value) && value.length <= 3,
        message: 'Please select no more than 3 travel styles',
      },
    ],
  },

  auth: {
    email: [
      commonRules.required('Email is required'),
      commonRules.email(),
    ],
    password: [
      commonRules.required('Password is required'),
      commonRules.minLength(8, 'Password must be at least 8 characters'),
    ],
    name: [
      commonRules.required('Name is required'),
      commonRules.minLength(2, 'Name must be at least 2 characters'),
      commonRules.maxLength(50, 'Name must be no more than 50 characters'),
    ],
  },
};

// Hook for form validation
export const useFormValidation = (
  initialData: Record<string, any>,
  schema: Record<string, ValidationRule[]>
) => {
  // Use lazy initialization to prevent issues with Strict Mode
  const [data, setData] = React.useState(() => initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  // Store initial data ref to detect changes
  const initialDataRef = React.useRef(initialData);

  // Reset form data when initialData changes (for component remounting in Strict Mode)
  React.useEffect(() => {
    const hasChanged = Object.keys(initialData).some(
      key => initialData[key] !== initialDataRef.current[key]
    ) || Object.keys(initialDataRef.current).length !== Object.keys(initialData).length;

    if (hasChanged) {
      setData(initialData);
      setErrors({});
      setTouched({});
      initialDataRef.current = initialData;
    }
  }, [initialData]);

  const validateSingleField = (fieldName: string, value: any) => {
    if (schema[fieldName]) {
      const error = validateField(value, schema[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || '',
      }));
      return !error;
    }
    return true;
  };

  const validateAllFields = () => {
    const newErrors = validateForm(data, schema);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setFieldValue = (fieldName: string, value: any) => {
    setData(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validate field if it has been touched
    if (touched[fieldName]) {
      validateSingleField(fieldName, value);
    }
  };

  const setFieldTouched = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate field when touched
    validateSingleField(fieldName, data[fieldName]);
  };

  const resetForm = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  const isValid = Object.keys(errors).every(key => !errors[key]);
  const hasErrors = Object.keys(errors).some(key => errors[key]);

  return {
    data,
    errors,
    touched,
    isValid,
    hasErrors,
    setFieldValue,
    setFieldTouched,
    validateSingleField,
    validateAllFields,
    resetForm,
  };
};

const ValidationUtils = {
  validateField,
  validateForm,
  commonRules,
  validationSchemas,
  useFormValidation,
};

export default ValidationUtils;