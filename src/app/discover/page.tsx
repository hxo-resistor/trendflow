"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, TrendingUp, ExternalLink, Lightbulb, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Trend {
  id: string
  title: string
  source: string
  url: string
  score: number
  opportunity: string
  category?: string
  platforms?: string[]
  monetizable?: boolean
}

interface Hotspot {
  id: string
  title: string
  source: string
  url: string
  score: number
  opportunity: string
  trend: 'rising' | 'stable' | 'falling'
  competition: 'low' | 'medium' | 'high'
  peakTime: string
  recommendedAction: string
  heat?: number
  platforms?: string[]
  monetizable?: boolean
}

export default function DiscoverPage() {
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [trends, setTrends] = useState<Trend[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [error, setError] = useState<string>("")
  const [activeTab, setActiveTab] = useState<'trends' | 'hotspots'>('trends')

  useEffect(() => {
    fetchTrends()
    fetchHotspots()
  }, [])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/discover")
      if (!response.ok) throw new Error("获取失败")
      const data = await response.json()
      if (data.success && data.trends?.length > 0) {
        setTrends(data.trends)
      } else {
        throw new Error("热点数据为空")
      }
    } catch (err) {
      console.error("Fetch trends error:", err)
      setError(err instanceof Error ? err.message : "加载热点失败")
    } finally {
      setLoading(false)
    }
  }

  const fetchHotspots = async () => {
    try {
      const response = await fetch("/api/intercept/hotspot?filter=rising")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setHotspots(data.hotspots || [])
        }
      }
    } catch (error) {
      console.error("Fetch hotspots error:", error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setError("")
    setTrends([])

    try {
      const response = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      })

      if (!response.ok) throw new Error("搜索失败")
      const data = await response.json()
      setTrends(data.trends || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            全球热点发现器
          </h1>
          <p className="text-muted-foreground mt-2">
            发现海外热门趋势，捕捉中国市场机会 + 实时截流机会
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'trends'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔥 热门趋势 ({trends.length})
          </button>
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'hotspots'
                ? 'border-b-2 border-red-500 text-red-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚡ 实时截流 ({hotspots.length})
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入关键词（如：宠物用品、AI工具...）"
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading || !keyword.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  搜索中...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  发现热点
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">正在抓取和分析全球热点...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>找到 {trends.length} 个相关热点</span>
              <span className="ml-auto">更新于: {new Date().toLocaleString('zh-CN')}</span>
            </div>

            <div className="grid gap-4">
              {trends.map((trend) => (
                <div
                  key={trend.id}
                  className="bg-secondary rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        热度: {trend.score}/100
                      </div>
                      <span className="text-xs text-muted-foreground">{trend.source}</span>
                      {trend.monetizable && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                          💰 可变现
                        </span>
                      )}
                    </div>
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {trend.title}
                  </h3>

                  <div className="flex items-start gap-2 pt-3 border-t border-border">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">市场机会：</span>
                      {trend.opportunity}
                    </p>
                  </div>

                  {trend.platforms && trend.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {trend.platforms.map(p => (
                        <span key={p} className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hotspots Tab */}
        {activeTab === 'hotspots' && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Zap className="w-4 h-4 text-red-500" />
              <span>实时截流机会 - 快速响应，抢占先机</span>
              <span className="ml-auto text-red-500">⚡ {hotspots.length} 个上升热点</span>
            </div>

            <div className="grid gap-4">
              {hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className={`rounded-xl p-6 border transition-colors ${
                    (spot.heat || 0) >= 90 ? 'border-red-500/30 bg-red-500/5' :
                    (spot.heat || 0) >= 80 ? 'border-yellow-500/30 bg-yellow-500/5' :
                    'border-border bg-secondary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 text-sm rounded-full ${
                        spot.trend === 'rising' ? 'bg-red-500/20 text-red-600' :
                        spot.trend === 'stable' ? 'bg-yellow-500/20 text-yellow-600' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {spot.trend === 'rising' ? '🔥 上升中' : spot.trend === 'stable' ? '➡️ 稳定' : '⬇️ 下降'}
                      </div>
                      <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        热度: {spot.heat}/100
                      </div>
                      <div className={`px-2 py-0.5 text-xs rounded-full ${
                        spot.competition === 'low' ? 'bg-green-500/10 text-green-600' :
                        spot.competition === 'medium' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        竞争: {spot.competition === 'low' ? '低' : spot.competition === 'medium' ? '中' : '高'}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{spot.source}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {spot.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">流量峰值</p>
                        <p className="text-sm font-medium text-foreground">{spot.peakTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">建议行动</p>
                        <p className="text-sm font-medium text-foreground">{spot.recommendedAction}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-3 mt-3 border-t border-border">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">机会分析：</span>
                      {spot.opportunity}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      立即截流
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      查看详情
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && trends.length === 0 && hotspots.length === 0 && !error && (
          <div className="text-center py-20 text-muted-foreground">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>输入关键词开始发现全球热点</p>
          </div>
        )}
      </div>
    </div>
  )
}
