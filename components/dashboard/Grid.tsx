"use client";

import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GridItem, TabType, Widget } from '@/types';
import WidgetWrapper from '@/components/dashboard/WidgetWrapper';
import AddWidgetDialog from '@/components/dashboard/AddWidgetDialog';
import { saveGridConfig } from '@/lib/supabase/config';
import { toast } from 'sonner';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridProps {
  items: GridItem[];
  tab: TabType;
  onUpdateItems: (items: GridItem[]) => void;
}

export default function Grid({ items, tab, onUpdateItems }: GridProps) {
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState<GridItem[]>(items);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Prevent SSR layout shift
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLayout(items);
  }, [items]);

  const handleLayoutChange = (layout: any[]) => {
    const newItems = layout.map((l) => {
      const existingItem = items.find((item) => item.i === l.i);
      if (!existingItem) return null;
      
      return {
        ...existingItem,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
      };
    }).filter(Boolean) as GridItem[];
    
    onUpdateItems(newItems);
    
    // Debounced save to Supabase
    const saveTimeout = setTimeout(() => {
      saveGridConfig(tab, newItems)
        .catch(() => toast.error("Failed to save layout"));
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  };

  const handleAddWidget = (widget: Widget) => {
    const newItem: GridItem = {
      i: widget.id,
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      minW: 1,
      minH: 1,
      widget,
    };
    
    const newItems = [...items, newItem];
    onUpdateItems(newItems);
    
    saveGridConfig(tab, newItems)
      .then(() => toast.success(`Added ${widget.title} widget`))
      .catch(() => toast.error("Failed to add widget"));
      
    setShowAddDialog(false);
  };

  const handleRemoveWidget = (id: string) => {
    const newItems = items.filter(item => item.i !== id);
    onUpdateItems(newItems);
    
    saveGridConfig(tab, newItems)
      .then(() => toast.success("Widget removed"))
      .catch(() => toast.error("Failed to remove widget"));
  };

  if (!mounted) return <div>Loading...</div>;

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold capitalize">{tab}</h1>
        <Button 
          onClick={() => setShowAddDialog(true)} 
          size="sm" 
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: layout,
          md: layout,
          sm: layout,
          xs: layout,
          xxs: layout,
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {items.map((item) => (
          <div key={item.i}>
            <WidgetWrapper 
              widget={item.widget} 
              onRemove={() => handleRemoveWidget(item.i)} 
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      <AddWidgetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
}