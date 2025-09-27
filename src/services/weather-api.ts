/**
 * Weather API Service
 * Handles weather data retrieval and forecasting
 */

import { apiClient, APIResponse } from './api-client';
import { PlaceLocation } from './places-api';

// Weather API Types
export interface CurrentWeather {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      us_epa_index: number;
      gb_defra_index: number;
    };
  };
}

export interface WeatherForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
  };
  hour: Array<{
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
  }>;
}

export interface WeatherForecast {
  location: CurrentWeather['location'];
  current: CurrentWeather['current'];
  forecast: {
    forecastday: WeatherForecastDay[];
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

export interface WeatherAlert {
  id: string;
  type: 'weather' | 'air_quality' | 'uv' | 'wind' | 'precipitation';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  message: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  validUntil: string;
  recommendation?: string;
}

export interface WeatherRequest {
  location: PlaceLocation | string; // coordinates or location name
  days?: number; // forecast days (1-10)
  include_air_quality?: boolean;
  include_alerts?: boolean;
  include_hourly?: boolean;
}

export interface WeatherSummary {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  feels_like: number;
  uv_index: number;
  visibility: number;
  pressure: number;
  precipitation_chance: number;
  is_day: boolean;
  last_updated: string;
}

// Weather API Service
export class WeatherAPI {
  /**
   * Get current weather for a location
   */
  async getCurrentWeather(params: WeatherRequest): Promise<APIResponse<CurrentWeather>> {
    const searchParams = new URLSearchParams();

    if (typeof params.location === 'string') {
      searchParams.append('q', params.location);
    } else {
      searchParams.append('q', `${params.location.latitude},${params.location.longitude}`);
    }

    if (params.include_air_quality) searchParams.append('aqi', 'yes');
    if (params.include_alerts) searchParams.append('alerts', 'yes');

    return apiClient.get<CurrentWeather>(`/api/weather/current?${searchParams.toString()}`);
  }

  /**
   * Get weather forecast for a location
   */
  async getForecast(params: WeatherRequest): Promise<APIResponse<WeatherForecast>> {
    const searchParams = new URLSearchParams();

    if (typeof params.location === 'string') {
      searchParams.append('q', params.location);
    } else {
      searchParams.append('q', `${params.location.latitude},${params.location.longitude}`);
    }

    searchParams.append('days', (params.days || 3).toString());
    if (params.include_air_quality) searchParams.append('aqi', 'yes');
    if (params.include_alerts) searchParams.append('alerts', 'yes');

    return apiClient.get<WeatherForecast>(`/api/weather/forecast?${searchParams.toString()}`);
  }

  /**
   * Get weather alerts for a location
   */
  async getWeatherAlerts(location: PlaceLocation | string): Promise<APIResponse<{ alerts: WeatherAlert[] }>> {
    const searchParams = new URLSearchParams();

    if (typeof location === 'string') {
      searchParams.append('q', location);
    } else {
      searchParams.append('q', `${location.latitude},${location.longitude}`);
    }

    return apiClient.get<{ alerts: WeatherAlert[] }>(`/api/weather/alerts?${searchParams.toString()}`);
  }

  /**
   * Convert weather data to summary format
   */
  weatherToSummary(weather: CurrentWeather): WeatherSummary {
    return {
      temperature: weather.current.temp_c,
      condition: weather.current.condition.text,
      icon: weather.current.condition.icon,
      humidity: weather.current.humidity,
      wind_speed: weather.current.wind_kph,
      wind_direction: weather.current.wind_dir,
      feels_like: weather.current.feelslike_c,
      uv_index: weather.current.uv,
      visibility: weather.current.vis_km,
      pressure: weather.current.pressure_mb,
      precipitation_chance: 0, // Not available in current weather
      is_day: weather.current.is_day === 1,
      last_updated: weather.current.last_updated
    };
  }

  /**
   * Get weather condition icon
   */
  getConditionIcon(conditionText: string, isDay: boolean): string {
    const condition = conditionText.toLowerCase();

    if (condition.includes('sunny') || condition.includes('clear')) {
      return isDay ? '☀️' : '🌙';
    } else if (condition.includes('partly cloudy') || condition.includes('partly sunny')) {
      return isDay ? '⛅' : '🌙';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      return '☁️';
    } else if (condition.includes('rain') || condition.includes('shower')) {
      return '🌧️';
    } else if (condition.includes('thunderstorm') || condition.includes('storm')) {
      return '⛈️';
    } else if (condition.includes('snow') || condition.includes('blizzard')) {
      return '❄️';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return '🌫️';
    } else if (condition.includes('wind')) {
      return '💨';
    } else {
      return isDay ? '☀️' : '🌙';
    }
  }

  /**
   * Get weather-based travel recommendations
   */
  getTravelRecommendations(weather: WeatherSummary): string[] {
    const recommendations: string[] = [];

    if (weather.temperature > 30) {
      recommendations.push('Stay hydrated and seek shade during midday');
    } else if (weather.temperature < 10) {
      recommendations.push('Dress warmly and consider indoor activities');
    }

    if (weather.precipitation_chance > 70) {
      recommendations.push('Bring an umbrella or raincoat');
      recommendations.push('Consider indoor activities as backup');
    }

    if (weather.uv_index > 7) {
      recommendations.push('Use sunscreen and wear protective clothing');
    }

    if (weather.wind_speed > 25) {
      recommendations.push('Be cautious of strong winds, especially outdoors');
    }

    if (weather.visibility < 5) {
      recommendations.push('Exercise caution when traveling, visibility is reduced');
    }

    return recommendations;
  }

  /**
   * Generate weather alerts from forecast data
   */
  generateWeatherAlerts(forecast: WeatherForecast): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const today = forecast.forecast.forecastday[0];

    // High temperature alert
    if (today.day.maxtemp_c > 35) {
      alerts.push({
        id: 'high-temp',
        type: 'weather',
        severity: 'high',
        title: 'High Temperature Alert',
        message: `Temperature expected to reach ${today.day.maxtemp_c}°C. Stay hydrated and seek shade.`,
        icon: '🌡️',
        priority: 'high',
        validUntil: today.date,
        recommendation: 'Plan indoor activities during peak heat hours (12-4 PM)'
      });
    }

    // Rain alert
    if (today.day.daily_chance_of_rain > 70) {
      alerts.push({
        id: 'rain-alert',
        type: 'precipitation',
        severity: 'medium',
        title: 'Rain Expected',
        message: `${today.day.daily_chance_of_rain}% chance of rain today. Pack an umbrella.`,
        icon: '🌧️',
        priority: 'medium',
        validUntil: today.date,
        recommendation: 'Consider indoor activities or covered walkways'
      });
    }

    // UV alert
    if (today.day.uv > 7) {
      alerts.push({
        id: 'uv-alert',
        type: 'uv',
        severity: 'medium',
        title: 'High UV Index',
        message: `UV index of ${today.day.uv}. Sun protection recommended.`,
        icon: '☀️',
        priority: 'medium',
        validUntil: today.date,
        recommendation: 'Use sunscreen SPF 30+ and wear protective clothing'
      });
    }

    // Wind alert
    if (today.day.maxwind_kph > 30) {
      alerts.push({
        id: 'wind-alert',
        type: 'wind',
        severity: 'medium',
        title: 'Strong Winds',
        message: `Wind speeds up to ${today.day.maxwind_kph} km/h expected.`,
        icon: '💨',
        priority: 'medium',
        validUntil: today.date,
        recommendation: 'Be cautious of outdoor activities, secure loose items'
      });
    }

    return alerts;
  }

  /**
   * Check if weather is suitable for specific activities
   */
  isGoodWeatherFor(weather: WeatherSummary, activity: 'walking' | 'outdoor' | 'photography' | 'sightseeing'): {
    suitable: boolean;
    reason?: string;
    score: number; // 1-10
  } {
    let score = 5;
    const reasons: string[] = [];

    // Temperature scoring
    if (weather.temperature >= 18 && weather.temperature <= 28) {
      score += 2;
    } else if (weather.temperature < 5 || weather.temperature > 35) {
      score -= 2;
      reasons.push('extreme temperature');
    }

    // Precipitation scoring
    if (weather.precipitation_chance < 20) {
      score += 2;
    } else if (weather.precipitation_chance > 70) {
      score -= 3;
      reasons.push('high chance of rain');
    }

    // Wind scoring
    if (weather.wind_speed < 15) {
      score += 1;
    } else if (weather.wind_speed > 30) {
      score -= 2;
      reasons.push('strong winds');
    }

    // Visibility scoring
    if (weather.visibility > 10) {
      score += 1;
    } else if (weather.visibility < 5) {
      score -= 1;
      reasons.push('poor visibility');
    }

    // Activity-specific adjustments
    switch (activity) {
      case 'photography':
        if (weather.condition.includes('sunny') || weather.condition.includes('partly cloudy')) {
          score += 1;
        }
        break;
      case 'walking':
      case 'sightseeing':
        if (!weather.is_day) {
          score -= 1;
        }
        break;
    }

    return {
      suitable: score >= 6,
      reason: reasons.length > 0 ? reasons.join(', ') : undefined,
      score: Math.max(1, Math.min(10, score))
    };
  }

  /**
   * Format temperature for display
   */
  formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    return `${Math.round(temp)}°${unit}`;
  }

