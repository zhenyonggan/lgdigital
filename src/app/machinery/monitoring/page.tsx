"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Fuel, Thermometer, MapPin, Loader2 } from "lucide-react";
import Script from "next/script";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    AMap: any;
  }
}

interface MachineStats {
  id: string;
  name: string;
  type: string;
  status: string;
  speed: number;
  fuel: number;
  temp: number;
  location: [number, number]; // [lng, lat]
}

// 模拟路径数据（北京天安门附近的一个矩形路径）
const MOCK_PATH = [
  [116.397428, 39.90923],
  [116.407428, 39.90923],
  [116.407428, 39.91923],
  [116.397428, 39.91923],
  [116.397428, 39.90923],
];

export default function MonitoringPage() {
  const [machines, setMachines] = useState<MachineStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const polylinesRef = useRef<Map<string, any>>(new Map());
  const pathsRef = useRef<Map<string, [number, number][]>>(new Map());
  const pathIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取农机数据
  const fetchMachines = async () => {
    try {
      const { data, error } = await supabase
        .from("farm_machinery")
        .select("id, name, type, status");

      if (error) throw error;

      const stats = (data || []).map((m: any, index: number) => {
        const initialLocation: [number, number] = [
          116.397428 + (Math.random() - 0.5) * 0.05,
          39.90923 + (Math.random() - 0.5) * 0.05
        ];
        
        // 初始化轨迹路径
        if (m.status === 'working') {
          pathsRef.current.set(m.id, [initialLocation]);
        }

        return {
          ...m,
          speed: m.status === 'working' ? Math.floor(Math.random() * 20) + 10 : 0,
          fuel: Math.floor(Math.random() * 40) + 60,
          temp: Math.floor(Math.random() * 30) + 60,
          location: initialLocation
        };
      });

      setMachines(stats);
      if (stats.length > 0 && !selectedMachineId) {
        setSelectedMachineId(stats[0].id);
      }
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
    // 设置高德地图安全密钥
    (window as any)._AMapSecurityConfig = {
      securityJsCode: 'c209b3b6150f76d6bed88b5a04509d95',
    };

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 模拟运动逻辑
  useEffect(() => {
    if (!mapInstanceRef.current || machines.length === 0) return;

    timerRef.current = setInterval(() => {
      setMachines(prevMachines => {
        return prevMachines.map(m => {
          // 只模拟状态为 working 的农机移动
          if (m.status === 'working') {
            // 简单的随机游走模拟
            const lng = m.location[0] + (Math.random() - 0.5) * 0.001;
            const lat = m.location[1] + (Math.random() - 0.5) * 0.001;
            
            // 更新地图标记位置
            const marker = markersRef.current.get(m.id);
            if (marker) {
              marker.setPosition([lng, lat]);
              
              // 更新轨迹
              const currentPath = pathsRef.current.get(m.id) || [];
              const newPath: [number, number][] = [...currentPath, [lng, lat]];
              // 限制轨迹长度，避免内存溢出
              if (newPath.length > 50) newPath.shift();
              pathsRef.current.set(m.id, newPath);

              // 绘制/更新折线
              let polyline = polylinesRef.current.get(m.id);
              if (!polyline) {
                polyline = new window.AMap.Polyline({
                  path: newPath,
                  strokeColor: "#3b82f6", // blue-500
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                  strokeStyle: "solid",
                  zIndex: 50,
                });
                mapInstanceRef.current.add(polyline);
                polylinesRef.current.set(m.id, polyline);
              } else {
                polyline.setPath(newPath);
              }

              // 如果是选中的农机，移动地图中心
              if (m.id === selectedMachineId) {
                mapInstanceRef.current.setCenter([lng, lat]);
              }
            }

            return {
              ...m,
              location: [lng, lat],
              speed: Math.max(0, Math.min(40, m.speed + (Math.random() - 0.5) * 5)),
              fuel: Math.max(0, m.fuel - 0.01),
            };
          }
          return m;
        });
      });
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedMachineId]); // 依赖 selectedMachineId 以便更新地图中心逻辑

  const initMap = () => {
    if (!mapContainerRef.current || !window.AMap) return;

    if (mapInstanceRef.current) mapInstanceRef.current.destroy();

    const map = new window.AMap.Map(mapContainerRef.current, {
      viewMode: '2D',
      zoom: 14,
      center: [116.397428, 39.90923],
      mapStyle: 'amap://styles/normal',
    });

    mapInstanceRef.current = map;

    // 添加控件
    window.AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function(){
      map.addControl(new window.AMap.ToolBar());
      map.addControl(new window.AMap.Scale());
    });

    // 初始化标记点
    machines.forEach(machine => {
      const markerContent = `
        <div class="custom-marker">
          <div class="marker-icon ${machine.status === 'working' ? 'bg-green-500' : 'bg-gray-400'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div class="marker-label">${machine.name}</div>
        </div>
      `;

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(machine.location[0], machine.location[1]),
        content: markerContent,
        offset: new window.AMap.Pixel(-15, -15),
        zIndex: machine.id === selectedMachineId ? 100 : 1
      });

      marker.on('click', () => setSelectedMachineId(machine.id));
      map.add(marker);
      markersRef.current.set(machine.id, marker);
    });
  };

  // 当机器列表加载完成后初始化地图
  useEffect(() => {
    if (machines.length > 0 && window.AMap && !mapInstanceRef.current) {
      initMap();
    }
  }, [machines]);

  // 当选中机器变化时，更新地图视图
  useEffect(() => {
    if (selectedMachineId && mapInstanceRef.current && machines.length > 0) {
      const machine = machines.find(m => m.id === selectedMachineId);
      if (machine) {
        mapInstanceRef.current.setZoomAndCenter(15, machine.location);
        
        // 高亮选中的轨迹
        polylinesRef.current.forEach((polyline, id) => {
          if (id === selectedMachineId) {
            polyline.setOptions({ strokeColor: "#3b82f6", zIndex: 100 });
          } else {
            polyline.setOptions({ strokeColor: "#9ca3af", zIndex: 10 });
          }
        });
      }
    }
  }, [selectedMachineId, machines]);

  return (
    <div className="space-y-6">
      <Script 
        src="https://webapi.amap.com/maps?v=2.0&key=e515aabb012021557833c3db9d489ffc" 
        onLoad={() => {
          if (machines.length > 0) initMap();
        }}
      />

      <style jsx global>{`
        .custom-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .marker-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .marker-label {
          background-color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
          white-space: nowrap;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">农机监测</h1>
        <Badge variant="outline" className="text-sm">
          系统状态: 实时监控中
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Column: Machine List */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : machines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无农机数据，请先在设备管理中添加
            </div>
          ) : (
            machines.map((machine) => (
              <Card 
                key={machine.id} 
                className={`cursor-pointer transition-all ${
                  selectedMachineId === machine.id 
                    ? 'border-primary ring-1 ring-primary shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedMachineId(machine.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {machine.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({machine.type})
                    </span>
                  </CardTitle>
                  <Badge variant={machine.status === "working" ? "default" : "secondary"}>
                    {machine.status === "working" ? "工作中" : 
                     machine.status === "maintenance" ? "维护中" : "空闲"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                      <Gauge className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="text-xs font-bold">{machine.speed.toFixed(1)} km/h</span>
                      <span className="text-[10px] text-muted-foreground">速度</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                      <Fuel className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="text-xs font-bold">{machine.fuel.toFixed(1)}%</span>
                      <span className="text-[10px] text-muted-foreground">油量</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                      <Thermometer className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span className="text-xs font-bold">{machine.temp}°C</span>
                      <span className="text-[10px] text-muted-foreground">温度</span>
                    </div>
                  </div>
                  {machine.status === 'working' && (
                    <div className="mt-3 text-xs text-blue-600 flex items-center animate-pulse">
                      <MapPin className="h-3 w-3 mr-1" />
                      正在移动中...
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-full">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>实时位置监控</span>
                {selectedMachineId && (
                  <span className="text-sm font-normal text-muted-foreground">
                    当前追踪: {machines.find(m => m.id === selectedMachineId)?.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[400px]">
              <div ref={mapContainerRef} className="w-full h-full bg-gray-100" />
              
              {!mapInstanceRef.current && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 pointer-events-none z-10">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 className="animate-spin" />
                    <span>地图初始化中...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
