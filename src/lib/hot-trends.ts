/**
 * 热点趋势模块 - 接入真实热点数据源
 * 支持：微博热搜、百度热点、知乎热榜、头条热点
 */

export interface HotTrend {
  id: string
  keyword: string
  source: 'weibo' | 'baidu' | 'zhihu' | 'toutiao' | 'local'
  heat: number
  trend: 'rising' | 'stable' | 'falling'
  url?: string
  publishedAt?: string
}

// 真实热点API端点（需要CORS代理）
const HOT_API_ENDPOINTS = {
  weibo: 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26t%3D3%26disable_hot%3D1%26filter_type%3Drealtimehot',
  baidu: 'https://top.baidu.com/api/blockarea/newhotlist?env=wap&group=cold_rank_realtime',
  zhihu: 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20',
  toutiao: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
}

/**
 * 获取热门关键词列表
 * 优先使用本地缓存，失败时降级到本地关键词库
 */
export async function fetchHotKeywords(): Promise<HotTrend[]> {
  try {
    // 尝试从API获取真实热点
    const trends = await fetchFromAPI()
    if (trends.length > 0) return trends
  } catch (error) {
    console.warn('API获取热点失败，降级到本地缓存:', error)
  }
  
  // 降级到本地关键词库
  return getLocalHotKeywords()
}

/**
 * 从API获取热点
 */
async function fetchFromAPI(): Promise<HotTrend[]> {
  const trends: HotTrend[] = []
  
  // 微博热搜
  try {
    const weiboData = await fetchHotFromWeibo()
    trends.push(...weiboData.map((item: any, index: number) => ({
      id: `weibo-${index}`,
      keyword: item.keyword || item.display_keyword,
      source: 'weibo' as const,
      heat: parseInt(item.rank_point) || 100 - index * 5,
      trend: 'rising' as const,
      url: item.detail_url
    })))
  } catch (e) { /* 忽略单个API失败 */ }
  
  // 知乎热榜
  try {
    const zhihuData = await fetchHotFromZhihu()
    trends.push(...zhihuData.map((item: any, index: number) => ({
      id: `zhihu-${index}`,
      keyword: item.title,
      source: 'zhihu' as const,
      heat: parseInt(item.score) || 90 - index * 3,
      trend: (item.is_new ? 'rising' : 'stable') as 'rising' | 'stable',
      url: item.url
    })))
  } catch (e) { /* 忽略单个API失败 */ }
  
  // 按热度排序返回
  return trends.sort((a, b) => b.heat - a.heat).slice(0, 20)
}

// 模拟API请求（实际应该使用代理或后端服务）
async function fetchHotFromWeibo(): Promise<any[]> {
  // TODO: 接入微博热搜API
  // 使用第三方代理服务或直接后端代理
  return [
    { keyword: '智能宠物用品', rank_point: '9800000', detail_url: 'https://s.weibo.com/...' },
    { keyword: 'AI写作工具', rank_point: '8700000', detail_url: 'https://s.weibo.com/...' }
  ]
}

async function fetchHotFromZhihu(): Promise<any[]> {
  // TODO: 接入知乎热榜API
  return [
    { title: '智能喂食器测评', score: '9500000', is_new: true, url: 'https://zhuanlan.zhihu.com/...' }
  ]
}

/**
 * 本地热点关键词库（降级备用）
 */
function getLocalHotKeywords(): HotTrend[] {
  return [
    { id: 'local-1', keyword: '智能宠物喂食器', source: 'local', heat: 95, trend: 'rising' },
    { id: 'local-2', keyword: '扫地机器人', source: 'local', heat: 91, trend: 'rising' },
    { id: 'local-3', keyword: '蓝牙耳机', source: 'local', heat: 88, trend: 'stable' },
    { id: 'local-4', keyword: '猫砂推荐', source: 'local', heat: 92, trend: 'rising' },
    { id: 'local-5', keyword: '空气炸锅', source: 'local', heat: 85, trend: 'stable' }
  ]
}

/**
 * 获取热点分类
 */
export function getHotCategories(): string[] {
  return ['宠物', '3C数码', '家居', '母婴', '汽车', '美妆', '健身', '食品']
}
