'use client';

import { useRouter } from 'next/navigation';
import { ContextSetupForm, type ContextSetupData } from '@/components/features';
import { useAppActions } from '@/contexts/app-context';

export default function ContextSetupPage() {
  const router = useRouter();
  const { setTravelContext } = useAppActions();

  const handleFormSubmit = (data: ContextSetupData) => {
    console.log('📋 Context setup data received:', data);

    const contextToSave = {
      location: data.location,
      coordinates: data.coordinates,
      group: data.group,
      startDate: data.startDate,
      endDate: data.endDate,
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
      onFormSubmit={handleFormSubmit}
      onBack={handleBack}
    />
  );
}