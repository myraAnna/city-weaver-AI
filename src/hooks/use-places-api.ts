/**
 * Places API Hook
 * React hook for places search and location functionality
 */

import { useState, useCallback, useEffect } from 'react';
import {
  placesAPI,
  Place,
  PlaceLocation,
  AutocompletePrediction,
  PlaceSearchRequest,
  NearbyPlacesRequest,
  AutocompleteRequest
} from '@/services/places-api';

export interface UsePlacesAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  searchResults: Place[];
  nearbyPlaces: Place[];
  autocompleteResults: AutocompletePrediction[];
  selectedPlace: Place | null;

  // Actions
  searchPlaces: (params: PlaceSearchRequest) => Promise<Place[]>;
  getNearbyPlaces: (params: NearbyPlacesRequest) => Promise<Place[]>;
  getAutocomplete: (params: AutocompleteRequest) => Promise<AutocompletePrediction[]>;
  getPlaceDetails: (placeId: string) => Promise<Place | null>;
  selectPlace: (place: Place | null) => void;
  clearSearchResults: () => void;
  clearNearbyPlaces: () => void;
  clearAutocomplete: () => void;
  clearError: () => void;
}

export const usePlacesAPI = (): UsePlacesAPIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  const clearNearbyPlaces = useCallback(() => {
    setNearbyPlaces([]);
  }, []);

  const clearAutocomplete = useCallback(() => {
    setAutocompleteResults([]);
  }, []);

  const selectPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place);
  }, []);

  const searchPlaces = useCallback(async (params: PlaceSearchRequest): Promise<Place[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await placesAPI.searchPlaces(params);

      if (response.ok && response.data) {
        const places = response.data.places;
        setSearchResults(places);
        return places;
      } else {
        const errorMessage = response.error || 'Failed to search places';
        setError(errorMessage);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search places';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNearbyPlaces = useCallback(async (params: NearbyPlacesRequest): Promise<Place[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await placesAPI.getNearbyPlaces(params);

      if (response.ok && response.data) {
        const places = response.data.places;
        setNearbyPlaces(places);
        return places;
      } else {
        const errorMessage = response.error || 'Failed to get nearby places';
        setError(errorMessage);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get nearby places';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAutocomplete = useCallback(async (params: AutocompleteRequest): Promise<AutocompletePrediction[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await placesAPI.getAutocomplete(params);

      if (response.ok && response.data) {
        const predictions = response.data.predictions;
        setAutocompleteResults(predictions);
        return predictions;
      } else {
        const errorMessage = response.error || 'Failed to get autocomplete results';
        setError(errorMessage);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get autocomplete results';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlaceDetails = useCallback(async (placeId: string): Promise<Place | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await placesAPI.getPlaceDetails({ place_id: placeId });

      if (response.ok && response.data) {
        const place = response.data;
        setSelectedPlace(place);
        return place;
      } else {
        const errorMessage = response.error || 'Failed to get place details';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get place details';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    searchResults,
    nearbyPlaces,
    autocompleteResults,
    selectedPlace,

    // Actions
    searchPlaces,
    getNearbyPlaces,
    getAutocomplete,
    getPlaceDetails,
    selectPlace,
    clearSearchResults,
    clearNearbyPlaces,
    clearAutocomplete,
    clearError,
  };
};

// Hook for debounced autocomplete
export const useDebouncedAutocomplete = (delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedQuery.trim().length >= 2) {
        setIsLoading(true);
        setError(null);
        
        // Use Nominatim API (free, no API key required)
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            const results = data.map((result: any) => result.display_name);
            setAutocompleteResults(results);
          })
          .catch(err => {
            setError('Failed to fetch suggestions');
            setAutocompleteResults([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setAutocompleteResults([]);
        setIsLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedQuery, delay]);

  const setQuery = useCallback((query: string) => {
    setDebouncedQuery(query);
  }, []);

  const clearAutocomplete = () => {
    setAutocompleteResults([]);
    setError(null);
  };

  return {
    autocompleteResults,
    isLoading,
    error,
    setQuery,
    clearAutocomplete,
    query: debouncedQuery
  };
};

export default usePlacesAPI;