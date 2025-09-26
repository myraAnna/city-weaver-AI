/**
 * Routes API Service
 * Handles route calculation, navigation, and direction functionality
 */

import { apiClient, APIResponse } from './api-client';
import { PlaceLocation } from './places-api';

// Routes API Types
export interface RouteWaypoint {
  location: PlaceLocation;
  place_id?: string;
  address?: string;
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
  maneuver?: string;
  travel_mode: 'walking' | 'driving' | 'transit' | 'cycling';
}

export interface RouteLeg {
  start_location: PlaceLocation;
  end_location: PlaceLocation;
  start_address: string;
  end_address: string;
  distance: number; // in meters
  duration: number; // in seconds
  steps: RouteStep[];
}

export interface Route {
  legs: RouteLeg[];
  overview_polyline: string;
  total_distance: number; // in meters
  total_duration: number; // in seconds
  warnings?: string[];
  bounds: {
    northeast: PlaceLocation;
    southwest: PlaceLocation;
  };
}

export interface RouteRequest {
  origin: PlaceLocation;
  destination: PlaceLocation;
  waypoints?: RouteWaypoint[];
  travel_mode?: 'walking' | 'driving' | 'transit' | 'cycling';
  avoid_tolls?: boolean;
  avoid_highways?: boolean;
  avoid_ferries?: boolean;
  optimize_waypoints?: boolean;
  departure_time?: string; // ISO 8601 format
  arrival_time?: string; // ISO 8601 format
}

export interface RouteResponse {
  routes: Route[];
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_WAYPOINTS_EXCEEDED' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';
  geocoded_waypoints?: Array<{
    geocoder_status: string;
    place_id: string;
    types: string[];
  }>;
}

export interface TransitRoute extends Route {
  transit_info: {
    departure_time: string;
    arrival_time: string;
    agencies: Array<{
      name: string;
      url?: string;
      phone?: string;
    }>;
    lines: Array<{
      name: string;
      short_name?: string;
      color?: string;
      agencies: Array<{ name: string }>;
      vehicle: {
        name: string;
        type: 'BUS' | 'RAIL' | 'SUBWAY' | 'TRAIN' | 'TRAM' | 'TROLLEYBUS';
        icon?: string;
      };
    }>;
  };
}

export interface DistanceMatrixRequest {
  origins: PlaceLocation[];
  destinations: PlaceLocation[];
  travel_mode?: 'walking' | 'driving' | 'transit' | 'cycling';
  avoid_tolls?: boolean;
  avoid_highways?: boolean;
  avoid_ferries?: boolean;
  departure_time?: string;
}

export interface DistanceMatrixElement {
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  duration_in_traffic?: { text: string; value: number };
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS';
}

export interface DistanceMatrixResponse {
  rows: Array<{
    elements: DistanceMatrixElement[];
  }>;
  origin_addresses: string[];
  destination_addresses: string[];
  status: string;
}

// Routes API Service
export class RoutesAPI {
  /**
   * Get directions between two points
   */
  async getDirections(params: RouteRequest): Promise<APIResponse<RouteResponse>> {
    const searchParams = new URLSearchParams();

    searchParams.append('origin_lat', params.origin.latitude.toString());
    searchParams.append('origin_lng', params.origin.longitude.toString());
    searchParams.append('destination_lat', params.destination.latitude.toString());
    searchParams.append('destination_lng', params.destination.longitude.toString());

    if (params.travel_mode) searchParams.append('travel_mode', params.travel_mode);
    if (params.avoid_tolls) searchParams.append('avoid_tolls', 'true');
    if (params.avoid_highways) searchParams.append('avoid_highways', 'true');
    if (params.avoid_ferries) searchParams.append('avoid_ferries', 'true');
    if (params.optimize_waypoints) searchParams.append('optimize_waypoints', 'true');
    if (params.departure_time) searchParams.append('departure_time', params.departure_time);
    if (params.arrival_time) searchParams.append('arrival_time', params.arrival_time);

    // Add waypoints if provided
    if (params.waypoints && params.waypoints.length > 0) {
      const waypointStrings = params.waypoints.map(wp =>
        `${wp.location.latitude},${wp.location.longitude}`
      );
      searchParams.append('waypoints', waypointStrings.join('|'));
    }

    return apiClient.get<RouteResponse>(`/api/routes?${searchParams.toString()}`);
  }

