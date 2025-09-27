'use client';

import { useRouter } from 'next/navigation';
import { StyleSelectionScreen } from '@/components/features';
import { TravelStyle } from '@/types';
import { useAppActions } from '@/contexts/app-context';

export default function StyleSelectionPage() {
  const router = useRouter();
  const { setSelectedStyles } = useAppActions();

  const handleStyleSelected = (selectedStyles: TravelStyle[]) => {
    console.log('🎯 Style Selection - Selected travel styles:', selectedStyles);
    console.log('🎯 Style Selection - Number of styles:', selectedStyles.length);

    // Save to global state first
    console.log('💾 Style Selection - Saving to global state...');
    setSelectedStyles(selectedStyles);

    // Small delay to ensure state update, then navigate
    setTimeout(() => {
      console.log('🧭 Style Selection - Navigating to context-setup...');
      router.push('/context-setup');
    }, 100);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <StyleSelectionScreen
      onStyleSelected={handleStyleSelected}
      onBack={handleBack}
      maxSelections={3}
    />
  );
}