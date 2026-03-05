"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function InspectionsPage() {
  const { crop } = useCrop();

  const inspections = [
    {
      id: "INS001",
      date: "2024-03-01",
      location: "1号仓库",
      inspector: "张三",
      crop: "rice",
      quality: "合格",
      weightCheck: "一致"
    },
    {
      id: "INS002",
      date: "2024-03-02",
      location: "2号仓库",
      inspector: "李四",
      crop: "wheat",
      quality: "需整改",
      weightCheck: "偏差 < 1%"
    },
    {
      id: "INS003",
      date: "2024-03-03",
      location: "3号露天堆场",
      inspector: "王五",
      crop: "rice",
      quality: "合格",
      weightCheck: "一致"
    },
  ];

  // Filter inspections based on current crop
  const filteredInspections = inspections.filter(ins => ins.crop === crop);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">巡查记录</h1>
          <p className="text-muted-foreground">
            原粮巡查与质量检测记录 ({crop === 'rice' ? '水稻' : '小麦'})
          </p>
        </div>
        <Button>新增巡查</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>最近巡查记录</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>地点</TableHead>
              <TableHead>巡查员</TableHead>
              <TableHead>质量结果</TableHead>
              <TableHead>重量核查</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell className="font-medium">{inspection.date}</TableCell>
                <TableCell>{inspection.location}</TableCell>
                <TableCell>{inspection.inspector}</TableCell>
                <TableCell>{inspection.quality}</TableCell>
                <TableCell>{inspection.weightCheck}</TableCell>
              </TableRow>
            ))}
            {filteredInspections.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
