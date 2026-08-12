/**
 * 404错误页面
 */
'use client'

import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 图标 */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-6xl font-bold text-white mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">
          页面不存在
        </h2>
        <p className="text-slate-400 mb-8">
          抱歉，您访问的页面可能已被移除、名称更改或暂时不可用。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上一页
          </button>
        </div>

        {/* 常见链接 */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm mb-4">您可能想访问：</p>
          <div className="flex flex-wrap justify-center gap-2">
            <a href="/daily-tasks" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              今日任务
            </a>
            <a href="/radar" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              趋势雷达
            </a>
            <a href="/dashboard" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              数据看板
            </a>
            <a href="/health" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
              健康检查
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
