"use client";

import { useState, useEffect } from 'react';
import { DashboardConfig, GridItem, TabType } from '@/types';
import { getGridConfig } from '@/lib/supabase/config';
import { toast } from 'sonner';

export function useWidgets() {
  const [config, setConfig] = useState<DashboardConfig>({
    finance: [],
    personal: [],
    professional: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getGridConfig();
        setConfig(data);
      } catch (err) {
        setError('Failed to load dashboard configuration');
        toast.error('Failed to load dashboard configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateTabItems = (tab: TabType, items: GridItem[]) => {
    setConfig(prev => ({
      ...prev,
      [tab]: items,
    }));
  };

  return {
    config,
    loading,
    error,
    updateTabItems,
  };
}

export default useWidgets;