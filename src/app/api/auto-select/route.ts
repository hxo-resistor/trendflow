import { NextRequest, NextResponse } from "next/server"

// 模拟热销商品数据（实际应接入京东/淘宝API）
const MOCK_HOT_PRODUCTS = [
  {
    id: "hot-001",
    name: "小佩智能宠物喂食器PRO",
    category: "宠物用品",
    price: 899,
    originalPrice: 1299,
    commission: 12,
    sales: 15680,
    positiveRate: 98,
    heat: 92,
    trend: "rising" as const,
    tags: ["智能", "自动", "远程"],
    keywords: ["智能喂食器", "宠物喂食器", "自动喂食"]
  },
  {
    id: "hot-002",
    name: "TWS降噪蓝牙耳机",
    category: "数码配件",
    price: 299,
    originalPrice: 599,
    commission: 15,
    sales: 32560,
    positiveRate: 96,
    heat: 88,
    trend: "stable" as const,
    tags: ["降噪", "蓝牙", "便携"],
    keywords: ["蓝牙耳机", "降噪耳机", "TWS"]
  },
  {
    id: "hot-003",
    name: "车载手机支架",
    category: "汽车用品",
    price: 59.9,
    originalPrice: 129,
    commission: 20,
    sales: 8920,
    positiveRate: 97,
    heat: 75,
    trend: "rising" as const,
    tags: ["车载", "手机架", "稳固"],
    keywords: ["车载支架", "手机支架", "车用"]
  },
  {
    id: "hot-004",
    name: "桌面收纳盒套装",
    category: "家居用品",
    price: 89,
    originalPrice: 159,
    commission: 18,
    sales: 12340,
    positiveRate: 95,
    heat: 72,
    trend: "stable" as const,
    tags: ["收纳", "桌面", "整理"],
    keywords: ["收纳盒", "桌面收纳", "整理"]
  },
  {
    id: "hot-005",
    name: "快充数据线三件套",
    category: "数码配件",
    price: 39.9,
    originalPrice: 79,
    commission: 25,
    sales: 45670,
    positiveRate: 96,
    heat: 85,
    trend: "rising" as const,
    tags: ["充电", "数据线", "快充"],
    keywords: ["数据线", "充电线", "快充"]
  }
]

interface HotProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  commission: number
  sales: number
  positiveRate: number
  heat: number
  trend: 'rising' | 'stable' | 'falling' | 'new'
  tags: string[]
  keywords: string[]
  score: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取热销商品列表
    if (action === 'list') {
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      
      let products = [...MOCK_HOT_PRODUCTS]
      
      // 按热度排序
      products.sort((a, b) => b.heat - a.heat)
      
      // 计算综合得分
      products = products.map(p => ({
        ...p,
        score: calculateScore(p)
      }))
      
      // 过滤品类
      if (category) {
        products = products.filter(p => p.category.includes(category))
      }
      
      return NextResponse.json({
        success: true,
        data: products.slice(0, limit),
        total: products.length
      })
    }
    
    // 生成今日推荐
    if (action === 'recommend') {
      const recommendations = generateDailyRecommendation()
      return NextResponse.json({
        success: true,
        data: recommendations,
        generatedAt: new Date().toISOString()
      })
    }
    
    // 获取搜索趋势
    if (action === 'trends') {
      const trends = [
        { keyword: "智能喂食器", change: "+25%", period: "7天" },
        { keyword: "降噪耳机", change: "+18%", period: "7天" },
        { keyword: "车载支架", change: "+12%", period: "30天" },
        { keyword: "收纳盒", change: "+8%", period: "7天" },
        { keyword: "数据线", change: "+15%", period: "30天" }
      ]
      return NextResponse.json({ success: true, data: trends })
    }
    
    // 默认返回热门商品
    return NextResponse.json({
      success: true,
      data: MOCK_HOT_PRODUCTS.slice(0, 10).map(p => ({
        ...p,
        score: calculateScore(p)
      }))
    })
  } catch (error) {
    console.error('Auto select error:', error)
    return NextResponse.json(
      { error: "获取推荐失败" },
      { status: 500 }
    )
  }
}

/**
 * 计算商品综合得分
 */
function calculateScore(product: typeof MOCK_HOT_PRODUCTS[0]): number {
  // 权重：热度40% + 销量20% + 好评率20% + 佣金率20%
  const heatScore = product.heat * 0.4
  const salesScore = Math.min(product.sales / 1000, 100) * 0.2
  const ratingScore = product.positiveRate * 0.2
  const commissionScore = product.commission * 2 * 0.2
  
  return Math.round(heatScore + salesScore + ratingScore + commissionScore)
}

/**
 * 生成每日推荐
 */
function generateDailyRecommendation(): Array<{
  product: HotProduct
  reason: string
  estimatedIncome: number
}> {
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // 根据星期几推荐不同品类
  const categoryBias: Record<number, string> = {
    0: '宠物用品',      // 周日
    1: '数码配件',      // 周一
    2: '汽车用品',      // 周二
    3: '家居用品',      // 周三
    4: '运动健身',      // 周四
    5: '宠物用品',      // 周五
    6: '数码科技'       // 周六
  }
  
  const bias = categoryBias[dayOfWeek] || '宠物用品'
  
  return MOCK_HOT_PRODUCTS
    .filter(p => p.category.includes(bias) || p.trend === 'rising')
    .map(p => ({ ...p, score: calculateScore(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(p => ({
      product: p,
      reason: generateReason(p, bias),
      estimatedIncome: Math.round(p.price * p.commission / 100 * 2) // 预估日收入（按2单算）
    }))
}

/**
 * 生成推荐理由
 */
function generateReason(product: typeof MOCK_HOT_PRODUCTS[0], bias: string): string {
  const reasons = {
    rising: `${product.name}近期热度上升${product.heat > 80 ? '显著' : '明显'}，建议抓住时机`,
    stable: `${product.name}销量稳定，${product.positiveRate}%好评率证明品质可靠`,
    new: `${product.name}新品上市，竞争较小，容易获得早期流量`
  }
  
  return reasons[product.trend] || reasons.stable
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'refresh') {
      // 模拟刷新数据
      return NextResponse.json({
        success: true,
        message: "数据已刷新",
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auto select error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}