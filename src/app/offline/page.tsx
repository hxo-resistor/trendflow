/**
 * 离线页面 - 网络断开时的友好提示
 */
'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 图标动画 */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-2xl opacity-30 animate-pulse">
            <WifiOff className="w-32 h-32 text-red-400 mx-auto" />
          </div>
          <WifiOff className="w-32 h-32 text-red-400 mx-auto relative z-10" />
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-white mb-4">
          网络连接中断
        </h1>
        <p className="text-slate-400 mb-8">
          看起来你正在离线状态，无法访问 TrendFlow 服务。
          <br />
          请检查网络连接后重试。
        </p>

        {/* 功能说明 */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            离线可用功能
          </h2>
          <ul className="text-slate-300 text-sm space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              查看已缓存的页面和数据
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              编辑和准备内容（稍后同步）
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              查看历史记录和统计数据
            </li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            重试连接
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>

        {/* 提示 */}
        <p className="mt-8 text-xs text-slate-500">
          提示: 安装TrendFlow到主屏幕，可享受更好的离线体验
        </p>
      </div>
    </div>
  )
}
