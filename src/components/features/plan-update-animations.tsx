'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge } from '@/components/ui';
import { Stop, TravelSegment } from '@/types';

export interface PlanUpdateAnimationsProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

interface UpdateAction {
  id: string;
  type: 'add' | 'remove' | 'modify' | 'reorder';
  target: 'stop' | 'route' | 'timing';
  item: Stop | TravelSegment | any;
  description: string;
  duration: number; // in seconds
}

// Mock update actions for demonstration
const mockUpdates: UpdateAction[] = [
  {
    id: 'update-1',
    type: 'add',
    target: 'stop',
    item: {
      id: 'new-stop',
      name: 'Local Coffee Shop',
      address: 'Jalan Telawi, Bangsar',
      coordinates: { lat: 3.1319, lng: 101.6840 },
      duration: 30,
      category: 'cafe',
      rating: 4.2,
    },
    description: 'Adding a cozy coffee stop',
    duration: 2,
  },
  {
    id: 'update-2',
    type: 'modify',
    target: 'timing',
    item: { stopId: 'stop-1', newDuration: 120 },
    description: 'Extending time at Petronas Towers',
    duration: 1.5,
  },
  {
    id: 'update-3',
    type: 'remove',
    target: 'stop',
    item: {
      id: 'stop-to-remove',
      name: 'Crowded Market',
      address: 'Busy Street, KL',
    },
    description: 'Removing crowded location',
    duration: 1,
  },
];

const PlanUpdateAnimations = ({
  isVisible,
  onAnimationComplete,
  className,
}: PlanUpdateAnimationsProps) => {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [completedUpdates, setCompletedUpdates] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentUpdateIndex(0);
      setCompletedUpdates([]);
      setIsComplete(false);
      return;
    }

    if (currentUpdateIndex >= mockUpdates.length) {
      setIsComplete(true);
      setTimeout(() => {
        onAnimationComplete?.();
      }, 2000);
      return;
    }

    const currentUpdate = mockUpdates[currentUpdateIndex];
    const timer = setTimeout(() => {
      setCompletedUpdates(prev => [...prev, currentUpdate.id]);
      setCurrentUpdateIndex(prev => prev + 1);
    }, currentUpdate.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentUpdateIndex, isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl p-8 max-w-md w-full mx-4 border border-border-default shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: isComplete ? 0 : 360 }}
            transition={{
              duration: isComplete ? 0 : 2,
              repeat: isComplete ? 0 : Infinity,
              ease: 'linear'
            }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center text-2xl"
          >
            {isComplete ? '✅' : '🔄'}
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isComplete ? 'Plan Updated!' : 'Updating Your Plan'}
          </h2>

          <p className="text-foreground-secondary">
            {isComplete
              ? 'Your itinerary has been customized successfully'
              : 'Applying your requested changes...'
            }
          </p>
        </div>

        {/* Update Progress */}
        <div className="space-y-3">
          {mockUpdates.map((update, index) => {
            const isCompleted = completedUpdates.includes(update.id);
            const isCurrent = index === currentUpdateIndex && !isComplete;
            const isPending = index > currentUpdateIndex && !isComplete;

            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <UpdateItem
                  update={update}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isPending={isPending}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-6 p-4 bg-magic-teal/10 rounded-lg border border-magic-teal/30"
          >
            <div className="text-magic-teal font-medium mb-1">
              🎉 All changes applied!
            </div>
            <p className="text-sm text-foreground-secondary">
              Your timeline will refresh automatically
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Individual Update Item Component
interface UpdateItemProps {
  update: UpdateAction;
  isCompleted: boolean;
  isCurrent: boolean;
  isPending: boolean;
}

const UpdateItem = ({ update, isCompleted, isCurrent, isPending }: UpdateItemProps) => {
  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'add': return '➕';
      case 'remove': return '➖';
      case 'modify': return '✏️';
      case 'reorder': return '🔄';
      default: return '📝';
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'add': return 'success';
      case 'remove': return 'error';
      case 'modify': return 'warning';
      case 'reorder': return 'magic';
      default: return 'default';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
        isCurrent
          ? 'bg-magic-teal/10 border border-magic-teal/30'
          : isCompleted
          ? 'bg-card-hover'
          : 'bg-transparent'
      }`}
    >
      {/* Status Indicator */}
      <div className="relative flex-shrink-0">
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-magic-teal to-magic-purple flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        ) : isCurrent ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 rounded-full border-2 border-magic-teal border-t-transparent"
          />
        ) : (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
            isPending ? 'bg-card-hover text-foreground-secondary' : 'bg-card-default'
          }`}>
            {getUpdateIcon(update.type)}
          </div>
        )}
      </div>

      {/* Update Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium transition-colors duration-200 ${
          isCurrent
            ? 'text-magic-teal'
            : isCompleted
            ? 'text-foreground'
            : 'text-foreground-secondary'
        }`}>
          {update.description}
        </div>

        {/* Update Details */}
        {update.item && (update.item.name || update.item.stopId) && (
          <div className="text-xs text-foreground-secondary truncate mt-1">
            {update.item.name || `Stop ${update.item.stopId}`}
          </div>
        )}
      </div>

      {/* Update Type Badge */}
      <Badge
        variant={isCompleted ? 'success' : isCurrent ? getUpdateColor(update.type) : 'ghost'}
        size="sm"
      >
        {update.type}
      </Badge>
    </div>
  );
};

// Timeline Update Overlay (for when changes are applied to the timeline)
interface TimelineUpdateOverlayProps {
  changes: Array<{
    id: string;
    type: 'add' | 'remove' | 'modify';
    stopId: string;
    position?: number;
  }>;
  onAnimationComplete?: () => void;
}

const TimelineUpdateOverlay = ({ changes, onAnimationComplete }: TimelineUpdateOverlayProps) => {
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);

  useEffect(() => {
    if (currentChangeIndex >= changes.length) {
      setTimeout(() => {
        onAnimationComplete?.();
      }, 1000);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentChangeIndex(prev => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentChangeIndex, changes.length, onAnimationComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {changes.map((change, index) => (
          index === currentChangeIndex && (
            <motion.div
              key={change.id}
              initial={{
                opacity: 0,
                scale: 0.8,
                x: change.type === 'add' ? '100%' : change.type === 'remove' ? '-100%' : 0,
                y: change.position ? change.position * 100 : '50%'
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: change.position ? change.position * 100 : '50%'
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                x: change.type === 'remove' ? '-100%' : 0
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Card className="bg-background/90 backdrop-blur-sm border-magic-teal/50 shadow-magic-medium">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">
                    {change.type === 'add' ? '➕' : change.type === 'remove' ? '➖' : '✏️'}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {change.type === 'add' ? 'Added to itinerary' :
                     change.type === 'remove' ? 'Removed from itinerary' :
                     'Updated in itinerary'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export { PlanUpdateAnimations, TimelineUpdateOverlay };