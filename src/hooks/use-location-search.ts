// Custom hook for location search functionality
import { useState, useCallback, useEffect } from 'react';

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export interface UseLocationSearchReturn {
  suggestions: string[];
  isSearching: boolean;
  error: string | null;
  searchLocations: (query: string) => void;
  clearSuggestions: () => void;
}

export const useLocationSearch = (
  debounceMs: number = 300
): UseLocationSearchReturn => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const searchLocations = useCallback((query: string) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Clear suggestions if query is too short
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    // Debounce the search
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        const locationNames = data.map((result: any) => result.display_name);
        
        setSuggestions(locationNames);
      } catch (error) {
        console.error('Location search failed:', error);
        setError(error instanceof Error ? error.message : 'Search failed');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    setSearchTimeout(timeout);
  }, [debounceMs, searchTimeout]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  }, [searchTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    suggestions,
    isSearching,
    error,
    searchLocations,
    clearSuggestions,
  };
};