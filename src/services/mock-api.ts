// Mock API service for development and testing
import { TravelStyle, Stop, ItineraryData, AIInsight } from '@/types';
import { mockItinerary } from '@/data/mock-itinerary';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export interface MockAPIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Mock AI Planning Service
export class MockAIPlanningService {
  static async generateItinerary(
    selectedStyles: TravelStyle[],
    context: {
      location: string;
      group: any;
      duration: number;
      timeOfDay: string;
      budget: number;
      mobilityNeeds: string[];
    }
  ): Promise<MockAPIResponse<ItineraryData>> {
    await delay(2000); // Simulate API call delay

    // Generate a customized itinerary based on input
    const customizedItinerary = this.customizeItinerary(mockItinerary, selectedStyles, context);

    return {
      data: customizedItinerary,
      success: true,
      message: 'Itinerary generated successfully',
    };
  }

  static async regenerateItinerary(
    currentItinerary: ItineraryData,
    userFeedback: string
  ): Promise<MockAPIResponse<ItineraryData>> {
    await delay(1500);

    // Simulate itinerary modification based on feedback
    const updatedItinerary = this.modifyItineraryBasedOnFeedback(currentItinerary, userFeedback);

    return {
      data: updatedItinerary,
      success: true,
      message: 'Itinerary updated successfully',
    };
  }

  static async addStopToItinerary(
    currentItinerary: ItineraryData,
    stopQuery: string,
    insertAfterStopId?: string
  ): Promise<MockAPIResponse<Stop>> {
    await delay(1000);

    // Generate a new stop based on query
    const newStop = this.generateStopFromQuery(stopQuery, currentItinerary.location);

    return {
      data: newStop,
      success: true,
      message: 'New stop added successfully',
    };
  }

  static async getStopInsights(stopId: string): Promise<MockAPIResponse<AIInsight[]>> {
    await delay(800);

    const insights: AIInsight[] = [
      {
        id: `insight-${stopId}-1`,
        content: 'This location is particularly beautiful during sunset, offering stunning photo opportunities.',
        source: 'ai_generated',
        confidence: 0.9,
        type: 'tip',
        rating: 4.8,
      },
      {
        id: `insight-${stopId}-2`,
        content: 'Local visitors recommend visiting early morning to avoid crowds and enjoy a peaceful experience.',
        source: 'reddit',
        confidence: 0.85,
        type: 'crowd_info',
        rating: 4.2,
      },
      {
        id: `insight-${stopId}-3`,
        content: 'The nearby cafe serves excellent local coffee and traditional pastries.',
        source: 'google',
        confidence: 0.75,
        type: 'dining_suggestion',
        rating: 4.6,
      },
    ];

    return {
      data: insights,
      success: true,
      message: 'Insights retrieved successfully',
    };
  }

  // Private helper methods
  private static customizeItinerary(
    baseItinerary: ItineraryData,
    selectedStyles: TravelStyle[],
    context: any
  ): ItineraryData {
    // Customize stops based on selected travel styles
    let customizedStops = [...baseItinerary.stops];

    // Filter stops based on travel styles
    if (selectedStyles.some(style => style.id === 'foodie')) {
      // Emphasize food-related activities
      customizedStops = customizedStops.map(stop => ({
        ...stop,
        duration: stop.category === 'dining' ? Math.min(stop.duration * 1.5, 120) : stop.duration,
      }));
    }

    if (selectedStyles.some(style => style.id === 'cultural-explorer')) {
      // Add more cultural insights
      customizedStops = customizedStops.map(stop => ({
        ...stop,
        insights: stop.category === 'cultural' ? [
          ...(stop.insights || []),
          {
            id: `cultural-${stop.id}`,
            content: 'Rich historical significance dating back to the colonial era.',
            source: 'ai_generated',
            confidence: 0.8,
            type: 'historical_context',
          }
        ] : stop.insights,
      }));
    }

    // Adjust for budget
    if (context.budget < 50) {
      customizedStops = customizedStops.map(stop => ({
        ...stop,
        entryFee: Math.max(0, (stop.entryFee || 0) * 0.5), // Reduce fees for budget travelers
      }));
    }

    // Adjust for group size and mobility needs
    if (context.mobilityNeeds.includes('wheelchair-accessible')) {
      customizedStops = customizedStops.filter(stop =>
        !stop.accessibility || stop.accessibility.wheelchairAccessible !== false
      );
    }

    return {
      ...baseItinerary,
      id: `itinerary-${Date.now()}`,
      location: context.location,
      totalBudget: customizedStops.reduce((sum, stop) => sum + (stop.entryFee || 0), 0) * context.group.adults,
      totalDuration: Math.min(customizedStops.reduce((sum, stop) => sum + stop.duration, 0), context.duration * 60),
      stops: customizedStops,
      generatedAt: new Date().toISOString(),
    };
  }