  /**
   * Get distance matrix between multiple origins and destinations
   */
  async getDistanceMatrix(params: DistanceMatrixRequest): Promise<APIResponse<DistanceMatrixResponse>> {
    const searchParams = new URLSearchParams();

    // Add origins
    const originStrings = params.origins.map(origin =>
      `${origin.latitude},${origin.longitude}`
    );
    searchParams.append('origins', originStrings.join('|'));

    // Add destinations
    const destinationStrings = params.destinations.map(dest =>
      `${dest.latitude},${dest.longitude}`
    );
    searchParams.append('destinations', destinationStrings.join('|'));

    if (params.travel_mode) searchParams.append('travel_mode', params.travel_mode);
    if (params.avoid_tolls) searchParams.append('avoid_tolls', 'true');
    if (params.avoid_highways) searchParams.append('avoid_highways', 'true');
    if (params.avoid_ferries) searchParams.append('avoid_ferries', 'true');
    if (params.departure_time) searchParams.append('departure_time', params.departure_time);

    return apiClient.get<DistanceMatrixResponse>(`/api/routes/distance-matrix?${searchParams.toString()}`);
  }

  /**
   * Format distance for display
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Format duration for display
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Get travel mode icon
   */
  getTravelModeIcon(mode: string): string {
    const iconMap: Record<string, string> = {
      'walking': '🚶‍♂️',
      'driving': '🚗',
      'transit': '🚌',
      'cycling': '🚴‍♂️'
    };
    return iconMap[mode] || '➡️';
  }

  /**
   * Get maneuver instruction icon
   */
  getManeuverIcon(maneuver: string): string {
    const iconMap: Record<string, string> = {
      'turn-left': '↰',
      'turn-right': '↱',
      'turn-slight-left': '↖',
      'turn-slight-right': '↗',
      'turn-sharp-left': '↸',
      'turn-sharp-right': '↷',
      'straight': '↑',
      'ramp-left': '↰',
      'ramp-right': '↱',
      'merge': '↗',
      'fork-left': '↖',
      'fork-right': '↗',
      'roundabout-left': '↺',
      'roundabout-right': '↻',
      'uturn-left': '↶',
      'uturn-right': '↷'
    };
    return iconMap[maneuver] || '→';
  }

  /**
   * Decode polyline string to coordinates
   */
  decodePolyline(encoded: string): PlaceLocation[] {
    const points: PlaceLocation[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1E5,
        longitude: lng / 1E5
      });
    }

    return points;
  }

  /**
   * Calculate bounds from a list of coordinates
   */
  calculateBounds(coordinates: PlaceLocation[]): {
    northeast: PlaceLocation;
    southwest: PlaceLocation;
  } {
    if (coordinates.length === 0) {
      throw new Error('Cannot calculate bounds for empty coordinates');
    }

    let north = coordinates[0].latitude;
    let south = coordinates[0].latitude;
    let east = coordinates[0].longitude;
    let west = coordinates[0].longitude;

    coordinates.forEach(coord => {
      north = Math.max(north, coord.latitude);
      south = Math.min(south, coord.latitude);
      east = Math.max(east, coord.longitude);
      west = Math.min(west, coord.longitude);
    });

    return {
      northeast: { latitude: north, longitude: east },
      southwest: { latitude: south, longitude: west }
    };
  }

  /**
   * Generate Maps URL for external navigation
   */
  generateMapsUrl(
    origin: PlaceLocation,
    destination: PlaceLocation,
    travelMode: 'walking' | 'driving' | 'transit' | 'cycling' = 'walking'
  ): string {
    const modeParam = {
      'walking': 'w',
      'driving': 'd',
      'transit': 'r',
      'cycling': 'b'
    }[travelMode];

    const baseUrl = 'https://www.google.com/maps/dir/';
    const originParam = `${origin.latitude},${origin.longitude}`;
    const destinationParam = `${destination.latitude},${destination.longitude}`;

    return `${baseUrl}${originParam}/${destinationParam}/@${origin.latitude},${origin.longitude},15z/data=!3m1!4b1!4m2!4m1!3e${modeParam}`;
  }

  /**
   * Check if route is valid
   */
  validateRoute(route: Route): boolean {
    return route.legs.length > 0 &&
           route.total_distance > 0 &&
           route.total_duration > 0;
  }

  /**
   * Get estimated cost for different travel modes
   */
  getEstimatedCost(
    distance: number, // in meters
    travelMode: 'walking' | 'driving' | 'transit' | 'cycling'
  ): number {
    switch (travelMode) {
      case 'walking':
      case 'cycling':
        return 0;
      case 'transit':
        return 2.5; // Base fare for public transport
      case 'driving':
        const kmDistance = distance / 1000;
        const fuelCostPerKm = 0.45; // Approximate fuel cost per km
        const tollCost = kmDistance > 20 ? 5 : 0; // Toll for long distances
        return kmDistance * fuelCostPerKm + tollCost;
      default:
        return 0;
    }
  }
}

// Export singleton instance
export const routesAPI = new RoutesAPI();

// Export utility functions
export const getDirections = (params: RouteRequest) => routesAPI.getDirections(params);
export const getDistanceMatrix = (params: DistanceMatrixRequest) => routesAPI.getDistanceMatrix(params);

export default routesAPI;