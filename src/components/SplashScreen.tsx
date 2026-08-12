/**
 * TrendFlow Splash Screen Component
 * 启动画面 - 品牌展示 + 加载动画
 */

'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'initial' | 'loading' | 'ready'>('initial')
  const [show, setShow] = useState(true)

  useEffect(() => {
    // 模拟加载进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // 2秒后进入加载状态
    const timer1 = setTimeout(() => setPhase('loading'), 1000)
    
    // 4秒后完成加载
    const timer2 = setTimeout(() => {
      setPhase('ready')
      setTimeout(() => setShow(false), 500)
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f1a] flex flex-col items-center justify-center">
      {/* Logo动画 */}
      <div className="relative mb-8">
        {/* 外圈光环 */}
        <div className="absolute inset-0 blur-xl opacity-50 animate-pulse">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
        </div>
        
        {/* 旋转光环 */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg className="w-32 h-32" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="100 200"
              strokeLinecap="round"
              className="animate-spin"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* 中心Logo */}
        <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-700 shadow-2xl">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">
            TF
          </span>
        </div>
      </div>

      {/* 品牌名称 */}
      <h1 className="text-2xl font-bold text-white mb-2">
        TrendFlow
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        AI内容自动化平台 · ECHO-2027
      </p>

      {/* 加载进度 */}
      <div className="w-48 space-y-2">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-center text-slate-500 text-xs">
          {phase === 'initial' && '启动中...'}
          {phase === 'loading' && '信号锁定...'}
          {phase === 'ready' && '准备就绪'}
        </p>
      </div>

      {/* 版本信息 */}
      <div className="absolute bottom-8 text-slate-600 text-xs">
        v8.0.0 PWA
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
