"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, AlertCircle, TrendingUp, Eye, Link2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DiscoverabilityReport {
  url: string
  title: string
  discoverabilityScore: number
  schemaComplete: boolean
  pageSpeed: number
  contentStructure: number
  citationNetwork: number
  indexStatus: 'indexed' | 'pending' | 'not_found'
  recommendations: string[]
}

export default function AEODiscoverPage() {
  const [reports, setReports] = useState<DiscoverabilityReport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      // 模拟加载报告
      const mockReports: DiscoverabilityReport[] = generateMockReports()
      setReports(mockReports)
    } catch (error) {
      console.error('Failed to load reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIndex = async () => {
    setSubmitting(true)
    // 模拟提交到搜索引擎
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitting(false)
    alert('URL已成功提交到Google索引请求！')
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            AI 可发现性检测器
          </h1>
          <p className="text-muted-foreground mt-2">
            模拟AI助手抓取流程，检测内容的可索引性和引用潜力
          </p>
        </div>

        {/* Stats Overview */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">平均可发现分</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {Math.round(reports.reduce((a, b) => a + b.discoverabilityScore, 0) / reports.length)}
              </p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Schema完整率</span>
              </div>
              <p className="text-2xl font-bold text-green-500">
                {Math.round((reports.filter(r => r.schemaComplete).length / reports.length) * 100)}%
              </p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-muted-foreground">已索引页面</span>
              </div>
              <p className="text-2xl font-bold text-purple-500">
                {reports.filter(r => r.indexStatus === 'indexed').length}/{reports.length}
              </p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">预估AI引用率</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">
                {Math.round(reports.reduce((a, b) => a + b.discoverabilityScore * 0.8, 0) / reports.length)}%
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={loadReports} disabled={loading}>
            {loading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : null}
            重新检测
          </Button>
          <Button variant="outline" onClick={handleCheckIndex} disabled={submitting}>
            {submitting ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : null}
            提交Google索引
          </Button>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Clock className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="font-semibold text-blue-600 mb-2">💡 提升可发现性的建议</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 确保所有Schema标记完整且符合Google规范</li>
            <li>• 提高页面加载速度（目标：首屏&lt;2秒）</li>
            <li>• 增加内部链接网络，提高页面关联度</li>
            <li>• 在社交媒体和论坛自然提及，建立外部引用</li>
            <li>• 定期更新内容，保持新鲜度</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ report }: { report: DiscoverabilityReport }) {
  const getStatusIcon = () => {
    switch (report.indexStatus) {
      case 'indexed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      default: return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-foreground">{report.title}</h3>
            <p className="text-xs text-muted-foreground font-mono">{report.url}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(report.discoverabilityScore)}`}>
            {report.discoverabilityScore}
          </div>
          <div className="text-xs text-muted-foreground">可发现性评分</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(report.schemaComplete ? 90 : 50)}`}>
            {report.schemaComplete ? '✅' : '❌'}
          </div>
          <div className="text-xs text-muted-foreground">Schema完整</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(report.pageSpeed)}`}>
            {report.pageSpeed}/100
          </div>
          <div className="text-xs text-muted-foreground">页面速度</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(report.contentStructure)}`}>
            {report.contentStructure}/100
          </div>
          <div className="text-xs text-muted-foreground">内容结构</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${getScoreColor(report.citationNetwork)}`}>
            {report.citationNetwork}/100
          </div>
          <div className="text-xs text-muted-foreground">引用网络</div>
        </div>
      </div>

      {report.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">优化建议：</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {report.recommendations.slice(0, 3).map((rec, i) => (
              <li key={i}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function generateMockReports(): DiscoverabilityReport[] {
  return [
    {
      url: 'https://trendflow-fawn.vercel.app/aeo/sites/review/pet-feeder-review',
      title: '小佩智能喂食器PRO深度测评',
      discoverabilityScore: 88,
      schemaComplete: true,
      pageSpeed: 85,
      contentStructure: 92,
      citationNetwork: 78,
      indexStatus: 'pending',
      recommendations: [
        '添加更多内部链接到其他相关评测',
        '优化图片ALT标签以提高可访问性',
        '增加用户评论区域提高互动性'
      ]
    },
    {
      url: 'https://trendflow-fawn.vercel.app/aeo/sites/faq/is-pet-feeder-worth-it',
      title: '智能喂食器值得买吗？',
      discoverabilityScore: 85,
      schemaComplete: true,
      pageSpeed: 90,
      contentStructure: 88,
      citationNetwork: 72,
      indexStatus: 'indexed',
      recommendations: [
        '在回答中添加更多具体数据支撑',
        '优化FAQ结构化数据标记',
        '增加相关问题推荐'
      ]
    },
    {
      url: 'https://trendflow-fawn.vercel.app/aeo/sites/wiki/pet-supplies-guide',
      title: '智能宠物用品百科全解',
      discoverabilityScore: 92,
      schemaComplete: true,
      pageSpeed: 82,
      contentStructure: 95,
      citationNetwork: 88,
      indexStatus: 'indexed',
      recommendations: [
        '页面内容非常完整，继续保持更新频率',
        '可以考虑添加视频内容提高参与度',
        '建立更完善的内部链接网络'
      ]
    }
  ]
}
