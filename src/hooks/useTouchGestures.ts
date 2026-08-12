/**
 * 触摸手势优化Hook
 * 支持滑动、长按、下拉刷新等手势操作
 */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TouchGesture {
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  velocity: number
  direction: 'left' | 'right' | 'up' | 'down' | 'none'
}

interface GestureCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onLongPress?: () => void
  onPullRefresh?: () => Promise<void>
}

export function useTouchGestures(containerRef: React.RefObject<HTMLElement>, callbacks: GestureCallbacks) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const isScrolling = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // 长按检测
    longPressTimer.current = setTimeout(() => {
      if (callbacks.onLongPress) {
        callbacks.onLongPress()
      }
    }, 500)
  }, [callbacks])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // 检测是否开始滚动
    if (distance > 10) {
      isScrolling.current = true
      // 清除长按定时器
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }

    // 下拉刷新检测
    if (deltaY < -50 && touchStart.current.y < 50 && callbacks.onPullRefresh) {
      e.preventDefault()
    }
  }, [callbacks])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current || isScrolling.current) {
      touchStart.current = null
      isScrolling.current = false
      return
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const duration = Date.now() - touchStart.current.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // 计算速度
    const velocity = distance / (duration || 1)

    // 判断方向
    let direction: TouchGesture['direction'] = 'none'
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    const gesture: TouchGesture = {
      startX: touchStart.current.x,
      startY: touchStart.current.y,
      endX: touch.clientX,
      endY: touch.clientY,
      duration,
      velocity,
      direction
    }

    // 触发对应的手势回调
    if (distance > 50 && velocity > 0.5) {
      switch (gesture.direction) {
        case 'left':
          callbacks.onSwipeLeft?.()
          break
        case 'right':
          callbacks.onSwipeRight?.()
          break
        case 'up':
          callbacks.onSwipeUp?.()
          break
        case 'down':
          callbacks.onSwipeDown?.()
          break
      }
    }

    // 下拉刷新
    if (gesture.direction === 'down' && gesture.startY < 100 && callbacks.onPullRefresh) {
      callbacks.onPullRefresh()
    }

    touchStart.current = null
    isScrolling.current = false
  }, [callbacks])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * 惯性滚动Hook
 */
export function useInertiaScroll(containerRef: React.RefObject<HTMLDivElement>) {
  const velocity = useRef(0)
  const lastPosition = useRef(0)
  const lastTime = useRef(Date.now())
  const animationFrame = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const now = Date.now()
      const dt = now - lastTime.current
      const delta = container.scrollTop - lastPosition.current
      
      velocity.current = delta / (dt || 1)
      lastPosition.current = container.scrollTop
      lastTime.current = now
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [containerRef])

  const applyInertia = useCallback(() => {
    const container = containerRef.current
    if (!container || Math.abs(velocity.current) < 0.1) return

    const friction = 0.95
    velocity.current *= friction
    
    container.scrollTop += velocity.current * 16
    
    animationFrame.current = requestAnimationFrame(applyInertia)
  }, [containerRef, velocity])

  return { applyInertia }
}
