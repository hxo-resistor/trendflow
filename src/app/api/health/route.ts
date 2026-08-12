import { NextResponse } from 'next/server'

/**
 * 系统健康检查API
 * GET /api/health - 返回系统整体健康状态
 */

interface HealthCheck {
  success: boolean
  timestamp: string
  version: string
  uptime: string
  checks: Record<string, { status: 'ok' | 'error' | 'warning'; message?: string; latency_ms?: number }>
}

export async function GET() {
  const checks: HealthCheck['checks'] = {}
  const startTime = Date.now()
  
  try {
    // 1. 基础环境检查
    checks['environment'] = {
      status: 'ok',
      message: `Node ${process.version}, Next.js ${require('next/package.json').version}`
    }
    
    // 2. 内存使用情况
    const memUsage = process.memoryUsage()
    checks['memory'] = {
      status: memUsage.heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning',
      message: `Heap: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB / ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
    }
    
    // 3. CPU负载
    const loadAvg = process.cpuUsage()
    checks['cpu'] = {
      status: 'ok',
      message: `User: ${loadAvg.user}μs, System: ${loadAvg.system}μs`
    }
    
    // 4. 环境变量检查
    const envKeys = ['OPENAI_API_KEY', 'API2D_KEY']
    const missing = envKeys.filter(k => !process.env[k])
    if (missing.length > 0) {
      checks['environment-variables'] = {
        status: 'warning',
        message: `Missing: ${missing.join(', ')}`
      }
    } else {
      checks['environment-variables'] = {
        status: 'ok',
        message: 'All required env vars present'
      }
    }
    
    // 5. 数据库连接检查（模拟）
    checks['database'] = {
      status: 'ok',
      message: 'localStorage operational (mock DB)'
    }
    
    // 总耗时
    const totalLatency = Date.now() - startTime
    
    const healthCheck: HealthCheck = {
      success: Object.values(checks).every(c => c.status === 'ok'),
      timestamp: new Date().toISOString(),
      version: '3.1.0',
      uptime: formatUptime(process.uptime()),
      checks
    }
    
    return NextResponse.json(healthCheck, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        checks
      },
      { status: 500 }
    )
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}
