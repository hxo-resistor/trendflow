"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Circle, Calendar, TrendingUp, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PublishedItem {
  id: string
  keyword: string
  platform: string
  title: string
  status: 'pending' | 'published' | 'scheduled'
  scheduledDate?: string
  publishedAt?: string
  content?: string
}

export default function PublishPage() {
  const [items, setItems] = useState<PublishedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayPublished: 0,
    todayPending: 0,
    totalScheduled: 0,
    successRate: 0
  })

  useEffect(() => {
    loadPublishQueue()
  }, [])

  const loadPublishQueue = async () => {
    try {
      const mockData: PublishedItem[] = generateMockData()
      setItems(mockData)
      
      // 计算统计数据
      const todayPublished = mockData.filter(i => i.status === 'published').length
      const todayPending = mockData.filter(i => i.status === 'pending').length
      const totalScheduled = mockData.filter(i => i.status === 'scheduled').length
      
      setStats({
        todayPublished,
        todayPending,
        totalScheduled,
        successRate: mockData.length > 0 
          ? Math.round((todayPublished / mockData.length) * 100) 
          : 0
      })
    } catch (error) {
      console.error("Failed to load publish queue:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'pending' ? 'published' : 'pending'
        return {
          ...item,
          status: newStatus,
          publishedAt: newStatus === 'published' ? new Date().toLocaleString('zh-CN') : undefined
        }
      }
      return item
    }))
    
    // 更新统计
    const updatedItem = items.find(i => i.id === id)
    if (updatedItem) {
      const newStatus = updatedItem.status === 'pending' ? 'published' : 'pending'
      setStats(prev => ({
        ...prev,
        todayPublished: newStatus === 'published' ? prev.todayPublished + 1 : Math.max(0, prev.todayPublished - 1),
        todayPending: newStatus === 'pending' ? prev.todayPending + 1 : Math.max(0, prev.todayPending - 1),
        successRate: newStatus === 'published' ? Math.min(100, prev.successRate + 5) : Math.max(0, prev.successRate - 5)
      }))
    }
  }

  const schedulePost = (id: string, date: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'scheduled',
          scheduledDate: date
        }
      }
      return item
    }))
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载发布队列...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              发布管理中心
            </h1>
            <p className="text-muted-foreground mt-2">
              管理内容发布计划，跟踪发布状态
            </p>
          </div>
          <Button onClick={loadPublishQueue} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            刷新数据
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">今日已发布</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{stats.todayPublished}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Circle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">待发布</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{stats.todayPending}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">已排期</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">{stats.totalScheduled}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">成功率</span>
            </div>
            <p className="text-2xl font-bold text-purple-500">{stats.successRate}%</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <FilterTab label="全部" count={items.length} active />
          <FilterTab label="待发布" count={items.filter(i => i.status === 'pending').length} />
          <FilterTab label="已发布" count={items.filter(i => i.status === 'published').length} />
          <FilterTab label="已排期" count={items.filter(i => i.status === 'scheduled').length} />
        </div>

        {/* Publish Queue */}
        <div className="space-y-4">
          {items.map((item) => (
            <PublishCard
              key={item.id}
              item={item}
              onToggle={() => toggleStatus(item.id)}
              onSchedule={(date) => schedulePost(item.id, date)}
            />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">暂无待发布内容</p>
            <p className="text-sm mt-2">前往生成页面创作内容</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 筛选标签组件
function FilterTab({ label, count, active = false }: { label: string; count: number; active?: boolean }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-muted-foreground hover:bg-accent'
      }`}
    >
      {label} ({count})
    </button>
  )
}

// 发布卡片组件
function PublishCard({ 
  item, 
  onToggle, 
  onSchedule 
}: { 
  item: PublishedItem; 
  onToggle: () => void;
  onSchedule: (date: string) => void;
}) {
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')

  const handleSchedule = () => {
    if (scheduleDate) {
      onSchedule(scheduleDate)
      setShowSchedule(false)
      setScheduleDate('')
    }
  }

  const getStatusIcon = () => {
    switch (item.status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />
      default:
        return <Circle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = () => {
    switch (item.status) {
      case 'published':
        return `已发布于 ${item.publishedAt}`
      case 'scheduled':
        return `排期至 ${item.scheduledDate}`
      default:
        return '待发布'
    }
  }

  return (
    <div className={`bg-secondary rounded-xl p-4 border transition-all ${
      item.status === 'published' ? 'border-green-500/30 bg-green-500/5' :
      item.status === 'scheduled' ? 'border-blue-500/30 bg-blue-500/5' :
      'border-border'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={onToggle}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              item.status === 'published' 
                ? 'border-green-500 bg-green-500 text-white' 
                : 'border-muted-foreground hover:border-primary'
            }`}
          >
            {item.status === 'published' && <Check className="w-3 h-3" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {item.platform}
              </span>
              <span className="text-xs text-muted-foreground">{item.keyword}</span>
            </div>
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.content || '暂无内容预览'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {getStatusIcon()}
          <span className="text-xs text-muted-foreground hidden sm:block">
            {getStatusText()}
          </span>
          
          {item.status === 'pending' && (
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="设置发布时间"
            >
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Schedule Form */}
      {showSchedule && (
        <div className="mt-4 pt-4 border-t border-border flex gap-2">
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
          />
          <Button size="sm" onClick={handleSchedule}>确认排期</Button>
        </div>
      )}
    </div>
  )
}

// 生成模拟数据
function generateMockData(): PublishedItem[] {
  const platforms = ['小红书', '知乎', '公众号', '微博']
  const keywords = ['智能喂食器', '猫砂推荐', '蓝牙耳机', '扫地机器人', '狗粮测评']
  
  return Array.from({ length: 15 }, (_, i) => {
    const platform = platforms[i % platforms.length]
    const keyword = keywords[Math.floor(i / 3)]
    const statuses: ('pending' | 'published' | 'scheduled')[] = ['pending', 'published', 'scheduled']
    const status = statuses[i % 3]
    
    return {
      id: `pub-${i + 1}`,
      keyword,
      platform,
      title: `${keyword}${['深度测评', '避坑指南', '选购攻略', '真实体验'][i % 4]}`,
      status,
      publishedAt: status === 'published' ? new Date().toLocaleString('zh-CN') : undefined,
      scheduledDate: status === 'scheduled' ? '2026-08-12 14:00' : undefined,
      content: `这是关于${keyword}的${['深度测评', '避坑指南', '选购攻略'][i % 3]}文章...`
    }
  })
}
