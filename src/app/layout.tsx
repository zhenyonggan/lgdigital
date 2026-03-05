import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CropProvider } from "@/contexts/CropContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthWrapper } from "@/components/AuthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "粮谷数字化平台",
  description: "大型企业水稻小麦种植数字化管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex overflow-hidden`}
      >
        <AuthProvider>
          <CropProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </CropProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
