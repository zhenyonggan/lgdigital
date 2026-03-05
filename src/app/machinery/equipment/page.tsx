"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Loader2, Truck, Wrench, CircleDot } from "lucide-react";
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

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string | null;
  created_at: string;
}

const EQUIPMENT_TYPES = [
  { value: "Tractor", label: "拖拉机" },
  { value: "Harvester", label: "收割机" },
  { value: "Drone", label: "无人机" },
  { value: "Seeder", label: "播种机" },
  { value: "Sprayer", label: "打药机" },
  { value: "Other", label: "其他" },
];

const STATUS_OPTIONS = [
  { value: "idle", label: "空闲", color: "bg-gray-100 text-gray-800", icon: CircleDot },
  { value: "working", label: "工作中", color: "bg-green-100 text-green-800", icon: Truck },
  { value: "maintenance", label: "维护中", color: "bg-red-100 text-red-800", icon: Wrench },
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "idle",
    location: "",
  });

  // 获取数据
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("farm_machinery") // Changed table name
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("farm_machinery").insert([
        {
          name: formData.name,
          type: formData.type,
          status: formData.status,
          location: formData.location,
        },
      ]);

      if (error) throw error;

      await fetchEquipment();
      setIsDialogOpen(false);
      setFormData({
        name: "",
        type: "",
        status: "idle",
        location: "",
      });
    } catch (error) {
      console.error("Error adding equipment:", error);
      alert("添加失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
    const Icon = option.icon;
    return (
      <Badge variant="secondary" className={`${option.color} flex w-fit items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {option.label}
      </Badge>
    );
  };

  const getTypeName = (type: string) => {
    return EQUIPMENT_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">农机设备管理</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              添加设备
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新农机设备</DialogTitle>
              <DialogDescription>
                请输入设备的详细信息。点击保存以添加到系统。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    设备名称
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：东方红拖拉机-01"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    设备类型
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    当前位置
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="例如：一号库房"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    状态
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
                      提交中...
                    </>
                  ) : (
                    "保存设备"
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
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>当前位置</TableHead>
              <TableHead className="text-right">入库时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>加载设备数据...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : equipment.length > 0 ? (
              equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold">{item.name}</TableCell>
                  <TableCell>{getTypeName(item.type)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.location || "未知"}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  暂无设备，请点击右上角添加
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
