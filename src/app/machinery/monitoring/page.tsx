"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Fuel, Thermometer } from "lucide-react";

interface MachineStats {
  id: string;
  name: string;
  speed: number;
  fuel: number;
  temp: number;
  status: "Active" | "Idle";
}

const machines: MachineStats[] = [
  {
    id: "M-001",
    name: "拖拉机 A",
    speed: 15,
    fuel: 78,
    temp: 85,
    status: "Active",
  },
  {
    id: "M-002",
    name: "收割机 B",
    speed: 0,
    fuel: 45,
    temp: 40,
    status: "Idle",
  },
  {
    id: "M-003",
    name: "无人机 C",
    speed: 35,
    fuel: 92,
    temp: 55,
    status: "Active",
  },
];

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">农机监测</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Machine List */}
        <div className="lg:col-span-1 space-y-4">
          {machines.map((machine) => (
            <Card key={machine.id} className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {machine.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({machine.id})
                  </span>
                </CardTitle>
                <Badge variant={machine.status === "Active" ? "default" : "secondary"}>
                  {machine.status === "Active" ? "工作中" : "空闲"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                    <Gauge className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span className="text-xs font-bold">{machine.speed} km/h</span>
                    <span className="text-[10px] text-muted-foreground">速度</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                    <Fuel className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span className="text-xs font-bold">{machine.fuel}%</span>
                    <span className="text-[10px] text-muted-foreground">油量</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-md">
                    <Thermometer className="h-4 w-4 mb-1 text-muted-foreground" />
                    <span className="text-xs font-bold">{machine.temp}°C</span>
                    <span className="text-[10px] text-muted-foreground">引擎温度</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>实时位置监控</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              <div className="absolute inset-0 m-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-400">Map Placeholder</div>
                  <p className="text-gray-400 mt-2">实时位置显示区域</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
