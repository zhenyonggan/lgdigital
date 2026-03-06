"use client";

import React, { useState, useEffect } from 'react';
import { useCrop } from '@/contexts/CropContext';
import { supabase } from '@/lib/supabase';
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
import { Loader2, Plus, Warehouse } from 'lucide-react';

interface Location {
  id: string;
  planting_subject: string;
  name: string;
  admin_name: string;
  crop_type: string;
  impurity_grade: number;
  grain_weight: number;
  temperature: number;
  humidity: number;
  remarks: string;
  created_at: string;
}

export default function LocationsPage() {
  const { crop } = useCrop();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    planting_subject: "",
    name: "",
    admin_name: "",
    impurity_grade: "",
    grain_weight: "",
    temperature: "",
    humidity: "",
    remarks: ""
  });

  // 获取数据
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('storage_locations') // Changed table name
        .select('*')
        .eq('crop_type', crop)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [crop]);

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('storage_locations') // Changed table name
        .insert([
          {
            planting_subject: formData.planting_subject,
            name: formData.name,
            admin_name: formData.admin_name,
            crop_type: crop,
            impurity_grade: parseFloat(formData.impurity_grade) || 0,
            grain_weight: parseFloat(formData.grain_weight) || 0,
            temperature: parseFloat(formData.temperature) || 0,
            humidity: parseFloat(formData.humidity) || 0,
            remarks: formData.remarks
          }
        ]);

      if (error) throw error;

      await fetchLocations();
      setIsDialogOpen(false);
      setFormData({
        planting_subject: "",
        name: "",
        admin_name: "",
        impurity_grade: "",
        grain_weight: "",
        temperature: "",
        humidity: "",
        remarks: ""
      });
    } catch (error: any) {
      console.error('Error adding location:', error);
      alert('添加失败：' + (error.message || '请重试'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">地点管理</h1>
          <p className="text-muted-foreground">
            管理原粮存储地点及相关信息 ({crop === 'rice' ? '水稻' : '小麦'})
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加地点
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新存储地点</DialogTitle>
              <DialogDescription>
                请输入存储地点的详细信息，例如仓库编号、管理员和初始库存。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="planting_subject" className="text-right">
                    种植主体
                  </Label>
                  <Input
                    id="planting_subject"
                    value={formData.planting_subject}
                    onChange={(e) => setFormData({ ...formData, planting_subject: e.target.value })}
                    placeholder="例如：XX合作社"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    暂存点名称
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：1号仓库"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="admin_name" className="text-right">
                    管理员
                  </Label>
                  <Input
                    id="admin_name"
                    value={formData.admin_name}
                    onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                    placeholder="管理员姓名"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="impurity" className="text-right">
                    杂质等级
                  </Label>
                  <Input
                    id="impurity"
                    type="number"
                    step="0.1"
                    value={formData.impurity_grade}
                    onChange={(e) => setFormData({ ...formData, impurity_grade: e.target.value })}
                    placeholder="例如：1.5"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temperature" className="text-right">
                    温度 (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="例如：25.5"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="humidity" className="text-right">
                    湿度 (%)
                  </Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    placeholder="例如：13.5"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    重量 (吨)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.grain_weight}
                    onChange={(e) => setFormData({ ...formData, grain_weight: e.target.value })}
                    placeholder="输入重量"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-right">
                    备注
                  </Label>
                  <Input
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="其他备注信息"
                    className="col-span-3"
                  />
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
                    "保存地点"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableCaption>存储地点列表</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>种植主体</TableHead>
              <TableHead>暂存点名称</TableHead>
              <TableHead>管理员</TableHead>
              <TableHead>存储作物</TableHead>
              <TableHead>杂质等级</TableHead>
              <TableHead>温度 (°C)</TableHead>
              <TableHead>湿度 (%)</TableHead>
              <TableHead>重量 (吨)</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>加载地点数据...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.planting_subject}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    {location.name}
                  </TableCell>
                  <TableCell>{location.admin_name}</TableCell>
                  <TableCell>{location.crop_type === 'rice' ? '水稻' : '小麦'}</TableCell>
                  <TableCell>{location.impurity_grade}%</TableCell>
                  <TableCell>{location.temperature}°C</TableCell>
                  <TableCell>{location.humidity}%</TableCell>
                  <TableCell>{location.grain_weight}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{location.remarks || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  暂无存储地点，请点击右上角添加
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
