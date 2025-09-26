'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Stack } from '@/components/layout';
import { ChatMessage, ChatConversation } from '@/types';

export interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  conversation?: ChatConversation;
  onSendMessage: (message: string) => void;
  onAcceptPlanUpdate?: (updateId: string) => void;
  onRejectPlanUpdate?: (updateId: string) => void;
  isTyping?: boolean;
  className?: string;
}

interface SuggestionChip {
  id: string;
  text: string;
  category: 'modify' | 'add' | 'remove' | 'time' | 'budget';
  icon: string;
}

const suggestionChips: SuggestionChip[] = [
  { id: 'add-food', text: 'Add a food stop', category: 'add', icon: '🍜' },
  { id: 'skip-crowded', text: 'Skip crowded places', category: 'modify', icon: '👥' },
  { id: 'more-time', text: 'Spend more time at museums', category: 'time', icon: '⏱️' },
  { id: 'budget-friendly', text: 'Make it more budget-friendly', category: 'budget', icon: '💰' },
  { id: 'add-shopping', text: 'Add shopping spots', category: 'add', icon: '🛍️' },
  { id: 'remove-walking', text: 'Less walking', category: 'modify', icon: '🚶‍♂️' },
  { id: 'indoor-activities', text: 'More indoor activities', category: 'modify', icon: '🏢' },
  { id: 'family-friendly', text: 'Make it more family-friendly', category: 'modify', icon: '👨‍👩‍👧‍👦' },
];

const ChatOverlay = ({
  isOpen,
  onClose,
  conversation,
  onSendMessage,
  onAcceptPlanUpdate: _onAcceptPlanUpdate,
  onRejectPlanUpdate: _onRejectPlanUpdate,
  isTyping = false,
  className,
}: ChatOverlayProps) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionChip) => {
    onSendMessage(suggestion.text);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    console.log('Voice input clicked');
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-background border-l border-border-default shadow-2xl z-50 flex flex-col ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-card-default/50 backdrop-blur-sm">
              <div>
                <CardTitle className="text-xl">Modify Your Plan</CardTitle>
                <p className="text-sm text-foreground-secondary mt-1">
                  Chat with AI to customize your itinerary
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full w-8 h-8 p-0 hover:bg-card-hover"
              >
                ✕
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {(!conversation?.messages || conversation.messages.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AIMessage
                    content="Hi! I'm here to help you customize your itinerary. What would you like to change about your plan?"
                    showAvatar
                  />
                </motion.div>
              )}

              {/* Conversation Messages */}
              {conversation?.messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {msg.role === 'user' ? (
                    <UserMessage content={msg.content} timestamp={msg.timestamp} />
                  ) : (
                    <AIMessage
                      content={msg.content}
                      suggestions={msg.suggestions}
                      showAvatar={index === 0}
                    />
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {showSuggestions && (!conversation?.messages || conversation.messages.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-4 border-t border-border-subtle bg-card-hover/30"
              >
                <p className="text-sm text-foreground-secondary mb-3">
                  💡 Popular requests:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.slice(0, 6).map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs border border-border-subtle hover:border-magic-teal/50 hover:bg-magic-teal/10"
                    >
                      {suggestion.icon} {suggestion.text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border-subtle bg-card-default/50 backdrop-blur-sm">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Press Enter to send)"
                    className="w-full p-3 pr-12 bg-input-default border border-border-default rounded-lg resize-none text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-magic-teal/50 focus:bg-input-focus transition-all duration-200"
                    rows={1}
                    style={{
                      minHeight: '44px',
                      maxHeight: '120px',
                      height: `${Math.min(120, Math.max(44, message.split('\n').length * 20 + 24))}px`,
                    }}
                  />

                  {/* Voice Input Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full hover:bg-card-hover"
                    title="Voice input"
                  >
                    🎤
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`rounded-lg px-6 ${
                    message.trim()
                      ? 'bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// User Message Component
interface UserMessageProps {
  content: string;
  timestamp: Date;
}

const UserMessage = ({ content, timestamp }: UserMessageProps) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="bg-gradient-to-r from-magic-teal to-magic-purple text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-magic-soft/30">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        <div className="text-xs text-foreground-secondary mt-1 text-right">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// AI Message Component
interface AIMessageProps {
  content: string;
  suggestions?: string[];
  showAvatar?: boolean;
}

const AIMessage = ({ content, suggestions, showAvatar }: AIMessageProps) => {
  return (
    <div className="flex items-start gap-3">
      {/* AI Avatar */}
      {showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
          AI
        </div>
      )}

      <div className={`flex-1 ${!showAvatar ? 'ml-11' : ''}`}>
        {/* Message Content */}
        <div className="bg-card-hover rounded-2xl rounded-tl-md px-4 py-3 border border-border-subtle">
          <p className="text-sm leading-relaxed text-foreground">{content}</p>
        </div>

        {/* Quick Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs bg-card-default border border-border-subtle hover:border-magic-teal/50 hover:bg-magic-teal/10"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        AI
      </div>

      <div className="bg-card-hover rounded-2xl rounded-tl-md px-4 py-3 border border-border-subtle">
        <div className="flex items-center gap-1">
          <span className="text-sm text-foreground-secondary">AI is thinking</span>
          <div className="flex gap-1 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-magic-teal"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Plan Update Card Component (for when AI suggests changes)
interface PlanUpdateCardProps {
  updateId: string;
  title: string;
  description: string;
  changes: Array<{
    type: 'add' | 'remove' | 'modify';
    item: string;
    details: string;
  }>;
  onAccept: (updateId: string) => void;
  onReject: (updateId: string) => void;
}

const PlanUpdateCard = ({
  updateId,
  title,
  description,
  changes,
  onAccept,
  onReject,
}: PlanUpdateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="my-4"
    >
      <Card className="border-magic-teal/30 bg-magic-teal/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ✨ {title}
          </CardTitle>
          <p className="text-sm text-foreground-secondary">{description}</p>
        </CardHeader>

        <CardContent>
          <Stack spacing="md">
            {/* Changes List */}
            <div className="space-y-2">
              {changes.map((change, index) => {
                const getChangeIcon = (type: string) => {
                  switch (type) {
                    case 'add': return '➕';
                    case 'remove': return '➖';
                    case 'modify': return '✏️';
                    default: return '🔄';
                  }
                };

                const getChangeColor = (type: string) => {
                  switch (type) {
                    case 'add': return 'success';
                    case 'remove': return 'error';
                    case 'modify': return 'warning';
                    default: return 'default';
                  }
                };

                return (
                  <div key={index} className="flex items-start gap-3 p-2 bg-card-hover/50 rounded-lg">
                    <Badge variant={getChangeColor(change.type)} size="sm">
                      {getChangeIcon(change.type)}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{change.item}</div>
                      <div className="text-xs text-foreground-secondary">{change.details}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => onAccept(updateId)}
                className="flex-1 bg-gradient-to-r from-magic-teal to-magic-purple hover:shadow-magic-soft"
              >
                ✅ Apply Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => onReject(updateId)}
                className="flex-1 hover:bg-card-hover"
              >
                ❌ Keep Current
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { ChatOverlay, PlanUpdateCard };