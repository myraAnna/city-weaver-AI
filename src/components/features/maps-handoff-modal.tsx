'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Itinerary, Stop } from '@/types';
import { useRoutesAPI } from '@/hooks';
import { Route } from '@/services/routes-api';

export interface MapsHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
  selectedStops?: Stop[];
  travelMode?: 'walking' | 'driving' | 'transit' | 'cycling';
  onGoogleMaps?: (route?: Route) => void;
  onAppleMaps?: (route?: Route) => void;
  onWaze?: (route?: Route) => void;
  onShare?: (route?: Route) => void;
  onDownload?: (route?: Route) => void;
  className?: string;
}

interface NavigationApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  available: boolean;
}

const navigationApps: NavigationApp[] = [
  {
    id: 'google-maps',
    name: 'Google Maps',
    icon: '🗺️',
    description: 'Most comprehensive with real-time traffic',
    color: 'bg-blue-500',
    available: true,
  },
  {
    id: 'apple-maps',
    name: 'Apple Maps',
    icon: '🧭',
    description: 'Native iOS integration with Siri',
    color: 'bg-gray-500',
    available: typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent),
  },
  {
    id: 'waze',
    name: 'Waze',
    icon: '🚗',
    description: 'Community-driven with traffic alerts',
    color: 'bg-purple-500',
    available: true,
  },
];

