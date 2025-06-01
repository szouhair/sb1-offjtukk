import { TodoItem, PriceAlert } from '@/types';
import { supabase, getCurrentUser } from '@/lib/supabase/client';

// Save todos to Supabase
export async function saveTodos(widgetId: string, todos: TodoItem[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('widget_data')
    .upsert({
      user_id: user.id,
      widget_id: widgetId,
      widget_type: 'todo',
      data: todos
    }, {
      onConflict: 'user_id,widget_id'
    });
    
  if (error) throw error;
  return true;
}

// Get todos from Supabase
export async function getTodos(widgetId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('widget_data')
    .select('data')
    .eq('user_id', user.id)
    .eq('widget_id', widgetId)
    .eq('widget_type', 'todo')
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return []; // No data found
    }
    throw error;
  }
  
  return data.data as TodoItem[];
}

// Save price alerts to Supabase
export async function savePriceAlerts(widgetId: string, alerts: PriceAlert[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('widget_data')
    .upsert({
      user_id: user.id,
      widget_id: widgetId,
      widget_type: 'price-alert',
      data: alerts
    }, {
      onConflict: 'user_id,widget_id'
    });
    
  if (error) throw error;
  return true;
}

// Get price alerts from Supabase
export async function getPriceAlerts(widgetId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('widget_data')
    .select('data')
    .eq('user_id', user.id)
    .eq('widget_id', widgetId)
    .eq('widget_type', 'price-alert')
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return []; // No data found
    }
    throw error;
  }
  
  return data.data as PriceAlert[];
}