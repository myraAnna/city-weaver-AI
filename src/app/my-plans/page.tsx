'use client';

import { useRouter } from 'next/navigation';
import { MyPlansScreen } from '@/components/features/my-plans-screen';

export default function MyPlansPage() {
  const router = useRouter();

  const handlePlanSelected = (planId: string) => {
    router.push(`/itinerary?planId=${planId}`);
  };

  const handleCreateNew = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <MyPlansScreen
      onPlanSelected={handlePlanSelected}
      onCreateNew={handleCreateNew}
      onBack={handleBack}
    />
  );
}