'use client';

import { Sprout, Wheat, User, LogOut } from 'lucide-react';
import { useCrop } from '@/contexts/CropContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

export function Header() {
  const { crop, setCrop } = useCrop();
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-primary">
          {crop === 'rice' ? '水稻' : '小麦'}种植数字化管理
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-muted-foreground">当前作物：</span>
        <Select value={crop} onValueChange={(value) => setCrop(value as 'rice' | 'wheat')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择作物" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rice">
              <div className="flex items-center">
                <Sprout className="mr-2 h-4 w-4" />
                水稻
              </div>
            </SelectItem>
            <SelectItem value="wheat">
              <div className="flex items-center">
                <Wheat className="mr-2 h-4 w-4" />
                小麦
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-border mx-2" />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>我的账号</span>
                  <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">个人中心</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">登录</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
