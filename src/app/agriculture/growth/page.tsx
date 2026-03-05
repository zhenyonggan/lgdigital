"use client";

import React from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

export default function GrowthPage() {
  const { crop } = useCrop();

  const weatherData = {
    temp: "24°C",
    humidity: "65%",
    wind: "3级 东南风",
    rain: "0mm"
  };

  const soilData = {
    moisture: "22%",
    ph: "6.5",
    temp: "18°C",
    nitrogen: "中等"
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">长势监测</h2>
        <p className="text-muted-foreground">
          当前监测作物: <span className="font-bold text-primary">{crop === 'rice' ? '水稻' : '小麦'}</span>
        </p>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4">农业资源</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudRain className="mr-2 h-5 w-5 text-blue-500" />
                气象数据
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <Thermometer className="h-6 w-6 mb-1 text-red-400" />
                  <span className="text-sm text-muted-foreground">温度</span>
                  <span className="font-bold">{weatherData.temp}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <Droplets className="h-6 w-6 mb-1 text-blue-400" />
                  <span className="text-sm text-muted-foreground">湿度</span>
                  <span className="font-bold">{weatherData.humidity}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <Wind className="h-6 w-6 mb-1 text-gray-400" />
                  <span className="text-sm text-muted-foreground">风力</span>
                  <span className="font-bold">{weatherData.wind}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <CloudRain className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-sm text-muted-foreground">降雨量</span>
                  <span className="font-bold">{weatherData.rain}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SproutIcon className="mr-2 h-5 w-5 text-green-500" />
                土壤墒情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">土壤湿度</span>
                  <span className="font-bold text-lg">{soilData.moisture}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">pH值</span>
                  <span className="font-bold text-lg">{soilData.ph}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">土温</span>
                  <span className="font-bold text-lg">{soilData.temp}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">氮含量</span>
                  <span className="font-bold text-lg">{soilData.nitrogen}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">空天地一体化监测</h3>
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-xl">
            <div className="bg-gray-200 h-96 w-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <GlobeIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>地图加载中...</p>
                <p className="text-sm mt-1">集成卫星遥感与无人机影像</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function SproutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.4-1.2-.6-2.1-1.9-2-3.3a2.94 2.94 0 0 1 2.5-2.8c1.2-.3 2.1-.9 2.4-2.1.3-1.4 1.2-2.5 2.5-2.5h0c1.4 0 2.5 1.1 2.5 2.5 0 1.6-1.5 3-3 4-.7.5-1.5.9-2.4.9Z" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
