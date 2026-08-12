'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface RiskItem {
  type: string
  level: string
  message: string
}

interface SafetyCheckResult {
  accountId: string
  riskScore: string
  risks: RiskItem[]
  recommendations: string[]
}

export default function AntiBanPage() {
  const [config, setConfig] = useState<any>(null)
  const [checks, setChecks] = useState<SafetyCheckResult[]>([])
  const [checking, setChecking] = useState(false)
  
  useEffect(() => {
    fetchConfig()
  }, [])
  
  async function fetchConfig() {
    try {
      const res = await fetch('/api/anti-ban?action=config')
      const data = await res.json()
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }
  
  async function runSafetyCheck() {
    setChecking(true)
    const results: SafetyCheckResult[] = []
    
    // 模拟检查多个账号
    for (let i = 1; i <= 5; i++) {
      try {
        const res = await fetch(`/api/anti-ban?action=check&accountId=acc-${i}`)
        const data = await res.json()
        if (data.success) {
          results.push(data)
        }
      } catch (error) {
        console.error(`Check failed for acc-${i}:`, error)
      }
    }
    
    setChecks(results)
    setChecking(false)
  }
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            安全防护系统
          </h1>
          <p className="text-muted-foreground mt-2">
            防封策略 · 行为随机化 · 封号检测与恢复
          </p>
        </div>
        
        {/* Config Panel */}
        {config && (
          <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">安全配置</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">每日发帖上限</div>
                <div className="text-2xl font-bold">{config.dailyLimits.posts}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">每日评论上限</div>
                <div className="text-2xl font-bold">{config.dailyLimits.comments}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">每日点赞上限</div>
                <div className="text-2xl font-bold">{config.dailyLimits.likes}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>IP轮换：{config.ipRotation ? '开启' : '关闭'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>操作延迟：{config.randomDelay.min}s - {config.randomDelay.max}s 随机</span>
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Button
          onClick={runSafetyCheck}
          disabled={checking}
          className="w-full mb-8 h-12 bg-gradient-to-r from-orange-500 to-red-500"
        >
          {checking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              安全检查中...
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              执行全账号安全检查
            </>
          )}
        </Button>
        
        {/* Results */}
        {checks.length > 0 && (
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  check.riskScore === 'high' ? 'border-red-500/30 bg-red-500/5' :
                  check.riskScore === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  'border-green-500/30 bg-green-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">
                    账号: {check.accountId}
                    <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                      check.riskScore === 'high' ? 'bg-red-500/20 text-red-600' :
                      check.riskScore === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-green-500/20 text-green-600'
                    }`}>
                      风险等级: {check.riskScore.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {check.risks.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {check.risks.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{risk.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                    <CheckCircle className="w-4 h-4" />
                    <span>未发现风险项</span>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="text-sm font-medium mb-2">建议措施:</div>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {check.recommendations.map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {checks.length === 0 && !checking && (
          <div className="text-center py-20 text-muted-foreground">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">点击"执行全账号安全检查"</p>
            <p className="text-sm mt-2">系统将检查所有账号的风险状态并提供优化建议</p>
          </div>
        )}
      </div>
    </div>
  )
}