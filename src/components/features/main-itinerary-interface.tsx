'use client';

import React, { useState, useEffect } from 'react';
import { TimelineView } from './timeline-view';
import { StopDetailModal } from './stop-detail-modal';
import { ChatOverlay } from './chat-overlay';
import { Itinerary, Stop, WeatherData, ChatConversation } from '@/types';
import { usePlansAPI } from '@/hooks';
import { Plan } from '@/services/plans-api';
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
    if (planId && !providedItinerary) {
      loadPlan(planId);
    }
  }, [planId, providedItinerary, loadPlan]);

  // Convert API plan to itinerary format
  useEffect(() => {
    if (currentPlan && !providedItinerary) {
      // Get active itinerary (draft if available, otherwise main)
      const activeItinerary = isDraftMode && currentPlan.draft_itinerary
        ? currentPlan.draft_itinerary.stops
        : currentPlan.itinerary;

      if (activeItinerary) {
        // Convert API format to frontend format
        const convertedItinerary: Itinerary = {
          id: currentPlan.plan_id,
          title: currentPlan.persona.name + ' Adventure',
          description: currentPlan.persona.backstory,
          duration: '6 hours', // Could calculate from stops
          totalDistance: '5.2 km', // Could calculate from coordinates
          stops: activeItinerary.map((apiStop, index): Stop => ({
            id: `stop_${index}`,
            name: apiStop.place_details.display_name,
            address: apiStop.place_details.formatted_address,
            coordinates: {
              lat: apiStop.place_details.location.latitude,
              lng: apiStop.place_details.location.longitude
            },
            time: apiStop.time,
            duration: '45 minutes', // Default duration
            category: apiStop.place_details.types?.[0] || 'attraction',
            rating: apiStop.place_details.rating || 4.0,
            photo: '', // Would need photo from API
            description: apiStop.narrative,
            aiInsights: [{
              id: `insight_${index}`,
              type: 'recommendation',
              content: apiStop.narrative,
              confidence: 0.9
            }],
            liveStatus: {
              crowdLevel: 'moderate',
              waitTime: '5-10 min',
              isOpen: true,
              nextChange: '6:00 PM'
            },
            travelTime: index < activeItinerary.length - 1 ? '8 min walk' : undefined
          }))
        };

        setItinerary(convertedItinerary);
      }
    }
  }, [currentPlan, isDraftMode, providedItinerary]);

  // Handle errors
  useEffect(() => {
    if (error) {
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
    messages: chatHistory.map(msg => ({
      id: `${msg.role}_${msg.timestamp}`,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      suggestions: [] // Add suggestions if available in the future
    }))
  } : undefined;

  return (
    <div className={className}>
      <DataLoading
        isLoading={isLoading && !itinerary}
        loadingType="timeline"
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