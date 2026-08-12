'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ExternalLink, TrendingUp } from 'lucide-react'
import { Suspense } from 'react'

function RedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('recording')
  const [targetUrl, setTargetUrl] = useState('')
  const [clickId, setClickId] = useState('')
  
  const platform = searchParams.get('to') || 'unknown'
  const product = searchParams.get('product') || '未知商品'
  const source = searchParams.get('source') || 'direct'
  const contentId = searchParams.get('content_id') || `click-${Date.now()}`
  
  useEffect(() => {
    // 记录点击数据
    recordClick({ platform, product, source, contentId })
    
    // 生成实际跳转链接（模拟真实联盟链接）
    const baseUrl = getBaseURL(platform)
    const finalUrl = `${baseUrl}/${encodeURIComponent(product)}?pid=${process.env.NEXT_PUBLIC_JD_UNION_ID || '2038448747'}`
    
    setTargetUrl(finalUrl)
    setClickId(contentId)
    
    // 延迟后跳转
    setTimeout(() => {
      setStatus('redirecting')
      window.location.href = finalUrl
    }, 800)
  }, [])
  
  // 记录点击到后端
  async function recordClick(data: {
    platform: string
    product: string
    source: string
    contentId: string
  }) {
    try {
      await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error('Failed to record click:', error)
    }
  }
  
  // 根据平台获取基础URL
  function getBaseURL(platform: string): string {
    const urls: Record<string, string> = {
      jd: 'https://item.jd.com',
      tb: 'https://detail.tmall.com/item.htm',
      pdd: 'https://mobile.yangkeduo.com',
      douyin: 'https://www.douyin.com',
      weibo: 'https://weibo.com'
    }
    return urls[platform] || 'https://item.jd.com'
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          正在跳转...
        </h1>
        
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
            <TrendingUp className="w-5 h-5" />
            <span>正在为您准备专属优惠</span>
          </div>
          
          <div className="space-y-2 text-sm text-left bg-secondary p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">来源平台：</span>
              <span className="font-medium capitalize">{platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">商品：</span>
              <span className="font-medium truncate max-w-[200px]">{product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">追踪ID：</span>
              <span className="font-mono text-xs">{clickId}</span>
            </div>
          </div>
          
          {status === 'redirecting' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">即将跳转到商家页面...</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => window.location.href = targetUrl}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          立即前往购买
        </button>
        
        <p className="mt-4 text-xs text-muted-foreground">
          如果自动跳转失败，请点击上方按钮
        </p>
      </div>
    </div>
  )
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <RedirectContent />
    </Suspense>
  )
}