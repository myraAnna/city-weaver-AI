/**
 * Nearby Places Component
 * Shows nearby places with filtering and selection capabilities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Stack, Grid } from '@/components/layout';
import { usePlacesAPI } from '@/hooks';
import { Place, PlaceLocation } from '@/services/places-api';

export interface NearbyPlacesProps {
  location: PlaceLocation;
  radius?: number;
  type?: string;
  keyword?: string;
  onPlaceSelect?: (place: Place) => void;
  onExplorePlaces?: (places: Place[]) => void;
  maxResults?: number;
  showTypeFilter?: boolean;
  showRadiusSelector?: boolean;
  className?: string;
}

const placeTypes = [
  { id: 'tourist_attraction', label: 'Attractions', icon: '🎯', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'restaurant', label: 'Food', icon: '🍜', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'shopping_mall', label: 'Shopping', icon: '🛍️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'museum', label: 'Culture', icon: '🏛️', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'park', label: 'Nature', icon: '🌳', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'lodging', label: 'Hotels', icon: '🏨', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'night_club', label: 'Nightlife', icon: '🌙', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
];

const radiusOptions = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
  { value: 5000, label: '5km' },
];

const NearbyPlaces = ({
  location,
  radius = 1000,
  type,
  keyword,
  onPlaceSelect,
  onExplorePlaces,
  maxResults = 12,
  showTypeFilter = true,
  showRadiusSelector = false,
  className,
}: NearbyPlacesProps) => {
  const [selectedType, setSelectedType] = useState(type);
  const [selectedRadius, setSelectedRadius] = useState(radius);
  const [searchKeyword, setSearchKeyword] = useState(keyword || '');

  const {
    nearbyPlaces,
    isLoading,
    error,
    getNearbyPlaces,
    clearNearbyPlaces,
    clearError
  } = usePlacesAPI();

  // Search for nearby places
  const searchNearbyPlaces = async (params?: {
    type?: string;
    radius?: number;
    keyword?: string;
  }) => {
    const searchParams = {
      location,
      radius: params?.radius || selectedRadius,
      type: params?.type || selectedType,
      keyword: params?.keyword || searchKeyword || undefined,
      open_now: false,
    };

    const results = await getNearbyPlaces(searchParams);
    onExplorePlaces?.(results.slice(0, maxResults));
  };

  // Initial search on component mount or location change
  useEffect(() => {
    if (location.latitude && location.longitude) {
      searchNearbyPlaces();
    }
  }, [location]);

  // Handle type filter change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    searchNearbyPlaces({ type: newType });
  };

  // Handle radius change
  const handleRadiusChange = (newRadius: number) => {
    setSelectedRadius(newRadius);
    searchNearbyPlaces({ radius: newRadius });
  };

  // Handle keyword search
  const handleKeywordSearch = () => {
    searchNearbyPlaces({ keyword: searchKeyword });
  };

  const handlePlaceClick = (place: Place) => {
    onPlaceSelect?.(place);
  };

  const handleRetry = () => {
    clearError();
    searchNearbyPlaces();
  };

  // Error state
  if (error) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Failed to Load Nearby Places
        </h3>
        <p className="text-foreground-secondary mb-4">{error}</p>
        <Button onClick={handleRetry} variant="primary" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Stack spacing="lg">
        {/* Header with Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Nearby Places
              </h3>
              <p className="text-sm text-foreground-secondary">
                Discover places around this location
              </p>
            </div>

            {showRadiusSelector && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground-secondary">Radius:</span>
                {radiusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedRadius === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleRadiusChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Keyword Search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeywordSearch()}
              placeholder="Search by keyword..."
              className="flex-1 px-3 py-2 bg-input-default border border-border-default rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-magic-teal/50 focus:bg-input-focus transition-all duration-200"
            />
            <Button
              onClick={handleKeywordSearch}
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? '⏳' : '🔍'}
            </Button>
          </div>

          {/* Type Filters */}
          {showTypeFilter && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedType ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleTypeChange('')}
              >
                All
              </Button>
              {placeTypes.map((placeType) => (
                <Button
                  key={placeType.id}
                  variant={selectedType === placeType.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleTypeChange(placeType.id)}
                  className="text-xs"
                >
                  {placeType.icon} {placeType.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-magic-teal border-t-transparent" />
            <span className="ml-3 text-foreground-secondary">Finding nearby places...</span>
          </div>
        )}

        {/* Places Grid */}
        <AnimatePresence>
          {!isLoading && nearbyPlaces.length > 0 && (
            <Grid cols={{ default: 1, sm: 2, lg: 3 }} gap="md">
              {nearbyPlaces.slice(0, maxResults).map((place, index) => (
                <motion.div
                  key={place.place_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PlaceCard
                    place={place}
                    onClick={() => handlePlaceClick(place)}
                  />
                </motion.div>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && nearbyPlaces.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Places Found
            </h3>
            <p className="text-foreground-secondary">
              Try adjusting your search criteria or expanding the radius.
            </p>
          </div>
        )}
      </Stack>
    </div>
  );
};

// Individual Place Card Component
interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

const PlaceCard = ({ place, onClick }: PlaceCardProps) => {
  const getPlaceIcon = (types: string[]) => {
    const iconMap: Record<string, string> = {
      'tourist_attraction': '🎯',
      'restaurant': '🍜',
      'food': '🍜',
      'shopping_mall': '🛍️',
      'store': '🛍️',
      'museum': '🏛️',
      'park': '🌳',
      'lodging': '🏨',
      'night_club': '🌙',
      'bar': '🍺',
    };

    for (const type of types) {
      if (iconMap[type]) return iconMap[type];
    }
    return '📍';
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  return (
    <Card
      interactive
      onClick={onClick}
      className="h-full cursor-pointer hover:shadow-magic-soft transition-all duration-200"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">
            {getPlaceIcon(place.types)}
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1 line-clamp-2">
              {place.display_name}
            </CardTitle>

            <p className="text-sm text-foreground-secondary mb-2 line-clamp-2">
              {place.formatted_address}
            </p>

            <div className="flex flex-wrap gap-2">
              {place.rating && (
                <Badge variant="outline" size="sm">
                  ⭐ {place.rating.toFixed(1)}
                </Badge>
              )}

              {place.price_level && (
                <Badge variant="outline" size="sm">
                  {'$'.repeat(parseInt(place.price_level))}
                </Badge>
              )}

              {place.regular_opening_hours?.open_now && (
                <Badge variant="success" size="sm">
                  Open
                </Badge>
              )}

              {place.distance_meters && (
                <Badge variant="ghost" size="sm">
                  {formatDistance(place.distance_meters)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { NearbyPlaces, PlaceCard };