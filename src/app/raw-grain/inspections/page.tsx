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
import { Loader2, Plus, CalendarCheck } from 'lucide-react';

interface Inspection {
  id: string;
  date: string;
  location_id: string;
  inspector_name: string;
  impurity_grade: number;
  grain_weight: number;
  temperature: number;
  humidity: number;
  created_at: string;
  storage_locations?: {
    name: string;
    planting_subject: string;
    crop_type: string;
  };
}

interface Location {
  id: string;
  planting_subject: string;
  name: string;
}

export default function InspectionsPage() {
  const { crop } = useCrop();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location_id: "",
    inspector_name: "",
    impurity_grade: "",
    grain_weight: "",
    temperature: "",
    humidity: ""
  });

  // 获取数据
  const fetchInspections = async () => {
    setLoading(true);
    try {
      // 关联查询：storage_locations
      const { data, error } = await supabase
        .from('grain_inspections')
        .select(`
          *,
          storage_locations!inner (
            name,
            planting_subject,
            crop_type
          )
        `)
        .eq('storage_locations.crop_type', crop)
        .order('date', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取可用地点
  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_locations')
        .select('id, name, planting_subject')
        .eq('crop_type', crop)
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchInspections();
    fetchLocations();
  }, [crop]);

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('grain_inspections')
        .insert([
          {
            date: formData.date,
            location_id: formData.location_id,
            inspector_name: formData.inspector_name,
            impurity_grade: parseFloat(formData.impurity_grade) || 0,
            grain_weight: parseFloat(formData.grain_weight) || 0,
            temperature: parseFloat(formData.temperature) || 0,
            humidity: parseFloat(formData.humidity) || 0
          }
        ]);

      if (error) throw error;

      await fetchInspections();
      setIsDialogOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location_id: "",
        inspector_name: "",
        impurity_grade: "",
        grain_weight: "",
        temperature: "",
        humidity: ""
      });
    } catch (error: any) {
      console.error('Error adding inspection:', error);
      alert('添加失败：' + (error.message || '请重试'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">巡查记录</h1>
          <p className="text-muted-foreground">
            原粮巡查与质量检测记录 ({crop === 'rice' ? '水稻' : '小麦'})
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={fetchLocations}>
              <Plus className="mr-2 h-4 w-4" />
              新增巡查
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新巡查记录</DialogTitle>
              <DialogDescription>
                请填写巡查的详细信息，包括地点、巡查员和质量结果。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    日期
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    地点
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={formData.location_id} 
                      onValueChange={(value) => setFormData({ ...formData, location_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择巡查地点" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.planting_subject ? `${loc.planting_subject} - ${loc.name}` : loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inspector" className="text-right">
                    巡查员
                  </Label>
                  <Input
                    id="inspector"
                    value={formData.inspector_name}
                    onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                    placeholder="姓名"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quality" className="text-right">
                    杂质等级
                  </Label>
                  <Input
                    id="quality"
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
                    重量核查
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.grain_weight}
                    onChange={(e) => setFormData({ ...formData, grain_weight: e.target.value })}
                    placeholder="当前重量 (吨)"
                    className="col-span-3"
                    required
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
                    "保存记录"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableCaption>最近巡查记录</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>地点</TableHead>
              <TableHead>巡查员</TableHead>
              <TableHead>杂质等级</TableHead>
              <TableHead>温度 (°C)</TableHead>
              <TableHead>湿度 (%)</TableHead>
              <TableHead>重量核查 (吨)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span>加载记录...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : inspections.length > 0 ? (
              inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    {inspection.date}
                  </TableCell>
                  <TableCell>
                    {inspection.storage_locations?.planting_subject 
                      ? `${inspection.storage_locations.planting_subject} - ${inspection.storage_locations.name}` 
                      : (inspection.storage_locations?.name || '未知地点')}
                  </TableCell>
                  <TableCell>{inspection.inspector_name}</TableCell>
                  <TableCell>{inspection.impurity_grade}%</TableCell>
                  <TableCell>{inspection.temperature}°C</TableCell>
                  <TableCell>{inspection.humidity}%</TableCell>
                  <TableCell>{inspection.grain_weight}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  暂无巡查记录，请点击新增
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
