/**
 * TrendFlow PWA Install Guide
 * 安装引导组件 - 检测到未安装时显示
 */

'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstallGuide() {
  const [showGuide, setShowGuide] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // 检查是否已作为PWA安装
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true ||
             (window as any).__pwaInstalled
    }
    
    setIsStandalone(checkStandalone())
    
    // 延迟3秒后显示引导
    if (!checkStandalone()) {
      const timer = setTimeout(() => setShowGuide(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleInstall = () => {
    // 简单的安装提示
    alert('请在浏览器菜单中选择"添加到主屏幕"或"安装应用"')
    setShowGuide(false)
  }

  const handleClose = () => {
    setShowGuide(false)
  }

  if (isStandalone || !showGuide) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 animate-slide-up">
      <div className="max-w-md mx-auto bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">添加到桌面</h3>
              <p className="text-slate-400 text-xs">随时查看，像原生APP一样流畅</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            立即安装
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors text-sm"
          >
            暂不
          </button>
        </div>
      </div>
    </div>
  )
}
