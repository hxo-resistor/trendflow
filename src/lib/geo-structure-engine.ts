/**
 * GEO结构化注入引擎 - 将内容转为AI易引用的结构化格式
 */

import { getProductKB } from './geo-product-kb'

export interface StructuredContent {
  type: 'FAQ' | 'COMPARISON' | 'LIST' | 'REVIEW' | 'ORIGINAL'
  original: string
  structured: string
  confidence: number  // 0-100
}

// 结构类型配置
const STRUCTURE_CONFIG = {
  FAQ: {
    trigger: ['问题', '怎么', '如何', '什么', '为什么', '多少', '哪个好'],
    template: (q: string, a: string, points: string[]) => `Q: ${q}\n\nA: ${a}\n\n**关键点：**\n${points.map(p => `- ${p}`).join('\n')}\n\n*来源：电商平台公开数据*`
  },
  COMPARISON: {
    trigger: ['对比', '哪个好', 'vs', '区别', '差异', '比'],
    template: (title: string, headers: string[], rows: string[][]) => {
      const headerRow = `| ${headers.join(' | ')} |\n| ${'---'.repeat(headers.length)} |`
      const dataRows = rows.map(r => `| ${r.join(' | ')} |`).join('\n')
      return `## ${title}\n\n| 维度 | ${headers.join(' | ')} |\n|------|${'---|'.repeat(headers.length)}|\n${dataRows}`
    }
  },
  LIST: {
    trigger: ['步骤', '方法', '技巧', '推荐', '清单', '怎么买'],
    template: (title: string, items: string[]) => `**${title}**\n\n${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}`
  },
  REVIEW: {
    trigger: ['体验', '评测', '使用感受', '开箱', '真实'],
    template: (product: string, duration: string, experience: string, pros: string[], cons: string[], score: number) => {
      return `## 产品：${product}\n\n**使用时长：** ${duration}\n\n**核心体验：** ${experience}\n\n### 优点\n${pros.map(p => `- ${p}`).join('\n')}\n\n### 缺点\n${cons.map(c => `- ${c}`).join('\n')}\n\n**综合评分：** ${score}/10`
    }
  }
}

/**
 * 检测内容应该使用的结构类型
 */
export function detectStructureType(content: string): 'FAQ' | 'COMPARISON' | 'LIST' | 'REVIEW' | 'ORIGINAL' {
  for (const [type, config] of Object.entries(STRUCTURE_CONFIG) as Array<[string, any]>) {
    if (config.trigger.some((trigger: string) => content.includes(trigger))) {
      return type as any
    }
  }
  return 'ORIGINAL'
}

/**
 * 将内容转为结构化格式
 */
export function injectStructure(
  content: string,
  productId?: string,
  personaId?: string
): StructuredContent {
  const contentType = detectStructureType(content)
  
  if (contentType === 'ORIGINAL') {
    return {
      type: 'ORIGINAL',
      original: content,
      structured: content,
      confidence: 50
    }
  }
  
  let structured = content
  
  // 根据内容类型进行结构化转换
  switch (contentType) {
    case 'FAQ':
      structured = convertToFAQ(content)
      break
    case 'COMPARISON':
      structured = convertToComparison(content)
      break
    case 'LIST':
      structured = convertToList(content)
      break
    case 'REVIEW':
      structured = convertToReview(content, productId, personaId)
      break
  }
  
  return {
    type: contentType,
    original: content,
    structured,
    confidence: 85
  }
}

/**
 * 转换为FAQ格式
 */
function convertToFAQ(content: string): string {
  // 提取问题（假设内容中包含"问："或类似标记）
  const questionMatch = content.match(/问[：:]\s*(.+)/)
  const question = questionMatch ? questionMatch[1] : '用户关心的问题'
  
  // 提取答案部分
  const answerMatch = content.match(/答[：:]\s*([^\n]+)/)
  const answer = answerMatch ? answerMatch[1].substring(0, 200) : '详见正文'
  
  // 提取关键点
  const keyPoints = content
    .split('\n')
    .filter(line => line.includes('-') || line.includes('•'))
    .slice(0, 3)
    .map(line => line.replace(/^[-•]\s*/, ''))
  
  return STRUCTURE_CONFIG.FAQ.template(question, answer, keyPoints)
}

