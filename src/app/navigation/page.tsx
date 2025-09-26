'use client';

import { useState } from 'react';
import { MapsHandoffModal } from '@/components/features';
import { mockItinerary } from '@/data/mock-itinerary';
import { Button } from '@/components/ui';
import { Container, Stack } from '@/components/layout';

export default function NavigationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleMaps = () => {
    console.log('Opening Google Maps...');
    // Generate Google Maps URL with waypoints
    const waypoints = mockItinerary.stops.map(stop =>
      `${stop.coordinates.lat},${stop.coordinates.lng}`
    ).join('|');

    const url = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(url, '_blank');
  };

  const handleAppleMaps = () => {
    console.log('Opening Apple Maps...');
    // Generate Apple Maps URL
    const waypoints = mockItinerary.stops.map((stop, index) =>
      `${index === 0 ? 'saddr' : index === mockItinerary.stops.length - 1 ? 'daddr' : 'waypoint'}=${stop.coordinates.lat},${stop.coordinates.lng}`
    ).join('&');

    const url = `http://maps.apple.com/?${waypoints}`;
    window.open(url, '_blank');
  };

  const handleWaze = () => {
    console.log('Opening Waze...');
    // Generate Waze URL (simplified version)
    const firstStop = mockItinerary.stops[0];
    const url = `https://waze.com/ul?ll=${firstStop.coordinates.lat}%2C${firstStop.coordinates.lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    console.log('Sharing itinerary...');

    if (navigator.share) {
      navigator.share({
        title: 'My Kuala Lumpur Itinerary',
        text: `Check out my personalized KL travel plan! ${mockItinerary.stops.length} amazing stops in ${Math.floor(mockItinerary.totalDuration / 60)}h ${mockItinerary.totalDuration % 60}m.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const shareText = `My Kuala Lumpur Itinerary:\n\n${mockItinerary.stops.map((stop, i) => `${i + 1}. ${stop.name} - ${stop.duration}min`).join('\n')}\n\nTotal: ${Math.floor(mockItinerary.totalDuration / 60)}h ${mockItinerary.totalDuration % 60}m | Est. Cost: RM${mockItinerary.estimatedCost.toFixed(2)}`;

      navigator.clipboard.writeText(shareText).then(() => {
        alert('Itinerary copied to clipboard!');
      }).catch(() => {
        alert('Sharing not supported on this device');
      });
    }
  };

  const handleDownload = () => {
    console.log('Downloading itinerary...');

    // Generate JSON file
    const itineraryData = {
      title: 'My Kuala Lumpur Itinerary',
      generated: new Date().toISOString(),
      duration: `${Math.floor(mockItinerary.totalDuration / 60)}h ${mockItinerary.totalDuration % 60}m`,
      estimatedCost: `RM${mockItinerary.estimatedCost.toFixed(2)}`,
      stops: mockItinerary.stops.map((stop, index) => ({
        order: index + 1,
        name: stop.name,
        address: stop.address,
        coordinates: stop.coordinates,
        duration: `${stop.duration} minutes`,
        category: stop.category,
        rating: stop.rating,
        entryFee: stop.entryFee ? `RM${stop.entryFee}` : 'Free',
      })),
      travelSegments: mockItinerary.travelSegments.map(segment => ({
        from: segment.from.name,
        to: segment.to.name,
        mode: segment.mode,
        duration: `${segment.duration} minutes`,
        distance: `${(segment.distance / 1000).toFixed(1)} km`,
        cost: segment.cost ? `RM${segment.cost.toFixed(2)}` : 'Free',
      })),
    };

    const dataStr = JSON.stringify(itineraryData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = 'kuala-lumpur-itinerary.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Container size="xl" className="py-12">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Navigation Integration
              <span className="block text-2xl bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent mt-2">
                Demo
              </span>
            </h1>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              Experience how users seamlessly transition from planning to navigation with our Maps Handoff Modal.
            </p>
          </div>

          {/* Demo Button */}
          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft text-lg px-8 py-4"
          >
            🚀 Launch Navigation Modal
          </Button>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold text-foreground mb-2">Multi-App Support</h3>
              <p className="text-sm text-foreground-secondary">
                Google Maps, Apple Maps, and Waze integration with smart device detection
              </p>
            </div>

            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-foreground mb-2">Trip Overview</h3>
              <p className="text-sm text-foreground-secondary">
                Complete summary with duration, cost, distance, and all stops
              </p>
            </div>

            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="font-semibold text-foreground mb-2">Share & Export</h3>
              <p className="text-sm text-foreground-secondary">
                Native sharing, clipboard copying, and JSON download functionality
              </p>
            </div>

            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-foreground mb-2">Beautiful Animations</h3>
              <p className="text-sm text-foreground-secondary">
                Spring-based modal animations with loading states and micro-interactions
              </p>
            </div>

            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-foreground mb-2">Responsive Design</h3>
              <p className="text-sm text-foreground-secondary">
                Optimized for mobile and desktop with touch-friendly controls
              </p>
            </div>

            <div className="text-center p-6 bg-card-hover rounded-lg border border-border-subtle">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-semibold text-foreground mb-2">URL Generation</h3>
              <p className="text-sm text-foreground-secondary">
                Automatic URL generation for different mapping services with waypoints
              </p>
            </div>
          </div>

          {/* Sample Itinerary Preview */}
          <div className="w-full max-w-2xl mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
              Sample Itinerary
            </h2>
            <div className="bg-card-hover rounded-lg p-6 border border-border-subtle space-y-4">
              {mockItinerary.stops.slice(0, 4).map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{stop.name}</div>
                    <div className="text-sm text-foreground-secondary">
                      {stop.duration}min • {stop.category} • ⭐ {stop.rating}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border-subtle text-center">
                <div className="text-sm text-foreground-secondary">
                  Total: <span className="font-medium text-magic-teal">
                    {Math.floor(mockItinerary.totalDuration / 60)}h {mockItinerary.totalDuration % 60}m
                  </span> •
                  Cost: <span className="font-medium text-magic-purple">
                    RM{mockItinerary.estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </Container>

      {/* Maps Handoff Modal */}
      <MapsHandoffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itinerary={mockItinerary}
        onGoogleMaps={handleGoogleMaps}
        onAppleMaps={handleAppleMaps}
        onWaze={handleWaze}
        onShare={handleShare}
        onDownload={handleDownload}
      />
    </div>
  );
}