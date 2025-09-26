// Custom hook for chat API operations
import { useState } from 'react';
import { useChatState } from '@/contexts/app-context';
import { MockAPI } from '@/services/mock-api';

export interface UseChatAPIReturn {
  sendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
}

export const useChatAPI = (): UseChatAPIReturn => {
  const { addMessage, setAIResponding } = useChatState();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsSending(true);
      setError(null);

      // Add user message immediately
      addMessage({
        type: 'user',
        content: message.trim(),
      });

      // Show AI is responding
      setAIResponding(true);

      // Send message to AI service
      const response = await MockAPI.chat.sendMessage(message);

      if (response.success) {
        // Add AI response
        addMessage({
          type: 'ai',
          content: response.data,
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');

      // Add error message to chat
      addMessage({
        type: 'ai',
        content: 'I\'m sorry, I encountered an error while processing your message. Please try again.',
      });
    } finally {
      setIsSending(false);
      setAIResponding(false);
    }
  };

  return {
    sendMessage,
    isSending,
    error,
  };
};