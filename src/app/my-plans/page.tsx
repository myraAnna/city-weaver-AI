'use client';

import { useRouter } from 'next/navigation';
import { MyPlansScreen } from '@/components/features/my-plans-screen';
import { AuthGuard } from '@/contexts';

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
    <AuthGuard requireAuth={true}>
      <MyPlansScreen
        onPlanSelected={handlePlanSelected}
        onCreateNew={handleCreateNew}
        onBack={handleBack}
      />
    </AuthGuard>
  );
}