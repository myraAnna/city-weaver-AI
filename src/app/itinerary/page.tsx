'use client';

import { useSearchParams } from 'next/navigation';
import { MainItineraryInterface } from '@/components/features';
import { mockWeatherData, contextAlerts } from '@/data/mock-itinerary';
import { Stop } from '@/types';

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const handleStartJourney = () => {
    console.log('Starting journey...');
    // TODO: Navigate to maps or journey tracking
  };

  const handleOpenChat = () => {
    console.log('Opening chat interface...');
    // TODO: Open chat overlay
  };

  const handleGetDirections = (stop: Stop) => {
    console.log('Getting directions to:', stop.name);
    // TODO: Open maps app or navigation
    window.open(`https://maps.google.com/?q=${stop.coordinates.lat},${stop.coordinates.lng}`, '_blank');
  };

  const handleCallVenue = (stop: Stop) => {
    console.log('Calling venue:', stop.name);
    // TODO: Initiate phone call or show contact info
  };

  const handleRemoveStop = (stop: Stop) => {
    console.log('Removing stop:', stop.name);
    // TODO: Remove stop from itinerary and update state
  };

  const handleError = (error: string) => {
    console.error('Itinerary error:', error);
    // TODO: Show error toast or navigate to error page
  };

  return (
    <MainItineraryInterface
      planId={planId || undefined}
      weather={mockWeatherData}
      contextAlerts={contextAlerts}
      onStartJourney={handleStartJourney}
      onOpenChat={handleOpenChat}
      onGetDirections={handleGetDirections}
      onCallVenue={handleCallVenue}
      onRemoveStop={handleRemoveStop}
      onError={handleError}
    />
  );
}