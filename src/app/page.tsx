'use client';

import { useRouter } from 'next/navigation';
import { WelcomeScreen } from '@/components';

export default function Home() {
  const router = useRouter();

  const handleStartPlanning = () => {
    router.push('/style-selection');
  };

  const handleHowItWorks = () => {
    console.log('Show how it works...');
    // TODO: Show how it works modal or section
  };

  const handleSamplePlans = () => {
    console.log('Show sample plans...');
    // TODO: Show sample plans modal or section
  };

  return (
    <WelcomeScreen
      onStartPlanning={handleStartPlanning}
      onHowItWorks={handleHowItWorks}
      onSamplePlans={handleSamplePlans}
    />
  );
}