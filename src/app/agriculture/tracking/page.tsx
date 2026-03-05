"use client";

import React, { useState, useEffect } from 'react';
import { useCrop } from '@/contexts/CropContext';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
// 如果没有 Textarea 组件，使用 Input 代替，或者后续添加。这里先假设用 Input 或者多行 Input
// 为了更好的体验，我将使用 Input 作为描述字段

// 定义活动类型
type Activity = {
  id: string;
  crop_id: string;
  date: string;
  activity_type: string;
  description: string | null;
  status: string;
  created_at: string;
};

const ACTIVITY_TYPES = [
  "播种", "灌溉", "施肥", "植保", "除草", "收割", "巡田", "其他"
];

const STATUS_OPTIONS = [
  { value: "pending", label: "计划中" },
  { value: "in_progress", label: "进行中" },
  { value: "completed", label: "已完成" },
];

export default function TrackingPage() {
  const { crop } = useCrop();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activity_type: "",
    description: "",
    status: "pending"
  });

  // 获取数据
  const fetchActivities = async () => {
    setLoading(true);
    try {
      console.log('Fetching activities for crop:', crop);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('crop_id', crop)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error detailed:', error);
        throw error;
      }
      console.log('Fetched data:', data);
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [crop]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('activities')
        .insert([
          {
            crop_id: crop,
            date: formData.date,
            activity_type: formData.activity_type,
            description: formData.description,
            status: formData.status
          }
        ]);

      if (error) throw error;

      // 成功后刷新列表并关闭弹窗
      await fetchActivities();
      setIsDialogOpen(false);
      // 重置表单
      setFormData({
        date: new Date().toISOString().split('T')[0],
        activity_type: "",
        description: "",
        status: "pending"
      });
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('添加失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 状态显示映射
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">已完成</span>;
      case 'in_progress':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">进行中</span>;
      default:
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">计划中</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">农事跟踪</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> 录入农事
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>录入{crop === 'rice' ? '水稻' : '小麦'}农事活动</DialogTitle>
              <DialogDescription>
                请填写农事活动的详细信息。
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
                  <Label htmlFor="type" className="text-right">
                    类型
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={formData.activity_type} 
                      onValueChange={(value) => setFormData({ ...formData, activity_type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择农事类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    描述
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    placeholder="例如：亩均施肥10kg"
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
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                      保存中...
                    </>
                  ) : (
                    '保存记录'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.date}</TableCell>
                    <TableCell>{activity.activity_type}</TableCell>
                    <TableCell>{activity.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(activity.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    暂无农事记录，请点击右上角录入
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
