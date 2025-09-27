/**
 * Plans API Service
 * Handles plan creation, management, and conversational re-planning
 */

import { apiClient, APIResponse } from './api-client';
import { PersonaGenerationResponse } from './personas-api';
import mockStopsData from '../data/mockstops.json';
import mockData2 from '../data/mockdata2.json';
import mockData from '../data/mockdata.json';
import historyData from '../data/history.json';

// Plan API Types (based on API schema)
export interface PlanLocation {
  latitude: number;
  longitude: number;
}

export interface PlaceDetails {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: PlanLocation;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  websiteUri?: string;
  regularOpeningHours?: {
    openNow: boolean;
    periods?: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
    weekdayDescriptions?: string[];
    nextOpenTime?: string;
    nextCloseTime?: string;
  };
  types: string[];
  goodForChildren?: boolean;
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

export interface MapData {
  staticMapUrl: string;
  navigationUrl: string;
}

export interface PlanPayload {
  itinerary: ItineraryStop[];
  map_data: MapData;
}

export interface Plan {
  plan_id: string;
  user_id: string;
  persona: PersonaGenerationResponse;
  payload: PlanPayload;
  conversation_history: ConversationMessage[];
  draft_itinerary?: {
    stops: ItineraryStop[];
  };
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'confirmed';
  name?: string;
  // Legacy support - keep itinerary for backward compatibility
  itinerary?: ItineraryStop[];
}

export interface CreatePlanRequest {
  interests: string[];
  location_name: string;
  location: {
    latitude: number;
    longitude: number;
  };
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
  action: 'message_user' | 'propose_draft_plan';
  response: string;
  payload: PlanPayload | null;
}

// Plans API Service
export class PlansAPI {
  /**
   * Create a new travel plan
   */
  async createPlan(data: CreatePlanRequest): Promise<APIResponse<Plan>> {
    console.log('🌐 PlansAPI.createPlan called with:', data);

    try {
      const response: APIResponse<Plan> = {
        data: mockStopsData as unknown as Plan,
        status: 200,
        ok: true
      };
      console.log('🌐 PlansAPI.createPlan response:', response);
      return response;
    } catch (error) {
      console.error('💥 PlansAPI.createPlan error:', error);
      throw error;
    }
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
    try {
      return {
        data: mockStopsData as unknown as Plan,
        status: 200,
        ok: true
      };
    } catch (error) {
      console.error('💥 PlansAPI.getPlan error:', error);
      throw error;
    }
  }

  /**
   * Send chat message for plan re-planning
   */
  async chatWithPlan(planId: string, message: string): Promise<APIResponse<ChatResponse>> {
    try {
      // Store conversation in localStorage
      const existingHistory = JSON.parse(localStorage.getItem('chat-history') || '[]');
      const newConversation = {
        planId,
        message,
        timestamp: new Date().toISOString()
      };
      existingHistory.push(newConversation);
      localStorage.setItem('chat-history', JSON.stringify(existingHistory));
      console.log('💬 Added conversation to localStorage:', newConversation);
      
      // Count messages for this plan
      const planMessages = existingHistory.filter((conv: any) => conv.planId === planId);
      const messageCount = planMessages.length;
      
      // Return mockdata2.json on second message, mockdata.json on first
      const responseData = messageCount >= 2 ? mockData2 : mockData;
      
      return {
        data: responseData as unknown as ChatResponse,
        status: 200,
        ok: true
      };
    } catch (error) {
      console.error('💥 PlansAPI.chatWithPlan error:', error);
      throw error;
    }
  }

  /**
   * Confirm plan changes (make draft active)
   */
  async confirmPlan(planId: string): Promise<APIResponse<Plan>> {
    try {
      return {
        data: mockData2 as unknown as Plan,
        status: 200,
        ok: true
      };
    } catch (error) {
      console.error('💥 PlansAPI.confirmPlan error:', error);
      throw error;
    }
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

    const stops = plan.payload?.itinerary || plan.itinerary || [];
    if (stops.length === 0) return 'New Plan';

    const firstStop = stops[0]?.place_details?.displayName?.text;
    const lastStop = stops[stops.length - 1]?.place_details?.displayName?.text;

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
    const stops = plan.payload?.itinerary || plan.itinerary || [];
    if (stops.length === 0) return null;

    const firstStop = stops[0];
    const address = firstStop.place_details?.formattedAddress;

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
    const stops = plan.payload?.itinerary || plan.itinerary || [];
    if (stops.length === 0) return '0 hours';

    // Simple calculation based on number of stops
    const hours = Math.max(2, stops.length * 0.5);
    return hours >= 1 ? `${Math.round(hours)} hours` : `${Math.round(hours * 60)} minutes`;
  }

  /**
   * Get plan highlights (top 3 stops)
   */
  getPlanHighlights(plan: Plan): string[] {
    const stops = plan.payload?.itinerary || plan.itinerary || [];
    return stops
      .slice(0, 3)
      .map(stop => stop.place_details?.displayName?.text)
      .filter(Boolean) as string[];
  }

  /**
   * Check if plan has draft changes
   */
  hasDraftChanges(plan: Plan): boolean {
    return false;
  }

  /**
   * Get active itinerary (draft if available, otherwise main)
   */
  getActiveItinerary(plan: Plan): ItineraryStop[] {
    if (this.hasDraftChanges(plan)) {
      return plan.draft_itinerary!.stops;
    }
    return plan.payload?.itinerary || plan.itinerary || [];
  }

  /**
   * Validate plan data
   */
  validatePlan(plan: Plan): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!plan.plan_id) errors.push('Plan ID is required');
    if (!plan.persona) errors.push('Persona is required');

    const itinerary = plan.payload?.itinerary || plan.itinerary || [];
    if (itinerary.length === 0) {
      errors.push('At least one itinerary stop is required');
    }

    // Validate itinerary stops
    if (itinerary.length > 0) {
      itinerary.forEach((stop, index) => {
        if (!stop.place_details?.id) {
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
export const createNewPlan = (interests: string[], location_name: string, location: { latitude: number; longitude: number }) =>
  plansAPI.createPlan({ interests, location_name, location });

export const getAllPlans = () => plansAPI.getPlans();

export const getPlanById = (planId: string) => plansAPI.getPlan(planId);

export const sendChatMessage = (planId: string, message: string) =>
  plansAPI.chatWithPlan(planId, message);

export const confirmPlanChanges = (planId: string) => plansAPI.confirmPlan(planId);

export default plansAPI;