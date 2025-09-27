'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContextSetupForm, type ContextSetupData } from '@/components/features';

export default function ContextSetupPage() {
  const router = useRouter();
  const [pageKey, setPageKey] = useState(0);

  // Force component re-mount when navigating to this page
  useEffect(() => {
    setPageKey(prev => prev + 1);
  }, []);

  const handleFormSubmit = (data: ContextSetupData) => {
    console.log('Context setup data:', data);
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