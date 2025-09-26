// Global type definitions
// All TypeScript types and interfaces will be defined here

// User and Trip Types
export interface User {
  id: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  travelStyle?: string;
  budget?: number;
  mobilityNeeds?: string[];
}

export interface TravelGroup {
  adults: number;
  children: Array<{ age: number }>;
}

// Trip and Itinerary Types
export interface Trip {
  id: string;
  location: string;
  duration: number; // in hours
  groupSize: TravelGroup;
  style: string;
  itinerary: Itinerary;
  createdAt: Date;
}

export interface Itinerary {
  stops: Stop[];
  travelSegments: TravelSegment[];
  totalDuration: number;
  estimatedCost: number;
}

export interface Stop {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  duration: number; // in minutes
  category: string;
  rating?: number;
  photos?: string[];
  insights?: AIInsight[];
  crowdLevel?: 'low' | 'medium' | 'high';
  isOpen?: boolean;
  entryFee?: number;
}

export interface TravelSegment {
  id: string;
  from: Stop;
  to: Stop;
  mode: 'walking' | 'transit' | 'driving';
  duration: number; // in minutes
  distance: number; // in meters
  instructions?: string[];
  cost?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AIInsight {
  source: 'google' | 'reddit' | 'ai_generated';
  content: string;
  rating?: number;
  timestamp?: Date;
}

// UI Component Types
export interface TravelStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  examples: string[];
}

// Chat and Conversation Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  tripId: string;
}

// API Response Types
export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error' | 'loading';
}

// Weather and Real-time Data Types
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
}