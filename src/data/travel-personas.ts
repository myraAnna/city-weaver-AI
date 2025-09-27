import { TravelStyle } from '@/types';

export const travelPersonas: TravelStyle[] = [
  {
    id: 'urban-explorer',
    name: 'Urban Explorer',
    description: 'Discover hidden gems, street art, and local neighborhoods off the beaten path',
    icon: '🗺️',
    examples: ['Street art tours', 'Local markets', 'Rooftop bars', 'Walking neighborhoods']
  },
  {
    id: 'foodies-quest',
    name: "Foodie's Quest",
    description: 'Savor authentic cuisine, food markets, and culinary experiences',
    icon: '🍜',
    examples: ['Food tours', 'Local eateries', 'Cooking classes', 'Night markets']
  },
  {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Immerse in museums, historical sites, and cultural heritage',
    icon: '🏛️',
    examples: ['Museums', 'Historical sites', 'Cultural districts', 'Architecture tours']
  },
  {
    id: 'nature-seeker',
    name: 'Nature Seeker',
    description: 'Find parks, gardens, waterfronts, and natural escapes within the city',
    icon: '🌿',
    examples: ['City parks', 'Botanical gardens', 'Waterfront walks', 'Nature reserves']
  },
  {
    id: 'adventure-thrill',
    name: 'Adventure & Thrill',
    description: 'Seek exciting activities, adventure sports, and adrenaline experiences',
    icon: '⚡',
    examples: ['Adventure sports', 'Unique experiences', 'Active pursuits', 'Thrill activities']
  },
  {
    id: 'culture-arts',
    name: 'Culture & Arts',
    description: 'Explore galleries, theaters, music venues, and artistic expressions',
    icon: '🎭',
    examples: ['Art galleries', 'Live music', 'Theater shows', 'Creative districts']
  },
  {
    id: 'nightlife-social',
    name: 'Nightlife & Social',
    description: 'Experience vibrant nightlife, bars, clubs, and social hotspots',
    icon: '🌃',
    examples: ['Rooftop bars', 'Live music venues', 'Social districts', 'Night markets']
  },
  {
    id: 'family-friendly',
    name: 'Family Friendly',
    description: 'Kid-friendly attractions, family activities, and safe, enjoyable spots',
    icon: '👨‍👩‍👧‍👦',
    examples: ['Family attractions', 'Playgrounds', 'Interactive museums', 'Safe neighborhoods']
  },
  {
    id: 'budget-conscious',
    name: 'Budget Conscious',
    description: 'Free activities, budget-friendly spots, and maximum value experiences',
    icon: '💰',
    examples: ['Free museums', 'Public parks', 'Walking tours', 'Budget eats']
  },
  {
    id: 'luxury-comfort',
    name: 'Luxury & Comfort',
    description: 'Premium experiences, upscale venues, and comfortable, refined activities',
    icon: '✨',
    examples: ['Fine dining', 'Luxury shopping', 'Spa experiences', 'Premium venues']
  },
  {
    id: 'photography-scenic',
    name: 'Photography & Scenic',
    description: 'Instagram-worthy spots, scenic viewpoints, and photogenic locations',
    icon: '📸',
    examples: ['Scenic viewpoints', 'Photo spots', 'Golden hour locations', 'Architectural gems']
  },
  {
    id: 'local-authentic',
    name: 'Local & Authentic',
    description: 'Experience the city like a local with authentic, non-touristy experiences',
    icon: '🏠',
    examples: ['Local hangouts', 'Neighborhood cafes', 'Community events', 'Resident favorites']
  }
];

export const getPersonaById = (id: string): TravelStyle | undefined => {
  return travelPersonas.find(persona => persona.id === id);
};

export const getPersonasByIds = (ids: string[]): TravelStyle[] => {
  return ids.map(id => getPersonaById(id)).filter(Boolean) as TravelStyle[];
};