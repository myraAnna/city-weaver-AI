/**
 * Weather API Hook
 * React hook for weather data and forecasting functionality
 */

import { useState, useCallback, useEffect } from 'react';
import {
  weatherAPI,
  WeatherSummary,
  WeatherForecast,
  WeatherAlert,
  WeatherRequest,
  CurrentWeather
} from '@/services/weather-api';
import { PlaceLocation } from '@/services/places-api';

export interface UseWeatherAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  currentWeather: WeatherSummary | null;
  forecast: WeatherForecast | null;
  weatherAlerts: WeatherAlert[];

  // Actions
  getCurrentWeather: (params: WeatherRequest) => Promise<WeatherSummary | null>;
  getForecast: (params: WeatherRequest) => Promise<WeatherForecast | null>;
  getWeatherAlerts: (location: PlaceLocation | string) => Promise<WeatherAlert[]>;
  refreshWeather: () => Promise<void>;
  clearWeatherData: () => void;
  clearError: () => void;
}

export const useWeatherAPI = (): UseWeatherAPIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherSummary | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [lastLocation, setLastLocation] = useState<PlaceLocation | string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearWeatherData = useCallback(() => {
    setCurrentWeather(null);
    setForecast(null);
    setWeatherAlerts([]);
    setLastLocation(null);
  }, []);

  const getCurrentWeather = useCallback(async (params: WeatherRequest): Promise<WeatherSummary | null> => {
    setIsLoading(true);
    setError(null);
    setLastLocation(params.location);

    try {
      const response = await weatherAPI.getCurrentWeather(params);

      if (response.ok && response.data) {
        const weatherSummary = weatherAPI.weatherToSummary(response.data);
        setCurrentWeather(weatherSummary);
        return weatherSummary;
      } else {
        const errorMessage = response.error || 'Failed to get current weather';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current weather';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getForecast = useCallback(async (params: WeatherRequest): Promise<WeatherForecast | null> => {
    setIsLoading(true);
    setError(null);
    setLastLocation(params.location);

    try {
      const response = await weatherAPI.getForecast(params);

      if (response.ok && response.data) {
        const forecastData = response.data;
        setForecast(forecastData);

        // Update current weather from forecast
        if (forecastData.current) {
          const weatherSummary = weatherAPI.weatherToSummary({
            location: forecastData.location,
            current: forecastData.current
          } as CurrentWeather);
          setCurrentWeather(weatherSummary);
        }

        // Generate weather alerts
        const alerts = weatherAPI.generateWeatherAlerts(forecastData);
        setWeatherAlerts(alerts);

        return forecastData;
      } else {
        const errorMessage = response.error || 'Failed to get weather forecast';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weather forecast';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWeatherAlerts = useCallback(async (
    location: PlaceLocation | string
  ): Promise<WeatherAlert[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await weatherAPI.getWeatherAlerts(location);

      if (response.ok && response.data) {
        const alerts = response.data.alerts;
        setWeatherAlerts(alerts);
        return alerts;
      } else {
        const errorMessage = response.error || 'Failed to get weather alerts';
        setError(errorMessage);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weather alerts';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    if (lastLocation) {
      await getForecast({
        location: lastLocation,
        days: 3,
        include_air_quality: true,
        include_alerts: true
      });
    }
  }, [lastLocation, getForecast]);

  return {
    // State
    isLoading,
    error,
    currentWeather,
    forecast,
    weatherAlerts,

    // Actions
    getCurrentWeather,
    getForecast,
    getWeatherAlerts,
    refreshWeather,
    clearWeatherData,
    clearError,
  };
};

// Hook for location-based weather with auto-refresh
export const useLocationWeather = (
  location: PlaceLocation | string | null,
  autoRefresh: boolean = true,
  refreshInterval: number = 300000 // 5 minutes
) => {
  const weatherAPI = useWeatherAPI();

  useEffect(() => {
    if (location) {
      weatherAPI.getForecast({
        location,
        days: 3,
        include_air_quality: true,
        include_alerts: true
      });
    }

    return () => weatherAPI.clearError();
  }, [location]);

  // Auto-refresh weather data
  useEffect(() => {
    if (autoRefresh && location) {
      const interval = setInterval(() => {
        weatherAPI.refreshWeather();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, location, refreshInterval, weatherAPI]);

  return weatherAPI;
};

export default useWeatherAPI;