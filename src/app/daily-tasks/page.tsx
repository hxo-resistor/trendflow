'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, Copy, Play, RefreshCw, Plus, WifiOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import QuickEntryPanel from '@/components/QuickEntryPanel'
import Loading, { GridSkeleton } from '@/components/Loading'

interface HotWord {
  id: string
  name: string
  score: number
  searchVolume: number
  trend: 'rising' | 'stable' | 'falling'
  changePercent: number
  category: string
  source: string
}

interface CommentResult {
  success: boolean
  comments: string[]
  keyword: string
}

interface Task {
  id: string
  type: 'comment' | 'reply' | 'data_check'
  title: string
  description: string
  platform: string
  keyword?: string
  hotScore?: number
  searchVolume?: number
  source?: string
  targetPost?: {
    url: string
    title: string
    author: string
    hotScore: number
  }
  content?: {
    original: string
    suggested: string
    scripts: string[]
  }
  status: string
}

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [hotWords, setHotWords] = useState<HotWord[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRunning, setAutoRunning] = useState(false)
  const [generatingComments, setGeneratingComments] = useState<string | null>(null)
  const [commentResults, setCommentResults] = useState<Record<string, CommentResult>>({})
  const [completedCount, setCompletedCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // 检测网络状态
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    fetchTasks()
    fetchHotWords()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  async function fetchTasks() {
    setLoading(true)
    try {
      const res = await fetch('/api/daily-tasks?action=tasks')
      const data = await res.json()
      if (data.success) {
        setTasks(data.data.tasks || [])
        setCompletedCount(data.data.stats?.completedTasks || 0)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchHotWords() {
    try {
      const res = await fetch('/api/radar/hot-words?limit=3')
      const data = await res.json()
      if (data.success) {
        setHotWords(data.words || [])
      }
    } catch (error) {
      console.error('Failed to fetch hot words:', error)
    }
  }

  async function generateComments(keyword: string) {
    setGeneratingComments(keyword)
    try {
      const res = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      })
      const data = await res.json()
      if (data.success) {
        setCommentResults(prev => ({ ...prev, [keyword]: data }))
      }
    } catch (error) {
      console.error('Failed to generate comments:', error)
    } finally {
      setGeneratingComments(null)
    }
  }

  async function completeTask(taskId: string) {
    try {
      const res = await fetch('/api/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          data: { taskId }
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setCompletedCount(prev => prev + 1)
        fetchTasks()
      }
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      alert('复制失败，请手动复制')
    }
  }

  async function startAutoPublish() {
    setAutoRunning(true)
    setTimeout(() => {
      setAutoRunning(false)
    }, 3000)
  }

  const totalTasks = tasks.length + hotWords.length
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  // 离线提示
  if (!isOnline) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">网络连接中断</h2>
          <p className="text-slate-400 mb-4">请检查网络连接后刷新页面</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Play className="w-8 h-8 text-blue-400" />
          今日任务
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          每天只需3步，5分钟搞定 → 从操作工到指挥官的跃迁
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-blue-400">{progressPercent}%</div>
            <div className="text-sm text-slate-400">今日完成进度</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">{completedCount}/{totalTasks}</div>
            <div className="text-sm text-slate-400">任务完成</div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            onClick={startAutoPublish}
            disabled={autoRunning || progressPercent >= 100}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {autoRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                执行中...
              </>
            ) : progressPercent >= 100 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                今日完成！
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                一键执行全部任务
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={fetchTasks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* Hot Words Tasks */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : hotWords.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">🔥</span> 趋势热词任务
          </h2>
          <div className="space-y-3">
            {hotWords.map((word, index) => {
              const result = commentResults[word.name]
              
              return (
                <div key={word.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">{word.name}</div>
                        <div className="text-xs text-slate-400">
                          {word.source} · 搜索量 {word.searchVolume.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">{word.score}</div>
                      <div className={`text-xs ${word.trend === 'rising' ? 'text-green-400' : 'text-slate-400'}`}>
                        热度 {word.trend === 'rising' ? `↑${word.changePercent}%` : word.trend}
                      </div>
                    </div>
                  </div>

                  {/* Generated Comments */}
                  {result && (
                    <div className="mb-3 space-y-2">
                      {result.comments.map((comment, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
                          <span className="text-slate-500 text-xs">话术{i + 1}：</span>
                          <span className="text-slate-300 text-sm flex-1">{comment}</span>
                          <button
                            onClick={() => copyToClipboard(comment)}
                            className="p-1 hover:bg-slate-700 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-blue-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateComments(word.name)}
                      disabled={generatingComments === word.name}
                      className="flex-1"
                    >
                      {generatingComments === word.name ? (
                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />生成中...</>
                      ) : (
                        <><Plus className="w-4 h-4 mr-2" />生成话术</>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={completedCount > index ? 'default' : 'outline'}
                      disabled={completedCount > index}
                      onClick={() => completeTask(`hot-${word.id}`)}
                    >
                      {completedCount > index ? (
                        <><CheckCircle className="w-4 h-4 mr-2" />已完成</>
                      ) : '标记完成'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">暂无热词数据</p>
          <p className="text-sm mt-2">请刷新或稍后重试</p>
          <button
            onClick={fetchHotWords}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            刷新数据
          </button>
        </div>
      )}

      {/* Other Tasks */}
      {!loading && tasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">系统任务</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-800 rounded-xl p-4 border ${
                  task.status === 'completed' ? 'border-green-500/30' :
                  task.status === 'in_progress' ? 'border-yellow-500/30' :
                  'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-slate-400" />
                    )}
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        {task.title}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          task.type === 'comment' ? 'bg-blue-500/20 text-blue-400' :
                          task.type === 'reply' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {task.type === 'comment' ? '评论' : task.type === 'reply' ? '回复' : '数据'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">{task.description}</div>
                    </div>
                  </div>
                  
                  {task.hotScore && (
                    <div className="text-right">
                      <div className="text-sm text-yellow-400">热度 {task.hotScore}</div>
                      {task.source && <div className="text-xs text-slate-500">{task.source}</div>}
                    </div>
                  )}
                </div>
                
                {task.content?.scripts && task.content.scripts.length > 0 && (
                  <div className="mb-3 p-3 bg-slate-900 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">建议话术：</div>
                    <div className="font-medium text-slate-200">{task.content.suggested}</div>
                    <button
                      onClick={() => copyToClipboard(task.content!.suggested)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      复制话术
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={task.status === 'completed' ? 'default' : 'outline'}
                    disabled={task.status === 'completed'}
                    onClick={() => completeTask(task.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {task.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        已完成
                      </>
                    ) : '标记完成'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Entry Panel */}
      <QuickEntryPanel />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-slate-400">正在加载任务...</p>
        </div>
      )}
    </div>
  )
}
