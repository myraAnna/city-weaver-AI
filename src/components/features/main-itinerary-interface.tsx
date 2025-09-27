'use client';

import React, { useState, useEffect } from 'react';
import { TimelineView } from './timeline-view';
import { StopDetailModal } from './stop-detail-modal';
import { ChatOverlay } from './chat-overlay';
import { Itinerary, Stop, WeatherData, ChatConversation, TravelSegment } from '@/types';
import { usePlansAPI } from '@/hooks';
import { Place } from '@/services/places-api';
import { DataLoading } from '@/components/ui';

export interface MainItineraryInterfaceProps {
  planId?: string; // Load plan from API
  itinerary?: Itinerary; // Or use provided itinerary
  weather?: WeatherData;
  contextAlerts?: Array<{
    type: 'weather' | 'crowd' | 'transit' | 'info';
    message: string;
    priority: 'low' | 'medium' | 'high';
    icon: string;
  }>;
  onStartJourney?: () => void;
  onOpenChat?: () => void;
  onGetDirections?: (stop: Stop) => void;
  onCallVenue?: (stop: Stop) => void;
  onRemoveStop?: (stop: Stop) => void;
  onError?: (error: string) => void;
  className?: string;
}

const MainItineraryInterface = ({
  planId,
  itinerary: providedItinerary,
  weather,
  contextAlerts,
  onStartJourney,
  onOpenChat,
  onGetDirections,
  onCallVenue,
  onRemoveStop,
  onError,
  className,
}: MainItineraryInterfaceProps) => {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(providedItinerary || null);

  // Plans API hook
  const {
    loadPlan,
    currentPlan,
    isLoading,
    error,
    isDraftMode,
    chatHistory,
    sendMessage,
    confirmPlan
  } = usePlansAPI();

  // Load plan if planId is provided
  useEffect(() => {
    console.log('🔄 MainItineraryInterface loadPlan effect triggered:', {
      planId,
      providedItinerary: !!providedItinerary,
      shouldLoad: planId && !providedItinerary
    });

    if (planId && !providedItinerary) {
      console.log('📡 Loading plan with ID:', planId);
      loadPlan(planId);
    }
  }, [planId, providedItinerary, loadPlan]);

  // Convert API plan to itinerary format
  useEffect(() => {
    console.log('🔄 Transformation useEffect triggered:', {
      hasCurrentPlan: !!currentPlan,
      hasProvidedItinerary: !!providedItinerary,
      shouldTransform: currentPlan && !providedItinerary
    });

    if (currentPlan && !providedItinerary) {
      console.log('🔍 MainItineraryInterface: Converting API plan to itinerary format');
      console.log('📦 currentPlan:', currentPlan);
      console.log('🔄 isDraftMode:', isDraftMode);

      // Get active itinerary (draft if available, otherwise main)
      const activeItinerary = isDraftMode && currentPlan.draft_itinerary
        ? currentPlan.draft_itinerary.stops
        : currentPlan.itinerary;

      console.log('📋 activeItinerary:', activeItinerary);
      console.log('🔍 activeItinerary type:', typeof activeItinerary);
      console.log('📊 activeItinerary isArray:', Array.isArray(activeItinerary));

      if (activeItinerary && Array.isArray(activeItinerary)) {
        console.log('✅ Processing itinerary with', activeItinerary.length, 'stops');

        // Log first stop details for debugging
        if (activeItinerary.length > 0) {
          console.log('🏪 First stop details:', activeItinerary[0]);
          console.log('🗺️ Place details structure:', activeItinerary[0].place_details);
        }
        // Convert API format to frontend format
        const convertedItinerary: Itinerary = {
          stops: activeItinerary.map((apiStop, index): Stop => ({
            id: apiStop.place_details.id || `stop_${index}`,
            name: apiStop.place_details.displayName?.text || 'Unknown Location',
            address: apiStop.place_details.formattedAddress || '',
            coordinates: {
              lat: apiStop.place_details.location.latitude,
              lng: apiStop.place_details.location.longitude
            },
            duration: 45, // in minutes - default duration
            category: apiStop.place_details.types?.[0] || 'attraction',
            rating: apiStop.place_details.rating || 4.0,
            photos: [], // Would need photo from API
            insights: [{
              source: 'ai_generated' as const,
              content: apiStop.narrative,
              rating: 0.9
            }],
            crowdLevel: 'medium' as const,
            isOpen: apiStop.place_details.regularOpeningHours?.openNow ?? true,
            entryFee: 0 // Default to free
          })),
          travelSegments: activeItinerary.slice(0, -1).map((apiStop, index): TravelSegment => ({
            id: `segment_${index}`,
            from: {
              id: apiStop.place_details.id || `stop_${index}`,
              name: apiStop.place_details.displayName?.text || 'Unknown Location',
              address: apiStop.place_details.formattedAddress || '',
              coordinates: {
                lat: apiStop.place_details.location.latitude,
                lng: apiStop.place_details.location.longitude
              },
              duration: 45,
              category: apiStop.place_details.types?.[0] || 'attraction',
              rating: apiStop.place_details.rating || 4.0
            },
            to: {
              id: activeItinerary[index + 1].place_details.id || `stop_${index + 1}`,
              name: activeItinerary[index + 1].place_details.displayName?.text || 'Unknown Location',
              address: activeItinerary[index + 1].place_details.formattedAddress || '',
              coordinates: {
                lat: activeItinerary[index + 1].place_details.location.latitude,
                lng: activeItinerary[index + 1].place_details.location.longitude
              },
              duration: 45,
              category: activeItinerary[index + 1].place_details.types?.[0] || 'attraction',
              rating: activeItinerary[index + 1].place_details.rating || 4.0
            },
            mode: 'walking' as const,
            duration: 10, // Default 10 minutes walking time
            distance: 500, // Default 500 meters
            cost: 0
          })),
          totalDuration: activeItinerary.length * 45, // Rough estimate
          estimatedCost: 50 // Default estimated cost
        };

        console.log('🎯 convertedItinerary:', convertedItinerary);
        console.log('🔄 About to call setItinerary...');
        setItinerary(convertedItinerary);
        console.log('✅ setItinerary called successfully');
      } else {
        console.log('❌ activeItinerary is not a valid array:', {
          activeItinerary,
          type: typeof activeItinerary,
          isArray: Array.isArray(activeItinerary)
        });
      }
    } else {
      console.log('❌ No currentPlan or providedItinerary provided:', {
        currentPlan: !!currentPlan,
        providedItinerary: !!providedItinerary
      });
    }
  }, [currentPlan, isDraftMode, providedItinerary]);

  // Handle errors
  useEffect(() => {
    console.log('🚨 MainItineraryInterface error check:', {
      hasError: !!error,
      error: error
    });

    if (error) {
      console.error('❌ MainItineraryInterface error:', error);
      onError?.(error);
    }
  }, [error, onError]);

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStop(null);
  };

  const handleGetDirections = (stop: Stop) => {
    onGetDirections?.(stop);
    // Close modal after action
    handleCloseModal();
  };

  const handleCallVenue = (stop: Stop) => {
    onCallVenue?.(stop);
  };

  const handleRemoveStop = (stop: Stop) => {
    onRemoveStop?.(stop);
    // Close modal and update itinerary
    handleCloseModal();
  };

  // Chat handlers
  const handleOpenChat = () => {
    setIsChatOpen(true);
    onOpenChat?.();
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSendMessage = async (message: string) => {
    if (planId) {
      await sendMessage(planId, message);
    }
  };

  const handleConfirmPlan = async () => {
    if (planId) {
      await confirmPlan(planId);
    }
  };

  const handleReplaceStop = async (stop: Stop, newPlace: Place) => {
    // TODO: Implement stop replacement logic
    // This would involve updating the itinerary with the new place
    console.log('Replacing stop:', stop.name, 'with:', newPlace.display_name);
  };

  // Convert chat history to ChatConversation format
  const conversation: ChatConversation | undefined = chatHistory.length > 0 ? {
    id: `chat_${planId || 'default'}`,
    tripId: planId || 'default',
    messages: chatHistory.map(msg => ({
      id: `${msg.role}_${msg.timestamp}`,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      suggestions: [] // Add suggestions if available in the future
    }))
  } : undefined;

  console.log('🖼️ MainItineraryInterface render:', {
    hasItinerary: !!itinerary,
    isLoading,
    planId,
    currentPlan: !!currentPlan,
    error
  });

  return (
    <div className={className}>
      <DataLoading
        isLoading={isLoading && !itinerary}
        loadingType="skeleton"
        loadingText="Loading your itinerary..."
      >
        {/* Main Timeline View */}
        <TimelineView
          itinerary={itinerary}
          weather={weather}
          contextAlerts={contextAlerts}
          onStopClick={handleStopClick}
          onStartJourney={onStartJourney}
          onOpenChat={handleOpenChat}
          onConfirmPlan={handleConfirmPlan}
          isDraftMode={isDraftMode}
          isConfirming={isLoading}
        />

        {/* Stop Detail Modal */}
        <StopDetailModal
          stop={selectedStop}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onGetDirections={handleGetDirections}
          onCallVenue={handleCallVenue}
          onRemoveStop={handleRemoveStop}
          onReplaceStop={handleReplaceStop}
        />
      </DataLoading>

      {/* Chat Overlay */}
      {planId && (
        <ChatOverlay
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          conversation={conversation}
          onSendMessage={handleSendMessage}
          isTyping={isLoading}
        />
      )}
    </div>
  );
};

export { MainItineraryInterface };