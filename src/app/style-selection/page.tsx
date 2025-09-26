'use client';

import { useRouter } from 'next/navigation';
import { StyleSelectionScreen } from '@/components/features';
import { TravelStyle } from '@/types';

export default function StyleSelectionPage() {
  const router = useRouter();

  const handleStyleSelected = (selectedStyles: TravelStyle[]) => {
    console.log('Selected travel styles:', selectedStyles);
    router.push('/context-setup');
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