'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardContent, Button, Badge, LiveBadge } from '@/components/ui';
import { Container, Stack } from '@/components/layout';
import { Itinerary, Stop, TravelSegment, WeatherData } from '@/types';
import { useRoutesAPI } from '@/hooks';

export interface TimelineViewProps {
  itinerary: Itinerary | null;
  weather?: WeatherData;
  contextAlerts?: Array<{
    type: 'weather' | 'crowd' | 'transit' | 'info';
    message: string;
    priority: 'low' | 'medium' | 'high';
    icon: string;
  }>;
  onStopClick?: (stop: Stop) => void;
  onStartJourney?: () => void;
  onOpenChat?: () => void;
  onConfirmPlan?: () => void;
  isDraftMode?: boolean;
  isConfirming?: boolean;
  className?: string;
}

const TimelineView = ({
  itinerary,
  weather,
  contextAlerts = [],
  onStopClick,
  onStartJourney,
  onOpenChat,
  onConfirmPlan,
  isDraftMode = false,
  isConfirming = false,
  className,
}: TimelineViewProps) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // const formatTime = (minutes: number) => {
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return `${hours}h ${mins}m`;
  // };

  // const formatCurrency = (amount: number) => `RM${amount.toFixed(2)}`;

  const handleStopClick = (stop: Stop) => {
    setSelectedStopId(stop.id === selectedStopId ? null : stop.id);
    onStopClick?.(stop);
  };

  // Show empty state if no itinerary
  if (!itinerary) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Itinerary Available
          </h3>
          <p className="text-foreground-secondary">
            Your itinerary is being generated or failed to load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Container size="xl" className="py-6">
        <Stack spacing="lg">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TopBar
              weather={weather}
              totalDuration={itinerary.totalDuration}
              estimatedCost={itinerary.estimatedCost}
            />
          </motion.div>

          {/* Context Alert Bar */}
          {contextAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ContextAlertBar alerts={contextAlerts} />
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-magic-teal via-magic-purple to-magic-teal" />

              {/* Timeline Items */}
              <div className="space-y-6">
                {itinerary.stops.map((stop, index) => {
                  const travelSegment = itinerary.travelSegments.find(s => s.from.id === stop.id);
                  const isSelected = selectedStopId === stop.id;

                  return (
                    <div key={stop.id} className="relative">
                      {/* Stop Card */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative z-10"
                      >
                        <StopCard
                          stop={stop}
                          stopNumber={index + 1}
                          isSelected={isSelected}
                          onClick={() => handleStopClick(stop)}
                        />
                      </motion.div>

                      {/* Travel Segment */}
                      {travelSegment && index < itinerary.stops.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: (index * 0.1) + 0.05 }}
                          className="relative z-10 ml-12 mt-4"
                        >
                          <TravelSegmentCard segment={travelSegment} />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Floating Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="fixed bottom-6 right-6 flex flex-col gap-3 z-20"
          >
            {/* Draft Mode Confirmation Banner */}
            {isDraftMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-magic-teal/10 backdrop-blur-sm border border-magic-teal/30 rounded-lg p-3 mb-2"
              >
                <div className="text-sm text-magic-teal font-medium mb-2">
                  ✨ You have pending changes
                </div>
                <Button
                  size="sm"
                  onClick={onConfirmPlan}
                  disabled={isConfirming}
                  className="w-full bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft"
                >
                  {isConfirming ? '⏳ Confirming...' : '✅ Confirm Changes'}
                </Button>
              </motion.div>
            )}

            <Button
              size="lg"
              onClick={onStartJourney}
              className="rounded-full shadow-magic-medium hover:shadow-magic-strong"
            >
              🚀 Start Journey
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onOpenChat}
              className="rounded-full bg-card-default/80 backdrop-blur-sm border border-border-default hover:bg-card-hover"
            >
              💬 Modify Plan
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </div>
  );
};

// Top Bar Component
interface TopBarProps {
  weather?: WeatherData;
  totalDuration: number;
  estimatedCost: number;
}

const TopBar = ({ weather, totalDuration, estimatedCost }: TopBarProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => `RM${amount.toFixed(2)}`;

  return (
    <Card className="bg-card-default/80 backdrop-blur-sm border-border-subtle">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Trip Info */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatTime(totalDuration)}
              </div>
              <div className="text-xs text-foreground-secondary uppercase tracking-wide">
                Duration
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-magic-teal">
                {formatCurrency(estimatedCost)}
              </div>
              <div className="text-xs text-foreground-secondary uppercase tracking-wide">
                Estimated Cost
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          {weather && (
            <div className="flex items-center gap-3 px-4 py-2 bg-card-hover rounded-lg">
              <div className="text-2xl">
                {weather.condition.includes('Cloud') ? '⛅' :
                 weather.condition.includes('Rain') ? '🌧️' : '☀️'}
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {weather.temperature}°C
                </div>
                <div className="text-xs text-foreground-secondary">
                  {weather.condition}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Context Alert Bar Component
interface ContextAlertBarProps {
  alerts: Array<{
    type: 'weather' | 'crowd' | 'transit' | 'info';
    message: string;
    priority: 'low' | 'medium' | 'high';
    icon: string;
  }>;
}

const ContextAlertBar = ({ alerts }: ContextAlertBarProps) => {
  const [currentAlert, setCurrentAlert] = useState(0);

  React.useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlert(prev => (prev + 1) % alerts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const alert = alerts[currentAlert];
  const priorityColor = {
    low: 'border-blue-400/30 bg-blue-400/10',
    medium: 'border-warning-500/30 bg-warning-500/10',
    high: 'border-error-500/30 bg-error-500/10',
  }[alert.priority];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAlert}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`p-3 rounded-lg border ${priorityColor}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg flex-shrink-0">{alert.icon}</span>
          <p className="text-sm text-foreground flex-1">{alert.message}</p>
          {alerts.length > 1 && (
            <div className="flex gap-1">
              {alerts.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    index === currentAlert ? 'bg-magic-teal' : 'bg-border-default'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Stop Card Component
interface StopCardProps {
  stop: Stop;
  stopNumber: number;
  isSelected: boolean;
  onClick: () => void;
}

const StopCard = ({ stop, stopNumber, isSelected, onClick }: StopCardProps) => {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getTimeEstimate = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() + (stopNumber - 1) * 90 * 60000);
    return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="ml-12 cursor-pointer"
    >
      <Card
        variant={isSelected ? 'selected' : 'stop'}
        className="transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Photo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card-hover rounded-l-lg flex items-center justify-center text-4xl">
              📍
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <CardTitle className="text-lg mb-1">{stop.name}</CardTitle>
                  <p className="text-sm text-foreground-secondary">{stop.address}</p>
                </div>

                {/* Stop Number */}
                <div className="absolute -left-6 top-4 w-6 h-6 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple text-white text-sm font-bold flex items-center justify-center shadow-magic-soft">
                  {stopNumber}
                </div>
              </div>

              {/* Info Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" size="sm">
                  ⭐ {stop.rating}
                </Badge>
                <Badge variant={getCrowdColor(stop.crowdLevel || 'medium')} size="sm">
                  👥 {stop.crowdLevel}
                </Badge>
                {stop.isOpen && (
                  <LiveBadge size="sm">Open</LiveBadge>
                )}
                <Badge variant="ghost" size="sm">
                  ⏱️ {stop.duration}min
                </Badge>
                {stop.entryFee && stop.entryFee > 0 && (
                  <Badge variant="outline" size="sm">
                    💰 RM{stop.entryFee}
                  </Badge>
                )}
              </div>

              {/* AI Insights */}
              {stop.insights && stop.insights.length > 0 && (
                <div className="bg-card-hover rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-magic-teal">✨ AI Insight</span>
                  </div>
                  <p className="text-sm text-foreground-secondary line-clamp-2">
                    {stop.insights[0].content}
                  </p>
                </div>
              )}

              {/* Time Estimate */}
              <div className="text-xs text-foreground-secondary mt-2">
                📅 Estimated arrival: {getTimeEstimate()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced Travel Segment Card Component with Route Integration
interface TravelSegmentCardProps {
  segment: TravelSegment;
  onGetDirections?: (segment: TravelSegment) => void;
  onShowRoute?: (segment: TravelSegment) => void;
}

const TravelSegmentCard = ({ segment, onGetDirections, onShowRoute }: TravelSegmentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { generateMapsUrl } = useRoutesAPI();

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walking': return '🚶‍♂️';
      case 'transit': return '🚌';
      case 'driving': return '🚗';
      case 'cycling': return '🚴‍♂️';
      default: return '➡️';
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleGetDirections = () => {
    if (onGetDirections) {
      onGetDirections(segment);
    } else if (segment.from && segment.to) {
      // Fallback to external maps
      const mapsUrl = generateMapsUrl(
        segment.from.coordinates,
        segment.to.coordinates,
        segment.mode as 'walking' | 'driving' | 'transit' | 'cycling'
      );
      window.open(mapsUrl, '_blank');
    }
  };

  const handleShowRoute = () => {
    if (onShowRoute) {
      onShowRoute(segment);
    }
    setExpanded(!expanded);
  };

  const getRouteQualityColor = () => {
    // Mock route quality based on segment type
    if (segment.mode === 'walking' && segment.distance > 1000) return 'warning';
    if (segment.mode === 'transit') return 'success';
    return 'default';
  };

  return (
    <Card
      variant="ghost"
      className="bg-card-hover/50 border-l-2 border-l-magic-teal/30 hover:bg-card-hover/70 transition-all duration-200 cursor-pointer"
      onClick={handleShowRoute}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Main Route Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getModeIcon(segment.mode)}</span>
              <div>
                <div className="text-sm font-medium text-foreground capitalize flex items-center gap-2">
                  {segment.mode === 'transit' ? 'Public Transport' : segment.mode}
                  <Badge variant={getRouteQualityColor()} size="sm">
                    {segment.mode === 'walking' ? 'Scenic' :
                     segment.mode === 'transit' ? 'Eco' :
                     segment.mode === 'driving' ? 'Fast' : 'Active'}
                  </Badge>
                </div>
                <div className="text-xs text-foreground-secondary">
                  {formatDuration(segment.duration)} • {formatDistance(segment.distance)}
                  {segment.cost && segment.cost > 0 && ` • RM${segment.cost.toFixed(2)}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetDirections();
                }}
                className="text-xs px-2 py-1"
              >
                🧭
              </Button>
              <div className="text-xs text-foreground-secondary">
                {expanded ? '▲' : '▼'}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border-subtle pt-2 mt-2"
              >
                <div className="space-y-2 text-xs">
                  {/* Route Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-foreground-secondary">From:</span>
                      <div className="text-foreground truncate">{segment.from?.name || 'Current location'}</div>
                    </div>
                    <div>
                      <span className="text-foreground-secondary">To:</span>
                      <div className="text-foreground truncate">{segment.to?.name || 'Destination'}</div>
                    </div>
                  </div>

                  {/* Route Options */}
                  {segment.mode === 'transit' && (
                    <div className="bg-card-default rounded-lg p-2">
                      <div className="text-foreground-secondary mb-1">🚌 Transit Options</div>
                      <div className="text-xs space-y-1">
                        <div>• Bus 101 → Bus 205 (2 transfers)</div>
                        <div>• Next departure: 8 mins</div>
                        <div>• Service frequency: 10-15 mins</div>
                      </div>
                    </div>
                  )}

                  {segment.mode === 'walking' && (
                    <div className="bg-card-default rounded-lg p-2">
                      <div className="text-foreground-secondary mb-1">🚶‍♂️ Walking Route</div>
                      <div className="text-xs space-y-1">
                        <div>• Via pedestrian paths</div>
                        <div>• Weather: Clear, good for walking</div>
                        <div>• Elevation gain: Minimal</div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections();
                      }}
                      className="flex-1 text-xs py-1"
                    >
                      🧭 Get Directions
                    </Button>
                    {segment.mode === 'transit' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs py-1"
                      >
                        🚌 Live Updates
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export { TimelineView };