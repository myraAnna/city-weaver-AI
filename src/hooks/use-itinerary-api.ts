// Custom hook for itinerary API operations
import { useState } from 'react';
import { useAppActions, useApp } from '@/contexts/app-context';
import { MockAPI } from '@/services/mock-api';
import { TravelStyle, Itinerary, Stop } from '@/types';

export interface UseItineraryAPIReturn {
  generateItinerary: (
    selectedStyles: TravelStyle[],
    context: any
  ) => Promise<void>;
  regenerateItinerary: (feedback: string) => Promise<void>;
  addStop: (query: string, insertAfterStopId?: string) => Promise<void>;
  removeStop: (stopId: string) => Promise<void>;
  updateStop: (stopId: string, updates: Partial<Stop>) => Promise<void>;
  reorderStops: (fromIndex: number, toIndex: number) => Promise<void>;
  isGenerating: boolean;
  isUpdating: boolean;
  error: string | null;
}

export const useItineraryAPI = (): UseItineraryAPIReturn => {
  const { state } = useApp();
  const {
    startItineraryGeneration,
    setGeneratedItinerary,
    updateStop: updateStopAction,
    removeStop: removeStopAction,
    addStop: addStopAction,
    reorderStops: reorderStopsAction,
    setError,
  } = useAppActions();

  const [isUpdating, setIsUpdating] = useState(false);

  const generateItinerary = async (
    selectedStyles: TravelStyle[],
    context: any
  ) => {
    try {
      startItineraryGeneration();
      setError(null);

      const response = await MockAPI.ai.generateItinerary(selectedStyles, context);

      if (response.success) {
        setGeneratedItinerary(response.data);
      } else {
        throw new Error(response.message || 'Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate itinerary');
    }
  };

  const regenerateItinerary = async (feedback: string) => {
    if (!state.currentItinerary) {
      throw new Error('No current itinerary to regenerate');
    }

    try {
      setIsUpdating(true);
      setError(null);

      const response = await MockAPI.ai.regenerateItinerary(
        state.currentItinerary,
        feedback
      );

      if (response.success) {
        setGeneratedItinerary(response.data);
      } else {
        throw new Error(response.message || 'Failed to regenerate itinerary');
      }
    } catch (error) {
      console.error('Failed to regenerate itinerary:', error);
      setError(error instanceof Error ? error.message : 'Failed to regenerate itinerary');
    } finally {
      setIsUpdating(false);
    }
  };

  const addStop = async (query: string, insertAfterStopId?: string) => {
    if (!state.currentItinerary) {
      throw new Error('No current itinerary to add stop to');
    }

    try {
      setIsUpdating(true);
      setError(null);

      const response = await MockAPI.ai.addStopToItinerary(
        state.currentItinerary,
        query,
        insertAfterStopId
      );

      if (response.success) {
        addStopAction(response.data);
      } else {
        throw new Error(response.message || 'Failed to add stop');
      }
    } catch (error) {
      console.error('Failed to add stop:', error);
      setError(error instanceof Error ? error.message : 'Failed to add stop');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeStop = async (stopId: string) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Remove stop immediately for better UX
      removeStopAction(stopId);

      // In a real app, you might want to sync this with the server
      // await MockAPI.ai.removeStop(stopId);
    } catch (error) {
      console.error('Failed to remove stop:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove stop');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStop = async (stopId: string, updates: Partial<Stop>) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Update stop immediately for better UX
      updateStopAction(stopId, updates);

      // In a real app, you might want to sync this with the server
      // await MockAPI.ai.updateStop(stopId, updates);
    } catch (error) {
      console.error('Failed to update stop:', error);
      setError(error instanceof Error ? error.message : 'Failed to update stop');
    } finally {
      setIsUpdating(false);
    }
  };

  const reorderStops = async (fromIndex: number, toIndex: number) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Reorder stops immediately for better UX
      reorderStopsAction(fromIndex, toIndex);

      // In a real app, you might want to sync this with the server
      // await MockAPI.ai.reorderStops(fromIndex, toIndex);
    } catch (error) {
      console.error('Failed to reorder stops:', error);
      setError(error instanceof Error ? error.message : 'Failed to reorder stops');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    generateItinerary,
    regenerateItinerary,
    addStop,
    removeStop,
    updateStop,
    reorderStops,
    isGenerating: state.isGeneratingItinerary,
    isUpdating,
    error: state.error,
  };
};