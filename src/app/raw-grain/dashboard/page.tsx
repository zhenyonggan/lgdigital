"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RawGrainDashboard() {
  const { crop } = useCrop();

  // Mock data based on crop type
  const stats = {
    rice: {
      totalWeight: "5,000 吨",
      avgQuality: "一级",
      inspections: 12
    },
    wheat: {
      totalWeight: "3,200 吨",
      avgQuality: "二级",
      inspections: 8
    }
  };

  const currentStats = stats[crop];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">原粮监控数据概览</h1>
      <p className="text-muted-foreground">
        当前作物: {crop === 'rice' ? '水稻' : '小麦'}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总重量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalWeight}</div>
            <p className="text-xs text-muted-foreground">
              当前库存总量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均质量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.avgQuality}</div>
            <p className="text-xs text-muted-foreground">
              基于最近一次检测
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              本月巡查次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.inspections}</div>
            <p className="text-xs text-muted-foreground">
              较上月 +2
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
