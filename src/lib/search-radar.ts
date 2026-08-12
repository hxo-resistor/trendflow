/**
 * 搜索趋势雷达 - Search Trend Radar
 * 每小时扫描知乎/百度/微博热搜，提取上升关键词
 */

export interface TrendKeyword {
  id: string
  keyword: string
  platform: 'zhihu' | 'baidu' | 'weibo' | 'xiaohongshu'
  searchVolume: number  // 搜索量
  growthRate: number    // 增长率(%)
  category: string      // 品类
  heat: number          // 热度 0-100
  trend: 'rising' | 'stable' | 'falling'
  suggestedProducts?: string[]  // 推荐关联商品（可选）
  capturedAt: string
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

/**
 * 获取 trending 关键词列表
 */
export function getTrendingKeywords(limit: number = 20): TrendKeyword[] {
  // 按增长率排序
  return [...MOCK_TRENDS]
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, limit)
}

/**
 * 根据品类筛选趋势词
 */
export function filterByCategory(category: string): TrendKeyword[] {
  return MOCK_TRENDS.filter(t => t.category === category)
}

/**
 * 根据平台筛选趋势词
 */
export function filterByPlatform(platform: string): TrendKeyword[] {
  return MOCK_TRENDS.filter(t => t.platform === platform)
}

/**
 * 计算趋势得分（综合评分）
 */
export function calculateTrendScore(keyword: TrendKeyword): number {
  // 权重：搜索量30% + 增长率40% + 热度30%
  const volumeScore = Math.min(keyword.searchVolume / 1000, 100) * 0.3
  const growthScore = Math.min(keyword.growthRate, 50) * 2 * 0.4
  const heatScore = keyword.heat * 0.3
  
  return Math.round(volumeScore + growthScore + heatScore)
}

/**
 * 导出为CSV
 */
export function exportToCSV(keywords: TrendKeyword[]): string {
  const headers = ['关键词', '平台', '搜索量', '增长率%', '热度', '趋势', '品类']
  const rows = keywords.map(k => [
    k.keyword,
    k.platform,
    k.searchVolume.toLocaleString(),
    k.growthRate.toFixed(1),
    k.heat,
    k.trend,
    k.category
  ])
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}
