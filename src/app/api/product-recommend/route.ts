import { NextRequest, NextResponse } from "next/server"

const PRODUCTS = [
  {
    id: 'p1',
    name: '智能宠物喂食器',
    category: '宠物用品',
    keyword: '智能喂食器',
    keywords: ['智能喂食器', '自动喂食器', '宠物喂饭机'],
    score: 92,
    heat: { searchVolume: 120000, trend: 'rising', changePercent: 25.5 },
    competition: { competitorCount: 150, difficulty: 'easy' },
    profit: { avgCommission: 45, commissionRate: 12.5, avgPrice: 359, estimatedConversion: 3.2 },
    reasons: ['搜索热度暴涨25%', '佣金率高达12.5%', '市场竞争较小'],
    risks: ['暂无明显风险']
  },
  {
    id: 'p2',
    name: '降噪蓝牙耳机',
    category: '3C数码',
    keyword: '降噪耳机',
    keywords: ['降噪耳机', '蓝牙耳机', '无线耳机'],
    score: 88,
    heat: { searchVolume: 280000, trend: 'stable', changePercent: 5.2 },
    competition: { competitorCount: 500, difficulty: 'medium' },
    profit: { avgCommission: 28, commissionRate: 8.5, avgPrice: 329, estimatedConversion: 2.8 },
    reasons: ['搜索量高', '稳定需求', '佣金适中'],
    risks: ['竞争激烈', '利润空间有限']
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'recommend') {
      const category = searchParams.get('category') || 'all'
      const sortBy = searchParams.get('sortBy') || 'score'
      const limit = parseInt(searchParams.get('limit') || '10')

      let filtered = PRODUCTS
      if (category !== 'all') {
        filtered = PRODUCTS.filter(p => p.category === category)
      }

      filtered.sort((a: any, b: any) => (b[sortBy as keyof typeof b] as number) - (a[sortBy as keyof typeof a] as number))
      
      return NextResponse.json({
        success: true,
        data: { products: filtered.slice(0, limit), total: filtered.length }
      })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
