'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, StatusBadge, LiveBadge, NearbyPlaces } from '@/components/ui';
import { Stop, AIInsight } from '@/types';
import { Place } from '@/services/places-api';

export interface StopDetailModalProps {
  stop: Stop | null;
  isOpen: boolean;
  onClose: () => void;
  onGetDirections?: (stop: Stop) => void;
  onCallVenue?: (stop: Stop) => void;
  onRemoveStop?: (stop: Stop) => void;
  onReplaceStop?: (stop: Stop, newPlace: Place) => void;
  className?: string;
}

const StopDetailModal = ({
  stop,
  isOpen,
  onClose,
  onGetDirections,
  onCallVenue,
  onRemoveStop,
  onReplaceStop,
  className,
}: StopDetailModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!stop) return null;

  const handleGetDirections = () => {
    onGetDirections?.(stop);
  };

  const handleCallVenue = () => {
    onCallVenue?.(stop);
  };

  const handleRemoveStop = () => {
    onRemoveStop?.(stop);
  };

  const handleAlternativeSelect = (place: Place) => {
    onReplaceStop?.(stop, place);
    onClose();
  };

  const nextPhoto = () => {
    if (stop.photos && stop.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % stop.photos!.length);
    }
  };

  const prevPhoto = () => {
    if (stop.photos && stop.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + stop.photos!.length) % stop.photos!.length);
    }
  };

  const getCrowdAnalytics = (level: string) => {
    switch (level) {
      case 'low':
        return {
          percentage: 25,
          description: 'Perfect time to visit! Minimal crowds expected.',
          color: 'success',
        };
      case 'medium':
        return {
          percentage: 60,
          description: 'Moderately busy. Good time for photos.',
          color: 'warning',
        };
      case 'high':
        return {
          percentage: 85,
          description: 'Very busy period. Consider visiting later.',
          color: 'error',
        };
      default:
        return {
          percentage: 50,
          description: 'Crowd level unknown.',
          color: 'default',
        };
    }
  };

  const crowdData = getCrowdAnalytics(stop.crowdLevel || 'medium');

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
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed inset-x-0 top-0 z-50 h-full overflow-hidden ${className}`}
          >
            <div className="h-full bg-background overflow-y-auto">
              {/* Header with Photo Carousel */}
              <div className="relative h-64 sm:h-80 bg-card-hover">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>

                {/* Photo Carousel */}
                {stop.photos && stop.photos.length > 0 ? (
                  <div className="relative h-full">
                    {/* Current Photo */}
                    <div
                      className="h-full bg-cover bg-center flex items-center justify-center text-6xl text-foreground-secondary"
                      style={{
                        backgroundImage: `url(${stop.photos[currentPhotoIndex]})`,
                      }}
                    >
                      📍
                    </div>

                    {/* Navigation Arrows */}
                    {stop.photos.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevPhoto}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                        >
                          ←
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextPhoto}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
                        >
                          →
                        </Button>
                      </>
                    )}

                    {/* Photo Indicators */}
                    {stop.photos.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {stop.photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              index === currentPhotoIndex
                                ? 'bg-magic-teal'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-8xl text-foreground-secondary">
                    📍
                  </div>
                )}

                {/* Live Status Banner */}
                {stop.isOpen && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <LiveBadge>Currently Open</LiveBadge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {stop.name}
                  </h1>
                  <p className="text-foreground-secondary mb-4">{stop.address}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="magic">
                      ⭐ {stop.rating}
                    </Badge>
                    <Badge variant="outline">
                      ⏱️ {stop.duration} minutes
                    </Badge>
                    <Badge variant="outline">
                      🏷️ {stop.category}
                    </Badge>
                    {stop.entryFee && stop.entryFee > 0 && (
                      <Badge variant="outline">
                        💰 RM{stop.entryFee}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Crowd Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crowd Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Crowd Level Visualization */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Current Crowd Level</span>
                          <StatusBadge status={stop.crowdLevel === 'low' ? 'quiet' : stop.crowdLevel === 'high' ? 'busy' : 'moderate'}>
                            {stop.crowdLevel || 'moderate'}
                          </StatusBadge>
                        </div>
                        <div className="w-full bg-card-hover rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${crowdData.percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-3 rounded-full bg-gradient-to-r ${
                              crowdData.color === 'success'
                                ? 'from-green-500 to-emerald-500'
                                : crowdData.color === 'warning'
                                ? 'from-yellow-500 to-orange-500'
                                : 'from-red-500 to-pink-500'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-foreground-secondary mt-2">
                          {crowdData.description}
                        </p>
                      </div>

                      {/* Best Time to Visit */}
                      <div className="bg-card-hover rounded-lg p-3">
                        <div className="text-sm font-medium text-magic-teal mb-1">💡 Best Time to Visit</div>
                        <p className="text-sm text-foreground-secondary">
                          Early morning (8-10 AM) or late afternoon (4-6 PM) for fewer crowds and better lighting.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                {stop.insights && stop.insights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        ✨ Detailed Insights
                        <Badge variant="live" size="sm">Live</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(showAllInsights ? stop.insights : stop.insights.slice(0, 2)).map((insight, index) => (
                          <InsightCard key={index} insight={insight} />
                        ))}

                        {stop.insights.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllInsights(!showAllInsights)}
                            className="text-magic-teal hover:text-magic-teal"
                          >
                            {showAllInsights ? 'Show Less' : `Show ${stop.insights.length - 2} More Insights`}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Alternative Places */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        🔄 Alternative Places
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAlternatives(!showAlternatives)}
                      >
                        {showAlternatives ? 'Hide' : 'Show'} Alternatives
                      </Button>
                    </div>
                  </CardHeader>
                  {showAlternatives && (
                    <CardContent>
                      <p className="text-sm text-foreground-secondary mb-4">
                        Discover similar places nearby that you might prefer instead.
                      </p>
                      <NearbyPlaces
                        location={{
                          latitude: stop.coordinates.lat,
                          longitude: stop.coordinates.lng
                        }}
                        radius={1000}
                        type={stop.category}
                        onPlaceSelect={handleAlternativeSelect}
                        maxResults={6}
                        showTypeFilter={false}
                        showRadiusSelector={false}
                        className="max-h-96 overflow-y-auto"
                      />
                    </CardContent>
                  )}
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={handleGetDirections}
                    className="w-full"
                  >
                    🧭 Directions
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleCallVenue}
                    className="w-full"
                  >
                    📞 Call
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleRemoveStop}
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Insight Card Component
interface InsightCardProps {
  insight: AIInsight;
}

const InsightCard = ({ insight }: InsightCardProps) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google': return '🔍';
      case 'reddit': return '💬';
      case 'ai_generated': return '🤖';
      default: return '💡';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'google': return 'outline';
      case 'reddit': return 'warning';
      case 'ai_generated': return 'magic';
      default: return 'default';
    }
  };

  return (
    <div className="border border-border-subtle rounded-lg p-4 bg-card-hover/30">
      <div className="flex items-start justify-between mb-2">
        <Badge variant={getSourceColor(insight.source)} size="sm">
          {getSourceIcon(insight.source)} {insight.source.replace('_', ' ')}
        </Badge>
        {insight.rating && (
          <div className="flex items-center gap-1 text-xs text-foreground-secondary">
            ⭐ {insight.rating}
          </div>
        )}
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        {insight.content}
      </p>
    </div>
  );
};

export { StopDetailModal };