"use client";

import React, { useState, useEffect } from 'react';
import { useCrop } from '@/contexts/CropContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Warehouse, ClipboardList, Scale, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DashboardStats {
  totalWeight: number;
  locationCount: number;
  totalInspections: number;
  recentImpurity: string;
}

interface ChartData {
  date: string;
  count: number;
}

export default function RawGrainDashboard() {
  const { crop } = useCrop();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalWeight: 0,
    locationCount: 0,
    totalInspections: 0,
    recentImpurity: '-',
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. 获取存储地点统计 (总重量、地点数量)
      const { data: locations, error: locError } = await supabase
        .from('storage_locations')
        .select('grain_weight, impurity_grade')
        .eq('crop_type', crop);

      if (locError) throw locError;

      const totalWeight = locations?.reduce((sum, loc) => sum + (loc.grain_weight || 0), 0) || 0;
      const locationCount = locations?.length || 0;
      
      // 简单的众数算法计算“主要杂质等级”
      const impurityCounts: Record<string, number> = {};
      locations?.forEach(loc => {
        const q = loc.impurity_grade || '未知';
        impurityCounts[q] = (impurityCounts[q] || 0) + 1;
      });
      const recentImpurity = Object.entries(impurityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      // 2. 获取巡查记录统计 (总次数、图表数据)
      // 获取最近30天的记录
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: inspections, error: insError } = await supabase
        .from('grain_inspections')
        .select(`
          date,
          storage_locations!inner(crop_type)
        `)
        .eq('storage_locations.crop_type', crop)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (insError) throw insError;

      const totalInspections = inspections?.length || 0;

      // 处理图表数据：按日期聚合
      const dailyCounts: Record<string, number> = {};
      inspections?.forEach(ins => {
        dailyCounts[ins.date] = (dailyCounts[ins.date] || 0) + 1;
      });

      // 补全最近7天的日期（如果某天没有数据则为0）
      const chartDataArray: ChartData[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        chartDataArray.push({
          date: dateStr.slice(5), // 只显示 MM-DD
          count: dailyCounts[dateStr] || 0
        });
      }

      setStats({
        totalWeight,
        locationCount,
        totalInspections,
        recentImpurity
      });
      setChartData(chartDataArray);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [crop]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">原粮监控数据概览</h1>
        <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-md">
          当前作物: <span className="font-semibold text-primary">{crop === 'rice' ? '水稻' : '小麦'}</span>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总库存重量</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWeight.toLocaleString()} 吨</div>
            <p className="text-xs text-muted-foreground">当前所有仓库总量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">存储地点数</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locationCount} 个</div>
            <p className="text-xs text-muted-foreground">活跃存储节点</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">主要杂质等级</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentImpurity}</div>
            <p className="text-xs text-muted-foreground">基于当前库存分布</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">近30天巡查</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInspections} 次</div>
            <p className="text-xs text-muted-foreground">持续监控中</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>最近7天巡查趋势</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="currentColor" 
                    className="fill-primary" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
