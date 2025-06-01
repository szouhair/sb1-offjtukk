"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Widget } from '@/types';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { BarChart3, CheckSquare } from 'lucide-react';

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: Widget) => void;
}

// Available widget types
const widgetTypes = [
  {
    type: 'todo',
    title: 'Todo List',
    description: 'Track your tasks and to-dos',
    icon: CheckSquare,
    defaultConfig: {},
  },
  {
    type: 'price-alert',
    title: 'Price Alert',
    description: 'Set alerts for stock and crypto prices',
    icon: BarChart3,
    defaultConfig: {},
  },
];

export default function AddWidgetDialog({
  open,
  onOpenChange,
  onAddWidget,
}: AddWidgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {widgetTypes.map((widgetType) => (
            <Button
              key={widgetType.type}
              variant="outline"
              className="h-auto flex-col items-center justify-center gap-2 p-4 hover:bg-accent transition-colors"
              onClick={() => {
                onAddWidget({
                  id: uuidv4(),
                  type: widgetType.type,
                  title: widgetType.title,
                  config: widgetType.defaultConfig,
                });
              }}
            >
              <widgetType.icon className="h-8 w-8 text-primary" />
              <span className="font-medium">{widgetType.title}</span>
              <p className="text-xs text-muted-foreground text-center">
                {widgetType.description}
              </p>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}