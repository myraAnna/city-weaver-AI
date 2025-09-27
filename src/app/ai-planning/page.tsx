'use client';

import { useRouter } from 'next/navigation';
import { AIPlanningInterface } from '@/components/features';
import { travelPersonas } from '@/data/travel-personas';

export default function AIPlanningPage() {
  const router = useRouter();

  // Mock data for demonstration
  const mockSelectedStyles = [
    travelPersonas[0], // Urban Explorer
    travelPersonas[1], // Foodie's Quest
    travelPersonas[2], // History Buff
  ];

  const mockContextData = {
    location: 'Kuala Lumpur City Center',
    group: {
      adults: 2,
      children: [{ age: 8 }],
    },
    duration: 6,
    timeOfDay: 'full-day' as const,
    budget: 150,
    mobilityNeeds: ['public-transport', 'family-friendly'],
  };

  const handlePlanningComplete = (planData: { styles: any; context: any; planId: string }) => {
    console.log('Planning completed with data:', planData);
    router.push(`/itinerary?planId=${planData.planId}`);
  };

  return (
    <AIPlanningInterface
      selectedStyles={mockSelectedStyles}
      contextData={mockContextData}
      onPlanningComplete={handlePlanningComplete}
    />
  );
}