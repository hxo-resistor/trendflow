"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Trash2, UserCircle, TrendingUp, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Account {
  id: string
  name: string
  persona: string
  focus: string
  platforms: string[]
  activeTime: string
  style: string
  status: 'active' | 'inactive' | 'warning'
  contentCount: number
  publishedCount: number
}

const PERSONAS = [
  { id: 'mom', name: '宝妈', emoji: '👩‍👧', style: '亲切、接地气' },
  { id: 'student', name: '学生党', emoji: '🎓', style: '活泼、爱玩' },
  { id: 'pro', name: '专业人士', emoji: '👨‍💼', style: '严谨、专业' },
  { id: 'geek', name: '发烧友', emoji: '🤓', style: '懂行、极致' },
  { id: 'normal', name: '普通用户', emoji: '👤', style: '真实、中立' },
]

const FOCUSES = [
  '宠物用品', '3C数码', '家居生活', '母婴用品', 
  '汽车用品', '美妆护肤', '健身运动', '食品健康'
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    persona: 'normal',
    focus: '通用',
    platforms: ['xiaohongshu'],
    activeTime: '12:00-13:00',
    style: '亲切自然'
  })

  const [batchConfig, setBatchConfig] = useState({
    prefix: '矩阵账号',
    count: 10,
    persona: 'mixed',
    focus: 'mixed'
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
        setStats({
          total: data.stats?.total || 0,
          active: data.stats?.active || 0,
          pending: data.stats?.pending || 0
        })
      }
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          account: formData
        })
      })
      
      if (response.ok) {
        setShowCreateModal(false)
        loadAccounts()
      }
    } catch (error) {
      console.error('Create failed:', error)
    }
  }

  const handleBatchCreate = async () => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_create',
          account: batchConfig
        })
      })
      
      if (response.ok) {
        setShowBatchModal(false)
        loadAccounts()
      }
    } catch (error) {
      console.error('Batch create failed:', error)
    }
  }

  const deleteAccount = async (id: string) => {
    if (!confirm('确定要删除这个账号吗？')) return
    
    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', account: { id } })
      })
      loadAccounts()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载账号矩阵...</p>
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
              <Users className="w-8 h-8 text-primary" />
              账号矩阵管理
            </h1>
            <p className="text-muted-foreground mt-2">
              管理系统账号，实现多平台矩阵化运营
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBatchModal(true)}>
              批量创建
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加账号
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">总账号数</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">活跃账号</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">待激活</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">内容总量</span>
            </div>
            <p className="text-2xl font-bold text-purple-500">
              {accounts.reduce((sum, acc) => sum + acc.contentCount, 0)}
            </p>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const persona = PERSONAS.find(p => p.id === account.persona) || PERSONAS[4]
            return (
              <div
                key={account.id}
                className="bg-secondary rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                      {persona.emoji}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{account.name}</h3>
                      <p className="text-xs text-muted-foreground">{persona.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAccount(account.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">领域：</span>
                    <span className="font-medium">{account.focus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">活跃：</span>
                    <span className="font-medium">{account.activeTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {account.platforms.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                        {p === 'xiaohongshu' ? '红' : p === 'zhihu' ? '知' : p === 'wechat' ? '微' : p === 'weibo' ? '博' : '抖'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                  <span>内容: {account.contentCount}</span>
                  <span>发布: {account.publishedCount}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">暂无账号</p>
            <p className="text-sm mt-2">点击「添加账号」开始创建你的矩阵</p>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl border border-border w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">创建新账号</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">账号名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="如：宝妈小美"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">人设类型</label>
                    <select
                      value={formData.persona}
                      onChange={(e) => setFormData({...formData, persona: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {PERSONAS.map(p => (
                        <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">专注领域</label>
                    <select
                      value={formData.focus}
                      onChange={(e) => setFormData({...formData, focus: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {FOCUSES.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">活跃时间</label>
                    <input
                      type="text"
                      value={formData.activeTime}
                      onChange={(e) => setFormData({...formData, activeTime: e.target.value})}
                      placeholder="如：12:00-13:00"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                      取消
                    </Button>
                    <Button onClick={handleCreate} className="flex-1">
                      创建账号
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Create Modal */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl border border-border w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">批量创建账号</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">账号前缀</label>
                    <input
                      type="text"
                      value={batchConfig.prefix}
                      onChange={(e) => setBatchConfig({...batchConfig, prefix: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">创建数量</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={batchConfig.count}
                      onChange={(e) => setBatchConfig({...batchConfig, count: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowBatchModal(false)} className="flex-1">
                      取消
                    </Button>
                    <Button onClick={handleBatchCreate} className="flex-1">
                      开始创建
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
