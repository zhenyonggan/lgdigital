"use client";

import React, { useEffect, useRef } from 'react';
import { useCrop } from '@/contexts/CropContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    AMap: any;
  }
}

export default function GrowthPage() {
  const { crop } = useCrop();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

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

  useEffect(() => {
    // 设置安全密钥
    (window as any)._AMapSecurityConfig = {
      securityJsCode: 'c209b3b6150f76d6bed88b5a04509d95',
    };
  }, []);

  const initMap = () => {
    if (!mapContainerRef.current || !window.AMap) return;

    // 销毁旧实例
    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
    }

    // 初始化地图
    const map = new window.AMap.Map(mapContainerRef.current, {
      viewMode: '2D', // 默认使用 2D 模式
      zoom: 13,
      center: [116.397428, 39.90923], // 北京天安门
      mapStyle: 'amap://styles/normal', // 设置地图样式
    });

    mapInstanceRef.current = map;

    // 添加一些模拟的标记点（根据作物类型不同显示不同位置）
    const markers = crop === 'rice' 
      ? [
          { position: [116.397428, 39.90923], title: "水稻田块 A" },
          { position: [116.417428, 39.90923], title: "水稻田块 B" }
        ]
      : [
          { position: [116.387428, 39.91923], title: "小麦田块 C" },
          { position: [116.407428, 39.91923], title: "小麦田块 D" }
        ];

    markers.forEach(markerData => {
      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(markerData.position[0], markerData.position[1]),
        title: markerData.title
      });
      map.add(marker);
    });
    
    // 添加比例尺和缩放工具
    window.AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function(){
      map.addControl(new window.AMap.ToolBar());
      map.addControl(new window.AMap.Scale());
    });
  };

  return (
    <div className="space-y-8">
      <Script 
        src="https://webapi.amap.com/maps?v=2.0&key=e515aabb012021557833c3db9d489ffc" 
        onLoad={initMap}
      />
      
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
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-[500px]">
              {/* 地图容器 */}
              <div ref={mapContainerRef} className="w-full h-full bg-gray-100" />
              
              {/* 地图加载状态遮罩（可选，这里用简单的背景色代替） */}
              {!mapInstanceRef.current && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 pointer-events-none">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="animate-bounce" />
                    <span>地图初始化中...</span>
                  </div>
                </div>
              )}
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
