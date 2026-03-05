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

export default function LocationsPage() {
  const { crop } = useCrop();

  const locations = [
    {
      id: "LOC001",
      name: "1号仓库",
      admin: "张三",
      storedCrop: "rice",
      quality: "一级",
      weight: "1200 吨",
      remarks: "近期维护完成"
    },
    {
      id: "LOC002",
      name: "2号仓库",
      admin: "李四",
      storedCrop: "wheat",
      quality: "二级",
      weight: "800 吨",
      remarks: "需注意通风"
    },
    {
      id: "LOC003",
      name: "3号露天堆场",
      admin: "王五",
      storedCrop: "rice",
      quality: "一级",
      weight: "2000 吨",
      remarks: "临时存放"
    },
  ];

  // Filter locations based on current crop
  const filteredLocations = locations.filter(loc => loc.storedCrop === crop);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">地点管理</h1>
          <p className="text-muted-foreground">
            管理原粮存储地点及相关信息 ({crop === 'rice' ? '水稻' : '小麦'})
          </p>
        </div>
        <Button>添加地点</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>存储地点列表</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>地点名称</TableHead>
              <TableHead>管理员</TableHead>
              <TableHead>存储作物</TableHead>
              <TableHead>质量等级</TableHead>
              <TableHead>重量</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.admin}</TableCell>
                <TableCell>{location.storedCrop === 'rice' ? '水稻' : '小麦'}</TableCell>
                <TableCell>{location.quality}</TableCell>
                <TableCell>{location.weight}</TableCell>
                <TableCell>{location.remarks}</TableCell>
              </TableRow>
            ))}
            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
