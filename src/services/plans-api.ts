/**
 * Plans API Service
 * Handles plan creation, management, and conversational re-planning
 */

import { apiClient, APIResponse } from './api-client';
import { PersonaGenerationResponse } from './personas-api';

// Plan API Types (based on API schema)
export interface PlanLocation {
  latitude: number;
  longitude: number;
}

export interface PlaceDetails {
  place_id: string;
  display_name: string;
  formatted_address: string;
  location: PlanLocation;
  rating?: number;
  user_rating_count?: number;
  price_level?: string;
  website_uri?: string;
  regular_opening_hours?: any;
  types: string[];
}

export interface ItineraryStop {
  stop: number;
  time: string;
  narrative: string;
  place_details: PlaceDetails;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Plan {
  plan_id: string;
  user_id: string;
  persona: PersonaGenerationResponse;
  itinerary: ItineraryStop[];
  conversation_history: ConversationMessage[];
  draft_itinerary?: {
    stops: ItineraryStop[];
  };
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'confirmed';
  name?: string;
}

export interface CreatePlanRequest {
  persona: PersonaGenerationResponse;
  location: PlanLocation;
}

export interface PlanSummary {
  plan_id: string;
  name: string;
  created_at: string;
  status?: 'draft' | 'confirmed';
  location?: string;
  preview?: {
    stops_count: number;
    duration: string;
    highlights: string[];
  };
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  type: 'plan' | 'message';
  response: Plan | string;
}

// Plans API Service
export class PlansAPI {
  /**
   * Create a new travel plan
   */
  async createPlan(data: CreatePlanRequest): Promise<APIResponse<Plan>> {
    return apiClient.post<Plan>('/api/plans', data);
  }

  /**
   * Get all plans for authenticated user
   */
  async getPlans(): Promise<APIResponse<{ plans: PlanSummary[] }>> {
    return apiClient.get<{ plans: PlanSummary[] }>('/api/plans');
  }

  /**
   * Get specific plan by ID
   */
  async getPlan(planId: string): Promise<APIResponse<Plan>> {
    return apiClient.get<Plan>(`/api/plans/${planId}`);
  }

  /**
   * Send chat message for plan re-planning
   */
  async chatWithPlan(planId: string, message: string): Promise<APIResponse<ChatResponse>> {
    return apiClient.post<ChatResponse>(`/api/plans/${planId}/chat`, { message });
  }

  /**
   * Confirm plan changes (make draft active)
   */
  async confirmPlan(planId: string): Promise<APIResponse<Plan>> {
    return apiClient.post<Plan>(`/api/plans/${planId}/confirm`);
  }

  /**
   * Update plan details (name, etc.)
   */
  async updatePlan(planId: string, updates: Partial<Plan>): Promise<APIResponse<Plan>> {
    return apiClient.put<Plan>(`/api/plans/${planId}`, updates);
  }

  /**
   * Delete a plan
   */
  async deletePlan(planId: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/api/plans/${planId}`);
  }

  /**
   * Generate plan name from itinerary
   */
  generatePlanName(plan: Plan): string {
    if (plan.name) return plan.name;

    const stops = plan.itinerary || [];
    if (stops.length === 0) return 'New Plan';

    const firstStop = stops[0]?.place_details?.display_name;
    const lastStop = stops[stops.length - 1]?.place_details?.display_name;

    if (firstStop && lastStop && firstStop !== lastStop) {
      return `${firstStop} to ${lastStop}`;
    } else if (firstStop) {
      return `${firstStop} Adventure`;
    } else {
      const location = this.extractLocationFromPlan(plan);
      return location ? `${location} Tour` : 'City Adventure';
    }
  }

  /**
   * Extract location string from plan
   */
  extractLocationFromPlan(plan: Plan): string | null {
    const stops = plan.itinerary || [];
    if (stops.length === 0) return null;

    const firstStop = stops[0];
    const address = firstStop.place_details?.formatted_address;

    if (address) {
      // Extract city from address (simplified)
      const parts = address.split(',');
      return parts[parts.length - 2]?.trim() || parts[0]?.trim();
    }

    return null;
  }

  /**
   * Calculate plan duration from itinerary
   */
  calculatePlanDuration(plan: Plan): string {
    const stops = plan.itinerary || [];
    if (stops.length === 0) return '0 hours';

    // Simple calculation based on number of stops
    const hours = Math.max(2, stops.length * 0.5);
    return hours >= 1 ? `${Math.round(hours)} hours` : `${Math.round(hours * 60)} minutes`;
  }

  /**
   * Get plan highlights (top 3 stops)
   */
  getPlanHighlights(plan: Plan): string[] {
    const stops = plan.itinerary || [];
    return stops
      .slice(0, 3)
      .map(stop => stop.place_details?.display_name)
      .filter(Boolean) as string[];
  }

  /**
   * Check if plan has draft changes
   */
  hasDraftChanges(plan: Plan): boolean {
    return !!(plan.draft_itinerary && plan.draft_itinerary.stops);
  }

  /**
   * Get active itinerary (draft if available, otherwise main)
   */
  getActiveItinerary(plan: Plan): ItineraryStop[] {
    if (this.hasDraftChanges(plan)) {
      return plan.draft_itinerary!.stops;
    }
    return plan.itinerary || [];
  }

  /**
   * Validate plan data
   */
  validatePlan(plan: Plan): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!plan.plan_id) errors.push('Plan ID is required');
    if (!plan.persona) errors.push('Persona is required');
    if (!plan.itinerary || plan.itinerary.length === 0) {
      errors.push('At least one itinerary stop is required');
    }

    // Validate itinerary stops
    if (plan.itinerary) {
      plan.itinerary.forEach((stop, index) => {
        if (!stop.place_details?.place_id) {
          errors.push(`Stop ${index + 1} is missing place details`);
        }
        if (!stop.time) {
          errors.push(`Stop ${index + 1} is missing time`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const plansAPI = new PlansAPI();

// Export utility functions
export const createNewPlan = (persona: PersonaGenerationResponse, location: PlanLocation, context?: any) =>
  plansAPI.createPlan({ persona, location, context });

export const getAllPlans = () => plansAPI.getPlans();

export const getPlanById = (planId: string) => plansAPI.getPlan(planId);

export const sendChatMessage = (planId: string, message: string) =>
  plansAPI.chatWithPlan(planId, message);

export const confirmPlanChanges = (planId: string) => plansAPI.confirmPlan(planId);

export default plansAPI;