const MapsHandoffModal = ({
  isOpen,
  onClose,
  itinerary,
  selectedStops,
  travelMode = 'walking',
  onGoogleMaps,
  onAppleMaps,
  onWaze,
  onShare,
  onDownload,
  className,
}: MapsHandoffModalProps) => {
  const [selectedApp, setSelectedApp] = useState<string>('google-maps');
  const [isExporting, setIsExporting] = useState(false);
  const [routeMode, setRouteMode] = useState<'walking' | 'driving' | 'transit' | 'cycling'>(travelMode);

  const {
    currentRoute,
    isLoading: routeLoading,
    error: routeError,
    getDirections,
    generateMapsUrl,
    clearError
  } = useRoutesAPI();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => `RM${amount.toFixed(2)}`;

  // Get stops to route (selected stops or all stops)
  const stopsToRoute = selectedStops || itinerary.stops;

  // Calculate route on modal open
  useEffect(() => {
    if (isOpen && stopsToRoute.length >= 2) {
      calculateRoute();
    }
    return () => clearError();
  }, [isOpen, routeMode, stopsToRoute]);

  const calculateRoute = async () => {
    if (stopsToRoute.length < 2) return;

    const origin = {
      latitude: stopsToRoute[0].coordinates.lat,
      longitude: stopsToRoute[0].coordinates.lng
    };
    const destination = {
      latitude: stopsToRoute[stopsToRoute.length - 1].coordinates.lat,
      longitude: stopsToRoute[stopsToRoute.length - 1].coordinates.lng
    };
    const waypoints = stopsToRoute.slice(1, -1).map(stop => ({
      location: {
        latitude: stop.coordinates.lat,
        longitude: stop.coordinates.lng
      },
      place_id: stop.id
    }));

    await getDirections({
      origin,
      destination,
      waypoints,
      travel_mode: routeMode,
      optimize_waypoints: true
    });
  };

  const handleNavigationApp = (appId: string) => {
    setIsExporting(true);

    setTimeout(() => {
      switch (appId) {
        case 'google-maps':
          onGoogleMaps?.(currentRoute || undefined);
          break;
        case 'apple-maps':
          onAppleMaps?.(currentRoute || undefined);
          break;
        case 'waze':
          onWaze?.(currentRoute || undefined);
          break;
      }
      setIsExporting(false);
      onClose();
    }, 1500);
  };

  const handleTravelModeChange = (mode: 'walking' | 'driving' | 'transit' | 'cycling') => {
    setRouteMode(mode);
  };

  const handleShare = () => {
    onShare?.();
  };

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      onDownload?.();
      setIsExporting(false);
    }, 2000);
  };

  const generateGoogleMapsUrl = () => {
    const waypoints = itinerary.stops.map(stop =>
      `${stop.coordinates.lat},${stop.coordinates.lng}`
    ).join('|');

    return `https://www.google.com/maps/dir/${waypoints}`;
  };

  const generateAppleMapsUrl = () => {
    const waypoints = itinerary.stops.map((stop, index) =>
      `${index === 0 ? 'saddr' : index === itinerary.stops.length - 1 ? 'daddr' : 'waypoint'}=${stop.coordinates.lat},${stop.coordinates.lng}`
    ).join('&');

    return `http://maps.apple.com/?${waypoints}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 ${className}`}
          >
            <Card className="h-full md:h-auto bg-background border-border-default shadow-2xl">
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Ready to Explore!</CardTitle>
                    <p className="text-foreground-secondary mt-1">
                      Your personalized itinerary is ready for navigation
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full w-10 h-10 p-0 hover:bg-card-hover"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 max-h-96 md:max-h-none overflow-y-auto">
                {/* Trip Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card variant="ghost" className="bg-gradient-to-r from-magic-teal/10 to-magic-purple/10 border-magic-teal/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Trip Overview</h3>
                        <Badge variant="magic" size="sm">
                          {itinerary.stops.length} stops
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-magic-teal">
                            {formatDuration(itinerary.totalDuration)}
                          </div>
                          <div className="text-xs text-foreground-secondary">Duration</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-magic-purple">
                            {formatCurrency(itinerary.estimatedCost)}
                          </div>
                          <div className="text-xs text-foreground-secondary">Est. Cost</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">
                            {(itinerary.travelSegments.reduce((total, segment) => total + segment.distance, 0) / 1000).toFixed(1)}km
                          </div>
                          <div className="text-xs text-foreground-secondary">Distance</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Final Plan Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Your Journey</h3>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {itinerary.stops.map((stop, index) => (
                        <motion.div
                          key={stop.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center gap-3 p-2 bg-card-hover/50 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {stop.name}
                            </div>
                            <div className="text-xs text-foreground-secondary">
                              {stop.duration}min • {stop.category}
                            </div>
                          </div>
                          {stop.rating && (
                            <Badge variant="outline" size="sm">
                              ⭐ {stop.rating}
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Apps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Choose Navigation App</h3>

                    <div className="grid gap-3">
                      {navigationApps.filter(app => app.available).map((app) => (
                        <motion.button
                          key={app.id}
                          onClick={() => setSelectedApp(app.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedApp === app.id
                              ? 'border-magic-teal bg-magic-teal/10'
                              : 'border-border-default bg-card-hover hover:border-border-default/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center text-2xl`}>
                              {app.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{app.name}</div>
                              <div className="text-sm text-foreground-secondary">{app.description}</div>
                            </div>
                            {selectedApp === app.id && (
                              <div className="text-magic-teal text-xl">✓</div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4 pt-2 border-t border-border-subtle"
                >
                  {/* Primary Action */}
                  <Button
                    size="lg"
                    onClick={() => handleNavigationApp(selectedApp)}
                    disabled={isExporting}
                    className="w-full bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft disabled:opacity-50"
                  >
                    {isExporting ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Preparing Route...
                      </div>
                    ) : (
                      <>🚀 Start Journey in {navigationApps.find(app => app.id === selectedApp)?.name}</>
                    )}
                  </Button>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="w-full hover:bg-card-hover"
                    >
                      📤 Share Plan
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      disabled={isExporting}
                      className="w-full hover:bg-card-hover disabled:opacity-50"
                    >
                      {isExporting ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-3 h-3 border border-foreground border-t-transparent rounded-full"
                          />
                          Exporting...
                        </div>
                      ) : (
                        '📥 Download'
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Quick URLs for Development */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xs text-foreground-secondary space-y-1 pt-4 border-t border-border-subtle"
                  >
                    <div>Debug URLs:</div>
                    <div className="space-y-1 font-mono text-xs">
                      <div>Google: <a href={generateGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="text-magic-teal hover:underline">Open</a></div>
                      <div>Apple: <a href={generateAppleMapsUrl()} target="_blank" rel="noopener noreferrer" className="text-magic-teal hover:underline">Open</a></div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { MapsHandoffModal };