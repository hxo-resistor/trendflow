'use client'

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SafetyRule {
  name: string
  value: any
}

interface SafetyReport {
  rules: {
    maxCommentsPerDay: number
    maxIntervalMs: number
    minIntervalMs: number
    sensitiveWords: string[]
    accountStatusCheck: boolean
  }
  lastCheck: string
  warnings: string[]
}

export default function AutoPublishPage() {
  const [report, setReport] = useState<SafetyReport | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  
  const sampleContent = '这款智能喂食器真的不错，用了半个月了，定时定量很省心，推荐给大家~'
  
  async function fetchSafetyReport() {
    try {
      const res = await fetch('/api/auto-publish?action=safety-report')
      const data = await res.json()
      if (data.success) {
        setReport(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch safety report:', error)
    }
  }
  
  async function runSecurityCheck() {
    setTesting(true)
    setTestResult(null)
    
    try {
      const res = await fetch('/api/auto-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check',
          data: {
            platform: 'weibo',
            content: sampleContent
          }
        })
      })
      
      const data = await res.json()
      setTestResult(data)
    } catch (error) {
      console.error('Security check failed:', error)
    } finally {
      setTesting(false)
    }
  }
  
  useEffect(() => {
    fetchSafetyReport()
  }, [])
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            自动发布安全中心
          </h1>
          <p className="text-muted-foreground mt-2">
            三层防护体系 · 防封策略 · 合规保障
          </p>
        </div>
        
        {/* Safety Report */}
        {report && (
          <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">安全配置规则</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">每日最大评论数</div>
                <div className="text-2xl font-bold">{report.rules.maxCommentsPerDay}</div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">操作间隔</div>
                <div className="text-2xl font-bold">
                  {report.rules.minIntervalMs / 1000}-{report.rules.maxIntervalMs / 1000}s
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">敏感词检测</div>
                <div className="text-2xl font-bold text-green-500">已启用</div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">最后检查</div>
                <div className="text-sm font-mono">{new Date(report.lastCheck).toLocaleString()}</div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-700">安全警告</div>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                    {report.warnings.map((warning, idx) => (
                      <li key={idx}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Test */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">安全检测测试</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">测试内容</label>
              <textarea
                value={sampleContent}
                readOnly
                className="w-full h-24 px-4 py-3 bg-background border border-border rounded-lg resize-none"
              />
            </div>
            
            <Button
              onClick={runSecurityCheck}
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Shield className="w-4 h-4 mr-2 animate-spin" />
                  检测中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  执行安全检测
                </>
              )}
            </Button>
            
            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.data?.allowed 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.data?.allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {testResult.data?.allowed ? '检测通过' : '检测失败'}
                  </span>
                </div>
                {!testResult.data?.allowed && testResult.data?.reason && (
                  <div className="mt-2 text-sm text-red-600">
                    原因：{testResult.data.reason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Rules Info */}
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            防封策略说明
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-primary">红线规则：</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• 不自动登录任何平台</li>
                <li>• 验证码必须用户手动处理</li>
                <li>• 不批量注册账号</li>
                <li>• 不伪造身份信息</li>
              </ul>
            </div>
            <div>
              <strong className="text-primary">灰线规则：</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• 自动生成话术，用户确认后发送</li>
                <li>• 使用真实人设，不伪装身份</li>
                <li>• 多账号独立操作，行为不重叠</li>
                <li>• 数据锚点使用模糊区间</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}