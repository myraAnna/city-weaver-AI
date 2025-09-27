/**
 * Routes API Hook
 * React hook for route calculation and navigation functionality
 */

import { useState, useCallback } from 'react';
import {
  routesAPI,
  Route,
  RouteRequest,
  DistanceMatrixRequest,
  DistanceMatrixResponse
} from '@/services/routes-api';
import { PlaceLocation } from '@/services/places-api';

export interface UseRoutesAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  currentRoute: Route | null;
  routes: Route[];
  distanceMatrix: DistanceMatrixResponse | null;

  // Actions
  getDirections: (params: RouteRequest) => Promise<Route | null>;
  getDistanceMatrix: (params: DistanceMatrixRequest) => Promise<DistanceMatrixResponse | null>;
  generateMapsUrl: (origin: PlaceLocation, destination: PlaceLocation, mode?: 'walking' | 'driving' | 'transit' | 'cycling') => string;
  clearRoutes: () => void;
  clearError: () => void;
}

export const useRoutesAPI = (): UseRoutesAPIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [distanceMatrix, setDistanceMatrix] = useState<DistanceMatrixResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRoutes = useCallback(() => {
    setCurrentRoute(null);
    setRoutes([]);
    setDistanceMatrix(null);
  }, []);

  const getDirections = useCallback(async (params: RouteRequest): Promise<Route | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await routesAPI.getDirections(params);

      if (response.ok && response.data) {
        const routeData = response.data;

        if (routeData.status === 'OK' && routeData.routes.length > 0) {
          const firstRoute = routeData.routes[0];
          setCurrentRoute(firstRoute);
          setRoutes(routeData.routes);
          return firstRoute;
        } else {
          const errorMessage = routeData.status === 'ZERO_RESULTS'
            ? 'No route found between the specified locations'
            : routeData.status === 'NOT_FOUND'
            ? 'One or more locations could not be found'
            : `Route calculation failed: ${routeData.status}`;

          setError(errorMessage);
          return null;
        }
      } else {
        const errorMessage = response.error || 'Failed to get directions';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get directions';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDistanceMatrix = useCallback(async (
    params: DistanceMatrixRequest
  ): Promise<DistanceMatrixResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await routesAPI.getDistanceMatrix(params);

      if (response.ok && response.data) {
        const matrixData = response.data;
        setDistanceMatrix(matrixData);
        return matrixData;
      } else {
        const errorMessage = response.error || 'Failed to get distance matrix';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get distance matrix';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateMapsUrl = useCallback((
    origin: PlaceLocation,
    destination: PlaceLocation,
    mode: 'walking' | 'driving' | 'transit' | 'cycling' = 'walking'
  ): string => {
    return routesAPI.generateMapsUrl(origin, destination, mode);
  }, []);

  return {
    // State
    isLoading,
    error,
    currentRoute,
    routes,
    distanceMatrix,

    // Actions
    getDirections,
    getDistanceMatrix,
    generateMapsUrl,
    clearRoutes,
    clearError,
  };
};

export default useRoutesAPI;