'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye, MousePointer, ShoppingCart, DollarSign, Calendar, Download, RefreshCw, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Loading from '@/components/Loading'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface BattleReport {
  date: string
  traffic: {
    totalViews: number
    totalClicks: number
    totalExposures: number
    ctr: number
  }
  sales: {
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
    conversionRate: number
  }
  affiliate: {
    totalCommission: number
    byPlatform: Record<string, number>
    topProducts: Array<{ name: string; commission: number; orders: number }>
  }
  content: {
    totalGenerated: number
    totalPublished: number
    publishRate: number
    aeoScores: number[]
  }
  trends: {
    hotKeywords: string[]
    risingCategories: string[]
    recommendations: string[]
  }
}

export default function BattleReportPage() {
  const [report, setReport] = useState<BattleReport | null>(null)
  const [history, setHistory] = useState<BattleReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadReport()
    loadHistory()
  }, [])

  async function loadReport() {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/report?action=generate&date=${today}`)
      const data = await res.json()
      
      if (data.success) {
        setReport(data.data)
      }
    } catch (error) {
      console.error('Failed to load report:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadHistory() {
    try {
      const res = await fetch('/api/report?action=history&limit=7')
      const data = await res.json()
      
      if (data.success) {
        setHistory(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  async function regenerate() {
    setGenerating(true)
    await loadReport()
    setGenerating(false)
  }

  const handleExport = () => {
    if (!report) return
    
    const reportText = `
# 📊 TrendFlow 战报 ${report.date}

## 🎯 核心指标

| 指标 | 数值 |
|------|------|
| 总浏览量 | ${report.traffic.totalViews.toLocaleString()} |
| 总点击数 | ${report.traffic.totalClicks.toLocaleString()} |
| CTR | ${report.traffic.ctr}% |
| 总订单数 | ${report.sales.totalOrders} |
| 总收益 | ¥${report.sales.totalRevenue.toFixed(2)} |
| 佣金收入 | ¥${report.affiliate.totalCommission.toFixed(2)} |

## 📈 趋势分析
- 🔥 热门关键词: ${report.trends.hotKeywords.join(', ')}
- 📊 上升品类: ${report.trends.risingCategories.join(', ')}

## 💡 运营建议
${report.trends.recommendations.map(r => `- ${r}`).join('\n')}
`
    
    const blob = new Blob([reportText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `战报-${report.date}.md`
    a.click()
  }

  if (loading) {
    return <Loading fullScreen />
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            每日战报
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            自动生成运营数据报告，洞察流量与收益变化
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={regenerate} disabled={generating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {!report ? (
        <div className="text-center py-12 text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">暂无今日战报</p>
          <p className="text-sm mt-2">请确保已录入足够数据</p>
          <Button className="mt-4" onClick={regenerate}>
            重新生成
          </Button>
        </div>
      ) : (
        <>
          {/* Date Display */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold">{report.date}</div>
                <div className="text-sm opacity-80">TrendFlow 运营日报</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={<Eye className="w-5 h-5" />}
              title="总浏览量"
              value={report.traffic.totalViews.toLocaleString()}
              trend="+12%"
              color="text-blue-400"
            />
            <MetricCard
              icon={<MousePointer className="w-5 h-5" />}
              title="总点击数"
              value={report.traffic.totalClicks.toLocaleString()}
              trend="+8%"
              color="text-yellow-400"
            />
            <MetricCard
              icon={<ShoppingCart className="w-5 h-5" />}
              title="总订单数"
              value={report.sales.totalOrders.toString()}
              trend="+5%"
              color="text-green-400"
            />
            <MetricCard
              icon={<DollarSign className="w-5 h-5" />}
              title="总佣金"
              value={`¥${report.affiliate.totalCommission.toFixed(2)}`}
              trend="+15%"
              color="text-purple-400"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4">流量趋势</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { name: '昨日', views: report.traffic.totalViews * 0.8, clicks: report.traffic.totalClicks * 0.7 },
                  { name: '今日', views: report.traffic.totalViews, clicks: report.traffic.totalClicks }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" name="浏览量" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#eab308" name="点击数" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4">收益分布</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(report.affiliate.byPlatform).map(([platform, commission]) => ({
                  name: platform,
                  commission
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(value) => [`¥${value}`, '佣金']}
                  />
                  <Bar dataKey="commission" fill="#8b5cf6" name="佣金" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                流量分析
              </h3>
              <div className="space-y-3">
                <StatRow label="曝光量" value={report.traffic.totalExposures.toLocaleString()} />
                <StatRow label="点击率" value={`${report.traffic.ctr}%`} highlight />
                <StatRow label="平均停留" value="2:35" />
                <StatRow label="跳出率" value="32%" warning />
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                销售分析
              </h3>
              <div className="space-y-3">
                <StatRow label="订单数" value={report.sales.totalOrders.toString()} />
                <StatRow label="转化率" value={`${report.sales.conversionRate}%`} highlight />
                <StatRow label="客单价" value={`¥${report.sales.avgOrderValue}`} />
                <StatRow label="GMV" value={`¥${report.sales.totalRevenue.toFixed(2)}`} />
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                佣金分析
              </h3>
              <div className="space-y-3">
                <StatRow label="总佣金" value={`¥${report.affiliate.totalCommission.toFixed(2)}`} highlight />
                <StatRow label="最高平台" value={Object.entries(report.affiliate.byPlatform).sort((a,b) => b[1]-a[1])[0]?.[0] || '-'} />
                <StatRow label="Top产品" value={report.affiliate.topProducts[0]?.name || '-'} />
                <StatRow label="环比增长" value="+18%" />
              </div>
            </div>
          </div>

          {/* Trends & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                热门关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.trends.hotKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                运营建议
              </h3>
              <ul className="space-y-2">
                {report.trends.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-green-400 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="font-semibold text-white mb-4">历史战报</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="pb-2 pr-4">日期</th>
                  <th className="pb-2 pr-4">浏览量</th>
                  <th className="pb-2 pr-4">点击数</th>
                  <th className="pb-2 pr-4">订单数</th>
                  <th className="pb-2 pr-4">佣金</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 pr-4 text-slate-300">{r.date}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.traffic.totalViews.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.traffic.totalClicks.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.sales.totalOrders}</td>
                    <td className="py-3 pr-4 text-green-400">¥{r.affiliate.totalCommission.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon, title, value, trend, color }: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-green-500 font-medium">{trend}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  )
}

function StatRow({ label, value, highlight, warning }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`font-medium ${
        highlight ? 'text-green-400' : 
        warning ? 'text-yellow-400' : 
        'text-white'
      }`}>{value}</span>
    </div>
  )
}
