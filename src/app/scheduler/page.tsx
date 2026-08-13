'use client'

import { useState, useEffect } from 'react'
import { Clock, Play, Pause, Settings, Plus, RefreshCw, AlertCircle, CheckCircle, Zap, Search, MessageSquare, FileText, Eye, List } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SchedulerTask {
  id: string
  type: 'search' | 'comment' | 'post' | 'monitor'
  target: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: number
  scheduledAt: string
  retries: number
  error?: string
}

interface SchedulerConfig {
  maxSearchPerHour: number
  maxCommentPerHour: number
  maxPostPerHour: number
  idleTimeMin: number
  idleTimeMax: number
  workingHours: { start: string; end: string }
}

export default function SchedulerPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [queue, setQueue] = useState<SchedulerTask[]>([])
  const [config, setConfig] = useState<SchedulerConfig>({
    maxSearchPerHour: 30,
    maxCommentPerHour: 10,
    maxPostPerHour: 5,
    idleTimeMin: 30,
    idleTimeMax: 120,
    workingHours: { start: '08:00', end: '23:00' }
  })
  const [stats, setStats] = useState({
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatus()
    const interval = setInterval(loadStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadStatus() {
    try {
      const res = await fetch('/api/scheduler?action=status')
      const data = await res.json()
      
      if (data.success) {
        setIsRunning(data.data.isRunning)
        setQueue(data.data.queue || [])
        setStats({
          pending: data.data.pending || 0,
          running: data.data.running || 0,
          completed: data.data.completed || 0,
          failed: data.data.failed || 0
        })
      }
    } catch (error) {
      console.error('Failed to load scheduler status:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleEngine() {
    // TODO: 实现启动/停止逻辑
    setIsRunning(!isRunning)
  }

  async function addTask(type: 'search' | 'comment' | 'post' | 'monitor', target: string) {
    try {
      const res = await fetch('/api/scheduler?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target, priority: 5 })
      })
      const data = await res.json()
      
      if (data.success) {
        loadStatus()
        alert(`任务已添加，预计 ${data.data.estimatedStartTime} 开始执行`)
      }
    } catch (error) {
      alert('添加任务失败')
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="w-4 h-4" />
      case 'comment': return <MessageSquare className="w-4 h-4" />
      case 'post': return <FileText className="w-4 h-4" />
      case 'monitor': return <Eye className="w-4 h-4" />
      default: return <List className="w-4 h-4" />
    }
  }

  const getTaskColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'running': return 'text-blue-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-400" />
          后台调度引擎
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          24小时自动运行，智能控制任务节奏，确保合规安全
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-white font-medium">{isRunning ? '引擎运行�? : '引擎已停�?}</span>
          </div>
          <Button 
            onClick={toggleEngine}
            className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? <><Pause className="w-4 h-4 mr-2" />停止</> : <><Play className="w-4 h-4 mr-2" />启动</>}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="待执�? value={stats.pending} color="text-yellow-400" />
          <StatBox label="执行�? value={stats.running} color="text-blue-400" />
          <StatBox label="已完�? value={stats.completed} color="text-green-400" />
          <StatBox label="失败" value={stats.failed} color="text-red-400" />
        </div>
      </div>

      {/* Add Task Buttons */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          添加任务
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={() => addTask('search', '降噪蓝牙耳机')}
            className="justify-start"
          >
            <Search className="w-4 h-4 mr-2" />
            搜索任务
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addTask('comment', '热门帖子评论')}
            className="justify-start"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            评论任务
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addTask('post', '内容发布')}
            className="justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            发布任务
          </Button>
          <Button 
            variant="outline" 
            onClick={() => addTask('monitor', '竞品监控')}
            className="justify-start"
          >
            <Eye className="w-4 h-4 mr-2" />
            监控任务
          </Button>
        </div>
      </div>

      {/* Config Panel */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          节奏配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ConfigItem
              label="每小时搜索上�?
              value={config.maxSearchPerHour}
              min={10}
              max={100}
              onChange={(v) => setConfig(prev => ({ ...prev, maxSearchPerHour: v }))}
            />
            <ConfigItem
              label="每小时评论上�?
              value={config.maxCommentPerHour}
              min={1}
              max={20}
              onChange={(v) => setConfig(prev => ({ ...prev, maxCommentPerHour: v }))}
            />
            <ConfigItem
              label="每小时发布上�?
              value={config.maxPostPerHour}
              min={1}
              max={10}
              onChange={(v) => setConfig(prev => ({ ...prev, maxPostPerHour: v }))}
            />
          </div>
          <div className="space-y-4">
            <ConfigItem
              label="最小空闲时�?�?"
              value={config.idleTimeMin}
              min={10}
              max={300}
              onChange={(v) => setConfig(prev => ({ ...prev, idleTimeMin: v }))}
            />
            <ConfigItem
              label="最大空闲时�?�?"
              value={config.idleTimeMax}
              min={30}
              max={600}
              onChange={(v) => setConfig(prev => ({ ...prev, idleTimeMax: v }))}
            />
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
              <span className="text-slate-400 text-sm">工作时间</span>
              <span className="text-white text-sm">
                {config.workingHours.start} - {config.workingHours.end}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Queue */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <List className="w-5 h-5" />
            任务队列
          </h3>
          <Button size="sm" variant="outline" onClick={loadStatus}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">队列为空</p>
            <p className="text-sm mt-2">添加任务后将在此显示</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.slice(0, 10).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTaskColor(task.status)} bg-slate-800`}>
                    {getTaskIcon(task.type)}
                  </span>
                  <div>
                    <div className="text-white text-sm font-medium capitalize">{task.type}</div>
                    <div className="text-slate-400 text-xs">{task.target}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-xs font-medium ${getTaskColor(task.status)}`}>
                      {task.status === 'pending' && '待执�?}
                      {task.status === 'running' && '执行�?}
                      {task.status === 'completed' && '已完�?}
                      {task.status === 'failed' && '失败'}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {new Date(task.scheduledAt).toLocaleTimeString('zh-CN')}
                    </div>
                  </div>
                  
                  {task.retries > 0 && (
                    <span className="text-xs text-yellow-400">
                      重试{task.retries}�?                    </span>
                  )}
                  
                  {task.error && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">安全提示</h4>
            <ul className="text-sm text-yellow-200/80 space-y-1">
              <li>�?本系统采用严格的频率限制，防止账号被封禁</li>
              <li>�?所有操作均在设定工作时间内执行，避免异常时段活�?/li>
              <li>�?随机延迟机制模拟人类行为，降低被检测风�?/li>
              <li>�?失败任务自动重试，确保执行成功率</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-slate-900 rounded-lg p-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}

function ConfigItem({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className="text-white text-sm w-8">{value}</span>
      </div>
    </div>
  )
}

// Icon components
function Search(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function MessageSquare(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FileText(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function Eye(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function List(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}
