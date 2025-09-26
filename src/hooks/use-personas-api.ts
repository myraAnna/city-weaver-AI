/**
 * Personas API Hook
 * React hook for persona generation functionality
 */

import { useState, useCallback } from 'react';
import { personasAPI, PersonaGenerationResponse, EnhancedTravelStyle } from '@/services/personas-api';
import { TravelStyle } from '@/types';

export interface UsePersonasAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  personas: PersonaGenerationResponse[];
  enhancedStyles: EnhancedTravelStyle[];

  // Actions
  generatePersona: (interests: string[], location: string) => Promise<PersonaGenerationResponse | null>;
  generatePersonasForStyles: (styles: TravelStyle[], location: string) => Promise<EnhancedTravelStyle[]>;
  getSuggestedPersonas: (location: string) => Promise<PersonaGenerationResponse[]>;
  clearError: () => void;
  clearPersonas: () => void;
}

export const usePersonasAPI = (): UsePersonasAPIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personas, setPersonas] = useState<PersonaGenerationResponse[]>([]);
  const [enhancedStyles, setEnhancedStyles] = useState<EnhancedTravelStyle[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPersonas = useCallback(() => {
    setPersonas([]);
    setEnhancedStyles([]);
  }, []);

  const generatePersona = useCallback(async (
    interests: string[],
    location: string
  ): Promise<PersonaGenerationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await personasAPI.generatePersona({
        interests,
        location
      });

      if (response.ok && response.data) {
        const newPersona = response.data;
        setPersonas(prev => [...prev, newPersona]);
        return newPersona;
      } else {
        setError(response.error || 'Failed to generate persona');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate persona';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generatePersonasForStyles = useCallback(async (
    styles: TravelStyle[],
    location: string
  ): Promise<EnhancedTravelStyle[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await personasAPI.generatePersonasForStyles(styles, location);

      if (response.ok && response.data) {
        setEnhancedStyles(response.data);

        // Extract personas and add to personas list
        const newPersonas = response.data
          .map(style => style.persona)
          .filter((persona): persona is PersonaGenerationResponse => !!persona);

        setPersonas(prev => [...prev, ...newPersonas]);

        return response.data;
      } else {
        setError(response.error || 'Failed to generate personas for styles');
        return styles; // Return original styles if persona generation fails
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate personas for styles';
      setError(errorMessage);
      return styles;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSuggestedPersonas = useCallback(async (
    location: string
  ): Promise<PersonaGenerationResponse[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await personasAPI.getSuggestedPersonas(location);

      if (response.ok && response.data) {
        const suggestedPersonas = response.data;
        setPersonas(prev => [...prev, ...suggestedPersonas]);
        return suggestedPersonas;
      } else {
        setError(response.error || 'Failed to get suggested personas');
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get suggested personas';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    personas,
    enhancedStyles,

    // Actions
    generatePersona,
    generatePersonasForStyles,
    getSuggestedPersonas,
    clearError,
    clearPersonas,
  };
};

export default usePersonasAPI;