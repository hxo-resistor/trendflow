/**
 * GEO AI引用评分器 - 评估内容被AI引用的概率
 */

export interface GEOScore {
  total: number           // 总分0-100
  structureScore: number  // 结构化程度（0-25）
  dataScore: number       // 数据支撑度（0-25）
  semanticScore: number   // 语义完整性（0-25）
  authorityScore: number  // 可信度信号（0-25）
  breakdown: {
    structure: string[]
    data: string[]
    semantic: string[]
    authority: string[]
  }
}

// 评分阈值
export const GEO_THRESHOLD = {
  publish: 70,   // ≥70分才能发布
  optimal: 85,   // ≥85分为优质内容
  reject: 50     // <50分需要重写
}

/**
 * 计算GEO综合评分
 */
export function calculateGEOScore(
  content: string,
  options: {
    productId?: string
    platform?: string
    requireStructure?: boolean
  } = {}
): GEOScore {
  const score: GEOScore = {
    total: 0,
    structureScore: 0,
    dataScore: 0,
    semanticScore: 0,
    authorityScore: 0,
    breakdown: {
      structure: [],
      data: [],
      semantic: [],
      authority: []
    }
  }
  
  // 1. 结构化评分 (0-25)
  score.structureScore = calculateStructureScore(content, options)
  
  // 2. 数据支撑评分 (0-25)
  score.dataScore = calculateDataScore(content)
  
  // 3. 语义完整性评分 (0-25)
  score.semanticScore = calculateSemanticScore(content)
  
  // 4. 可信度评分 (0-25)
  score.authorityScore = calculateAuthorityScore(content, options.productId)
  
  // 总分
  score.total = score.structureScore + score.dataScore + 
                score.semanticScore + score.authorityScore
  
  return score
}

/**
 * 计算结构化得分
 */
function calculateStructureScore(content: string, options: any): number {
  let score = 0
  
  // 检查标题层级 (0-5)
  if (content.includes('#')) score += 2
  if (content.includes('##')) score += 2
  if (content.includes('###')) score += 1
  
  // 检查列表格式 (0-8)
  const listMatches = content.match(/^-|\d+[\.\、\)]/g) || []
  score += Math.min(listMatches.length * 2, 8)
  
  // 检查表格格式 (0-5)
  if (content.includes('|')) score += 5
  
  // 检查FAQ格式 (0-5)
  if (content.includes('Q:') && content.includes('A:')) score += 5
  
  // 分段合理 (0-2)
  const paragraphs = content.split('\n\n')
  if (paragraphs.length >= 3 && paragraphs.length <= 10) score += 2
  
  return Math.min(score, 25)
}

/**
 * 计算数据支撑得分
 */
