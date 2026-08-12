/**
 * 热词列表API - 带缓存和fallback
 */
import { NextResponse } from 'next/server'

interface HotWord {
  id: string
  name: string
  score: number
  searchVolume: number
  trend: 'rising' | 'stable' | 'falling'
  changePercent: number
  category: string
  source: string
  updatedAt: string
}

// 模拟热词数据（实际应从热点发现系统获取）
const MOCK_HOT_WORDS: HotWord[] = [
  {
    id: 'hw-1',
    name: '降噪蓝牙耳机',
    score: 88,
    searchVolume: 120000,
    trend: 'rising',
    changePercent: 15.3,
    category: '3C数码',
    source: '百度热搜',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw-2',
    name: '智能宠物喂食器',
    score: 92,
    searchVolume: 45000,
    trend: 'rising',
    changePercent: 28.7,
    category: '宠物用品',
    source: '知乎热榜',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw-3',
    name: '车载手机支架',
    score: 85,
    searchVolume: 89000,
    trend: 'stable',
    changePercent: 3.2,
    category: '汽车配件',
    source: '微博热搜',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw-4',
    name: '空气炸锅',
    score: 90,
    searchVolume: 230000,
    trend: 'rising',
    changePercent: 12.1,
    category: '家居电器',
    source: '小红书热榜',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'hw-5',
    name: '电动牙刷',
    score: 82,
    searchVolume: 156000,
    trend: 'stable',
    changePercent: 5.8,
    category: '个人护理',
    source: '抖音热榜',
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const forceRefresh = searchParams.get('refresh') === 'true'

    // 检查缓存（除非强制刷新）
    if (!forceRefresh) {
      const cached = request.headers.get('x-cache') === 'hit' 
        ? null 
        : null
      
      // 实际项目中应使用Redis或内存缓存
      // 这里简化处理，直接返回数据
    }

    let words = MOCK_HOT_WORDS

    // 按品类筛选
    if (category) {
      words = words.filter(w => w.category === category)
    }

    // 按热度排序
    words = words.sort((a, b) => b.score - a.score)

    // 限制数量
    words = words.slice(0, limit)

    return NextResponse.json({
      success: true,
      words,
      total: words.length,
      generatedAt: new Date().toISOString(),
      cached: false
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5分钟缓存
        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Hot words error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取热词失败',
        fallback: MOCK_HOT_WORDS.slice(0, 5) // 返回降级数据
      },
      { 
        status: 500,
        headers: {
          'X-Fallback': 'true'
        }
      }
    )
  }
}
