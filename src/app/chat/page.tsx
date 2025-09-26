'use client';

import { useState } from 'react';
import { ConversationalInterface } from '@/components/features';
import { Button } from '@/components/ui';

export default function ChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handlePlanUpdate = (updates: { updateId: string; action: string; timestamp: Date }) => {
    console.log('Plan updates received:', updates);
    // TODO: Apply updates to the actual itinerary
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Conversational Interface Demo
        </h1>

        <p className="text-foreground-secondary mb-8 max-w-md">
          Click the button below to open the chat interface and experience
          how users can modify their travel plans through natural conversation.
        </p>

        <Button
          size="lg"
          onClick={() => setIsChatOpen(true)}
          className="bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft"
        >
          💬 Open Chat Interface
        </Button>

        <div className="mt-8 text-xs text-foreground-secondary max-w-lg">
          <p className="mb-2">
            <strong>Demo Features:</strong>
          </p>
          <ul className="space-y-1 text-left">
            <li>• Interactive chat with AI typing indicators</li>
            <li>• Smart suggestion chips for quick actions</li>
            <li>• Plan update animations when changes are applied</li>
            <li>• Timeline update overlays showing real-time changes</li>
            <li>• Voice input button (UI placeholder)</li>
            <li>• Contextual AI responses based on user requests</li>
          </ul>
        </div>
      </div>

      {/* Conversational Interface */}
      <ConversationalInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tripId="demo-trip"
        onPlanUpdate={handlePlanUpdate}
      />
    </div>
  );
}