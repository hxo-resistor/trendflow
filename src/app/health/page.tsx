'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const HEALTH_ENDPOINTS = [
  { name: 'Dashboard API', url: '/api/dashboard' },
  { name: 'Matrix API', url: '/api/matrix' },
  { name: 'Nexus Sense', url: '/api/nexus/sense' },
  { name: 'Discover API', url: '/api/discover' },
  { name: 'Generate API', url: '/api/generate' },
  { name: 'Smart Reply', url: '/api/smart-reply' },
  { name: 'Affiliate Products', url: '/api/affiliate/products' },
  { name: 'Auto Publish', url: '/api/auto-publish?action=safety-report' },
  { name: 'Daily Tasks', url: '/api/daily-tasks' },
  { name: 'Anti-Ban', url: '/api/anti-ban' },
  { name: 'GEO Score', url: '/api/geo' },
  { name: 'Test API', url: '/api/test' },
]

export default function HealthCheckPage() {
  const [results, setResults] = useState<Array<{ name: string; url: string; status: 'checking' | 'ok' | 'error'; latency?: number; timestamp?: string }>>([])
  const [lastRun, setLastRun] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)

  const runHealthCheck = async () => {
    setIsRunning(true)
    const startTime = Date.now()
    const results = await Promise.all(
      HEALTH_ENDPOINTS.map(async (endpoint) => {
        const start = Date.now()
        try {
          const response = await fetch(endpoint.url)
          const elapsed = Date.now() - start
          return {
            name: endpoint.name,
            url: endpoint.url,
            status: (response.ok ? 'ok' : 'error') as 'ok' | 'error',
            latency: elapsed,
            timestamp: new Date().toISOString()
          }
        } catch {
          return {
            name: endpoint.name,
            url: endpoint.url,
            status: 'error' as 'error',
            latency: Date.now() - start,
            timestamp: new Date().toISOString()
          }
        }
      })
    )
    setResults(results)
    setLastRun(new Date().toLocaleString('zh-CN'))
    setIsRunning(false)
  }

  useEffect(() => {
    runHealthCheck()
  }, [])

  const okCount = results.filter(r => r.status === 'ok').length
  const errorCount = results.filter(r => r.status === 'error').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏥 系统健康检查</h1>
          <p className="text-slate-400">自动检测所有关键API端点状态</p>
          {lastRun && <p className="text-slate-500 mt-2">最后检测时间: {lastRun}</p>}
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <div className="text-3xl font-bold text-green-400">{okCount}</div>
            <div className="text-slate-400 mt-1">正常</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <div className="text-3xl font-bold text-red-400">{errorCount}</div>
            <div className="text-slate-400 mt-1">异常</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center border border-slate-700">
            <div className="text-3xl font-bold text-blue-400">{HEALTH_ENDPOINTS.length}</div>
            <div className="text-slate-400 mt-1">总数</div>
          </div>
        </div>

        {/* Run Button */}
        <div className="text-center mb-6">
          <button
            onClick={runHealthCheck}
            disabled={isRunning}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
          >
            {isRunning ? (
              <>
                <Loader2 className="animate-spin" />
                检测中...
              </>
            ) : (
              <>
                <CheckCircle />
                重新检测
              </>
            )}
          </button>
        </div>

        {/* Endpoint List */}
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg p-4 border flex items-center justify-between"
              style={{
                borderColor: result.status === 'ok' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)',
                backgroundColor: result.status === 'ok' ? 'rgba(74, 222, 128, 0.05)' : 'rgba(248, 113, 113, 0.05)'
              }}
            >
              <div className="flex items-center gap-3">
                {result.status === 'ok' ? (
                  <CheckCircle className="text-green-400 w-5 h-5" />
                ) : result.status === 'error' ? (
                  <XCircle className="text-red-400 w-5 h-5" />
                ) : (
                  <Loader2 className="animate-spin text-blue-400 w-5 h-5" />
                )}
                <div>
                  <div className="font-medium text-white">{result.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{result.url}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm ${result.status === 'ok' ? 'text-green-400' : result.status === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                  {result.status === 'ok' ? '正常' : result.status === 'error' ? '失败' : '检测中'}
                </div>
                {result.latency !== undefined && (
                  <div className="text-xs text-slate-500">{result.latency}ms</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Status */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xl font-bold ${
            errorCount === 0 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {errorCount === 0 ? (
              <>✅ 系统运行正常，明日就绪！</>
            ) : (
              <>❌ 存在 {errorCount} 个问题，请检查</>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>TrendFlow v3.1.0 - ECHO-2027 Project</p>
          <p className="mt-1">最后更新: {new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>
    </div>
  )
}