  private static modifyItineraryBasedOnFeedback(
    itinerary: ItineraryData,
    feedback: string
  ): ItineraryData {
    // Simple feedback processing - in real app this would use AI
    const lowerFeedback = feedback.toLowerCase();

    let modifiedStops = [...itinerary.stops];

    if (lowerFeedback.includes('more food') || lowerFeedback.includes('restaurant')) {
      // Add a food stop
      modifiedStops.push(this.generateFoodStop(itinerary.location));
    }

    if (lowerFeedback.includes('less walking') || lowerFeedback.includes('tired')) {
      // Reduce walking time between stops
      modifiedStops = modifiedStops.map(stop => ({
        ...stop,
        walkingTime: Math.max(5, (stop.walkingTime || 15) * 0.7),
      }));
    }

    if (lowerFeedback.includes('more time') || lowerFeedback.includes('rushed')) {
      // Increase duration at each stop
      modifiedStops = modifiedStops.map(stop => ({
        ...stop,
        duration: Math.min(stop.duration * 1.3, 180),
      }));
    }

    return {
      ...itinerary,
      stops: modifiedStops,
      lastModified: new Date().toISOString(),
    };
  }

  private static generateStopFromQuery(query: string, location: string): Stop {
    const stopId = `stop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Generate stop based on query
    return {
      id: stopId,
      name: `${query} in ${location}`,
      category: this.categorizeQuery(query),
      address: `${query} Location, ${location}`,
      coordinates: {
        lat: 3.1390 + (Math.random() - 0.5) * 0.1, // KL area with some randomness
        lng: 101.6869 + (Math.random() - 0.5) * 0.1,
      },
      duration: 45,
      rating: 4.0 + Math.random() * 1.0,
      description: `A wonderful place to experience ${query.toLowerCase()} in ${location}.`,
      photos: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800'],
      priceLevel: Math.floor(Math.random() * 3) + 1,
      entryFee: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 5 : 0,
      openingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '20:00' },
        sunday: { open: '09:00', close: '20:00' },
      },
      isOpen: true,
      crowdLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      amenities: ['wifi', 'parking'],
    };
  }

  private static generateFoodStop(location: string): Stop {
    const foodPlaces = [
      'Local Street Food Market',
      'Traditional Restaurant',
      'Artisan Cafe',
      'Rooftop Dining',
      'Local Delicacies House'
    ];

    const randomFood = foodPlaces[Math.floor(Math.random() * foodPlaces.length)];

    return {
      id: `food-stop-${Date.now()}`,
      name: randomFood,
      category: 'dining',
      address: `${randomFood}, ${location}`,
      coordinates: {
        lat: 3.1390 + (Math.random() - 0.5) * 0.1,
        lng: 101.6869 + (Math.random() - 0.5) * 0.1,
      },
      duration: 60,
      rating: 4.0 + Math.random() * 1.0,
      description: 'Delicious local cuisine and authentic flavors.',
      photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
      priceLevel: 2,
      entryFee: 0,
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '22:00' },
      },
      isOpen: true,
      crowdLevel: 'medium',
      amenities: ['wifi', 'outdoor_seating'],
    };
  }

  private static categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('food') || lowerQuery.includes('restaurant') || lowerQuery.includes('cafe')) {
      return 'dining';
    }
    if (lowerQuery.includes('museum') || lowerQuery.includes('temple') || lowerQuery.includes('cultural')) {
      return 'cultural';
    }
    if (lowerQuery.includes('park') || lowerQuery.includes('nature') || lowerQuery.includes('garden')) {
      return 'nature';
    }
    if (lowerQuery.includes('shopping') || lowerQuery.includes('market') || lowerQuery.includes('mall')) {
      return 'shopping';
    }
    if (lowerQuery.includes('bar') || lowerQuery.includes('club') || lowerQuery.includes('nightlife')) {
      return 'entertainment';
    }

    return 'attraction';
  }
}

// Mock Chat Service
export class MockChatService {
  static async sendMessage(message: string, context?: any): Promise<MockAPIResponse<string>> {
    await delay(1000 + Math.random() * 1000); // Variable delay for realism

    // Generate contextual AI response
    const response = this.generateAIResponse(message, context);

    return {
      data: response,
      success: true,
      message: 'Message sent successfully',
    };
  }

  private static generateAIResponse(message: string, context?: any): string {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based responses - in real app this would use AI
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you plan your perfect itinerary. What would you like to explore or change?";
    }

    if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('hungry')) {
      return "I'd be happy to suggest some food options! Would you like me to add more restaurants to your itinerary, or are you looking for a specific type of cuisine?";
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('schedule')) {
      return "I can help you adjust the timing of your itinerary. Would you like to spend more time at certain places, or would you prefer a more relaxed pace overall?";
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('expensive')) {
      return "Let me help you find budget-friendly alternatives. I can suggest free activities or places with lower entry fees. What's your preferred budget range?";
    }

    if (lowerMessage.includes('transport') || lowerMessage.includes('travel') || lowerMessage.includes('get there')) {
      return "For transportation, I recommend using Grab or the KL public transport system. Would you like me to provide specific directions between your stops?";
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return "Malaysia's tropical climate can be unpredictable! I'd recommend having indoor backup options and bringing an umbrella. Would you like me to suggest some covered attractions?";
    }

    if (lowerMessage.includes('change') || lowerMessage.includes('replace') || lowerMessage.includes('different')) {
      return "I can definitely help you modify your itinerary! What specific changes would you like to make? I can replace stops, adjust timing, or add new experiences.";
    }

    // Default response
    return "That's an interesting point! I'm here to help you customize your itinerary. Could you tell me more about what you'd like to explore or change about your current plan?";
  }
}

// Mock Location Service
export class MockLocationService {
  static async searchLocations(query: string): Promise<MockAPIResponse<string[]>> {
    await delay(300);

    const locations = [
      `${query}, Kuala Lumpur, Malaysia`,
      `${query} Area, Kuala Lumpur`,
      `${query} District, KL`,
      `${query} Shopping Center, Kuala Lumpur`,
      `${query} Cultural Site, Malaysia`,
    ].slice(0, 5);

    return {
      data: locations,
      success: true,
      message: 'Locations found successfully',
    };
  }

  static async getPlaceDetails(placeId: string): Promise<MockAPIResponse<any>> {
    await delay(500);

    return {
      data: {
        id: placeId,
        name: 'Sample Location',
        address: 'Sample Address, Kuala Lumpur',
        coordinates: {
          lat: 3.1390,
          lng: 101.6869,
        },
        rating: 4.5,
        priceLevel: 2,
      },
      success: true,
      message: 'Place details retrieved successfully',
    };
  }
}

// Aggregate service interface
export const MockAPI = {
  ai: MockAIPlanningService,
  chat: MockChatService,
  location: MockLocationService,
};

export default MockAPI;