import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import ComplianceBanner from "@/components/ComplianceBanner"
import MobileTabBar from "@/components/MobileTabBar"
import SplashScreen from "@/components/SplashScreen"
import PWAInstallGuide from "@/components/PWAInstallGuide"
import ErrorBoundary from "@/components/ErrorBoundary"
import { NetworkStatusIndicator } from "@/hooks/useNetwork"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrendFlow 指挥官",
  description: "AI内容自动化平台 - ECHO-2027",
  manifest: "/manifest.json",
  themeColor: "#0f0f1a",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrendFlow",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#0f0f1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TrendFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {/* Splash Screen */}
          <SplashScreen />
          
          {/* Network Status Indicator */}
          <NetworkStatusIndicator />
          
          <div className="flex h-screen overflow-hidden bg-[#0f0f1a]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
              {children}
              <ComplianceBanner />
            </main>
            {/* Mobile Tab Bar */}
            <MobileTabBar />
          </div>
          
          {/* PWA Install Guide */}
          <PWAInstallGuide />
          
          {/* Service Worker & Push Registration Script */}
          <script src="/pwa-init.js" />
        </ErrorBoundary>
      </body>
    </html>
  )
}
