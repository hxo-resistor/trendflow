'use client'

import { useState, useEffect } from 'react'
import { Zap, Copy, CheckCircle, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function InterceptorPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState('weibo')
  
  useEffect(() => {
    fetchTasks()
  }, [])
  
  async function fetchTasks() {
    try {
      const res = await fetch('/api/interceptor?action=list')
      const data = await res.json()
      if (data.success) {
        setTasks(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }
  
  async function analyzePosts() {
    if (!keyword.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/interceptor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          data: { keyword, platform }
        })
      })
      const data = await res.json()
      if (data.success) {
        setTasks(data.data)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function copyScript(script: string) {
    try {
      await navigator.clipboard.writeText(script)
      alert('已复制到剪贴板！')
    } catch (error) {
      alert('复制失败，请手动复制')
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            自动截流系统
          </h1>
          <p className="text-muted-foreground mt-2">
            自动发现热门帖子，生成专属截流话术，一键复制发布
          </p>
        </div>
        
        {/* Search Section */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">搜索关键词</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="如：智能宠物喂食器"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">目标平台</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
              >
                <option value="weibo">微博</option>
                <option value="zhihu">知乎</option>
                <option value="xiaohongshu">小红书</option>
              </select>
            </div>
          </div>
          <Button
            onClick={analyzePosts}
            disabled={loading || !keyword.trim()}
            className="w-full mt-4 h-12"
          >
            {loading ? '分析中...' : '开始分析'}
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{tasks.length}</span>
            </div>
            <div className="text-sm text-muted-foreground">待处理任务</div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{tasks.filter(t => t.status === 'processed').length}</span>
            </div>
            <div className="text-sm text-muted-foreground">已完成</div>
          </div>
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">
                {Math.round(tasks.reduce((sum, t) => sum + t.hotScore, 0) / (tasks.length || 1))}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">平均热度</div>
          </div>
        </div>
        
        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">输入关键词开始分析热门帖子</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-secondary rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {task.platform}
                      </span>
                      <span>@{task.author}</span>
                      <span className="text-muted-foreground text-sm">热度 {task.hotScore}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{task.postContent}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'processed' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {task.status === 'processed' ? '已处理' : '待处理'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">推荐截流话术：</p>
                  {task.generatedScripts?.map((script: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-background rounded-lg">
                      <span className="text-sm flex-1">{script.replace('${keyword}', keyword)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyScript(script.replace('${keyword}', keyword))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}