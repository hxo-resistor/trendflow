import { NextRequest, NextResponse } from "next/server"
import { 
  generateMatrixAccounts, 
  getMatrixStats, 
  generateInteractionTasks,
  generateCommentArmyTasks,
  ANTI_BAN_CONFIG,
  PERSONAS
} from "@/lib/matrix-engine"
import type { Account, Persona } from "@/lib/matrix-engine"

// 内存存储账号数据
let accounts: Account[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取统计信息
    if (action === 'stats') {
      const stats = getMatrixStats(accounts)
      return NextResponse.json({ success: true, stats })
    }
    
    // 获取账号列表
    if (action === 'list') {
      const platform = searchParams.get('platform')
      const persona = searchParams.get('persona')
      const status = searchParams.get('status')
      
      let filtered = [...accounts]
      
      if (platform) {
        filtered = filtered.filter(a => a.platform === platform)
      }
      
      if (persona) {
        filtered = filtered.filter(a => a.persona.name === persona)
      }
      
      if (status) {
        filtered = filtered.filter(a => a.status === status)
      }
      
      return NextResponse.json({
        success: true,
        data: filtered,
        total: filtered.length
      })
    }
    
    // 默认返回统计
    return NextResponse.json({
      success: true,
      stats: getMatrixStats(accounts),
      total: accounts.length
    })
  } catch (error) {
    console.error('Matrix error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 生成矩阵账号
    if (action === 'generate') {
      const count = data?.count || 50
      const newAccounts = generateMatrixAccounts()
      
      // 限制总数为50个
      accounts = newAccounts.slice(0, count)
      
      return NextResponse.json({
        success: true,
        generated: accounts.length,
        message: `已生成${accounts.length}个矩阵账号`
      })
    }
    
    // 执行互顶任务
    if (action === 'interact') {
      const { mainAccountId, targetCommentId } = data
      const account = accounts.find(a => a.id === mainAccountId)
      
      if (!account) {
        return NextResponse.json(
          { error: "账号不存在" },
          { status: 404 }
        )
      }
      
      const tasks = generateInteractionTasks(account, targetCommentId)
      
      return NextResponse.json({
        success: true,
        mainAccount: account.id,
        tasks: tasks.length,
        tasksDetail: tasks
      })
    }
    
    // 执行评论海
    if (action === 'comment-army') {
      const { postUrl, personaName } = data
      const persona = PERSONAS.find((p: Persona) => p.name === personaName)
      
      if (!persona) {
        return NextResponse.json(
          { error: "人设不存在" },
          { status: 404 }
        )
      }
      
      const tasks = generateCommentArmyTasks(postUrl, persona)
      
      return NextResponse.json({
        success: true,
        persona: personaName,
        tasks: tasks.length,
        tasksDetail: tasks
      })
    }
    
    // 更新账号状态
    if (action === 'update-status') {
      const { accountId, status } = data
      const account = accounts.find(a => a.id === accountId)
      
      if (!account) {
        return NextResponse.json(
          { error: "账号不存在" },
          { status: 404 }
        )
      }
      
      account.status = status as any
      account.lastActivity = new Date().toISOString()
      
      return NextResponse.json({
        success: true,
        account
      })
    }
    
    // 检查是否需要换IP
    if (action === 'check-ip-rotation') {
      const { accountId } = data
      const account = accounts.find(a => a.id === accountId)
      
      if (!account) {
        return NextResponse.json(
          { error: "账号不存在" },
          { status: 404 }
        )
      }
      
      const shouldRotate = true // 模拟判断
      
      return NextResponse.json({
        success: true,
        accountId,
        shouldRotateIP: shouldRotate,
        reason: shouldRotate ? '达到轮换条件' : '无需轮换'
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Matrix action error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}
