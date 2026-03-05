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
  name: string;
  admin_name: string;
  crop_type: string;
  grain_quality: string;
  grain_weight: number;
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
    name: "",
    admin_name: "",
    grain_quality: "一级",
    grain_weight: "",
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
            name: formData.name,
            admin_name: formData.admin_name,
            crop_type: crop,
            grain_quality: formData.grain_quality,
            grain_weight: parseFloat(formData.grain_weight) || 0,
            remarks: formData.remarks
          }
        ]);

      if (error) throw error;

      await fetchLocations();
      setIsDialogOpen(false);
      setFormData({
        name: "",
        admin_name: "",
        grain_quality: "一级",
        grain_weight: "",
        remarks: ""
      });
    } catch (error) {
      console.error('Error adding location:', error);
      alert('添加失败，请重试');
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
                  <Label htmlFor="name" className="text-right">
                    地点名称
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
                  <Label htmlFor="quality" className="text-right">
                    质量等级
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={formData.grain_quality} 
                      onValueChange={(value) => setFormData({ ...formData, grain_quality: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择等级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="一级">一级</SelectItem>
                        <SelectItem value="二级">二级</SelectItem>
                        <SelectItem value="三级">三级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
              <TableHead>地点名称</TableHead>
              <TableHead>管理员</TableHead>
              <TableHead>存储作物</TableHead>
              <TableHead>质量等级</TableHead>
              <TableHead>重量 (吨)</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>加载地点数据...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    {location.name}
                  </TableCell>
                  <TableCell>{location.admin_name}</TableCell>
                  <TableCell>{location.crop_type === 'rice' ? '水稻' : '小麦'}</TableCell>
                  <TableCell>{location.grain_quality}</TableCell>
                  <TableCell>{location.grain_weight}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{location.remarks || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
