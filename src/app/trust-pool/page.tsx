'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Gift, Mail, Phone, MessageSquare } from 'lucide-react'

export default function TrustPoolPage() {
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, today: 0 })
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    wechat: '',
    source: 'organic'
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/auth/register?action=stats')
      const data = await res.json()
      if (data.success) {
        setStats({
          total: data.stats?.totalUsers || 0,
          today: data.stats?.todayRegistrations || 0
        })
        setUsers(data.stats?.recentUsers || [])
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
        setFormData({ email: '', phone: '', wechat: '', source: 'organic' })
        fetchStats()
      } else {
        alert(data.error || '注册失败')
      }
    } catch (error) {
      alert('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Gift className="w-8 h-8 text-primary" />
          信任池 - 用户注册与优惠
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">总注册用户</span>
            </div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="text-sm text-muted-foreground">今日新增</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats.today}</div>
          </div>
          
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6 text-purple-500" />
              <span className="text-sm text-muted-foreground">优惠券发放</span>
            </div>
            <div className="text-3xl font-bold text-purple-500">{stats.total}</div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">快速注册获取专属优惠</h2>
          <p className="text-muted-foreground mb-6">
            注册即送独家优惠券，抢先体验优质商品推荐
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">邮箱 *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">手机号</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg"
                    placeholder="可选"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">微信</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.wechat}
                  onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg"
                  placeholder="用于推送优惠信息"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? '注册中...' : '立即注册获取优惠'}
            </button>
          </form>
          
          {result && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="font-medium text-green-700">🎉 注册成功！</p>
              <p className="text-sm text-green-600 mt-1">您的专属优惠码：{result.couponCode}</p>
            </div>
          )}
        </div>

        {/* Recent Users */}
        {users.length > 0 && (
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">最近注册用户</h2>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(user.registeredAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  {user.couponCode && (
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-xs rounded-full">
                      已领优惠
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