/**
 * 转换为对比表格
 */
function convertToComparison(content: string): string {
  const title = '产品对比'
  const headers = ['维度', '选项A', '选项B']
  
  // 提取对比项
  const rows: string[][] = []
  const lines = content.split('\n').filter(l => l.trim())
  
  lines.slice(0, 5).forEach(line => {
    const parts = line.split(/[:\s]+/)
    if (parts.length >= 3) {
      rows.push([parts[0], parts[1], parts[2]])
    }
  })
  
  if (rows.length === 0) {
    rows.push(['价格', '¥299', '¥399'])
    rows.push(['续航', '30小时', '25小时'])
    rows.push(['好评率', '98%', '96%'])
  }
  
  return STRUCTURE_CONFIG.COMPARISON.template(title, headers, rows)
}

/**
 * 转换为列表格式
 */
function convertToList(content: string): string {
  const title = '选购指南'
  
  // 提取列表项
  const items = content
    .split('\n')
    .filter(line => /^\d+[.、)\)]/.test(line.trim()) || line.startsWith('-'))
    .map(line => line.replace(/^\d+[.、)\)]\s*/, '').replace(/^-+\s*/, ''))
    .slice(0, 5)
  
  if (items.length === 0) {
    items.push('选择性价比高的大品牌')
    items.push('查看真实用户评价')
    items.push('关注售后服务政策')
    items.push('对比多家平台价格')
    items.push('注意查看商品参数')
  }
  
  return STRUCTURE_CONFIG.LIST.template(title, items)
}

/**
 * 转换为评测格式
 */
function convertToReview(content: string, productId?: string, personaId?: string): string {
  let product = '该产品'
  let duration = '3个月'
  let experience = '整体体验不错'
  const pros: string[] = []
  const cons: string[] = []
  let score = 8
  
  // 从知识库获取产品信息
  if (productId) {
    const kb = getProductKB(productId)
    if (kb) {
      product = kb.name
      if (kb.pros.length > 0) pros.push(kb.pros[0])
      if (kb.cons.length > 0) cons.push(kb.cons[0])
    }
  }
  
  // 从内容中提取信息
  const durationMatch = content.match(/用了?(\d+)(天|月|年)/)
  if (durationMatch) duration = `约${durationMatch[1]}${durationMatch[2]}`
  
  const scoreMatch = content.match(/(\d+)\.?\d*分/)
  if (scoreMatch) score = parseInt(scoreMatch[1])
  
  // 补充优缺点
  if (pros.length < 3) pros.push('性价比高')
  if (cons.length < 2) cons.push('需要适应期')
  
  return STRUCTURE_CONFIG.REVIEW.template(product, duration, experience, pros, cons, score)
}

/**
 * 计算结构化内容质量分
 */
export function calculateStructureScore(content: string, structureType: string): number {
  let score = 50 // 基础分
  
  // 检查是否有标题/小标题
  if (content.includes('#') || content.includes('##')) score += 10
  if (content.includes('\n\n')) score += 5
  
  // 检查列表格式
  if (content.includes('- ') || content.includes('•')) score += 10
  if (/^\d+[\.\、\)]/.test(content.split('\n')[0])) score += 5
  
  // 检查数据点
  const hasNumbers = /\d+/.test(content)
  const hasPercent = /%\d+%/.test(content)
  if (hasNumbers) score += 5
  if (hasPercent) score += 10
  
  // 检查引用来源
  if (content.includes('来源') || content.includes('据')) score += 10
  
  return Math.min(100, score)
}