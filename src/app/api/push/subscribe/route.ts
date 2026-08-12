/**
 * 推送通知订阅API
 * POST /api/push/subscribe
 */

import { NextResponse } from 'next/server'

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export async function POST(request: Request) {
  try {
    const subscription: PushSubscription = await request.json()

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json(
        { error: '无效的推送订阅' },
        { status: 400 }
      )
    }

    // 存储订阅信息（生产环境应使用数据库）
    const subscriptions: PushSubscription[] = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('trendflow_push_subscriptions') || '[]')
      : []

    // 检查是否已存在相同订阅
    const exists = subscriptions.some(
      s => s.endpoint === subscription.endpoint
    )

    if (!exists) {
      subscriptions.push(subscription)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'trendflow_push_subscriptions',
          JSON.stringify(subscriptions)
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: '订阅成功',
      subscriptionCount: subscriptions.length
    })
  } catch (error) {
    console.error('Push subscribe error:', error)
    return NextResponse.json(
      { error: '订阅失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscriptions: PushSubscription[] = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('trendflow_push_subscriptions') || '[]')
      : []

    return NextResponse.json({
      success: true,
      count: subscriptions.length,
      subscribed: subscriptions.length > 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    )
  }
}
