"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Loader2, Calendar, ClipboardCheck, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Dispatch {
  id: string;
  machinery_id: string;
  activity_id: string | null;
  date: string;
  status: string;
  location?: string;
  created_at: string;
  farm_machinery?: {
    name: string;
    type: string;
  };
  activities?: {
    activity_type: string;
    description: string;
  };
}

interface Machine {
  id: string;
  name: string;
  status: string;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  date: string;
}

const STATUS_OPTIONS = [
  { value: "scheduled", label: "待处理", color: "bg-yellow-100 text-yellow-800" },
  { value: "in_progress", label: "进行中", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "已完成", color: "bg-green-100 text-green-800" },
];

export default function DispatchPage() {
  const { crop } = useCrop();
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 关联数据
  const [machines, setMachines] = useState<Machine[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);

  // 表单状态
  const [formData, setFormData] = useState({
    machinery_id: "",
    activity_id: "none", // 'none' or uuid
    date: new Date().toISOString().split('T')[0],
    status: "scheduled",
    location: "",
  });

  // 获取派单列表
  const fetchDispatches = async () => {
    setLoading(true);
    try {
      // 关联查询：farm_machinery 和 activities
      const { data, error } = await supabase
        .from("dispatches")
        .select(`
          *,
          farm_machinery (name, type),
          activities (activity_type, description)
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      setDispatches(data || []);
    } catch (error) {
      console.error("Error fetching dispatches:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取可用的农机和活动
  const fetchOptions = async () => {
    try {
      // 1. 获取农机 (farm_machinery)
      const { data: machinesData } = await supabase
        .from("farm_machinery")
        .select("id, name, status")
        .order("name");
      setMachines(machinesData || []);

      // 2. 获取当前作物未完成的农事活动 (activities)
      // 这里简化逻辑，获取最近的活动供选择
      const { data: activitiesData } = await supabase
        .from("activities")
        .select("id, activity_type, description, date")
        .eq("crop_id", crop)
        .order("date", { ascending: false })
        .limit(20);
      setAvailableActivities(activitiesData || []);

    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchDispatches();
    fetchOptions();
  }, [crop]);

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        machinery_id: formData.machinery_id,
        date: formData.date,
        status: formData.status,
        location: formData.location, // 新增字段
      };

      // 只有选择了具体活动才添加关联
      if (formData.activity_id && formData.activity_id !== "none") {
        payload.activity_id = formData.activity_id;
      }

      const { error } = await supabase.from("dispatches").insert([payload]);

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      await fetchDispatches();
      setIsDialogOpen(false);
      // 重置表单
      setFormData({
        machinery_id: "",
        activity_id: "none",
        date: new Date().toISOString().split('T')[0],
        status: "scheduled",
        location: "",
      });
    } catch (error) {
      console.error("Error adding dispatch:", error);
      alert("添加失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
    return (
      <Badge variant="secondary" className={option.color}>
        {option.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">派单管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={fetchOptions}>
              <Plus className="mr-2 h-4 w-4" />
              新建派单
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>创建新的农机派单</DialogTitle>
              <DialogDescription>
                请填写派单详情，关联农机与作业任务。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* 选择农机 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="machine" className="text-right">
                    选择农机
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.machinery_id}
                      onValueChange={(value) => setFormData({ ...formData, machinery_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择执行农机" />
                      </SelectTrigger>
                      <SelectContent>
                        {machines.map((machine) => (
                          <SelectItem key={machine.id} value={machine.id}>
                            {machine.name} ({machine.status === 'working' ? '工作中' : '空闲'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 关联订单/活动 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activity" className="text-right">
                    关联作业
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.activity_id}
                      onValueChange={(value) => setFormData({ ...formData, activity_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择关联的农事活动（可选）" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不关联（直接派单）</SelectItem>
                        {availableActivities.map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            [{activity.date}] {activity.activity_type} - {activity.description || '无描述'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 作业地块/位置 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    作业地块
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="例如：东村2号地块"
                    className="col-span-3"
                  />
                </div>

                {/* 时间 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    作业时间
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* 状态 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    派单状态
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    "确认派单"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>执行农机</TableHead>
              <TableHead>关联作业任务</TableHead>
              <TableHead>作业地块</TableHead>
              <TableHead>时间</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>加载派单数据...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : dispatches.length > 0 ? (
              dispatches.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    {item.farm_machinery?.name || "未知农机"}
                  </TableCell>
                  <TableCell>
                    {item.activities ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{item.activities.activity_type}</span>
                        <span className="text-xs text-muted-foreground">{item.activities.description}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">直接派单</span>
                    )}
                  </TableCell>
                  <TableCell>{item.location || '-'}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  暂无派单记录，请点击新建
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
