"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@/components/dashboard/Grid';
import useWidgets from '@/hooks/useWidgets';

export default function PersonalPage() {
  const router = useRouter();
  const { config, loading, error, updateTabItems } = useWidgets();

  // Make sure we have authenticated user
  useEffect(() => {
    // You would typically check auth state here
    // For now, we'll simulate this functionality
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <Grid
      items={config.personal}
      tab="personal"
      onUpdateItems={(items) => updateTabItems('personal', items)}
    />
  );
}