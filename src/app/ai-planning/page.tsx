'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AIPlanningInterface } from '@/components/features';
import { travelPersonas } from '@/data/travel-personas';
import { useTravelContext, useSelectedStyles, useAppActions } from '@/contexts/app-context';

export default function AIPlanningPage() {
  const router = useRouter();
  const travelContext = useTravelContext();
  const selectedStyles = useSelectedStyles();
  const { resetApp } = useAppActions();


  // Debug logging
  console.log('🔍 AI Planning Page - travelContext from hook:', travelContext);
  console.log('🔍 AI Planning Page - selectedStyles from hook:', selectedStyles);

  // Check localStorage as fallback
  useEffect(() => {
    const saved = localStorage.getItem('city-weaver-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('📦 AI Planning Page - LocalStorage data:', parsed);
    }
  }, []);

  // Use context data or fallback to mock data
  const contextData = travelContext || {
    location: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    group: {
      adults: 2,
      children: [{ age: 8 }],
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    budget: 150,
    mobilityNeeds: ['public-transport', 'family-friendly'],
  };

  console.log('🎯 AI Planning Page - Final contextData being passed to interface:', contextData);

  // Use selected styles from context or fallback to mock data
  const stylesData = selectedStyles.length > 0 ? selectedStyles : [
    travelPersonas[0], // Urban Explorer
    travelPersonas[1], // Foodie's Quest
    travelPersonas[2], // History Buff
  ];

  const handlePlanningComplete = (planData: { styles: any; context: any; planId: string }) => {
    console.log('Planning completed with data:', planData);
    router.push(`/itinerary?planId=${planData.planId}`);
  };

  return (
    <div>

      <AIPlanningInterface
        selectedStyles={stylesData}
        contextData={contextData}
        onPlanningComplete={handlePlanningComplete}
      />
    </div>
  );
}