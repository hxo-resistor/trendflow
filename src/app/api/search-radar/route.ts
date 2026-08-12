import { NextRequest, NextResponse } from "next/server"
import { getTrendingKeywords, filterByCategory, filterByPlatform, calculateTrendScore, exportToCSV } from "@/lib/search-radar"
import type { TrendKeyword } from "@/lib/search-radar"

let keywords: TrendKeyword[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取trending关键词
    if (action === 'trending') {
      const limit = parseInt(searchParams.get('limit') || '20')
      const category = searchParams.get('category')
      const platform = searchParams.get('platform')
      
      let result = [...MOCK_TRENDS]
      
      if (category) {
        result = result.filter(k => k.category.includes(category))
      }
      
      if (platform) {
        result = result.filter(k => k.platform === platform)
      }
      
      // 计算得分并排序
      result = result.map(k => ({
        ...k,
        score: calculateTrendScore(k)
      })).sort((a, b) => b.score - a.score)
      
      return NextResponse.json({
        success: true,
        data: result.slice(0, limit),
        total: result.length
      })
    }
    
    // 导出CSV
    if (action === 'export') {
      const csv = exportToCSV(MOCK_TRENDS)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=trending-keywords.csv'
        }
      })
    }
    
    // 默认返回
    return NextResponse.json({
      success: true,
      data: MOCK_TRENDS,
      total: MOCK_TRENDS.length
    })
  } catch (error) {
    console.error('Search radar error:', error)
    return NextResponse.json(
      { error: "获取趋势失败" },
      { status: 500 }
    )
  }
}

// 模拟趋势数据（实际应接入各平台API）
const MOCK_TRENDS: TrendKeyword[] = [
  {
    id: 'trend-001',
    keyword: '智能宠物喂食器',
    platform: 'zhihu',
    searchVolume: 45000,
    growthRate: 28.5,
    category: '宠物用品',
    heat: 92,
    trend: 'rising',
    suggestedProducts: ['小佩喂食器', '霍曼喂食器', '猫咪自动喂食'],
    capturedAt: new Date().toISOString()
  },
  {
    id: 'trend-002',
    keyword: '降噪蓝牙耳机',
    platform: 'baidu',
    searchVolume: 120000,
    growthRate: 15.3,
    category: '数码配件',
    heat: 88,
    trend: 'rising',
    suggestedProducts: ['AirPods', '索尼降噪', '漫步者耳机'],
    capturedAt: new Date().toISOString()
  },
  {
    id: 'trend-003',
    keyword: '车载手机支架',
    platform: 'weibo',
    searchVolume: 32000,
    growthRate: 12.8,
    category: '汽车用品',
    heat: 75,
    trend: 'stable',
    suggestedProducts: ['倍思支架', '绿联支架', '磁吸支架'],
    capturedAt: new Date().toISOString()
  },
  {
    id: 'trend-004',
    keyword: '桌面收纳盒',
    platform: 'xiaohongshu',
    searchVolume: 28000,
    growthRate: 18.2,
    category: '家居用品',
    heat: 72,
    trend: 'rising',
    suggestedProducts: ['名创收纳', '无印风格收纳', '透明收纳盒'],
    capturedAt: new Date().toISOString()
  },
  {
    id: 'trend-005',
    keyword: '快充数据线',
    platform: 'weibo',
    searchVolume: 67000,
    growthRate: 8.5,
    category: '数码配件',
    heat: 85,
    trend: 'stable',
    suggestedProducts: ['Anker数据线', '罗马仕数据线', 'Type-C线'],
    capturedAt: new Date().toISOString()
  }
]