function calculateDataScore(content: string): number {
  let score = 0
  
  // 数字密度 (0-8)
  const numbers = content.match(/\d+/g) || []
  score += Math.min(numbers.length, 8)
  
  // 百分比 (0-4)
  const percentages = content.match(/%\d+%?/g) || []
  score += Math.min(percentages.length * 2, 4)
  
  // 数据来源标注 (0-4)
  const sourceMatches = content.match(/据.*数据|来源|统计|报告显示/g) || []
  score += Math.min(sourceMatches.length * 2, 4)
  
  // 具体数值范围 (0-4)
  const rangeMatches = content.match(/¥\d+-\d+|\d+至\d+|\d+以上|\d+以内/g) || []
  score += Math.min(rangeMatches.length * 2, 4)
  
  // 引用标记 (0-4)
  const quoteMatches = content.match(/\[数据|据.*称|报告显示/g) || []
  score += Math.min(quoteMatches.length * 2, 4)
  
  return Math.min(score, 25)
}

/**
 * 计算语义完整性得分
 */
function calculateSemanticScore(content: string): number {
  let score = 0
  
  // 内容长度 (0-6)
  const wordCount = content.length
  if (wordCount >= 500 && wordCount <= 2000) score += 6
  else if (wordCount >= 300) score += 4
  else if (wordCount >= 100) score += 2
  
  // 完整段落 (0-5)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20)
  if (paragraphs.length >= 3) score += 5
  else if (paragraphs.length >= 2) score += 3
  
  // 首尾呼应 (0-4)
  const lines = content.split('\n')
  if (lines.length >= 2) {
    const firstLine = lines[0].substring(0, 50)
    const lastLine = lines[lines.length - 1].substring(0, 50)
    if (firstLine && lastLine) score += 2
  }
  
  // 过渡词使用 (0-4)
  const transitionWords = ['首先', '其次', '再次', '最后', '总之', '综上所述', '因此', '然而']
  const transitionCount = transitionWords.filter(w => content.includes(w)).length
  score += Math.min(transitionCount, 4)
  
  // 逻辑连贯性 (0-6)
  const hasQuestion = content.includes('?') || content.includes('？')
  const hasAnswer = content.includes('答') || content.includes('答案') || content.includes('回答')
  if (hasQuestion && hasAnswer) score += 3
  if (content.includes('因为') && content.includes('所以')) score += 3
  
  return Math.min(score, 25)
}

/**
 * 计算可信度得分
 */
function calculateAuthorityScore(content: string, productId?: string): number {
  let score = 0
  
  // 专业术语使用 (0-5)
  const techTerms = ['参数', '规格', '性能', '配置', '品牌', '型号', '认证', '检测']
  const termCount = techTerms.filter(t => content.includes(t)).length
  score += Math.min(termCount, 5)
  
  // 时间戳/日期 (0-3)
  const datePattern = /\d{4}[年\-]\d{1,2}[月\-]\d{1,2}/g
  const dates = content.match(datePattern) || []
  score += Math.min(dates.length, 3)
  
  // 产品ID关联 (0-4)
  if (productId) {
    score += 4
  }
  
  // 真实体验表达 (0-5)
  const experienceWords = ['亲测', '实际使用', '用了', '体验', '感受', '评价']
  const expCount = experienceWords.filter(w => content.includes(w)).length
  score += Math.min(expCount, 5)
  
  // 优缺点平衡 (0-4)
  const hasPros = content.includes('优点') || content.includes('好处') || content.includes('优势')
  const hasCons = content.includes('缺点') || content.includes('不足') || content.includes('劣势')
  if (hasPros && hasCons) score += 4
  else if (hasPros || hasCons) score += 2
  
  // 免责声明 (0-4)
  const disclaimer = content.includes('仅供参考') || content.includes('个人看法') || content.includes('主观感受')
  if (disclaimer) score += 4
  
  return Math.min(score, 25)
}

/**
 * 获取优化建议
 */
export function getOptimizationSuggestions(score: GEOScore): string[] {
  const suggestions: string[] = []
  
  if (score.structureScore < 15) {
    suggestions.push('增加标题层级和列表格式，提升结构化程度')
  }
  if (score.dataScore < 15) {
    suggestions.push('添加更多具体数据和来源引用')
  }
  if (score.semanticScore < 15) {
    suggestions.push('完善内容结构，确保逻辑连贯')
  }
  if (score.authorityScore < 15) {
    suggestions.push('增加专业表述和真实体验细节')
  }
  
  return suggestions
}

/**
 * 判断是否达到发布标准
 */
export function canPublish(score: GEOScore): {
  canPublish: boolean
  level: 'optimal' | 'publishable' | 'needs_improvement' | 'reject'
  message: string
} {
  if (score.total >= GEO_THRESHOLD.optimal) {
    return {
      canPublish: true,
      level: 'optimal',
      message: `优秀！GEO评分${score.total}分，内容质量高，容易被AI引用`
    }
  }
  if (score.total >= GEO_THRESHOLD.publish) {
    return {
      canPublish: true,
      level: 'publishable',
      message: `可发布！GEO评分${score.total}分，符合基础标准`
    }
  }
  if (score.total >= GEO_THRESHOLD.reject) {
    return {
      canPublish: false,
      level: 'needs_improvement',
      message: `需要优化！GEO评分${score.total}分，建议修改后重新评估`
    }
  }
  return {
    canPublish: false,
    level: 'reject',
    message: `评分过低！GEO评分${score.total}分，建议重写内容`
  }
}