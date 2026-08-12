'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Zap, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Account {
  id: string
  platform: string
  persona: {
    name: string
    style: string
  }
  status: string
  followers: number
  dailyPosts: number
  dailyComments: number
}

interface MatrixStats {
  total: number
  active: number
  warming: number
  suspended: number
  banned: number
  totalFollowers: number
  totalDailyPosts: number
  totalDailyComments: number
}

export default function MatrixPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<MatrixStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch('/api/matrix?action=stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        fetchAccounts()
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function fetchAccounts() {
    try {
      const res = await fetch('/api/matrix?action=list')
      const data = await res.json()
      if (data.success) {
        setAccounts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }
  
  async function generateMatrix() {
    setGenerating(true)
    try {
      const res = await fetch('/api/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          data: { count: 50 }
        })
      })
      const data = await res.json()
      if (data.success) {
        alert(`✅ 已生成 ${data.generated} 个矩阵账号！`)
        fetchStats()
        fetchAccounts()
      }
    } catch (error) {
      alert('❌ 生成失败，请重试')
    } finally {
      setGenerating(false)
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            矩阵战争控制台
          </h1>
          <p className="text-muted-foreground mt-2">
            50账号矩阵 · 信息战指挥系统 · 封号是成本，不是终点
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">总账号数</span>
            </div>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
            <div className="text-xs text-muted-foreground">50个士兵</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-green-500" />
              <span className="text-sm text-muted-foreground">活跃账号</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats?.active || 0}</div>
            <div className="text-xs text-muted-foreground">战斗状态</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-orange-500" />
              <span className="text-sm text-muted-foreground">养号中</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{stats?.warming || 0}</div>
            <div className="text-xs text-muted-foreground">准备就绪</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <span className="text-sm text-muted-foreground">被封号</span>
            </div>
            <div className="text-3xl font-bold text-red-500">{stats?.banned || 0}</div>
            <div className="text-xs text-muted-foreground">成本计算</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={generateMatrix}
            disabled={generating || loading}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-600"
          >
            {generating ? '生成中...' : '🚀 生成50账号矩阵'}
          </Button>
          
          <Button
            variant="outline"
            onClick={fetchStats}
            disabled={loading}
            className="flex-1 h-12"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>
        
        {/* Account List */}
        <div className="bg-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">账号列表 ({accounts.length}/50)</h2>
          
          {accounts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>点击"生成50账号矩阵"开始建立你的军队</p>
              <p className="text-sm mt-2">每个账号都是一个士兵，准备投入信息战争</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 rounded-lg border ${
                    account.status === 'active' ? 'border-green-500/30 bg-green-500/5' :
                    account.status === 'warming' ? 'border-orange-500/30 bg-orange-500/5' :
                    account.status === 'banned' ? 'border-red-500/30 bg-red-500/5' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground">{account.id}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      account.status === 'active' ? 'bg-green-500/20 text-green-600' :
                      account.status === 'warming' ? 'bg-orange-500/20 text-orange-600' :
                      account.status === 'banned' ? 'bg-red-500/20 text-red-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {account.status === 'active' ? '🟢 活跃' :
                       account.status === 'warming' ? '🟡 养号' :
                       account.status === 'banned' ? '🔴 被封' : '⚪ 暂停'}
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium mb-1">{account.persona.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{account.platform}</div>
                  
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>粉丝:</span>
                      <span>{account.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>日发帖:</span>
                      <span>{account.dailyPosts}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>日评论:</span>
                      <span>{account.dailyComments}/20</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Strategy Tips */}
        <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            矩阵战争策略
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-primary">微博 (20个号):</strong> 主战场，100粉即可带货，评论区截流
            </div>
            <div>
              <strong className="text-primary">知乎 (10个号):</strong> SEO阵地，长尾流量，专业形象
            </div>
            <div>
              <strong className="text-primary">小红书 (10个号):</strong> 评论区截流，种草氛围
            </div>
            <div>
              <strong className="text-primary">百家号+头条 (10个号):</strong> 百度收录快，算法推荐
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}