'use client';

import React, { useState } from 'react';
import { ChatOverlay } from './chat-overlay';
import { PlanUpdateAnimations, TimelineUpdateOverlay } from './plan-update-animations';
import { ChatMessage, ChatConversation } from '@/types';

export interface ConversationalInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
  initialConversation?: ChatConversation;
  onPlanUpdate?: (updates: any) => void;
  className?: string;
}

interface PendingUpdate {
  id: string;
  type: 'plan_change' | 'timeline_update';
  data: any;
}

// Mock conversation for demonstration
const mockConversation: ChatConversation = {
  id: 'conv-1',
  tripId: 'trip-1',
  messages: [
    {
      id: 'msg-1',
      role: 'assistant',
      content: "Hi! I see you want to modify your Kuala Lumpur itinerary. What changes would you like to make?",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      suggestions: ['Add food stops', 'Skip crowded places', 'More budget-friendly'],
    },
    {
      id: 'msg-2',
      role: 'user',
      content: "I'd like to add more local food experiences and maybe skip the really crowded tourist spots",
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: "Great idea! I can add some amazing local food spots and replace crowded areas with hidden gems. Let me suggest some changes:",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
  ],
};

const ConversationalInterface = ({
  isOpen,
  onClose,
  tripId: _tripId,
  initialConversation,
  onPlanUpdate,
  className,
}: ConversationalInterfaceProps) => {
  const [conversation, setConversation] = useState<ChatConversation>(
    initialConversation || mockConversation
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showPlanUpdates, setShowPlanUpdates] = useState(false);
  const [showTimelineUpdates, setShowTimelineUpdates] = useState(false);
  // const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);

  // Simulate AI response with typing indicator
  const simulateAIResponse = (userMessage: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        // Generate contextual response based on user input
        let responseContent = '';
        let suggestions: string[] = [];

        if (userMessage.toLowerCase().includes('food')) {
          responseContent = "Perfect! I'll add some fantastic local food spots to your itinerary. How about a traditional kopitiam for breakfast and a night market for dinner?";
          suggestions = ['Add kopitiam', 'Include night market', 'More street food'];
        } else if (userMessage.toLowerCase().includes('budget')) {
          responseContent = "I understand you'd like to keep costs down. Let me suggest some free activities and budget-friendly alternatives.";
          suggestions = ['Show free activities', 'Budget restaurants', 'Public transport tips'];
        } else if (userMessage.toLowerCase().includes('crowded')) {
          responseContent = "I'll help you avoid the busy spots! Let me replace crowded tourist areas with peaceful alternatives that locals love.";
          suggestions = ['Show quiet spots', 'Off-peak timing', 'Hidden gems'];
        } else if (userMessage.toLowerCase().includes('time')) {
          responseContent = "I can adjust the timing of your stops. Would you like to spend more time at certain places or add buffer time between locations?";
          suggestions = ['Extend museum time', 'Add rest breaks', 'Flexible timing'];
        } else {
          responseContent = "I understand what you're looking for. Let me update your itinerary with some great suggestions that match your preferences.";
          suggestions = ['Apply changes', 'See alternatives', 'Modify further'];
        }

        const response: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          suggestions,
        };

        resolve(response);
      }, 2000 + Math.random() * 1000); // 2-3 seconds
    });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Get AI response
    const aiResponse = await simulateAIResponse(message);

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, aiResponse],
    }));

    // Trigger plan updates for certain types of requests
    if (message.toLowerCase().includes('add') ||
        message.toLowerCase().includes('change') ||
        message.toLowerCase().includes('remove')) {
      setTimeout(() => {
        setShowPlanUpdates(true);
      }, 1000);
    }
  };

  const handleAcceptPlanUpdate = (updateId: string) => {
    console.log('Accepting plan update:', updateId);

    // Show timeline update animations
    setShowPlanUpdates(false);
    setShowTimelineUpdates(true);

    // Notify parent component of plan changes
    onPlanUpdate?.({
      updateId,
      action: 'accept',
      timestamp: new Date(),
    });
  };

  const handleRejectPlanUpdate = (updateId: string) => {
    console.log('Rejecting plan update:', updateId);
    setShowPlanUpdates(false);

    // Add AI response acknowledging the rejection
    const rejectionResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: "No problem! Your current itinerary will stay as it is. Is there anything else you'd like to adjust?",
      timestamp: new Date(),
      suggestions: ['Try different changes', 'Modify timing', 'Add activities'],
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, rejectionResponse],
    }));
  };

  const handlePlanAnimationComplete = () => {
    setShowPlanUpdates(false);

    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: "Perfect! I've updated your itinerary with the changes. Your timeline now includes the local food spots and quieter alternatives you wanted. Anything else you'd like to adjust?",
      timestamp: new Date(),
      suggestions: ['Add more stops', 'Adjust timing', 'Perfect as is'],
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, confirmationMessage],
    }));
  };

  const handleTimelineAnimationComplete = () => {
    setShowTimelineUpdates(false);
  };

  const mockTimelineChanges = [
    { id: 'change-1', type: 'add' as const, stopId: 'new-food-stop', position: 0.3 },
    { id: 'change-2', type: 'remove' as const, stopId: 'crowded-spot', position: 0.6 },
    { id: 'change-3', type: 'modify' as const, stopId: 'existing-stop', position: 0.8 },
  ];

  return (
    <div className={className}>
      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isOpen}
        onClose={onClose}
        conversation={conversation}
        onSendMessage={handleSendMessage}
        onAcceptPlanUpdate={handleAcceptPlanUpdate}
        onRejectPlanUpdate={handleRejectPlanUpdate}
        isTyping={isTyping}
      />

      {/* Plan Update Animations */}
      <PlanUpdateAnimations
        isVisible={showPlanUpdates}
        onAnimationComplete={handlePlanAnimationComplete}
      />

      {/* Timeline Update Overlay */}
      {showTimelineUpdates && (
        <TimelineUpdateOverlay
          changes={mockTimelineChanges}
          onAnimationComplete={handleTimelineAnimationComplete}
        />
      )}
    </div>
  );
};

export { ConversationalInterface };