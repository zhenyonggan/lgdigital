'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Tractor, Warehouse, LayoutDashboard, ChevronDown, ChevronRight, BarChart3, Activity, Map, Wrench, Truck, MapPin, ClipboardList, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type NavItem = {
  name: string;
  href: string;
  icon?: any;
  children?: NavItem[];
};

const navigation: NavItem[] = [
  {
    name: '农事管理',
    href: '/agriculture',
    icon: Sprout,
    children: [
      { name: '数据概览', href: '/agriculture/dashboard', icon: BarChart3 },
      { name: '农事跟踪', href: '/agriculture/tracking', icon: Activity },
      { name: '长势监测', href: '/agriculture/growth', icon: Map },
      { name: '农事服务', href: '/agriculture/services', icon: Wrench },
    ],
  },
  {
    name: '农机调度',
    href: '/machinery',
    icon: Tractor,
    children: [
      { name: '数据概览', href: '/machinery/dashboard', icon: BarChart3 },
      { name: '设备管理', href: '/machinery/equipment', icon: Truck },
      { name: '派单管理', href: '/machinery/dispatch', icon: ClipboardList },
      { name: '农机监测', href: '/machinery/monitoring', icon: MapPin },
    ],
  },
  {
    name: '原粮监控',
    href: '/raw-grain',
    icon: Warehouse,
    children: [
      { name: '数据概览', href: '/raw-grain/dashboard', icon: BarChart3 },
      { name: '地点管理', href: '/raw-grain/locations', icon: Building2 },
      { name: '巡查记录', href: '/raw-grain/inspections', icon: ClipboardList },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  // 默认展开所有菜单，或者根据当前路径展开
  const [openMenus, setOpenMenus] = useState<string[]>(['农事管理', '农机调度', '原粮监控']);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <LayoutDashboard className="mr-2 h-6 w-6 text-sidebar-primary" />
        <span className="text-lg font-bold">粮谷平台</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isOpen = openMenus.includes(item.name);

          return (
            <div key={item.name} className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-between font-semibold hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && !isOpen && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
                onClick={() => toggleMenu(item.name)}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronRight className="h-4 w-4 opacity-50" />
                )}
              </Button>
              
              {isOpen && item.children && (
                <div className="ml-4 space-y-1 border-l border-sidebar-border pl-2">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          isChildActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground/70'
                        )}
                      >
                        {child.icon && <child.icon className="mr-3 h-4 w-4" />}
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
