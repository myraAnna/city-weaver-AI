'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContextSetupForm, type ContextSetupData } from '@/components/features';
import { useAppActions } from '@/contexts/app-context';

export default function ContextSetupPage() {
  const router = useRouter();
  const [pageKey, setPageKey] = useState(0);
  const { setTravelContext } = useAppActions();

  // Force component re-mount when navigating to this page
  useEffect(() => {
    setPageKey(prev => prev + 1);
  }, []);

  const handleFormSubmit = (data: ContextSetupData) => {
    console.log('📋 Context setup data received:', data);

    const contextToSave = {
      location: data.location,
      coordinates: data.coordinates,
      group: data.group,
      duration: data.duration,
      timeOfDay: data.timeOfDay,
      budget: data.budget,
      mobilityNeeds: data.mobilityNeeds,
    };

    console.log('💾 Context setup - Saving to app context:', contextToSave);

    // Save to app context
    setTravelContext(contextToSave);

    console.log('✅ Context setup - Data saved, navigating to ai-planning');
    router.push('/ai-planning');
  };

  const handleBack = () => {
    router.push('/style-selection');
  };

  return (
    <ContextSetupForm
      key={pageKey}
      onFormSubmit={handleFormSubmit}
      onBack={handleBack}
    />
  );
}