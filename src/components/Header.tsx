'use client';

import { Sprout, Wheat } from 'lucide-react';
import { useCrop } from '@/contexts/CropContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Header() {
  const { crop, setCrop } = useCrop();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-primary">
          {crop === 'rice' ? '水稻' : '小麦'}种植数字化管理
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-muted-foreground">当前作物：</span>
        <Select value={crop} onValueChange={(value) => setCrop(value as 'rice' | 'wheat')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择作物" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rice">
              <div className="flex items-center">
                <Sprout className="mr-2 h-4 w-4" />
                水稻
              </div>
            </SelectItem>
            <SelectItem value="wheat">
              <div className="flex items-center">
                <Wheat className="mr-2 h-4 w-4" />
                小麦
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
