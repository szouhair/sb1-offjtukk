import { GridItem, TabType } from '@/types';
import { supabase, getCurrentUser } from '@/lib/supabase/client';

// Save grid configuration to Supabase
export async function saveGridConfig(tab: TabType, items: GridItem[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get existing config or create new one
  const { data: existingConfig } = await supabase
    .from('dashboard_configs')
    .select()
    .eq('user_id', user.id)
    .single();

  // Prepare the update data
  const configData = {
    ...existingConfig?.config || { finance: [], personal: [], professional: [] },
    [tab]: items,
  };
  
  if (existingConfig) {
    // Update existing config
    const { error } = await supabase
      .from('dashboard_configs')
      .update({ config: configData })
      .eq('user_id', user.id);
      
    if (error) throw error;
  } else {
    // Insert new config
    const { error } = await supabase
      .from('dashboard_configs')
      .insert({
        user_id: user.id,
        config: configData
      });
      
    if (error) throw error;
  }
  
  return true;
}

// Load grid configuration from Supabase
export async function getGridConfig() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('dashboard_configs')
    .select('config')
    .eq('user_id', user.id)
    .single();
    
  if (error) {
    // If no config found, return empty config
    if (error.code === 'PGRST116') {
      return {
        finance: [],
        personal: [],
        professional: [],
      };
    }
    throw error;
  }
  
  return data.config as {
    finance: GridItem[];
    personal: GridItem[];
    professional: GridItem[];
  };
}