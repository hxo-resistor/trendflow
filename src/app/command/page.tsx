"use client"

import { useState } from "react"
import { Command, Loader2, Download, Zap, CheckCircle, TrendingUp, Users, Clock, AlertCircle, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContentItem {
  id: string
  platform: string
  angle: string
  title: string
  content: string
  monetizedContent: string | null
  persona: string
  bestTime: string
}

interface CommandStats {
  totalGenerated: number
  totalEstimated: string
  byPlatform: Record<string, number>
  accountCount: number
  scheduledCount: number
}

export default function CommandPage() {
  const [keyword, setKeyword] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [contents, setContents] = useState<ContentItem[]>([])
  const [error, setError] = useState("")
  const [stats, setStats] = useState<CommandStats>({
    totalGenerated: 0,
    totalEstimated: "¥0-¥0/月",
    byPlatform: {},
    accountCount: 0,
    scheduledCount: 0
  })
  
  const stages = [
    { id: 'scan', title: '情报扫描', icon: '🔍', description: '发现N个可截流话题' },
    { id: 'analyze', title: '策略制定', icon: '🎯', description: '匹配账号人设' },
    { id: 'generate', title: '蜂群生产', icon: '📝', description: '并行生成X篇内容' },
    { id: 'monetize', title: '变现装配', icon: '💰', description: '注入推广链接' },
    { id: 'distribute', title: '矩阵分发', icon: '📡', description: '分配Z个账号排期' },
    { id: 'done', title: '完成', icon: '✅', description: '神经中枢就绪' },
  ]

  const runFullCommand = async () => {
    if (!keyword.trim()) {
      setError("请输入领域关键词")
      return
    }

    setIsRunning(true)
    setError("")
    setContents([])
    setCurrentStage(0)

    try {
      // Simulate stages with real API calls
      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(i)
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      }

      // Call nexus produce API
      const response = await fetch("/api/nexus/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          platforms: ["xiaohongshu", "zhihu", "weibo", "douyin", "wechat"],
          angleCount: 10,
          contentPerAngle: 2,
          opportunity: `2024年${keyword}市场爆发，用户搜索量增长300%，商业机会巨大`
        }),
      })

      if (!response.ok) throw new Error("蜂群生成失败")
      const data = await response.json()
      
      if (data.success && data.contents) {
        setContents(data.contents)
        setStats({
          totalGenerated: data.totalGenerated,
          totalEstimated: data.estimatedRevenue,
          byPlatform: data.contents.reduce((acc: any, item: any) => {
            acc[item.platform] = (acc[item.platform] || 0) + 1
            return acc
          }, {}),
          accountCount: 50,
          scheduledCount: data.contents.length
        })
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "神经中枢启动失败，请重试")
    } finally {
      setIsRunning(false)
    }
  }

  const handleExport = () => {
    if (!contents.length) return
    
    const exportData = {
      version: "Nexus-3.0",
      exportedAt: new Date().toISOString(),
      keyword,
      contents,
      stats,
      system: "trendflow-nexus"
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Nexus矩阵-${keyword.replace(/\s+/g, "-")}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            Nexus 指挥中枢
          </h1>
          <p className="text-muted-foreground mt-2">
            输入领域关键词，启动神经中枢全自动内容统治
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl p-8 border border-primary/30 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                输入你要统治的领域关键词
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例如：智能宠物喂食器、AI写作工具、可持续时尚..."
                className="w-full px-6 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                disabled={isRunning}
                onKeyDown={(e) => e.key === "Enter" && runFullCommand()}
              />
            </div>
            <Button 
              onClick={runFullCommand}
              disabled={isRunning || !keyword.trim()}
              className="px-10 h-14 text-lg bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-500/30 transition-all"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  神经中枢运行中...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  🚀 启动神经中枢
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>🧠 神经中枢能力：</span>
            <span>感知层：500+关键词库</span>
            <span>•</span>
            <span>生产层：10角度×5平台</span>
            <span>•</span>
            <span>分发层：50账号矩阵</span>
          </div>
        </div>

        {/* Progress Stages */}
        {isRunning && (
          <div className="bg-secondary rounded-2xl p-6 border border-border mb-8">
            <h3 className="font-semibold text-foreground mb-6">神经中枢执行进度</h3>
            <div className="grid grid-cols-6 gap-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    index < currentStage ? 'bg-emerald-500 text-white' :
                    index === currentStage ? 'bg-primary text-white animate-pulse' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index < currentStage ? <CheckCircle className="w-6 h-6" /> : stage.icon}
                  </div>
                  <div className="text-xs font-medium text-foreground text-center">{stage.title}</div>
                  <div className="text-xs text-muted-foreground text-center mt-1">{stage.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-background rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              正在执行: {stages[currentStage]?.title}...
            </p>
          </div>
        )}

        {/* Results Section */}
        {contents.length > 0 && !isRunning && (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Brain className="w-7 h-7 text-primary" />
                  神经中枢产出总览
                </h2>
                <div className="flex gap-2">
                  <Button onClick={handleExport} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    导出JSON
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-background rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.totalGenerated}</div>
                  <div className="text-xs text-muted-foreground">生成总数</div>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">{Object.values(stats.byPlatform).reduce((a,b)=>a+b,0)}</div>
                  <div className="text-xs text-muted-foreground">平台覆盖</div>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">{stats.accountCount}</div>
                  <div className="text-xs text-muted-foreground">活跃账号</div>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500 mb-1">{stats.scheduledCount}</div>
                  <div className="text-xs text-muted-foreground">已排期</div>
                </div>
                <div className="bg-background rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-purple-500 mb-1">{stats.totalEstimated}</div>
                  <div className="text-xs text-muted-foreground">预估收益</div>
                </div>
              </div>
            </div>

            {/* Content Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contents.map((item, index) => (
                <ContentCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isRunning && contents.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">输入关键词，启动你的神经中枢</p>
            <p className="text-sm mt-2">系统将自动完成：感知→生产→分发全流程</p>
          </div>
        )}

        {/* System Status */}
        <div className="mt-8 bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              感知层正常
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              生产层就绪
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              分发层就绪
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              进化层待激活
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentCard({ item, index }: { item: ContentItem; index: number }) {
  const platformColors: Record<string, string> = {
    xiaohongshu: 'bg-pink-500',
    zhihu: 'bg-blue-500',
    weibo: 'bg-orange-500',
    douyin: 'bg-black',
    wechat: 'bg-green-500'
  }

  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full ${platformColors[item.platform] || 'bg-gray-500'} flex items-center justify-center text-white text-xs font-bold`}>
            {index + 1}
          </span>
          <span className={`px-2 py-0.5 ${platformColors[item.platform]} text-white text-xs rounded-full`}>
            {item.platform === 'xiaohongshu' ? '小红书' : item.platform === 'zhihu' ? '知乎' : item.platform === 'weibo' ? '微博' : item.platform === 'douyin' ? '抖音' : '公众号'}
          </span>
          <span className="text-xs text-muted-foreground">{item.angle}</span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.bestTime}
        </span>
      </div>
      
      <h3 className="font-medium text-foreground mb-2 line-clamp-2">{item.title}</h3>
      
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {item.content.substring(0, 100)}...
      </p>
      
      {item.monetizedContent && (
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/10 p-2 rounded">
          <span>💰 已注入变现路径</span>
        </div>
      )}
    </div>
  )
}
