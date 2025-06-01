export type TabType = 'finance' | 'personal' | 'professional';

export interface Widget {
  id: string;
  type: string; // Widget type (e.g., "todo", "price-alert")
  title: string;
  config?: Record<string, any>; // Widget-specific configuration
}

export interface GridItem {
  i: string; // Widget ID
  x: number; // Position x
  y: number; // Position y
  w: number; // Width
  h: number; // Height
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  widget: Widget;
}

export interface DashboardConfig {
  finance: GridItem[];
  personal: GridItem[];
  professional: GridItem[];
}

// Widget types
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
}