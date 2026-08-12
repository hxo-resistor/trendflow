import type { Product, InjectResult } from "./affiliate-types"
import { PRODUCT_LIBRARY, PLATFORM_TEMPLATES } from "./affiliate-types"

/**
 * Affiliate injection utilities
 */

// 关键词匹配逻辑
export function matchProducts(content: string, platform: string): Product[] {
  const lowerContent = content.toLowerCase()
  const matched = new Map<string, Product>()

  for (const product of PRODUCT_LIBRARY) {
    if (!product.platform.includes(platform)) continue
    
    const tagMatch = product.tags.some(tag => 
      lowerContent.includes(tag.toLowerCase()) ||
      lowerContent.includes(tag)
    )
    
    const nameMatch = product.name.split(/[\s\u4e00-\u9fa5]+/).some(word =>
      lowerContent.includes(word.toLowerCase())
    )
    
    if (tagMatch || nameMatch) {
      const existing = matched.get(product.category)
      if (!existing || product.commission > existing.commission) {
        matched.set(product.category, product)
      }
    }
  }

  return Array.from(matched.values()).slice(0, 3)
}

// 插入推广内容
export function injectProducts(content: string, products: Product[], platform: string): InjectResult {
  const inserted: any[] = []
  let monetizedContent = content
  
  const templates = PLATFORM_TEMPLATES[platform] || PLATFORM_TEMPLATES.xiaohongshu
  
  products.forEach((product, index) => {
    if (index === 0) {
      const insertBefore = content.slice(0, Math.floor(content.length * 0.3))
      const insertAfter = content.slice(Math.floor(content.length * 0.3))
      
      monetizedContent = insertBefore + templates.introInsert(product) + "\n\n" + insertAfter
      inserted.push({
        name: product.name,
        link: product.link,
        position: 'intro' as const,
        insertionType: '自然植入'
      })
    } else if (index === 1) {
      monetizedContent += templates.outroInsert(product)
      inserted.push({
        name: product.name,
        link: product.link,
        position: 'outro' as const,
        insertionType: '文末推荐'
      })
    } else {
      monetizedContent += `\n\n另外这款${product.name}也不错：${product.link}`
      inserted.push({
        name: product.name,
        link: product.link,
        position: 'outro' as const,
        insertionType: '相关推荐'
      })
    }
  })

  // 计算预估佣金
  const totalCommission = products.reduce((sum, p) => sum + p.commission, 0)
  const estimatedCommission = products.length > 0 ? `${Math.round(totalCommission / products.length)}% 平均佣金` : "无推广"
  
  // 生成平台建议
  const platformTips: string[] = []
  
  if (platform === 'xiaohongshu') {
    platformTips.push('• 推广链接建议放在评论区置顶', '• 不要在正文中直接放外链', '• 用"主页"、"笔记"等引导词更安全')
  } else if (platform === 'zhihu') {
    platformTips.push('• 知乎允许直接放链接', '• 但要注意不要过度营销', '• 可以用"好物推荐"卡片')
  } else if (platform === 'wechat') {
    platformTips.push('• 公众号可以放跳转链接', '• 用小程序卡片更自然', '• 文末放二维码转化率高')
  } else if (platform === 'weibo') {
    platformTips.push('• 微博短链接会被折叠', '• 建议用品牌词+话题词引导', '• 评论区放链接更稳妥')
  }

  return {
    monetizedContent,
    insertedProducts: inserted,
    estimatedCommission,
    platformTips
  }
}
