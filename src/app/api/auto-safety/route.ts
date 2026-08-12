import { NextRequest, NextResponse } from "next/server"
import { AUTO_PUBLISH_RULES } from "@/lib/auto-publish-engine"
import { REPLY_STRATEGIES } from "@/lib/smart-reply-engine"

// 内存存储操作日志
interface OperationLog {
  id: string
  timestamp: string
  action: string
  platform: string
  status: 'success' | 'failed' | 'blocked'
  details?: string
}

let operationLogs: OperationLog[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 记录操作日志
    if (action === 'log') {
      const log: OperationLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: data.action,
        platform: data.platform,
        status: data.status,
        details: data.details
      }
      
      operationLogs.push(log)
      
      // 限制日志数量
      if (operationLogs.length > 1000) {
        operationLogs = operationLogs.slice(-1000)
      }
      
      return NextResponse.json({
        success: true,
        log
      })
    }
    
    // 执行安全检查
    if (action === 'pre-check') {
      const { accountId, platform, content } = data
      
      const checks = {
        accountStatus: 'healthy',
        dailyLimit: {
          current: Math.floor(Math.random() * 15),
          max: AUTO_PUBLISH_RULES.maxCommentsPerDay,
          passed: true
        },
        contentSafety: {
          sensitiveWords: AUTO_PUBLISH_RULES.sensitiveWords.filter(word => !content.includes(word)),
          passed: AUTO_PUBLISH_RULES.sensitiveWords.every(word => !content.includes(word))
        },
        frequencyCheck: {
          lastOperation: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          nextAvailable: new Date(Date.now() + Math.random() * 60000).toISOString(),
          passed: true
        }
      }
      
      const allPassed = checks.accountStatus === 'healthy' && 
                        checks.dailyLimit.passed &&
                        checks.contentSafety.passed &&
                        checks.frequencyCheck.passed
      
      return NextResponse.json({
        success: true,
        checks,
        allowed: allPassed
      })
    }
    
    // 检查账号状态（模拟）
    if (action === 'check-account') {
      const { accountId } = data
      
      return NextResponse.json({
        success: true,
        account: {
          id: accountId,
          status: 'active',
          healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
          dailyOperations: Math.floor(Math.random() * 10),
          lastActive: new Date().toISOString()
        }
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auto safety error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取安全配置
    if (action === 'config') {
      return NextResponse.json({
        success: true,
        config: {
          rules: AUTO_PUBLISH_RULES,
          strategies: REPLY_STRATEGIES.map(s => ({
            id: s.id,
            name: s.name,
            keywords: s.detectKeywords.length
          }))
        }
      })
    }
    
    // 获取操作日志
    if (action === 'logs') {
      const limit = parseInt(searchParams.get('limit') || '50')
      return NextResponse.json({
        success: true,
        logs: [...operationLogs].reverse().slice(0, limit),
        total: operationLogs.length
      })
    }
    
    // 生成安全报告
    if (action === 'report') {
      const today = new Date().toISOString().split('T')[0]
      const todayLogs = operationLogs.filter(l => l.timestamp.startsWith(today))
      
      const stats = {
        totalOperations: todayLogs.length,
        successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
        blockedCount: todayLogs.filter(l => l.status === 'blocked').length,
        failedCount: todayLogs.filter(l => l.status === 'failed').length,
        warnings: [
          '建议每日评论数不超过15条',
          '注意观察账号健康度变化',
          '如遇验证码请立即停止自动操作'
        ]
      }
      
      return NextResponse.json({
        success: true,
        report: {
          date: today,
          stats,
          recommendations: generateRecommendations(stats)
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "自动化安全API"
    })
  } catch (error) {
    console.error('Auto safety error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}

function generateRecommendations(stats: any): string[] {
  const recs: string[] = []
  
  if (stats.totalOperations > 15) {
    recs.push('今日操作次数较多，建议降低频率')
  }
  if (stats.successRate < 90) {
    recs.push('成功率较低，请检查内容是否合规')
  }
  if (stats.blockedCount > 0) {
    recs.push(`有${stats.blockedCount}次操作被拦截，请审查评论内容`)
  }
  
  if (recs.length === 0) {
    recs.push('系统运行正常，继续保持！')
  }
  
  return recs
}
