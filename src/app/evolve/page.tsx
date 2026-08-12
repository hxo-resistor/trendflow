"use client"

import { useState, useEffect } from "react"
import { Brain, TrendingUp, TrendingDown, RefreshCw, Target, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatsData {
  totalGenerations?: number
  totalFeedbacks?: number
  keywords?: any[]
  topAngles?: any[]
  topPlatforms?: any[]
}

export default function EvolvePage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [error, setError] = useState<string>("")

  const fetchEvolutionData = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/evolve")
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      setError("获取进化数据失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/evolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze" }),
      })
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      setError("分析失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvolutionData()
  }, [])

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              自我进化中心
            </h1>
            <p className="text-muted-foreground mt-2">
              AI驱动的自动化内容策略优化系统
            </p>
          </div>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                立即进化
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">{error}</span>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-primary">{stats.totalGenerations || 0}</div>
              <div className="text-sm text-muted-foreground">总生成次数</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-emerald-400">{stats.totalFeedbacks || 0}</div>
              <div className="text-sm text-muted-foreground">反馈数据</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-blue-400">{stats.keywords?.length || 0}</div>
              <div className="text-sm text-muted-foreground">监控关键词</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-yellow-400">0</div>
              <div className="text-sm text-muted-foreground">生效策略数</div>
            </div>
          </div>
        )}

        {/* Evolution Decisions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-secondary rounded-xl p-6 border border-emerald-500/30">
            <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              加大火力
            </h3>
            <p className="text-sm text-muted-foreground">暂无需要加大力度的关键词</p>
          </div>

          <div className="bg-secondary rounded-xl p-6 border border-red-500/30">
            <h3 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              放弃或减少
            </h3>
            <p className="text-sm text-muted-foreground">暂无需要放弃的关键词</p>
          </div>

          <div className="bg-secondary rounded-xl p-6 border border-yellow-500/30">
            <h3 className="font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              测试变异
            </h3>
            <p className="text-sm text-muted-foreground">暂无需要测试的变体</p>
          </div>
        </div>

        {/* Top Keywords */}
        {stats?.keywords && stats.keywords.length > 0 && (
          <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              热门关键词排行
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {stats.keywords.slice(0, 5).map((kw: any, i: number) => (
                <div key={i} className="bg-background p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">#{i + 1}</span>
                    <span className={`text-xs ${
                      kw.trend === 'up' ? 'text-emerald-400' :
                      kw.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                    }`}>
                      {kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <p className="font-medium text-foreground text-sm truncate">{kw.keyword}</p>
                  <p className="text-xs text-muted-foreground">互动: {kw.avgEngagement?.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !stats && (
          <div className="text-center py-20 text-muted-foreground">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">暂无进化数据</p>
            <p className="text-sm mt-2">生成更多内容后，系统将自动开始进化分析</p>
          </div>
        )}
      </div>
    </div>
  )
}
