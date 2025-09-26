/**
 * Places API Service
 * Handles place search, nearby places, and location-based functionality
 */

import { apiClient, APIResponse } from './api-client';

// Places API Types
export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

export interface Place {
  place_id: string;
  display_name: string;
  formatted_address: string;
  location: PlaceLocation;
  rating?: number;
  user_rating_count?: number;
  price_level?: string;
  website_uri?: string;
  regular_opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
  types: string[];
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  distance_meters?: number;
}

export interface PlaceSearchRequest {
  query: string;
  location?: PlaceLocation;
  radius?: number;
  language?: string;
  region?: string;
}

export interface PlaceSearchResponse {
  places: Place[];
  query_prediction: string;
}

export interface NearbyPlacesRequest {
  location: PlaceLocation;
  radius?: number;
  type?: string;
  keyword?: string;
  min_rating?: number;
  price_level?: string;
  open_now?: boolean;
}

export interface NearbyPlacesResponse {
  places: Place[];
  next_page_token?: string;
}

export interface PlaceDetailsRequest {
  place_id: string;
  fields?: string[];
}

export interface AutocompleteRequest {
  input: string;
  location?: PlaceLocation;
  radius?: number;
  types?: string[];
  language?: string;
  region?: string;
}

export interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
  matched_substrings: Array<{
    offset: number;
    length: number;
  }>;
}

export interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
}

// Places API Service
export class PlacesAPI {
  /**
   * Search for places based on text query
   */
  async searchPlaces(params: PlaceSearchRequest): Promise<APIResponse<PlaceSearchResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('query', params.query);

    if (params.location) {
      searchParams.append('latitude', params.location.latitude.toString());
      searchParams.append('longitude', params.location.longitude.toString());
    }

    if (params.radius) searchParams.append('radius', params.radius.toString());
    if (params.language) searchParams.append('language', params.language);
    if (params.region) searchParams.append('region', params.region);

    return apiClient.get<PlaceSearchResponse>(`/api/places/search?${searchParams.toString()}`);
  }

  /**
   * Get places near a location
   */
  async getNearbyPlaces(params: NearbyPlacesRequest): Promise<APIResponse<NearbyPlacesResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('latitude', params.location.latitude.toString());
    searchParams.append('longitude', params.location.longitude.toString());

    if (params.radius) searchParams.append('radius', params.radius.toString());
    if (params.type) searchParams.append('type', params.type);
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.min_rating) searchParams.append('min_rating', params.min_rating.toString());
    if (params.price_level) searchParams.append('price_level', params.price_level);
    if (params.open_now !== undefined) searchParams.append('open_now', params.open_now.toString());

    return apiClient.get<NearbyPlacesResponse>(`/api/places/nearby?${searchParams.toString()}`);
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(params: PlaceDetailsRequest): Promise<APIResponse<Place>> {
    const searchParams = new URLSearchParams();
    searchParams.append('place_id', params.place_id);

    if (params.fields) {
      searchParams.append('fields', params.fields.join(','));
    }

    return apiClient.get<Place>(`/api/places/details?${searchParams.toString()}`);
  }

  /**
   * Get place autocomplete predictions
   */
  async getAutocomplete(params: AutocompleteRequest): Promise<APIResponse<AutocompleteResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append('input', params.input);

    if (params.location) {
      searchParams.append('latitude', params.location.latitude.toString());
      searchParams.append('longitude', params.location.longitude.toString());
    }

    if (params.radius) searchParams.append('radius', params.radius.toString());
    if (params.types) searchParams.append('types', params.types.join(','));
    if (params.language) searchParams.append('language', params.language);
    if (params.region) searchParams.append('region', params.region);

    return apiClient.get<AutocompleteResponse>(`/api/places/autocomplete?${searchParams.toString()}`);
  }

  /**
   * Format place for display
   */
  formatPlaceDisplay(place: Place): string {
    return place.display_name || place.formatted_address;
  }

  /**
   * Get place category from types
   */
  getPlaceCategory(place: Place): string {
    const categoryMap: Record<string, string> = {
      'tourist_attraction': 'attraction',
      'museum': 'culture',
      'restaurant': 'food',
      'meal_takeaway': 'food',
      'food': 'food',
      'lodging': 'accommodation',
      'shopping_mall': 'shopping',
      'store': 'shopping',
      'park': 'nature',
      'amusement_park': 'entertainment',
      'night_club': 'nightlife',
      'bar': 'nightlife'
    };

    for (const type of place.types) {
      if (categoryMap[type]) {
        return categoryMap[type];
      }
    }

    return 'general';
  }

  /**
   * Calculate distance between two locations
   */
  calculateDistance(from: PlaceLocation, to: PlaceLocation): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    const lat1 = this.toRad(from.latitude);
    const lat2 = this.toRad(to.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Math.round(d * 1000); // Return in meters
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /**
   * Get place photo URL
   */
  getPlacePhotoUrl(place: Place, maxWidth: number = 400): string | null {
    if (!place.photos || place.photos.length === 0) {
      return null;
    }

    const photo = place.photos[0];
    return `/api/places/photo?photo_reference=${photo.photo_reference}&max_width=${maxWidth}`;
  }

  /**
   * Check if place is open now
   */
  isPlaceOpen(place: Place): boolean | null {
    if (!place.regular_opening_hours) {
      return null;
    }

    return place.regular_opening_hours.open_now || false;
  }

  /**
   * Get price level description
   */
  getPriceLevelDescription(priceLevel: string): string {
    const levels: Record<string, string> = {
      '1': '$',
      '2': '$$',
      '3': '$$$',
      '4': '$$$$'
    };

    return levels[priceLevel] || 'Unknown';
  }
}

// Export singleton instance
export const placesAPI = new PlacesAPI();

// Export utility functions
export const searchPlaces = (params: PlaceSearchRequest) => placesAPI.searchPlaces(params);
export const getNearbyPlaces = (params: NearbyPlacesRequest) => placesAPI.getNearbyPlaces(params);
export const getPlaceDetails = (params: PlaceDetailsRequest) => placesAPI.getPlaceDetails(params);
export const getAutocomplete = (params: AutocompleteRequest) => placesAPI.getAutocomplete(params);

export default placesAPI;