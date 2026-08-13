import { AUTO_PUBLISH_RULES } from "./auto-publish-engine"

// ==================== 类型定义 ====================

export interface SafetyCheckResult {
  allowed: boolean
  reason?: string
  checks: {
    accountStatus: { passed: boolean; status: string }
    dailyLimit: { passed: boolean; current: number; max: number }
    contentSafety: { passed: boolean; sensitiveWords: string[] }
    frequencyCheck: { passed: boolean; lastOperation: string; nextAvailable: string }
  }
}

export interface OperationLog {
  id: string
  timestamp: string
  action: string
  platform: string
  content: string
  status: 'success' | 'failed' | 'blocked'
  details?: string
  duration: number
}

export interface SafetyReport {
  date: string
  totalOperations: number
  successRate: number
  blockedCount: number
  failedCount: number
  warnings: string[]
  recommendations: string[]
}

export interface AccountHealth {
  id: string
  status: 'active' | 'suspended' | 'warning'
  healthScore: number
  dailyOperations: number
  lastActive: string
  warnings: string[]
}

// ==================== 内存存储 ====================

const operationLogs: OperationLog[] = []
const lastOperationTime: Map<string, number> = new Map()
const accountData: Map<string, AccountHealth> = new Map()

// 初始化账号数据
function initAccount(accountId: string): AccountHealth {
  if (!accountData.has(accountId)) {
    accountData.set(accountId, {
      id: accountId,
      status: 'active',
      healthScore: 100,
      dailyOperations: 0,
      lastActive: new Date().toISOString(),
      warnings: []
    })
  }
  return accountData.get(accountId)!
}

// ==================== 核心函数 ====================

/**
 * 前置安全检查
 */
export function preCheck(
  accountId: string,
  platform: string,
  content: string
): SafetyCheckResult {
  const account = initAccount(accountId)
  
  // 1. 检查账号健康分
  const accountCheck = account.healthScore >= 60
  
  // 2. 检查今日操作次数
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOps = operationLogs.filter(
    log => log.timestamp.startsWith(todayStart.toISOString().split('T')[0])
  ).length
  const dailyCheck = todayOps < AUTO_PUBLISH_RULES.maxCommentsPerDay
  
  // 3. 检查内容安全
  const sensitiveWords: string[] = []
  for (const word of AUTO_PUBLISH_RULES.sensitiveWords) {
    if (content.includes(word)) {
      sensitiveWords.push(word)
    }
  }
  const contentCheck = sensitiveWords.length === 0
  
  // 4. 检查频率
  const lastOp = lastOperationTime.get(accountId) || 0
  const minInterval = AUTO_PUBLISH_RULES.minIntervalMs
  const now = Date.now()
  const timeDiff = now - lastOp
  const freqCheck = timeDiff >= minInterval
  
  const passed = accountCheck && dailyCheck && contentCheck && freqCheck
  
  // 计算下次可用时间
  let nextAvailable = ''
  if (!freqCheck) {
    const nextTime = lastOp + minInterval
    nextAvailable = new Date(nextTime).toLocaleTimeString('zh-CN')
  }
  
  return {
    allowed: passed,
    reason: !passed ? generateReason({ accountCheck, dailyCheck, contentCheck, freqCheck }, sensitiveWords) : undefined,
    checks: {
      accountStatus: {
        passed: accountCheck,
        status: account.status
      },
      dailyLimit: {
        passed: dailyCheck,
        current: todayOps,
        max: AUTO_PUBLISH_RULES.maxCommentsPerDay
      },
      contentSafety: {
        passed: contentCheck,
        sensitiveWords
      },
      frequencyCheck: {
        passed: freqCheck,
        lastOperation: lastOp > 0 ? new Date(lastOp).toLocaleTimeString('zh-CN') : '无记录',
        nextAvailable
      }
    }
  }
}

function generateReason(checks: any, sensitiveWords: string[]): string {
  const reasons = []
  if (!checks.accountCheck) reasons.push('账号健康分过低');
  if (!checks.dailyCheck) reasons.push('今日操作已达上限');
  if (!checks.contentCheck) reasons.push('内容包含敏感词：' + sensitiveWords.join('、'));
  if (!checks.freqCheck) reasons.push('操作过于频繁，请等待至少30秒');
  return reasons.join('；');
}

/**
 * 记录操作日志
 */
export function logOperation(
  accountId: string,
  action: string,
  platform: string,
  content: string,
  status: 'success' | 'failed' | 'blocked',
  details?: string
): OperationLog {
  const now = new Date()
  const log: OperationLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    timestamp: now.toISOString(),
    action,
    platform,
    content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
    status,
    details,
    duration: Math.floor(Math.random() * 500) + 100
  }
  
  operationLogs.push(log)
  
  // 更新账号数据
  const account = initAccount(accountId)
  account.lastActive = now.toISOString()
  account.dailyOperations++
  lastOperationTime.set(accountId, Date.now())
  
  return log
}

/**
 * 获取账号健康状态
 */
export function getAccountHealth(accountId: string): AccountHealth {
  return initAccount(accountId)
}

/**
 * 生成安全报告
 */
export function generateReport(date?: string): SafetyReport {
  const reportDate = date || new Date().toISOString().split('T')[0]
  const dayLogs = operationLogs.filter(log => log.timestamp.startsWith(reportDate))
  
  const successCount = dayLogs.filter(l => l.status === 'success').length
  const blockedCount = dayLogs.filter(l => l.status === 'blocked').length
  const failedCount = dayLogs.filter(l => l.status === 'failed').length
  
  const warnings: string[] = []
  const recommendations: string[] = []
  
  if (dayLogs.length > AUTO_PUBLISH_RULES.maxCommentsPerDay * 0.8) {
    warnings.push('今日操作量接近上限，建议控制发布节奏')
  }
  
  if (failedCount > 0) {
    warnings.push('今日有' + failedCount + '次操作失败，请检查内容合规性')
  }
  
  recommendations.push('保持每日操作间隔在30-90秒之间')
  recommendations.push('避免使用敏感词汇，确保内容真实自然')
  recommendations.push('定期查看账号健康分，及时补充养号')
  
  return {
    date: reportDate,
    totalOperations: dayLogs.length,
    successRate: dayLogs.length > 0 ? Math.round((successCount / dayLogs.length) * 100) : 0,
    blockedCount,
    failedCount,
    warnings,
    recommendations
  }
}

/**
 * 获取操作日志
 */
export function getOperationLogs(limit: number = 50): OperationLog[] {
  return operationLogs.slice(-limit).reverse()
}
