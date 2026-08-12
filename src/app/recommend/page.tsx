'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Target, TrendingUpDown, Search, Filter, ArrowUp, ArrowDown, Minus, Zap, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Loading from '@/components/Loading'

interface ProductRecommendation {
  id: string
  name: string
  category: string
  keyword: string
  keywords: string[]
  score: number
  heat: {
    searchVolume: number
    trend: 'rising' | 'stable' | 'falling'
    changePercent: number
  }
  competition: {
    competitorCount: number
    difficulty: 'easy' | 'medium' | 'hard'
  }
  profit: {
    avgCommission: number
    commissionRate: number
    avgPrice: number
    estimatedConversion: number
  }
  reasons: string[]
  risks: string[]
}

export default function RecommendPage() {
  const [products, setProducts] = useState<ProductRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: 'all',
    sortBy: 'score'
  })
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchRecommendations()
  }, [filter])

  async function fetchRecommendations() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category: filter.category,
        sortBy: filter.sortBy,
        limit: '20'
      })
      
      const res = await fetch(`/api/product-recommend?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.keyword.includes(searchKeyword) ||
    p.name.includes(searchKeyword)
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'falling': return <ArrowDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-yellow-500" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/10'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'hard': return 'text-red-500 bg-red-500/10'
      default: return 'text-slate-500'
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-400" />
          选品推荐引擎
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          AI智能分析品类热度、竞争度和利润空间，为您推荐最赚钱的选品方向
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索关键词..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有品类</option>
            <option value="宠物用品">宠物用品</option>
            <option value="3C数码">3C数码</option>
            <option value="家居电器">家居电器</option>
            <option value="个人护理">个人护理</option>
            <option value="智能家居">智能家居</option>
          </select>
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">综合评分</option>
            <option value="heat.searchVolume">搜索热度</option>
            <option value="profit.avgCommission">佣金金额</option>
            <option value="profit.commissionRate">佣金率</option>
          </select>
          <Button onClick={fetchRecommendations}>
            <Search className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400">{products.length}</div>
          <div className="text-xs text-slate-400">推荐品类</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-green-400">
            {products.length > 0 ? Math.round(products.reduce((acc: any, p: any) => acc + p.profit.avgCommission, 0) / products.length) : 0}
          </div>
          <div className="text-xs text-slate-400">平均佣金</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-yellow-400">
            {products.length > 0 ? Math.round(products.reduce((acc: any, p: any) => acc + p.heat.searchVolume, 0) / products.length / 1000) : 0}K
          </div>
          <div className="text-xs text-slate-400">平均搜索量</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400">
            {products.filter(p => p.competition.difficulty === 'easy').length}
          </div>
          <div className="text-xs text-slate-400">低竞争品类</div>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <Loading fullScreen={false} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">暂无推荐商品</p>
          <p className="text-sm mt-2">尝试调整筛选条件或刷新数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                      {product.category}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(product.competition.difficulty)}`}>
                      {product.competition.difficulty === 'easy' ? '易上' : product.competition.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    {product.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-700 rounded">{kw}</span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-gradient">
                    {product.score}
                  </div>
                  <div className="text-xs text-slate-400">综合评分</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    搜索热度
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(product.heat.trend)}
                    <span className="text-white font-medium">
                      {(product.heat.searchVolume / 1000).toFixed(0)}K
                    </span>
                    <span className={`text-xs ${product.heat.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.heat.changePercent > 0 ? '+' : ''}{product.heat.changePercent}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <DollarSign className="w-3 h-3" />
                    平均佣金
                  </div>
                  <div className="text-white font-medium">¥{product.profit.avgCommission}</div>
                  <div className="text-xs text-slate-400">{product.profit.commissionRate}%返点</div>
                </div>

                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Target className="w-3 h-3" />
                    预估转化
                  </div>
                  <div className="text-white font-medium">{product.profit.estimatedConversion}%</div>
                  <div className="text-xs text-slate-400">转化率</div>
                </div>

                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <TrendingUpDown className="w-3 h-3" />
                    竞争强度
                  </div>
                  <div className="text-white font-medium">{product.competition.competitorCount}</div>
                  <div className="text-xs text-slate-400">竞争对手</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-2">推荐理由：</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {product.reasons.map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-2">风险提示：</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {product.risks.map((risk: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-400">!</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  生成内容
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Clock className="w-4 h-4 mr-2" />
                  添加到监控
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  查看竞品
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
