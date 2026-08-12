import { NextRequest, NextResponse } from "next/server"
import type { Account, DistributionPlan } from "@/lib/nexus-types"

/**
 * Nexus 分发层 - 账号矩阵API
 * 目标：50个账号自动调度，模拟真人发布
 */

// 内存存储（生产环境应使用数据库）
let accounts: Account[] = []
let distributionPlans: DistributionPlan[] = []
let accountStats = {
  total: 0,
  active: 0,
  todayPublished: 0,
  pending: 0
}

export async function GET() {
  return NextResponse.json({
    success: true,
    accounts: accounts.slice(-50),
    plans: distributionPlans.slice(-20),
    stats: accountStats,
    personas: PERSONAS,
    limits: {
      maxAccounts: 100,
      maxPlatforms: 5,
      currentCount: accounts.length
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, account, plan } = body

    switch (action) {
      case 'create':
        return handleCreateAccount(account)
      case 'batch_create':
        return handleBatchCreate(account)
      case 'update':
        return handleUpdateAccount(account)
      case 'delete':
        return handleDeleteAccount(account)
      case 'schedule':
        return handleSchedule(plan)
      case 'publish':
        return handlePublish(plan)
      case 'auto_schedule':
        return handleAutoSchedule(body.contentIds)
      default:
        return NextResponse.json({ error: '未知操作' }, { status: 400 })
    }
  } catch (error) {
    console.error("Distribute API error:", error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}

// 创建账号
function handleCreateAccount(account: Partial<Account>) {
  const newAccount: Account = {
    id: `acc-${Date.now()}`,
    name: account.name || `账号${accounts.length + 1}`,
    persona: account.persona || 'normal',
    focus: account.focus || '通用',
    platforms: account.platforms || ['xiaohongshu'],
    activeTime: account.activeTime || '12:00-13:00',
    style: account.style || '亲切自然',
    status: 'active' as const,
    behaviorPattern: {
      postInterval: Math.floor(Math.random() * 20) + 10,  // 10-30分钟
      interactProbability: Math.random() * 0.3 + 0.1,    // 10%-40%
      onlineDuration: Math.floor(Math.random() * 3) + 2,  // 2-5小时
      randomize: true
    },
    contentCount: 0,
    publishedCount: 0
  }
  
  accounts.push(newAccount)
  updateStats()
  
  return NextResponse.json({
    success: true,
    account: newAccount,
    message: '账号创建成功'
  })
}

// 批量创建账号
function handleBatchCreate(config: any) {
  const createdAccounts: Account[] = []
  
  for (let i = 0; i < config.count && accounts.length < 100; i++) {
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
    const newAccount: Account = {
      id: `acc-${Date.now()}-${i}`,
      name: config.prefix ? `${config.prefix}${i + 1}` : `账号${accounts.length + 1}`,
      persona: persona.id,
      focus: config.focus || '通用',
      platforms: getRandomPlatforms(),
      activeTime: persona.defaultActiveTime,
      style: persona.style,
      status: 'active',
      behaviorPattern: {
        postInterval: Math.floor(Math.random() * 20) + 10,
        interactProbability: Math.random() * 0.3 + 0.1,
        onlineDuration: Math.floor(Math.random() * 3) + 2,
        randomize: true
      },
      contentCount: 0,
      publishedCount: 0
    }
    accounts.push(newAccount)
    createdAccounts.push(newAccount)
  }
  
  updateStats()
  
  return NextResponse.json({
    success: true,
    accounts: createdAccounts,
    created: createdAccounts.length,
    total: accounts.length
  })
}

// 更新账号
function handleUpdateAccount(account: Account) {
  const index = accounts.findIndex(a => a.id === account.id)
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...account }
    updateStats()
    return NextResponse.json({ success: true, account: accounts[index] })
  }
  return NextResponse.json({ error: '账号不存在' }, { status: 404 })
}

// 删除账号
function handleDeleteAccount(account: any) {
  const index = accounts.findIndex(a => a.id === account.id)
  if (index !== -1) {
    accounts.splice(index, 1)
    updateStats()
    return NextResponse.json({ success: true, message: '账号已删除' })
  }
  return NextResponse.json({ error: '账号不存在' }, { status: 404 })
}

// 安排发布计划
function handleSchedule(plan: any) {
  const newPlan: DistributionPlan = {
    id: `plan-${Date.now()}`,
    contentId: plan.contentId,
    accountId: plan.accountId,
    scheduledTime: plan.scheduledTime || new Date().toISOString(),
    status: 'scheduled',
    priority: plan.priority || 1
  }
  
  distributionPlans.push(newPlan)
  return NextResponse.json({ success: true, plan: newPlan })
}

// 执行发布
function handlePublish(plan: any) {
  const index = distributionPlans.findIndex(p => p.id === plan.id)
  if (index !== -1) {
    distributionPlans[index].status = 'published'
    distributionPlans[index].publishedAt = new Date().toISOString()
    
    // 更新账号统计
    const accountIndex = accounts.findIndex(a => a.id === distributionPlans[index].accountId)
    if (accountIndex !== -1) {
      accounts[accountIndex].publishedCount++
    }
    
    accountStats.todayPublished++
    return NextResponse.json({ success: true, plan: distributionPlans[index] })
  }
  return NextResponse.json({ error: '计划不存在' }, { status: 404 })
}

// 自动调度引擎
async function handleAutoSchedule(contentIds: string[]) {
  if (contentIds.length === 0 || accounts.length === 0) {
    return NextResponse.json({ 
      success: false, 
      error: '没有可调度的内容或账号' 
    }, { status: 400 })
  }
  
  const scheduledPlans: DistributionPlan[] = []
  const now = new Date()
  
  // 为每个内容匹配最合适的账号
  for (const contentId of contentIds) {
    // 找到最适合的账号（基于人设和领域匹配）
    const bestAccount = findBestAccount(contentId)
    
    if (bestAccount) {
      // 计算发布时间（错开，模拟真人）
      const scheduledTime = calculateScheduledTime(now, bestAccount)
      
      const plan: DistributionPlan = {
        id: `plan-${Date.now()}-${contentId}`,
        contentId,
        accountId: bestAccount.id,
        scheduledTime: scheduledTime.toISOString(),
        status: 'scheduled',
        priority: 1
      }
      
      distributionPlans.push(plan)
      scheduledPlans.push(plan)
      
      // 更新账号内容计数
      bestAccount.contentCount++
    }
  }
  
  updateStats()
  
  return NextResponse.json({
    success: true,
    scheduled: scheduledPlans.length,
    plans: scheduledPlans,
    message: `已为 ${scheduledPlans.length} 篇内容匹配合适账号`
  })
}

// 寻找最佳匹配账号
function findBestAccount(contentId: string): Account | null {
  // 简单匹配：随机选择一个活跃账号
  // 生产环境应根据内容特征智能匹配
  const activeAccounts = accounts.filter(a => a.status === 'active')
  if (activeAccounts.length === 0) return null
  
  return activeAccounts[Math.floor(Math.random() * activeAccounts.length)]
}

// 计算发布时间（防封机制）
function calculateScheduledTime(baseTime: Date, account: Account): Date {
  // 基于账号活跃时间 + 随机偏移
  const hourOffset = Math.floor(Math.random() * 4) - 2  // -2到+2小时
  const minuteOffset = Math.floor(Math.random() * 30)   // 0-30分钟
  
  const scheduledTime = new Date(baseTime)
  scheduledTime.setHours(scheduledTime.getHours() + hourOffset)
  scheduledTime.setMinutes(scheduledTime.getMinutes() + minuteOffset)
  
  return scheduledTime
}

function updateStats() {
  accountStats.total = accounts.length
  accountStats.active = accounts.filter(a => a.status === 'active').length
  accountStats.pending = accounts.filter(a => a.status === 'inactive').length
}

function getRandomPlatforms(): string[] {
  const all = ['xiaohongshu', 'zhihu', 'weibo', 'douyin', 'wechat']
  const count = Math.floor(Math.random() * 3) + 1
  return all.sort(() => Math.random() - 0.5).slice(0, count)
}

// 人设库
const PERSONAS = [
  { 
    id: 'mom', 
    name: '宝妈', 
    emoji: '👩‍👧',
    style: '亲切、接地气、注重性价比',
    defaultActiveTime: '09:00-10:00',
    focusPreference: ['母婴', '家居', '宠物'],
  },
  { 
    id: 'student', 
    name: '学生党', 
    emoji: '🎓',
    style: '活泼、爱玩、价格敏感',
    defaultActiveTime: '20:00-22:00',
    focusPreference: ['3C数码', '美妆', '食品'],
  },
  { 
    id: 'pro', 
    name: '专业人士', 
    emoji: '👨‍💼',
    style: '严谨、有深度、强调专业度',
    defaultActiveTime: '08:00-09:00',
    focusPreference: ['科技', '汽车', '教育'],
  },
  { 
    id: 'geek', 
    name: '发烧友', 
    emoji: '🤓',
    style: '懂行、追求极致、重参数',
    defaultActiveTime: '21:00-23:00',
    focusPreference: ['3C数码', '汽车', '健身'],
  },
  { 
    id: 'normal', 
    name: '普通用户', 
    emoji: '👤',
    style: '真实、中立、代表大众视角',
    defaultActiveTime: '12:00-13:00',
    focusPreference: ['通用'],
  },
]
