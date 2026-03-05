"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">个人中心</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle>用户信息</CardTitle>
              <CardDescription>管理您的个人资料</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">邮箱地址</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">注册时间</p>
                <p className="text-sm text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
