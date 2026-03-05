"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackingPage() {
  const { crop } = useCrop();

  const activities = [
    {
      date: "2023-10-15",
      type: "播种",
      description: "小麦播种，品种：济麦22",
      status: "已完成",
      cropType: "wheat"
    },
    {
      date: "2023-11-02",
      type: "灌溉",
      description: "冬灌，亩均用水40方",
      status: "已完成",
      cropType: "wheat"
    },
    {
      date: "2024-04-10",
      type: "施肥",
      description: "拔节期追肥，尿素10kg/亩",
      status: "计划中",
      cropType: "wheat"
    },
    {
      date: "2024-05-20",
      type: "插秧",
      description: "水稻插秧，品种：南粳9108",
      status: "已完成",
      cropType: "rice"
    },
    {
      date: "2024-06-15",
      type: "施肥",
      description: "分蘖肥，复合肥15kg/亩",
      status: "进行中",
      cropType: "rice"
    },
    {
      date: "2024-07-10",
      type: "植保",
      description: "防治纹枯病，无人机喷洒",
      status: "计划中",
      cropType: "rice"
    }
  ];

  const filteredActivities = activities.filter(activity => activity.cropType === crop);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">农事跟踪</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 录入农事
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{crop === 'rice' ? '水稻' : '小麦'}农事记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">日期</TableHead>
                <TableHead>农事类型</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{activity.date}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        activity.status === '已完成' ? 'bg-green-100 text-green-800' :
                        activity.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
