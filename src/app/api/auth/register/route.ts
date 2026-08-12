import { NextRequest, NextResponse } from "next/server"

// 内存存储用户数据（生产环境需接入数据库）
interface User {
  id: string
  email: string
  phone?: string
  wechat?: string
  password?: string  // 实际应加密存储
  source?: string    // 来源平台
  registeredAt: string
  couponCode?: string
  preference?: {
    categories: string[]
    platforms: string[]
  }
}

let users: User[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, wechat, password, source, preference } = body
    
    // 验证必填字段
    if (!email) {
      return NextResponse.json(
        { error: "邮箱不能为空" },
        { status: 400 }
      )
    }
    
    // 检查是否已注册
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已注册", userId: existingUser.id },
        { status: 409 }
      )
    }
    
    // 生成唯一优惠码
    const couponCode = `TF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // 创建用户
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      phone,
      wechat,
      password,
      source: source || 'organic',
      registeredAt: new Date().toISOString(),
      couponCode,
      preference: preference || {
        categories: [],
        platforms: []
      }
    }
    
    users.push(user)
    
    // 限制内存中的数据量
    if (users.length > 1000) {
      users = users.slice(-1000)
    }
    
    return NextResponse.json({
      success: true,
      message: "注册成功",
      userId: user.id,
      couponCode: user.couponCode,
      user: {
        id: user.id,
        email: user.email,
        wechat: user.wechat,
        registeredAt: user.registeredAt
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'stats') {
      const today = new Date().toISOString().split('T')[0]
      const todayRegistrations = users.filter(u => u.registeredAt.startsWith(today))
      
      return NextResponse.json({
        success: true,
        stats: {
          totalUsers: users.length,
          todayRegistrations: todayRegistrations.length,
          recentUsers: users.slice(-10).reverse()
        }
      })
    }
    
    if (action === 'by-source') {
      const bySource: Record<string, number> = {}
      users.forEach(u => {
        const source = u.source || 'unknown'
        bySource[source] = (bySource[source] || 0) + 1
      })
      
      return NextResponse.json({
        success: true,
        bySource
      })
    }
    
    // 默认返回统计
    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      recentCount: users.filter(u => {
        const hourAgo = new Date(Date.now() - 3600000)
        return new Date(u.registeredAt) >= hourAgo
      }).length
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}
