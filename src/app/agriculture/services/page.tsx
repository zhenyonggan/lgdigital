"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, FlaskConical, UserCheck, Calendar } from 'lucide-react';

export default function ServicesPage() {
  const { crop } = useCrop();

  const services = [
    {
      title: "无人机植保",
      description: "精准施药，高效作业，覆盖面积大。",
      icon: Plane,
      price: "¥15/亩",
      tags: ["病虫害防治", "叶面肥喷施"]
    },
    {
      title: "土壤检测",
      description: "专业土壤取样与实验室分析，提供施肥建议。",
      icon: FlaskConical,
      price: "¥200/次",
      tags: ["氮磷钾分析", "有机质检测"]
    },
    {
      title: "专家咨询",
      description: "农业专家在线诊断，提供种植技术指导。",
      icon: UserCheck,
      price: "免费",
      tags: ["远程诊断", "现场指导"]
    },
    {
      title: "农机预约",
      description: "耕、种、管、收全环节农机作业服务预约。",
      icon: Calendar,
      price: "按需报价",
      tags: ["收割机", "插秧机", "拖拉机"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">农事服务</h2>
        <p className="text-muted-foreground">
          为您的<span className="font-bold text-primary">{crop === 'rice' ? '水稻' : '小麦'}</span>种植提供全方位专业服务支持
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-lg font-bold text-primary">
                {service.price}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">预约服务</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
