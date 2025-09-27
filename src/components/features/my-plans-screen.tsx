'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button, DataLoading, Badge } from '@/components/ui';
import { CenteredLayout, Stack, Container, Grid } from '@/components/layout';
import { usePlansAPI } from '@/hooks';
import { PlanSummary } from '@/services/plans-api';

export interface MyPlansScreenProps {
  onPlanSelected?: (planId: string) => void;
  onCreateNew?: () => void;
  onBack?: () => void;
  className?: string;
}

const MyPlansScreen = ({
  onPlanSelected,
  onCreateNew,
  onBack,
  className,
}: MyPlansScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const {
    plans,
    isLoading,
    error,
    loadPlans,
    deletePlan,
    clearError
  } = usePlansAPI();

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handlePlanClick = (planId: string) => {
    setSelectedPlan(planId);
    onPlanSelected?.(planId);
  };

  const handleDeletePlan = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm('Are you sure you want to delete this plan?')) {
      await deletePlan(planId);
    }
  };

  const handleRetry = () => {
    clearError();
    loadPlans();
  };

  if (error) {
    return (
      <CenteredLayout maxWidth="lg" className={className}>
        <Container center>
          <Stack spacing="lg" align="center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">Failed to Load Plans</h2>
              <p className="text-foreground-secondary mb-6">{error}</p>
              <div className="flex gap-4">
                <Button onClick={handleRetry} variant="primary">
                  Try Again
                </Button>
                {onBack && (
                  <Button onClick={onBack} variant="ghost">
                    Go Back
                  </Button>
                )}
              </div>
            </div>
          </Stack>
        </Container>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout maxWidth="lg" className={className}>
      <Container>
        <Stack spacing="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                My Travel{' '}
                <span className="bg-gradient-to-r from-magic-teal to-magic-purple bg-clip-text text-transparent">
                  Plans
                </span>
              </h1>
              <p className="text-foreground-secondary mt-2">
                Explore your AI-crafted adventures
              </p>
            </div>

            <div className="flex gap-3">
              {onBack && (
                <Button onClick={onBack} variant="ghost" size="sm">
                  ← Back
                </Button>
              )}
              <Button onClick={onCreateNew} variant="primary">
                Create New Plan
              </Button>
            </div>
          </motion.div>

          {/* Plans List */}
          <DataLoading
            isLoading={isLoading}
            loadingType="cards"
            loadingText="Loading your travel plans..."
          >
            <AnimatePresence>
              {plans.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Plans Yet
                  </h3>
                  <p className="text-foreground-secondary mb-6 max-w-md mx-auto">
                    Ready to start your next adventure? Create your first AI-powered travel plan!
                  </p>
                  <Button onClick={onCreateNew} variant="primary" size="lg">
                    Create Your First Plan
                  </Button>
                </motion.div>
              ) : (
                <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
                  {plans.map((plan, index) => (
                    <PlanCard
                      key={plan.plan_id}
                      plan={plan}
                      index={index}
                      isSelected={selectedPlan === plan.plan_id}
                      onClick={() => handlePlanClick(plan.plan_id)}
                      onDelete={(e) => handleDeletePlan(plan.plan_id, e)}
                    />
                  ))}
                </Grid>
              )}
            </AnimatePresence>
          </DataLoading>

          {/* Stats */}
          {plans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="bg-card-default rounded-lg px-6 py-3 border border-border-subtle">
                <p className="text-sm text-foreground-secondary">
                  {plans.length} {plans.length === 1 ? 'plan' : 'plans'} •
                  {plans.filter(p => p.status === 'confirmed').length} confirmed •
                  {plans.filter(p => p.status === 'draft').length} drafts
                </p>
              </div>
            </motion.div>
          )}
        </Stack>
      </Container>
    </CenteredLayout>
  );
};

// Plan Card Component
interface PlanCardProps {
  plan: PlanSummary;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const PlanCard = ({ plan, index, isSelected, onClick, onDelete }: PlanCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        interactive
        selected={isSelected}
        onClick={onClick}
        className="h-full cursor-pointer group"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="group-hover:text-magic-teal transition-colors">
                {plan.name}
              </CardTitle>
              <p className="text-sm text-foreground-secondary mt-1">
                Created {formatDate(plan.created_at)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onDelete}
                className="p-1 text-foreground-secondary hover:text-red-400 transition-colors"
                title="Delete plan"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Status Badge */}
          {plan.status && (
            <div className="mt-2">
              <Badge className={getStatusColor(plan.status)}>
                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {plan.preview ? (
            <Stack spacing="sm">
              <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                <span>📍 {plan.location || 'Unknown'}</span>
                <span>⏱️ {plan.preview.duration}</span>
                <span>📊 {plan.preview.stops_count} stops</span>
              </div>

              {plan.preview.highlights.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.preview.highlights.slice(0, 3).map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-magic-teal/10 text-magic-teal rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Stack>
          ) : (
            <div className="text-sm text-foreground-secondary">
              Tap to view plan details
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { MyPlansScreen };

export default MyPlansScreen;