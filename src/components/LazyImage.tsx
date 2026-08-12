/**
 * 图片懒加载组件
 * 使用Intersection Observer实现高效的懒加载
 */
'use client'

import { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (priority) {
      // 优先加载的图片直接设置src
      if (imgRef.current) {
        imgRef.current.src = src
      }
      return
    }

    // 使用Intersection Observer实现懒加载
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          const img = imgRef.current
          if (img) {
            img.src = src
            observer.unobserve(img)
          }
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    const img = imgRef.current
    if (img) {
      observer.observe(img)
    }

    return () => observer.disconnect()
  }, [src, priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 占位符 */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton" />
      )}
      
      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={error ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}

/**
 * 图片画廊懒加载
 */
interface LazyGalleryProps {
  images: Array<{
    src: string
    alt: string
    thumbnail?: string
  }>
  columns?: number
  className?: string
}

export function LazyGallery({
  images,
  columns = 3,
  className = ''
}: LazyGalleryProps) {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
      }}
    >
      {images.map((image, index) => (
        <LazyImage
          key={index}
          src={image.src}
          alt={image.alt}
          placeholder={image.thumbnail}
          className="rounded-lg"
        />
      ))}
    </div>
  )
}
