/**
 * 智能预加载Hook - 提前加载即将需要的数据
 */
'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// 预加载映射：哪些路由需要预加载哪些API数据
const PREFETCH_MAP: Record<string, string[]> = {
  '/daily-tasks': ['/api/radar/hot-words?limit=3'],
  '/radar': ['/api/radar/hot-words?limit=20'],
  '/dashboard': ['/api/data/stats'],
  '/matrix': ['/api/matrix'],
  '/affiliate': ['/api/affiliate/products']
}

export function useSmartPrefetch() {
  const pathname = usePathname()
  const prefetching = useRef<Set<string>>(new Set())

  useEffect(() => {
    const endpoints = PREFETCH_MAP[pathname] || []
    
    endpoints.forEach(endpoint => {
      // 避免重复预加载
      if (prefetching.current.has(endpoint)) return
      
      prefetching.current.add(endpoint)
      
      // 使用低优先级预加载
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      
      fetch(endpoint, {
        signal: controller.signal,
        priority: 'low'
      })
        .then(res => res.json())
        .catch(() => {})
        .finally(() => {
          clearTimeout(timeout)
          prefetching.current.delete(endpoint)
        })
    })
  }, [pathname])
}

/**
 * 路由变化时预加载相关数据
 */
export function useRoutePrefetch() {
  const router = useRouter()
  const pathname = usePathname()
  const lastPath = useRef(pathname)

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const endpoints = PREFETCH_MAP[url] || []
      endpoints.forEach(endpoint => {
        fetch(endpoint).catch(() => {})
      })
    }

    // 监听路由变化
    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    history.pushState = (...args) => {
      const url = args[2]?.toString() || window.location.pathname
      handleRouteChange(url)
      return originalPushState(...args)
    }

    history.replaceState = (...args) => {
      const url = args[2]?.toString() || window.location.pathname
      handleRouteChange(url)
      return originalReplaceState(...args)
    }

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])
}
