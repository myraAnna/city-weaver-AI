'use client';

import { useRouter } from 'next/navigation';
import { ContextSetupForm, type ContextSetupData } from '@/components/features';

export default function ContextSetupPage() {
  const router = useRouter();

  const handleFormSubmit = (data: ContextSetupData) => {
    console.log('Context setup data:', data);
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