"use client";

import { useCrop } from "@/contexts/CropContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

interface Dispatch {
  id: string;
  machine: string;
  activity: string;
  date: string;
  status: "Pending" | "In Progress" | "Completed";
}

const dispatchDataRice: Dispatch[] = [
  {
    id: "DSP-001",
    machine: "插秧机 R-1",
    activity: "水稻插秧",
    date: "2023-05-15",
    status: "Completed",
  },
  {
    id: "DSP-002",
    machine: "无人机 D-2",
    activity: "水稻施肥",
    date: "2023-06-10",
    status: "In Progress",
  },
];

const dispatchDataWheat: Dispatch[] = [
  {
    id: "DSP-003",
    machine: "播种机 W-1",
    activity: "小麦播种",
    date: "2023-10-05",
    status: "Completed",
  },
  {
    id: "DSP-004",
    machine: "收割机 H-3",
    activity: "小麦收割",
    date: "2024-06-01",
    status: "Pending",
  },
];

const statusMap: Record<string, string> = {
  Pending: "待处理",
  "In Progress": "进行中",
  Completed: "已完成",
};

const statusColorMap: Record<string, string> = {
  Pending: "text-yellow-600",
  "In Progress": "text-blue-600",
  Completed: "text-green-600",
};

export default function DispatchPage() {
  const { crop } = useCrop();
  const data = crop === "rice" ? dispatchDataRice : dispatchDataWheat;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">派单管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新建派单
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>派单 ID</TableHead>
              <TableHead>农机</TableHead>
              <TableHead>关联作业 ({crop === "rice" ? "水稻" : "小麦"})</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.machine}</TableCell>
                <TableCell>{item.activity}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className={statusColorMap[item.status]}>
                  {statusMap[item.status]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
