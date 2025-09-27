/**
 * Personas API Service
 * Handles persona generation based on user interests and location
 */

import { APIResponse } from './api-client';
import { TravelStyle } from '@/types';

// Persona API Types
export interface PersonaGenerationRequest {
  interests: string[];
  location: string;
}

export interface PersonaGenerationResponse {
  name: string;
  backstory: string;
  tone: string;
}

export interface EnhancedTravelStyle extends TravelStyle {
  persona?: PersonaGenerationResponse;
}

// Personas API Service
export class PersonasAPI {
  /**
   * Generate persona based on interests and location
   * @deprecated - Persona generation is now handled by /api/plans endpoint
   * This method is kept for backward compatibility but will create mock personas
   */
  async generatePersona(data: PersonaGenerationRequest): Promise<APIResponse<PersonaGenerationResponse>> {
    // Create a mock persona based on interests
    const mockPersona: PersonaGenerationResponse = {
      name: `${data.interests[0] || 'Travel'} Explorer`,
      backstory: `A passionate traveler interested in ${data.interests.join(', ')} in ${data.location}`,
      tone: "enthusiastic and knowledgeable"
    };

    return {
      ok: true,
      status: 200,
      data: mockPersona
    };
  }

  /**
   * Generate personas for multiple travel styles
   */
  async generatePersonasForStyles(
    styles: TravelStyle[],
    location: string
  ): Promise<APIResponse<EnhancedTravelStyle[]>> {
    try {
      const enhancedStyles: EnhancedTravelStyle[] = [];

      // Generate persona for each style
      for (const style of styles) {
        // Clean interests to avoid JSON parsing errors
        const cleanInterests = [style.name, ...style.examples]
          .map(interest => interest.replace(/[\x00-\x1F\x7F]/g, '')) // Remove control characters
          .filter(interest => interest.trim().length > 0); // Remove empty strings

        const personaRequest: PersonaGenerationRequest = {
          interests: cleanInterests,
          location: location.replace(/[\x00-\x1F\x7F]/g, '') // Clean location too
        };

        const response = await this.generatePersona(personaRequest);

        if (response.ok && response.data) {
          enhancedStyles.push({
            ...style,
            persona: response.data
          });
        } else {
          // If persona generation fails, include style without persona
          enhancedStyles.push(style);
        }
      }

      return {
        ok: true,
        status: 200,
        data: enhancedStyles
      };
    } catch {
      return {
        ok: false,
        status: 0,
        error: 'Failed to generate personas for travel styles'
      };
    }
  }

  /**
   * Get suggested personas based on location (mock implementation)
   * This could be enhanced to call a real API endpoint
   */
  async getSuggestedPersonas(location: string): Promise<APIResponse<PersonaGenerationResponse[]>> {
    // Mock implementation - in real app this would call an API
    const mockPersonas: PersonaGenerationResponse[] = [
      {
        name: "The Local Explorer",
        backstory: `A curious traveler who loves discovering hidden gems in ${location}`,
        tone: "friendly and enthusiastic"
      },
      {
        name: "The Culture Seeker",
        backstory: `Someone passionate about the rich cultural heritage of ${location}`,
        tone: "respectful and inquisitive"
      },
      {
        name: "The Adventure Guide",
        backstory: `An energetic explorer who seeks unique experiences in ${location}`,
        tone: "exciting and encouraging"
      }
    ];

    return {
      ok: true,
      status: 200,
      data: mockPersonas
    };
  }

  /**
   * Validate persona data
   */
  validatePersona(persona: PersonaGenerationResponse): boolean {
    return !!(
      persona.name &&
      persona.backstory &&
      persona.tone &&
      persona.name.trim().length > 0 &&
      persona.backstory.trim().length > 10 &&
      persona.tone.trim().length > 0
    );
  }

  /**
   * Create a persona-enhanced context for planning
   */
  createPersonaContext(
    styles: EnhancedTravelStyle[],
    location: string
  ): {
    dominantPersona: PersonaGenerationResponse | null;
    combinedInterests: string[];
    contextDescription: string;
  } {
    const stylesWithPersonas = styles.filter(style => style.persona);

    if (stylesWithPersonas.length === 0) {
      return {
        dominantPersona: null,
        combinedInterests: styles.flatMap(style => style.examples),
        contextDescription: `A traveler interested in ${styles.map(s => s.name).join(', ')} in ${location}`
      };
    }

    // Use the first persona as dominant, or blend if multiple
    const dominantPersona = stylesWithPersonas[0].persona!;

    // Combine all interests from selected styles
    const combinedInterests = styles.flatMap(style => [style.name, ...style.examples]);

    // Create a context description
    const contextDescription = stylesWithPersonas.length === 1
      ? `${dominantPersona.backstory} exploring ${location}`
      : `A versatile traveler combining ${stylesWithPersonas.map(s => s.persona!.name).join(' and ')} approaches to explore ${location}`;

    return {
      dominantPersona,
      combinedInterests,
      contextDescription
    };
  }
}

// Export singleton instance
export const personasAPI = new PersonasAPI();

// Export utility functions
export const generatePersonaForStyle = (style: TravelStyle, location: string) =>
  personasAPI.generatePersona({
    interests: [style.name, ...style.examples],
    location
  });

export const enhanceStylesWithPersonas = (styles: TravelStyle[], location: string) =>
  personasAPI.generatePersonasForStyles(styles, location);

export default personasAPI;