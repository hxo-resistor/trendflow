/**
 * 智能数据缓存Hook - 减少API请求，提升性能
 */
'use client'

import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number  // 过期时间（毫秒）
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000  // 默认5分钟

  set(key: string, data: any, ttl?: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get(key: string): any {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  invalidate(key: string) {
    this.cache.delete(key)
  }

  invalidateAll() {
    this.cache.clear()
  }

  getSize() {
    return this.cache.size
  }
}

export const cache = new DataCache()

/**
 * 带缓存的fetch Hook
 */
export function useCachedFetch<T>(
  url: string,
  options?: {
    ttl?: number
    enabled?: boolean
    onError?: (error: Error) => void
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    if (!options?.enabled && options?.enabled !== undefined) return

    setLoading(true)
    setError(null)

    try {
      // 检查缓存
      const cached = cache.get(url)
      if (cached) {
        setData(cached as T)
        setLastUpdated(Date.now())
        setLoading(false)
        return
      }

      // 发起请求
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      // 存入缓存
      cache.set(url, result, options?.ttl)
      
      setData(result as T)
      setLastUpdated(Date.now())
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 提供手动刷新和清除缓存的方法
  const refresh = useCallback(() => {
    cache.invalidate(url)
    fetchData()
  }, [url, fetchData])

  const clearCache = useCallback(() => {
    cache.invalidate(url)
    setData(null)
    setLastUpdated(null)
  }, [url])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    clearCache
  }
}
