import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'search') {
      const keyword = searchParams.get('keyword')
      const platform = searchParams.get('platform') || 'all'
      
      if (!keyword) {
        return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 })
      }

      // 模拟商品数据
      const products = Array.from({ length: 10 }, (_, i) => ({
        id: `prod-${Date.now()}-${i}`,
        name: `${keyword}热销商品${i + 1}`,
        price: Math.floor(Math.random() * 300) + 50,
        commission: Math.floor(Math.random() * 30) + 5,
        commissionRate: (Math.random() * 10 + 5).toFixed(1),
        platform: platform,
        image: 'https://via.placeholder.com/100'
      }))

      return NextResponse.json({ success: true, data: { products, total: products.length } })
    }

    if (action === 'stats') {
      const period = searchParams.get('period') || 'today'
      
      return NextResponse.json({
        success: true,
        data: {
          [period]: {
            revenue: 0,
            orders: 0,
            clicks: 0
          }
        }
      })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, platform } = body

    if (!productId || !platform) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 生成推广链接
    const promoLink = `https://example.com/promo/${productId}`

    return NextResponse.json({
      success: true,
      data: { productId, platform, promoLink }
    })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
