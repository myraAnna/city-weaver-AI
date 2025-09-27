import { Itinerary, Stop, TravelSegment, WeatherData } from '@/types';

export const mockWeatherData: WeatherData = {
  temperature: 32,
  condition: 'Partly Cloudy',
  humidity: 75,
  windSpeed: 12,
  forecast: 'Warm with occasional clouds, perfect for exploring',
};

export const mockStops: Stop[] = [
  {
    id: 'stop-1',
    name: 'Petronas Twin Towers',
    address: 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
    coordinates: { lat: 3.1579, lng: 101.7120 },
    duration: 90,
    category: 'landmark',
    rating: 4.5,
    photos: ['/api/placeholder/400/300'],
    crowdLevel: 'high',
    isOpen: true,
    entryFee: 85,
    insights: [
      {
        source: 'ai_generated',
        content: 'Best views from the sky bridge on level 41-42. Visit early morning or late afternoon to avoid crowds.',
        rating: 4.8,
        timestamp: new Date(),
      },
      {
        source: 'reddit',
        content: 'Pro tip: Book tickets online in advance! The queue can be 2+ hours during weekends.',
        rating: 4.6,
        timestamp: new Date(),
      },
    ],
  },
  {
    id: 'stop-2',
    name: 'Jalan Alor Food Street',
    address: 'Jalan Alor, Bukit Bintang, 50200 Kuala Lumpur',
    coordinates: { lat: 3.1465, lng: 101.7104 },
    duration: 75,
    category: 'food',
    rating: 4.3,
    photos: ['/api/placeholder/400/300'],
    crowdLevel: 'medium',
    isOpen: true,
    entryFee: 0,
    insights: [
      {
        source: 'google',
        content: 'Famous for authentic street food. Try the satay, char kway teow, and fresh fruit juices.',
        rating: 4.5,
        timestamp: new Date(),
      },
      {
        source: 'reddit',
        content: 'Come hungry! Start from one end and work your way through. Cash only at most stalls.',
        rating: 4.4,
        timestamp: new Date(),
      },
    ],
  },
  {
    id: 'stop-3',
    name: 'Central Market',
    address: 'Jalan Hang Kasturi, City Centre, 50050 Kuala Lumpur',
    coordinates: { lat: 3.1424, lng: 101.6958 },
    duration: 60,
    category: 'culture',
    rating: 4.1,
    photos: ['/api/placeholder/400/300'],
    crowdLevel: 'low',
    isOpen: true,
    entryFee: 0,
    insights: [
      {
        source: 'ai_generated',
        content: 'Historic art deco building filled with local crafts and souvenirs. Perfect for authentic Malaysian gifts.',
        rating: 4.2,
        timestamp: new Date(),
      },
    ],
  },
  {
    id: 'stop-4',
    name: 'Batu Caves',
    address: 'Gombak, 68100 Batu Caves, Selangor',
    coordinates: { lat: 3.2379, lng: 101.6840 },
    duration: 120,
    category: 'nature',
    rating: 4.4,
    photos: ['/api/placeholder/400/300'],
    crowdLevel: 'medium',
    isOpen: true,
    entryFee: 0,
    insights: [
      {
        source: 'google',
        content: '272 colorful steps lead to this limestone cave temple. Spectacular views from the top!',
        rating: 4.6,
        timestamp: new Date(),
      },
      {
        source: 'reddit',
        content: 'Watch out for the monkeys - they can be aggressive. Bring water and wear good shoes!',
        rating: 4.3,
        timestamp: new Date(),
      },
    ],
  },
];

export const mockTravelSegments: TravelSegment[] = [
  {
    id: 'segment-1',
    from: mockStops[0],
    to: mockStops[1],
    mode: 'walking',
    duration: 12,
    distance: 950,
    instructions: ['Head southeast on Jalan Ampang', 'Turn right onto Jalan Bukit Bintang'],
    cost: 0,
  },
  {
    id: 'segment-2',
    from: mockStops[1],
    to: mockStops[2],
    mode: 'walking',
    duration: 8,
    distance: 650,
    instructions: ['Head southwest toward Jalan Sultan Ismail', 'Continue to Central Market'],
    cost: 0,
  },
  {
    id: 'segment-3',
    from: mockStops[2],
    to: mockStops[3],
    mode: 'transit',
    duration: 35,
    distance: 13500,
    instructions: ['Take KTM Komuter to Batu Caves station'],
    cost: 4.50,
  },
];

export const mockItinerary: Itinerary = {
  stops: mockStops,
  travelSegments: mockTravelSegments,
  totalDuration: 397, // Total minutes
  estimatedCost: 89.50,
};

export const contextAlerts = [
  {
    type: 'weather' as const,
    message: 'Rain expected around 3 PM - consider bringing an umbrella',
    priority: 'medium' as const,
    icon: '🌧️',
  },
  {
    type: 'crowd' as const,
    message: 'Kinta will be busy from 2-4 PM',
    priority: 'low' as const,
    icon: '👥',
  },
];