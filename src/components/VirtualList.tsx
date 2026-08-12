/**
 * 虚拟列表组件 - 优化长列表性能
 * 只渲染可见区域的元素
 */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface VirtualListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number | ((index: number) => number)
  overscan?: number
  containerHeight?: number
  className?: string
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
  containerHeight = 600,
  className = ''
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(containerHeight)

  const totalHeight = items.length * (typeof itemHeight === 'function' 
    ? itemHeight(0) 
    : itemHeight)

  // 计算可视范围
  const startIndex = Math.max(0, Math.floor(scrollTop / (typeof itemHeight === 'function' ? itemHeight(0) : itemHeight)) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + viewportHeight) / (typeof itemHeight === 'function' ? itemHeight(0) : itemHeight)) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportHeight(entry.contentRect.height)
      }
    })
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: `${containerHeight}px`, overflowY: 'auto' }}
      className={className}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems.map((item, i) => {
          const index = startIndex + i
          const height = typeof itemHeight === 'function' ? itemHeight(index) : itemHeight
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${height}px`,
                transform: `translateY(${index * (typeof itemHeight === 'function' ? itemHeight(0) : itemHeight)}px)`
              }}
            >
              {renderItem(item, index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 无限滚动列表 - 自动加载更多
 */
interface InfiniteScrollProps {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  onLoadMore: () => Promise<void>
  hasMore: boolean
  loader?: React.ReactNode
  className?: string
}

export function InfiniteScroll({
  items,
  renderItem,
  onLoadMore,
  hasMore,
  loader,
  className = ''
}: InfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    }, {
      rootMargin: '100px'
    })

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, onLoadMore])

  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}
      <div ref={loadMoreRef} className="py-4 text-center">
        {hasMore ? (
          loader || (
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          )
        ) : (
          <span className="text-slate-500 text-sm">没有更多数据了</span>
        )}
      </div>
    </div>
  )
}
