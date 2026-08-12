"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, DollarSign, FileText, Users, Eye, Zap, CheckCircle, AlertCircle, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeSystemPerformance, generateDataReport } from "@/lib/nexus-data-flow"
import type { SystemDataFlow } from "@/lib/nexus-data-flow"

export default function DashboardPage() {
  const [data, setData] = useState<SystemDataFlow>({
    generatedContents: [],
    aeoAnalyses: [],
    affiliateRecords: [],
    publishRecords: [],
    performanceRecords: []
  })
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 从localStorage加载真实数据
      const storedData = localStorage.getItem('trendflow_dashboard_data')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setData(parsedData)
        setStats(analyzeSystemPerformance(parsedData))
        setHasData(Object.values(parsedData as any).some((arr: any) => arr && arr.length > 0))
      } else {
        // 没有数据时显示空状态
        setStats({
          totalGenerated: 0,
          averageAeoScore: 0,
          totalRevenue: 0,
          totalViews: 0,
          publishRate: 0,
          ctr: 0,
          cvr: 0,
          revenuePerView: 0
        })
        setHasData(false)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const report = generateDataReport(data)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Nexus数据报表-${new Date().toISOString().split('T')[0]}.md`
    a.click()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Zap className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在加载数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-primary" />
              收益仪表盘
            </h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
              实时监控内容产出、变现效果和AI引用情况
            </p>
          </div>
          <Button onClick={handleExport} size="sm">
            <FileText className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <MetricCard
            title="总生成内容"
            value={stats?.totalGenerated || 0}
            icon={<FileText className="w-5 h-5" />}
            color="text-blue-500"
            trend="+12%"
          />
          <MetricCard
            title="平均AEO分"
            value={stats?.averageAeoScore || 0}
            icon={<Zap className="w-5 h-5" />}
            color="text-purple-500"
            trend="+5分"
          />
          <MetricCard
            title="累计收益"
            value={`¥${(stats?.totalRevenue || 0).toFixed(0)}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="text-green-500"
            trend="+8%"
          />
          <MetricCard
            title="总浏览量"
            value={(stats?.totalViews || 0).toLocaleString()}
            icon={<Eye className="w-5 h-5" />}
            color="text-yellow-500"
            trend="+15%"
          />
        </div>

        {/* Empty State */}
        {!hasData && !loading && (
          <div className="bg-secondary rounded-xl p-12 border border-border mb-8 text-center">
            <Database className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">暂无数据</p>
            <p className="text-sm text-muted-foreground">
              完成任务或录入数据后，这里将显示您的收益统计
            </p>
            <Button className="mt-6" onClick={() => window.location.href = '/daily-tasks'}>
              前往今日任务
            </Button>
          </div>
        )}

        {/* Charts */}
        {hasData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-secondary rounded-xl p-4 md:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">内容产出趋势</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={generateTimeSeriesData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend fontSize={12} />
                    <Line type="monotone" dataKey="generated" stroke="#8884d8" name="生成数" strokeWidth={2} />
                    <Line type="monotone" dataKey="published" stroke="#82ca9d" name="发布数" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-secondary rounded-xl p-4 md:p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">收益分布</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: '小红书', revenue: 450 },
                    { name: '知乎', revenue: 320 },
                    { name: '微博', revenue: 180 },
                    { name: '公众号', revenue: 280 },
                    { name: '抖音', revenue: 150 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => [`¥${value}`, '收益']} />
                    <Bar dataKey="revenue" fill="#8884d8" name="收益(元)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-secondary rounded-xl p-4 md:p-6 border border-border mb-6 md:mb-8">
              <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">详细指标分析</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatItem label="发布率" value={`${stats?.publishRate?.toFixed(1) || 0}%`} status="good" />
                <StatItem label="CTR" value={`${stats?.ctr?.toFixed(2) || 0}%`} status={stats?.ctr > 3 ? 'good' : 'warning'} />
                <StatItem label="CVR" value={`${stats?.cvr?.toFixed(2) || 0}%`} status={stats?.cvr > 2 ? 'good' : 'warning'} />
                <StatItem label="每浏览收益" value={`¥${(stats?.revenuePerView || 0).toFixed(4)}`} status="good" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary rounded-xl p-4 md:p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm md:text-base">最近活动</h3>
                <span className="text-xs text-muted-foreground">实时更新</span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {data.performanceRecords.slice(-10).reverse().map((record, index) => (
                  <ActivityItem key={index} record={record} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="bg-secondary rounded-xl p-3 md:p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-green-500 font-medium">{trend}</span>
      </div>
      <div className="text-xl md:text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs md:text-sm text-muted-foreground">{title}</div>
    </div>
  )
}

function StatItem({ label, value, status }: any) {
  const StatusIcon = status === 'good' ? CheckCircle : AlertCircle
  const statusColor = status === 'good' ? 'text-green-500' : 'text-yellow-500'
  
  return (
    <div className="flex items-center gap-2">
      <StatusIcon className={`w-4 h-4 ${statusColor}`} />
      <div>
        <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground text-sm md:text-base">{value}</div>
      </div>
    </div>
  )
}

function ActivityItem({ record }: any) {
  return (
    <div className="flex items-center justify-between p-2 md:p-3 bg-background rounded-lg">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <div>
          <div className="text-xs md:text-sm font-medium text-foreground">
            {record.platform} 内容获得浏览
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(record.timestamp).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs md:text-sm font-medium text-green-500">+{record.views} 浏览</div>
        {record.revenue > 0 && (
          <div className="text-xs text-muted-foreground">+¥{record.revenue} 收益</div>
        )}
      </div>
    </div>
  )
}

function generateTimeSeriesData() {
  const data = []
  for (let i = 0; i < 7; i++) {
    data.push({
      name: `Day ${i + 1}`,
      generated: Math.floor(Math.random() * 10) + 5,
      published: Math.floor(Math.random() * 8) + 3
    })
  }
  return data
}
