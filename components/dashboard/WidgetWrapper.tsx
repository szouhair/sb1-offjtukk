"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MoreHorizontal } from 'lucide-react';
import { Widget } from '@/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import dynamic from 'next/dynamic';

// Dynamically import widget components
const widgetComponents: Record<string, any> = {
  'todo': dynamic(() => import('@/components/widgets/TodoList')),
  'price-alert': dynamic(() => import('@/components/widgets/PriceAlert')),
};

interface WidgetWrapperProps {
  widget: Widget;
  onRemove: () => void;
}

export default function WidgetWrapper({ widget, onRemove }: WidgetWrapperProps) {
  const [isGrabbing, setIsGrabbing] = useState(false);
  
  // Get the component for this widget type
  const WidgetComponent = widgetComponents[widget.type];

  return (
    <Card 
      className={`h-full overflow-hidden transition-shadow border ${
        isGrabbing ? 'shadow-lg cursor-grabbing' : 'shadow cursor-grab'
      }`}
      onMouseDown={() => setIsGrabbing(true)}
      onMouseUp={() => setIsGrabbing(false)}
      onMouseLeave={() => setIsGrabbing(false)}
    >
      <CardHeader className="p-3 flex-row items-center justify-between space-y-0 bg-muted/30">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 h-[calc(100%-40px)] overflow-auto">
        {WidgetComponent ? (
          <WidgetComponent widgetId={widget.id} config={widget.config} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Widget type not found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}