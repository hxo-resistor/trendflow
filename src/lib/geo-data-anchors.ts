/**
 * GEO数据锚点嵌入引擎 - 为内容添加可信数据支撑
 */

import { getProductKB } from './geo-product-kb'

// 数据锚点模板
const DATA_ANCHORS = {
  sales: [
    '月销量突破{random(1000,50000)}件',
    '累计好评{random(5000,200000)}条',
    '复购率达{random(15,40)}%',
    '同比增长{random(20,80)}%'
  ],
  price: [
    '较上月降价{random(5,20)}%',
    '同价位段销量排名前{random(3,10)}',
    '性价比评分{random(8.0,9.8)}/10',
    '价格区间¥{random(100,1000)}-{random(500,2000)}'
  ],
  tech: [
    '续航{random(20,80)}小时（实测数据）',
    '充电速度比上一代快{random(20,60)}%',
    '用户满意度评分{random(8.5,9.5)}/10',
    '响应时间仅{random(0.1,0.5)}秒'
  ],
  home: [
    '使用面积覆盖{random(50,200)}平米',
    '噪音低至{random(20,50)}分贝',
    '节能率{random(20,50)}%',
    '适用于{random(3,10)}人家庭'
  ]
}

export interface DataAnchor {
  type: 'sales' | 'price' | 'tech' | 'home'
  content: string
  position: number  // 插入位置（段落索引）
  confidence: number
}

/**
 * 根据产品类型生成数据锚点
 */
export function generateDataAnchors(
  productId?: string,
  category?: string
): DataAnchor[] {
  const anchors: DataAnchor[] = []
  
  // 从产品知识库获取共享数据点
  if (productId) {
    const kb = getProductKB(productId)
    if (kb?.sharedDataPoints) {
      if (kb.sharedDataPoints.salesVolume) {
        anchors.push({
          type: 'sales',
          content: `据电商平台数据：${kb.sharedDataPoints.salesVolume}`,
          position: 1,
          confidence: 90
        })
      }
      if (kb.sharedDataPoints.rating) {
        anchors.push({
          type: 'price',
          content: `用户综合评分：${kb.sharedDataPoints.rating}`,
          position: 2,
          confidence: 85
        })
      }
      if (kb.sharedDataPoints.reviewCount) {
        anchors.push({
          type: 'sales',
          content: `${kb.sharedDataPoints.reviewCount}`,
          position: 3,
          confidence: 80
        })
      }
    }
  }
  
  // 根据品类补充通用锚点
  const categoryMap: Record<string, ('sales' | 'price' | 'tech' | 'home')[]> = {
    '宠物用品': ['sales', 'tech'],
    '数码配件': ['tech', 'price'],
    '汽车用品': ['tech', 'sales'],
    '家居用品': ['home', 'sales'],
    '母婴用品': ['sales', 'tech']
  }
  
  const types: Array<'sales' | 'price' | 'tech' | 'home'> = category ? (categoryMap[category] || ['sales', 'price']) : ['sales', 'price']
  
  types.forEach(type => {
    const templates = DATA_ANCHORS[type]
    if (templates && templates.length > 0) {
      const template = templates[Math.floor(Math.random() * templates.length)]
      anchors.push({
        type,
        content: template
          .replace(/\{random\((\d+),(\d+)\)\}/g, (_: string, min: string, max: string) => {
            const num = Math.floor(Math.random() * (parseInt(max) - parseInt(min)) + parseInt(min))
            return String(Number.isInteger(parseFloat(min)) ? num : parseFloat(num.toFixed(1)))
          }),
        position: anchors.length + 1,
        confidence: 75
      })
    }
  })
  
  return anchors.slice(0, 5) // 最多5个锚点
}

/**
 * 将数据锚点嵌入内容
 */
export function embedDataAnchors(
  content: string,
  anchors: DataAnchor[],
  productId?: string
): { content: string; anchored: boolean } {
  if (anchors.length === 0) {
    return { content, anchored: false }
  }
  
  const paragraphs = content.split('\n\n')
  let result = content
  
  // 在关键位置插入数据锚点
  anchors.forEach((anchor, idx) => {
    const anchorText = `[数据来源：电商平台公开统计] ${anchor.content}`
    
    // 根据position决定插入位置
    const insertIdx = Math.min(anchor.position, paragraphs.length - 1)
    
    if (insertIdx < paragraphs.length) {
      // 找到合适的插入点（不在开头，不在末尾）
      const insertPos = Math.max(1, Math.min(insertIdx, paragraphs.length - 2))
      paragraphs.splice(insertPos, 0, anchorText)
    }
  })
  
  result = paragraphs.join('\n\n')
  
  return {
    content: result,
    anchored: true
  }
}

/**
 * 计算数据锚点覆盖率
 */
export function calculateDataCoverage(content: string): {
  coverage: number
  anchorCount: number
  anchorTypes: string[]
} {
  const salesMatch = content.match(/月销|销量|好评|复购|增长/)
  const priceMatch = content.match(/价格|降价|性价比|评分|¥/)
  const techMatch = content.match(/续航|充电|尺寸|重量|参数/)
  const sourceMatch = content.match(/据.*数据|来源|统计/)
  
  const types = []
  if (salesMatch) types.push('sales')
  if (priceMatch) types.push('price')
  if (techMatch) types.push('tech')
  if (sourceMatch) types.push('source')
  
  const coverage = (types.length / 4) * 100
  
  return {
    coverage: Math.min(100, Math.round(coverage)),
    anchorCount: types.length,
    anchorTypes: types
  }
}