/**
 * 加载状态组件 - 统一的loading状态
 */
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
  fullScreen?: boolean
}

export default function Loading({ text = '加载中...', fullScreen = false }: LoadingProps) {
  const className = fullScreen 
    ? 'min-h-screen bg-[#0f0f1a] flex items-center justify-center' 
    : 'flex items-center justify-center p-8'
  
  return (
    <div className={className}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">{text}</p>
      </div>
    </div>
  )
}

/**
 * 骨架屏组件 - 加载占位符
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-slate-700/50 rounded ${className}`}
      style={{ minHeight: '1em' }}
    />
  )
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}

/**
 * 网格骨架屏
 */
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
