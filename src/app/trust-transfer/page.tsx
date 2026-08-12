'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, TrendingUp, ArrowUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function TrustTransferPage() {
  const [scores, setScores] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [hxoratio, setHxoratio] = useState(0)
  
  useEffect(() => {
    fetchStats()
    fetchScores()
    fetchHxoRatio()
  }, [])
  
  async function fetchStats() {
    try {
      const res = await fetch('/api/trust-transfer?action=stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }
  
  async function fetchScores() {
    try {
      const res = await fetch('/api/trust-transfer?action=list')
      const data = await res.json()
      if (data.success) {
        setScores(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch scores:', error)
    }
  }
  
  async function fetchHxoRatio() {
    try {
      const res = await fetch('/api/trust-transfer?action=hxoratio')
      const data = await res.json()
      if (data.success) {
        setHxoratio(data.hxoContentRatio)
      }
    } catch (error) {
      console.error('Failed to fetch HXO ratio:', error)
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            信任转移引擎
          </h1>
          <p className="text-muted-foreground mt-2">
            根据用户信任分自动调整HXO品牌内容比例，建立品牌护城河
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">总用户数</span>
            </div>
            <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">平均信任分</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats?.avgTrustScore || 0}</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">高信任用户</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{stats?.highTrustUsers || 0}</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">HXO内容比例</span>
            </div>
            <div className="text-3xl font-bold text-purple-500">{hxoratio}%</div>
          </div>
        </div>
        
        {/* HXO Recommendation */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mb-8">
          <h2 className="text-xl font-semibold mb-2">品牌内容策略建议</h2>
          <p className="text-muted-foreground">
            {hxoratio > 30 
              ? `当前信任度较高（${stats?.avgTrustScore || 0}分），建议增加HXO品牌内容曝光至${hxoratio}%`
              : `当前信任度一般（${stats?.avgTrustScore || 0}分），建议继续积累用户信任，HXO内容占比控制在${hxoratio}%`}
          </p>
        </div>
        
        {/* User Scores List */}
        <div className="bg-secondary rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">用户信任分排行榜</h2>
          <div className="space-y-3">
            {scores.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>暂无用户数据</p>
              </div>
            ) : (
              scores.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{user.email || user.userId}</div>
                      <div className="text-xs text-muted-foreground">
                        内容:{user.totalContentGenerated} 互动:{user.totalInteractions} 点击:{user.totalClicks}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      user.score >= 70 ? 'text-green-500' :
                      user.score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {user.score}
                    </div>
                    <div className="text-xs text-muted-foreground">信任分</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}