// Application constants
// Define all constant values used throughout the application

import { TravelStyle } from '@/types';

// Travel Styles Configuration
export const TRAVEL_STYLES: TravelStyle[] = [
  {
    id: 'urban-explorer',
    name: 'Urban Explorer',
    description: 'Discover the city like a local with hidden gems and authentic experiences',
    icon: '🏙️',
    examples: ['Street art districts', 'Local markets', 'Underground culture'],
  },
  {
    id: 'foodies-quest',
    name: "Foodie's Quest",
    description: 'Savor the best culinary experiences from street food to fine dining',
    icon: '🍜',
    examples: ['Local cuisine', 'Food tours', 'Cooking classes'],
  },
  {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Immerse yourself in the rich history and cultural heritage',
    icon: '🏛️',
    examples: ['Museums', 'Historical sites', 'Heritage walks'],
  },
  {
    id: 'nature-seeker',
    name: 'Nature Seeker',
    description: 'Find green spaces and natural beauty within the urban landscape',
    icon: '🌳',
    examples: ['Parks', 'Gardens', 'Scenic viewpoints'],
  },
  {
    id: 'art-culture',
    name: 'Art & Culture',
    description: 'Explore galleries, theaters, and cultural hotspots',
    icon: '🎨',
    examples: ['Art galleries', 'Cultural centers', 'Live performances'],
  },
  {
    id: 'family-fun',
    name: 'Family Fun',
    description: 'Kid-friendly activities that everyone in the family will enjoy',
    icon: '👨‍👩‍👧‍👦',
    examples: ['Interactive museums', 'Parks', 'Family attractions'],
  },
];

// Duration Options (in hours)
export const DURATION_OPTIONS = [
  { value: 2, label: '2 hours' },
  { value: 4, label: 'Half day' },
  { value: 8, label: 'Full day' },
  { value: 12, label: 'Extended day' },
];

// Budget Ranges
export const BUDGET_RANGES = [
  { min: 0, max: 50, label: 'Budget ($0-50)' },
  { min: 51, max: 100, label: 'Moderate ($51-100)' },
  { min: 101, max: 200, label: 'Comfortable ($101-200)' },
  { min: 201, max: Infinity, label: 'Premium ($201+)' },
];

// Mobility Options
export const MOBILITY_OPTIONS = [
  { id: 'walking', label: 'Walking preferred', icon: '🚶' },
  { id: 'wheelchair', label: 'Wheelchair accessible', icon: '♿' },
  { id: 'public-transport', label: 'Public transport only', icon: '🚇' },
  { id: 'driving', label: 'Car available', icon: '🚗' },
];

// Age Groups
export const AGE_GROUPS = [
  { min: 0, max: 2, label: 'Toddler' },
  { min: 3, max: 12, label: 'Child' },
  { min: 13, max: 17, label: 'Teen' },
  { min: 18, max: 64, label: 'Adult' },
  { min: 65, max: 120, label: 'Senior' },
];

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  TRIPS: '/api/trips',
  PLACES: '/api/places',
  WEATHER: '/api/weather',
  CHAT: '/api/chat',
  USER: '/api/user',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'City Weaver AI',
  DESCRIPTION: 'Your AI travel companion that adapts as you explore',
  MAX_STOPS_PER_ITINERARY: 5,
  DEFAULT_LOCATION: 'San Francisco, CA',
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP'],
  ANIMATION_DURATION: 300, // milliseconds
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_DELAY: 1000,
  SUGGESTION_PROMPTS: [
    "It's raining, find indoor alternatives",
    'I want something more budget-friendly',
    'Add a food stop along the way',
    'Make this more kid-friendly',
    'I have 2 hours less time',
  ],
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  DEFAULT_CENTER: { lat: 37.7749, lng: -122.4194 }, // San Francisco
  MARKER_COLORS: {
    START: '#10b981',
    STOP: '#3b82f6',
    END: '#ef4444',
  },
};