  /**
   * Format wind speed for display
   */
  formatWindSpeed(speed: number, unit: 'kph' | 'mph' = 'kph'): string {
    return `${Math.round(speed)} ${unit}`;
  }

  /**
   * Get weather trend for the day
   */
  getWeatherTrend(forecast: WeatherForecastDay): 'improving' | 'worsening' | 'stable' {
    const morningHours = forecast.hour.slice(6, 12);
    const eveningHours = forecast.hour.slice(18, 24);

    const morningTemp = morningHours.reduce((sum, hour) => sum + hour.temp_c, 0) / morningHours.length;
    const eveningTemp = eveningHours.reduce((sum, hour) => sum + hour.temp_c, 0) / eveningHours.length;

    const morningPrecip = morningHours.reduce((sum, hour) => sum + hour.chance_of_rain, 0) / morningHours.length;
    const eveningPrecip = eveningHours.reduce((sum, hour) => sum + hour.chance_of_rain, 0) / eveningHours.length;

    if (eveningTemp > morningTemp + 3 && eveningPrecip < morningPrecip - 10) {
      return 'improving';
    } else if (eveningTemp < morningTemp - 3 || eveningPrecip > morningPrecip + 10) {
      return 'worsening';
    } else {
      return 'stable';
    }
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPI();

// Export utility functions
export const getCurrentWeather = (params: WeatherRequest) => weatherAPI.getCurrentWeather(params);
export const getForecast = (params: WeatherRequest) => weatherAPI.getForecast(params);
export const getWeatherAlerts = (location: PlaceLocation | string) => weatherAPI.getWeatherAlerts(location);

export default weatherAPI;