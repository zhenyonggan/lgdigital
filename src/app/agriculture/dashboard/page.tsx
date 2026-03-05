"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Ruler, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { crop } = useCrop();

  const stats = [
    {
      title: "总种植面积",
      value: crop === 'rice' ? "12,500 亩" : "8,800 亩",
      icon: Ruler,
      description: "较上年增长 5%"
    },
    {
      title: "当前农事活动",
      value: crop === 'rice' ? "插秧期" : "越冬期",
      icon: Activity,
      description: "需注意近期降雨"
    },
    {
      title: "预计产量",
      value: crop === 'rice' ? "7,500 吨" : "4,200 吨",
      icon: Sprout,
      description: "根据当前长势估算"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">农事管理数据概览</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>当前作物信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            正在管理: <span className="font-bold text-primary">{crop === 'rice' ? '水稻' : '小麦'}</span>
          </div>
          <p className="text-muted-foreground mt-2">
            这里可以展示更多关于当前{crop === 'rice' ? '水稻' : '小麦'}种植周期的详细信息。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
