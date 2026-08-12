"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, CheckCircle, Loader2, RefreshCw, Sparkles, Copy } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  link: string
  commission: number
  platform: string[]
  tags: string[]
}

interface RecommendedProduct {
  id: string
  name: string
  category: string
  price: number
  commission: number
  commissionAmount: number
  sales: number
  positiveRate: number
  image: string
  link: string
  tags: string[]
  reason: string
  estimatedDailyIncome: number
}

export default function AffiliatePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchRecommendedProducts()
  }, [])

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch('/api/auto-select')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRecommendedProducts(data.products)
        }
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    }
  }

  const handleGenerateContent = async (productId: string, platform: string) => {
    try {
      setGeneratingId(productId)
      const response = await fetch('/api/affiliate/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          pid: process.env.JD_UNION_ID || '2038448747',
          platforms: [platform]
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // 复制内容到剪贴板
        if (navigator.clipboard && data.contents[0]) {
          await navigator.clipboard.writeText(data.contents[0].body)
          alert(`${platform}内容已复制到剪贴板！`)
        }
      }
    } catch (error) {
      console.error('Failed to generate content:', error)
      alert('生成失败，请重试')
    } finally {
      setGeneratingId(null)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/affiliate/products')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-xl font-medium mb-2">加载失败</div>
          <div className="text-muted-foreground text-sm mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            商品库管理
          </h1>
          <p className="text-muted-foreground mt-2">
            管理你的推广商品，设置佣金和适用平台
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">总商品数</div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? Math.round(products.reduce((a, b) => a + b.commission, 0) / products.length) 
                : 0}%
            </div>
            <div className="text-sm text-muted-foreground">平均佣金</div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="text-2xl font-bold">宠物</div>
            <div className="text-sm text-muted-foreground">热门品类</div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="text-2xl font-bold">6个</div>
            <div className="text-sm text-muted-foreground">支持平台</div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-4">暂无商品</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              重新加载
            </button>
          </div>
        ) : (
          <>
            {/* High Commission Top 5 */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">高佣金商品 Top 5</h3>
              <div className="space-y-2">
                {[...products]
                  .sort((a, b) => b.commission - a.commission)
                  .slice(0, 5)
                  .map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{product.commission}%</div>
                        <div className="text-xs text-muted-foreground">佣金</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Categories */}
            {Array.from(new Set(products.map(p => p.category))).map(category => {
              const categoryProducts = products.filter(p => p.category === category)
              return (
                <div key={category} className="mb-8">
                  <h3 className="font-semibold mb-4">{category} ({categoryProducts.length}款)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const getLinkSource = (link: string) => {
    if (link.includes('u.jd.com')) return '京东'
    if (link.includes('m.tb.cn')) return '淘宝'
    if (link.includes('p.pinduoduo.com') || link.includes('mob.huoshan.com')) return '拼多多'
    if (link.includes('amazon.com')) return '亚马逊'
    return '示例'
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(product.link)
      alert('链接已复制！')
    } catch (err) {
      alert('复制失败，请手动复制')
    }
  }

  return (
    <div className="bg-secondary rounded-xl p-4 border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{product.name}</h4>
        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
          {product.commission}%
        </span>
      </div>
      <div className="text-xs text-muted-foreground mb-2">{product.category}</div>
      <div className="flex flex-wrap gap-1 mb-3">
        {product.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-1">
          {product.platform.map(p => (
            <span key={p} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">
              {p === 'xiaohongshu' ? '红' : p === 'zhihu' ? '知' : p === 'weibo' ? '博' : p === 'wechat' ? '微' : p === 'douyin' ? '抖' : '拼'}
            </span>
          ))}
        </div>
        <span className="text-muted-foreground">{getLinkSource(product.link)}</span>
      </div>
      <button
        onClick={copyLink}
        className="mt-3 w-full py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
      >
        复制链接
      </button>
    </div>
  )
}
