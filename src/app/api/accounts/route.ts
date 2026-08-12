import { NextRequest, NextResponse } from "next/server"

/**
 * 账号矩阵管理API
 */

interface Account {
  id: string
  name: string
  persona: string
  focus: string
  platforms: string[]
  activeTime: string
  style: string
  status: 'active' | 'inactive' | 'warning'
  contentCount: number
  publishedCount: number
}

// 账号存储（生产环境应使用数据库）
let accounts: Account[] = []
let accountStats = {
  total: 0,
  active: 0,
  pending: 0,
  byPersona: {} as Record<string, number>,
  byFocus: {} as Record<string, number>
}

export async function GET() {
  return NextResponse.json({
    success: true,
    accounts: accounts.slice(-50), // 最近50个
    stats: accountStats,
    personas: PERSONAS.map(p => ({ id: p.id, name: p.name, emoji: p.emoji })),
    focuses: FOCUSES,
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
    const { action, account } = body

    if (action === 'create') {
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        name: account.name || `账号${accounts.length + 1}`,
        persona: account.persona || 'normal',
        focus: account.focus || '通用',
        platforms: account.platforms || ['xiaohongshu'],
        activeTime: account.activeTime || '12:00-13:00',
        style: account.style || '亲切自然',
        status: 'active' as const,
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

    if (action === 'update') {
      const index = accounts.findIndex(a => a.id === account.id)
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...account }
        updateStats()
        return NextResponse.json({ success: true, account: accounts[index] })
      }
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    if (action === 'delete') {
      const index = accounts.findIndex(a => a.id === account.id)
      if (index !== -1) {
        accounts.splice(index, 1)
        updateStats()
        return NextResponse.json({ success: true, message: '账号已删除' })
      }
    }

    if (action === 'batch_create') {
      const createdAccounts: Account[] = []
      for (let i = 0; i < account.count && accounts.length < 100; i++) {
        const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
        const focus = FOCUSES[Math.floor(Math.random() * FOCUSES.length)]
        const platforms = getRandomPlatforms()
        
        const newAccount: Account = {
          id: `acc-${Date.now()}-${i}`,
          name: account.prefix ? `${account.prefix}${i + 1}` : `账号${accounts.length + 1}`,
          persona: persona.id,
          focus: focus.name,
          platforms,
          activeTime: persona.defaultActiveTime,
          style: persona.style,
          status: 'active',
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

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error("Accounts API error:", error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}

function updateStats() {
  accountStats.total = accounts.length
  accountStats.active = accounts.filter(a => a.status === 'active').length
  accountStats.pending = accounts.filter(a => a.status === 'inactive').length
  accountStats.byPersona = {}
  accountStats.byFocus = {}
  
  accounts.forEach(acc => {
    accountStats.byPersona[acc.persona] = (accountStats.byPersona[acc.persona] || 0) + 1
    accountStats.byFocus[acc.focus] = (accountStats.byFocus[acc.focus] || 0) + 1
  })
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

// 专注领域
const FOCUSES = [
  { id: 'pet', name: '宠物用品', keywords: ['智能喂食器', '猫砂', '狗粮', '宠物玩具'] },
  { id: 'tech', name: '3C数码', keywords: ['蓝牙耳机', '充电宝', '手机壳', '机械键盘'] },
  { id: 'home', name: '家居生活', keywords: ['收纳神器', '扫地机器人', '空气炸锅', '香薰机'] },
  { id: 'baby', name: '母婴用品', keywords: ['纸尿裤', '婴儿推车', '早教玩具', '奶粉'] },
  { id: 'car', name: '汽车用品', keywords: ['行车记录仪', '车载充电器', '汽车座垫', '胎压监测'] },
  { id: 'beauty', name: '美妆护肤', keywords: ['防晒霜', '面膜', '洗面奶', '口红'] },
  { id: 'fitness', name: '健身运动', keywords: ['瑜伽垫', '跳绳', '运动手环', '蛋白棒'] },
  { id: 'food', name: '食品健康', keywords: ['代餐棒', '燕麦奶', '益生菌', '坚果'] },
]
