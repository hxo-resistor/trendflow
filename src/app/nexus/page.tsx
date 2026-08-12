"use client"

import { useState, useEffect } from "react"
import { Brain, Activity, Zap, Users, TrendingUp, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Hotspot {
  id: string
  title: string
  score: number
  trend: 'rising' | 'stable' | 'falling'
  competition: string
  opportunity: string
}

interface Prediction {
  keyword: string
  prediction: string
  confidence: number
  action: string
}

interface Stats {
  totalKeywords: number
  risingCount: number
  highHeatCount: number
  monetizableCount: number
}

export default function NexusPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<Stats>({
    totalKeywords: 0,
    risingCount: 0,
    highHeatCount: 0,
    monetizableCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState<'idle' | 'scanning' | 'generating' | 'distributing' | 'completed'>('idle')
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('')

  useEffect(() => {
    loadIntelligence()
  }, [])

  const loadIntelligence = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/nexus/sense')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setHotspots(data.hotspots || [])
          setPredictions(data.predictions || [])
          setStats(data.stats || {})
        }
      }
    } catch (error) {
      console.error('Failed to load intelligence:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNeuralNetwork = async () => {
    setSystemStatus('scanning')
    setProgress(0)
    setCurrentPhase('正在扫描热点...')

    // Phase 1: 感知层 - 扫描热点
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProgress(20)
    setCurrentPhase('发现可截流话题...')

    // Phase 2: 生产层 - 蜂群生成
    setSystemStatus('generating')
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProgress(60)
    setCurrentPhase('蜂群并行生成中...')

    // Phase 3: 分发层 - 自动调度
    setSystemStatus('distributing')
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProgress(80)
    setCurrentPhase('自动调度账号矩阵...')

    // Phase 4: 完成
    setSystemStatus('completed')
    setProgress(100)
    setCurrentPhase('神经中枢运行完毕')

    // 刷新数据
    setTimeout(() => {
      loadIntelligence()
      setSystemStatus('idle')
    }, 1000)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              Nexus 神经中枢
            </h1>
            <p className="text-muted-foreground mt-2">
              自动感知 · 智能生产 · 矩阵分发 · 持续进化
            </p>
          </div>
          <Button 
            onClick={startNeuralNetwork}
            disabled={systemStatus !== 'idle'}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8"
          >
            {systemStatus === 'idle' ? (
              <>
                <Zap className="w-5 h-5 mr-2" />
                🚀 启动神经中枢
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2 animate-spin" />
                {currentPhase}
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {systemStatus !== 'idle' && (
          <div className="mb-8 bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">执行进度</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span className={systemStatus === 'scanning' ? 'text-primary font-medium' : ''}>感知层</span>
              <span className={systemStatus === 'generating' ? 'text-primary font-medium' : ''}>生产层</span>
              <span className={systemStatus === 'distributing' ? 'text-primary font-medium' : ''}>分发层</span>
              <span className={systemStatus === 'completed' ? 'text-green-500 font-medium' : ''}>完成</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">关键词总数</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalKeywords}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">上升趋势</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{stats.risingCount}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-red-500" />
              <span className="text-sm text-muted-foreground">高热度词</span>
            </div>
            <p className="text-2xl font-bold text-red-500">{stats.highHeatCount}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">可变现词</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{stats.monetizableCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hotspots Panel */}
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                实时热点情报
              </h3>
              <Button size="sm" variant="outline" onClick={loadIntelligence}>
                刷新
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Activity className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : hotspots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>暂无热点数据</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {hotspots.map((spot) => (
                  <HotspotCard key={spot.id} spot={spot} />
                ))}
              </div>
            )}
          </div>

          {/* Predictions Panel */}
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">未来24小时预测</h3>
            </div>

            {predictions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>暂无预测数据</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {predictions.map((pred, index) => (
                  <PredictionCard key={index} prediction={pred} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Nexus 系统状态
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-500">✅</div>
              <div className="text-sm text-muted-foreground mt-1">感知层</div>
              <div className="text-xs text-green-500 mt-1">正常</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-500">✅</div>
              <div className="text-sm text-muted-foreground mt-1">生产层</div>
              <div className="text-xs text-green-500 mt-1">就绪</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-500">✅</div>
              <div className="text-sm text-muted-foreground mt-1">分发层</div>
              <div className="text-xs text-green-500 mt-1">就绪</div>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">⏳</div>
              <div className="text-sm text-muted-foreground mt-1">进化层</div>
              <div className="text-xs text-yellow-500 mt-1">待激活</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="font-semibold text-blue-600 mb-2">💡 Nexus 使用指南</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>感知层：</strong>实时监控热点，预测未来趋势</li>
            <li>• <strong>生产层：</strong>一键生成10个角度的内容矩阵</li>
            <li>• <strong>分发层：</strong>自动调度账号矩阵，模拟真人发布</li>
            <li>• <strong>进化层：</strong>基于历史数据持续优化策略（即将上线）</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function HotspotCard({ spot }: { spot: Hotspot }) {
  const trendColors = {
    rising: 'text-red-500',
    stable: 'text-yellow-500',
    falling: 'text-gray-500'
  }
  
  const trendLabels = {
    rising: '🔥 上升',
    stable: '➡️ 稳定',
    falling: '⬇️ 下降'
  }

  return (
    <div className="p-3 bg-background rounded-lg border border-border">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-foreground">{spot.title}</span>
        <span className={`text-xs ${trendColors[spot.trend as keyof typeof trendColors]}`}>
          {trendLabels[spot.trend as keyof typeof trendLabels]}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>热度: {spot.score}/100</span>
        <span>竞争: {spot.competition}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{spot.opportunity}</p>
    </div>
  )
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  return (
    <div className="p-3 bg-background rounded-lg border border-border">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-foreground">{prediction.keyword}</span>
        <span className="text-xs text-green-500">{prediction.confidence}% 置信度</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{prediction.prediction}</p>
      <div className="text-xs text-blue-600">→ {prediction.action}</div>
    </div>
  )
}
