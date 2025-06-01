"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trash2, BellRing, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { PriceAlert as PriceAlertType } from '@/types';
import { savePriceAlerts, getPriceAlerts } from '@/lib/supabase/widgets';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface PriceAlertProps {
  widgetId: string;
}

export default function PriceAlert({ widgetId }: PriceAlertProps) {
  const [alerts, setAlerts] = useState<PriceAlertType[]>([]);
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [isLoading, setIsLoading] = useState(true);

  // Load alerts from Supabase
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getPriceAlerts(widgetId);
        if (data) {
          setAlerts(data);
        }
      } catch (error) {
        toast.error('Failed to load price alerts');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, [widgetId]);

  // Save alerts to Supabase
  const handleSaveAlerts = async (updatedAlerts: PriceAlertType[]) => {
    try {
      await savePriceAlerts(widgetId, updatedAlerts);
    } catch (error) {
      toast.error('Failed to save price alerts');
    }
  };

  const addAlert = () => {
    if (!symbol.trim() || !price.trim() || isNaN(parseFloat(price))) {
      toast.error('Please enter a valid symbol and price');
      return;
    }
    
    const newAlert: PriceAlertType = {
      id: uuidv4(),
      symbol: symbol.toUpperCase(),
      targetPrice: parseFloat(price),
      condition,
      createdAt: new Date().toISOString(),
    };
    
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    handleSaveAlerts(updatedAlerts);
    
    // Reset form
    setSymbol('');
    setPrice('');
  };

  const removeAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    handleSaveAlerts(updatedAlerts);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid gap-2 mb-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 sm:col-span-1">
            <Label htmlFor="symbol" className="sr-only">Symbol</Label>
            <Input
              id="symbol"
              placeholder="Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="col-span-3 sm:col-span-1">
            <Label htmlFor="price" className="sr-only">Target Price</Label>
            <Input
              id="price"
              placeholder="Target Price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="col-span-3 sm:col-span-1">
            <Select 
              value={condition} 
              onValueChange={(value) => setCondition(value as 'above' | 'below')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="sm" onClick={addAlert} className="w-full">
          <BellRing className="h-4 w-4 mr-1" />
          Add Alert
        </Button>
      </div>
      
      {alerts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No price alerts yet</p>
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Target</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {alert.condition === 'above' ? (
                        <ArrowUpCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      ${alert.targetPrice.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeAlert(alert.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}