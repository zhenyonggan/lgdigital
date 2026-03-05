"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading, session } = useAuth();
  const pathname = usePathname();
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsTimedOut(true), 2000); // 2秒超时
    return () => clearTimeout(timer);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (loading && !isTimedOut) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 如果是登录/注册页面，全屏显示
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 如果未登录且不是 Auth 页面，应该由 Middleware 处理重定向，
  // 但为了防止闪烁，这里也可以做一个简单的检查
  if (!session && !isTimedOut) {
    return null; 
  }

  // 已登录或超时后兜底显示完整布局
  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </>
  );
}
