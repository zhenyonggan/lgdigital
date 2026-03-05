"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "Idle" | "Working" | "Maintenance";
  location: string;
}

const equipmentData: Equipment[] = [
  {
    id: "EQ-001",
    name: "拖拉机 A",
    type: "Tractor",
    status: "Working",
    location: "Zone A-1",
  },
  {
    id: "EQ-002",
    name: "收割机 B",
    type: "Harvester",
    status: "Idle",
    location: "Depot",
  },
  {
    id: "EQ-003",
    name: "无人机 C",
    type: "Drone",
    status: "Maintenance",
    location: "Repair Shop",
  },
  {
    id: "EQ-004",
    name: "播种机 D",
    type: "Seeder",
    status: "Working",
    location: "Zone B-2",
  },
];

const statusMap: Record<string, string> = {
  Idle: "空闲",
  Working: "工作中",
  Maintenance: "维护中",
};

const statusColorMap: Record<string, string> = {
  Idle: "text-gray-500",
  Working: "text-green-500",
  Maintenance: "text-red-500",
};

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">农机设备管理</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          添加设备
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>位置</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipmentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className={statusColorMap[item.status]}>
                  {statusMap[item.status]}
                </TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
