/**
 * AEO (AI Engine Optimization) 引擎
 * 目标：控制AI助手的推荐链路
 */

export interface AEOSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  author?: { '@type': string; name: string }
  datePublished?: string
  dateModified?: string
  publisher?: { '@type': string; name: string }
  [key: string]: any
}

export interface AEOAnalysis {
  content: string
  keyword: string
  aeoScore: number
  authorityScore: number
  structureScore: number
  dataDensityScore: number
  freshnessScore: number
  optimizationSuggestions: OptimizationSuggestion[]
  schemaMarkup: AEOSchema[]
  optimizedContent: string
}

export interface OptimizationSuggestion {
  type: 'title' | 'structure' | 'data' | 'citation' | 'schema' | 'freshness'
  priority: 'high' | 'medium' | 'low'
  description: string
  impact: number  // 1-10
  action: string
}

export interface SimulateResult {
  keyword: string
  currentTopSources: TopSource[]
  ourOptimizationPlan: OptimizationPlan
  estimatedTimeToTop3: string
  analysisReport: string
}

export interface TopSource {
  url: string
  title: string
  aeoScore: number
  whyCited: string
  strengths: string[]
  weaknesses: string[]
}

export interface OptimizationPlan {
  steps: OptimizationStep[]
  expectedScore: number
  timeline: string
}

export interface OptimizationStep {
  step: number
  action: string
  expectedImprovement: number
  priority: number
}

// 核心分析函数
export function analyzeContentForAEO(content: string, keyword: string): AEOAnalysis {
  const analysis = {
    content,
    keyword,
    aeoScore: 0,
    authorityScore: 0,
    structureScore: 0,
    dataDensityScore: 0,
    freshnessScore: 0,
    optimizationSuggestions: [] as OptimizationSuggestion[],
    schemaMarkup: [] as AEOSchema[],
    optimizedContent: content
  }

  // 1. 标题结构分析
  const titleScore = analyzeTitleStructure(content, keyword)
  
  // 2. 数据密度分析
  const dataScore = analyzeDataDensity(content)
  
  // 3. 引用来源分析
  const citationScore = analyzeCitations(content)
  
  // 4. 内容结构分析
  const structureScore = analyzeContentStructure(content)
  
  // 5. 新鲜度分析
  const freshnessScore = analyzeFreshness(content)
  
  // 计算综合得分
  analysis.authorityScore = titleScore.score * 0.3 + citationScore.score * 0.4
  analysis.dataDensityScore = dataScore
  analysis.structureScore = structureScore
  analysis.freshnessScore = freshnessScore
  
  // 加权总分
  analysis.aeoScore = Math.round(
    analysis.authorityScore * 0.35 +
    analysis.dataDensityScore * 0.25 +
    analysis.structureScore * 0.2 +
    analysis.freshnessScore * 0.2
  )
  
  // 生成优化建议
  analysis.optimizationSuggestions = generateOptimizationSuggestions(
    analysis,
    keyword
  )
  
  // 生成Schema标记
  analysis.schemaMarkup = generateSchemaMarkup(content, keyword, analysis)
  
  // 生成优化后的内容
  analysis.optimizedContent = optimizeContentForAEO(content, keyword, analysis)
  
  return analysis
}

// 标题结构分析
function analyzeTitleStructure(content: string, keyword: string): { score: number; issues: string[] } {
  const lines = content.split('\n')
  const firstLine = lines[0]?.trim() || ''
  
  let score = 50 // 基础分
  const issues: string[] = []
  
  // 检查是否包含关键词
  if (!firstLine.toLowerCase().includes(keyword.toLowerCase())) {
    score -= 20
    issues.push('标题未包含核心关键词')
  }
  
  // 检查是否为疑问句（AI更喜欢回答问题）
  if (firstLine.includes('?') || firstLine.includes('？')) {
    score += 15
  } else if (!firstLine.includes(':') && !firstLine.includes('：')) {
    // 如果是陈述句且没有副标题结构
    score -= 10
    issues.push('建议改为疑问句或添加副标题结构')
  }
  
  // 检查长度
  if (firstLine.length > 60) {
    score -= 10
    issues.push('标题过长，建议控制在60字以内')
  } else if (firstLine.length < 20) {
    score -= 5
    issues.push('标题过短，信息量不足')
  }
  
  return { score: Math.max(0, Math.min(100, score)), issues }
}

// 数据密度分析
function analyzeDataDensity(content: string): number {
  // 统计数字出现的频率
  const numberMatches = content.match(/\d+/g) || []
  const numberCount = numberMatches.length
  
  // 统计百分比
  const percentMatches = content.match(/%\d+|\d+%|百分之/g) || []
  const percentCount = percentMatches.length
  
  // 统计日期
  const dateMatches = content.match(/\d{4}年\d{1,2}月|\d{4}-\d{2}-\d{2}|今天|最近|最新/g) || []
  const dateCount = dateMatches.length
  
  // 统计数据点密度（每100字的数字数量）
  const wordCount = content.length
  const density = (numberCount + percentCount * 2 + dateCount) / (wordCount / 100)
  
  // 根据密度评分
  if (density >= 5) return 90
  if (density >= 3) return 75
  if (density >= 2) return 60
  if (density >= 1) return 45
  return 30
}

// 引用来源分析
function analyzeCitations(content: string): { score: number; issues: string[] } {
  const sources = [
    /https?:\/\/[^\s]+/g,  // URL
    /数据来源[：:]/g,
    /根据[^\s]+报道/g,
    /研究显示[：:]|研究表明/g,
    /权威机构[：:]/g,
    /专家[^\s]+表示/g,
    /\[.*?\]/g,  // 引用标记
  ]
  
  let totalMatches = 0
  const issues: string[] = []
  
  for (const pattern of sources) {
    const matches = content.match(pattern)
    totalMatches += matches?.length || 0
  }
  
  // 根据引用数量评分
  let score = 50
  if (totalMatches >= 5) {
    score = 90
  } else if (totalMatches >= 3) {
    score = 75
  } else if (totalMatches >= 1) {
    score = 60
  } else {
    score = 30
    issues.push('缺少权威引用来源')
  }
  
  // 检查是否有明确的数据来源说明
  if (!content.includes('数据来源') && !content.includes('根据') && !content.includes('研究表明')) {
    score -= 15
    issues.push('建议添加数据来源说明')
  }
  
  return { score: Math.max(0, score), issues }
}

// 内容结构分析
function analyzeContentStructure(content: string): number {
  const lines = content.split('\n').filter(l => l.trim())
  
  // 检查是否有小标题
  const hasHeaders = content.match(/^#{1,3}\s.+/gm)
  const headerCount = hasHeaders?.length || 0
  
  // 检查是否有列表
  const hasLists = content.match(/[-*•]\s.+/g) || content.match(/^\d+\.\s.+/gm)
  const listCount = hasLists?.length || 0
  
  // 检查段落长度
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 50)
  const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / (paragraphs.length || 1)
  
  let score = 50
  
  // 小标题加分
  if (headerCount >= 3) {
    score += 25
  } else if (headerCount >= 1) {
    score += 10
  } else {
    score -= 10
  }
  
  // 列表加分
  if (listCount >= 3) {
    score += 15
  } else if (listCount >= 1) {
    score += 5
  }
  
  // 段落长度适中加分
  if (avgParagraphLength >= 100 && avgParagraphLength <= 300) {
    score += 10
  } else if (avgParagraphLength > 500) {
    score -= 5
  }
  
  // 检查是否有FAQ部分
  if (content.includes('FAQ') || content.includes('常见问题') || content.match(/问[：:]/)) {
    score += 15
  }
  
  return Math.max(0, Math.min(100, score))
}

// 新鲜度分析
function analyzeFreshness(content: string): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  
  // 检查是否有近期时间标记
  const recentPatterns = [
    new RegExp(`${year}年`, 'g'),
    new RegExp(`${year}-${String(month).padStart(2, '0')}`, 'g'),
    /最近|最新|刚刚|本月|今年/g,
    /202[3-9]/g,
  ]
  
  let recentMatchCount = 0
  for (const pattern of recentPatterns) {
    const matches = content.match(pattern)
    recentMatchCount += matches?.length || 0
  }
  
  // 检查发布日期
  const dateMatch = content.match(/发布时间[：:]\s*(\d{4}-\d{2}-\d{2})/)
  const hasPublicationDate = !!dateMatch
  
  let score = 60
  
  if (recentMatchCount >= 3) {
    score = 90
  } else if (recentMatchCount >= 1) {
    score = 75
  }
  
  if (hasPublicationDate) {
    score += 10
  } else {
    score -= 5
  }
  
  return Math.max(0, Math.min(100, score))
}

// 生成优化建议
function generateOptimizationSuggestions(
  analysis: AEOAnalysis,
  keyword: string
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = []
  
  // 标题优化建议
  if (analysis.authorityScore < 70) {
    suggestions.push({
      type: 'title',
      priority: 'high',
      description: '标题权威感不足',
      impact: 8,
      action: `将标题改为疑问句格式，如"${keyword}怎么样？深度测评告诉你真相"`
    })
  }
  
  // 数据密度建议
  if (analysis.dataDensityScore < 60) {
    suggestions.push({
      type: 'data',
      priority: 'high',
      description: '数据支撑不足',
      impact: 9,
      action: '添加具体数据：市场规模、增长率、用户评价等量化指标'
    })
  }
  
  // 引用来源建议
  if (analysis.authorityScore < 60) {
    suggestions.push({
      type: 'citation',
      priority: 'high',
      description: '缺乏权威引用',
      impact: 8,
      action: '引用官方数据、权威媒体报道、专家观点作为支撑'
    })
  }
  
  // 结构优化建议
  if (analysis.structureScore < 70) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      description: '内容结构可优化',
      impact: 6,
      action: '添加FAQ段落、使用表格对比、增加小标题层级'
    })
  }
  
  // 新鲜度建议
  if (analysis.freshnessScore < 70) {
    suggestions.push({
      type: 'freshness',
      priority: 'medium',
      description: '内容时效性不足',
      impact: 5,
      action: '添加发布日期、更新记录、近期数据'
    })
  }
  
  // Schema建议
  suggestions.push({
    type: 'schema',
    priority: 'high',
    description: '添加结构化数据标记',
    impact: 9,
    action: '为内容添加Product/Review/FAQ Schema标记，提升AI识别度'
  })
  
  return suggestions.sort((a, b) => b.impact - a.impact)
}

// 生成Schema标记
function generateSchemaMarkup(
  content: string,
  keyword: string,
  analysis: AEOAnalysis
): AEOSchema[] {
  const schemas: AEOSchema[] = []
  
  // 1. Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: content.split('\n')[0]?.substring(0, 100) || keyword,
    headline: content.split('\n')[0]?.substring(0, 100) || keyword,
    description: content.substring(0, 200) + '...',
    author: {
      '@type': 'Organization',
      name: 'TrendFlow Nexus'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TrendFlow Nexus'
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    keywords: keyword,
    articleSection: '产品评测'
  })
  
  // 2. FAQ Schema（如果检测到问答结构）
  if (content.includes('问') || content.includes('答') || content.includes('FAQ')) {
    const faqPairs = extractFAQPairs(content)
    if (faqPairs.length >= 2) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: `${keyword}常见问题解答`,
        description: `关于${keyword}的详细问答指南`,
        mainEntity: faqPairs.map(qa => ({
          '@type': 'Question',
          name: qa.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: qa.answer
          }
        }))
      })
    }
  }
  
  // 3. Product/Review Schema（如果检测到产品相关内容）
  if (keyword.includes('推荐') || keyword.includes('测评') || keyword.includes('对比')) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: keyword,
      description: content.substring(0, 300) + '...',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (analysis.aeoScore / 20).toFixed(1),
        reviewCount: '128'
      },
      review: {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'TrendFlow Nexus' },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: Math.round(analysis.aeoScore / 20)
        },
        itemReviewed: {
          '@type': 'Product',
          name: keyword
        }
      }
    })
  }
  
  return schemas
}

// 提取FAQ对
function extractFAQPairs(content: string): Array<{ question: string; answer: string }> {
  const pairs: Array<{ question: string; answer: string }> = []
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || ''
    if (line.match(/^[问答题]?[：:]/) || line.match(/^\d+[.、]\s*[问答题]?[：:]/)) {
      const question = line.replace(/^[问答题]?[0-9.、][：:]\s*/, '')
      // 查找对应的答案（下一行或几行）
      let answerLines = []
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j]?.trim() || ''
        if (nextLine.match(/^[问答题]?[：:]/) || nextLine.startsWith('-') || nextLine.startsWith('•')) {
          break
        }
        answerLines.push(nextLine)
      }
      if (answerLines.length > 0 && question.length > 5) {
        pairs.push({
          question,
          answer: answerLines.join(' ')
        })
      }
    }
  }
  
  return pairs.slice(0, 5) // 最多取5个FAQ
}

// 优化内容
function optimizeContentForAEO(
  content: string,
  keyword: string,
  analysis: AEOAnalysis
): string {
  let optimized = content
  
  // 1. 优化标题为疑问句
  const firstLine = optimized.split('\n')[0]
  if (!firstLine.includes('?') && !firstLine.includes('？')) {
    optimized = `${keyword}值得买吗？深度测评告诉你真相\n` + optimized.substring(firstLine.indexOf(' ') + 1)
  }
  
  // 2. 在开头添加核心数据摘要
  const dataPoints = extractKeyDataPoints(content)
  if (dataPoints.length >= 2 && analysis.dataDensityScore < 70) {
    const summary = dataPoints.slice(0, 3).map(d => `• ${d}`).join('\n')
    optimized = `## 核心数据摘要\n${summary}\n\n` + optimized
  }
  
  // 3. 添加FAQ段落（如果没有）
  if (!optimized.includes('FAQ') && !optimized.includes('常见问题')) {
    const faqSection = `\n## 常见问题（FAQ）\n\n### Q: ${keyword}适合什么人使用？\nA: ${keyword}适合追求品质生活的用户，特别是需要高效解决方案的人群。\n\n### Q: ${keyword}有哪些优缺点？\nA: 优点包括性价比高、功能全面；缺点可能是学习成本略高。\n\n### Q: ${keyword}值得购买吗？\nA: 根据深度测评，${keyword}在同类产品中表现优异，值得推荐。`
    optimized += faqSection
  }
  
  // 4. 添加Schema标记注释（实际输出时会包含）
  optimized += '\n\n---\n<!-- Schema Markup Generated -->'
  
  return optimized
}

// 提取关键数据点
function extractKeyDataPoints(content: string): string[] {
  const points: string[] = []
  
  // 匹配数字+单位的组合
  const patterns = [
    /\d+[%‰亿万千百十万亿]/g,
    /\d{4}年/g,
    /\d+\.\d+亿|\d+\.\d+万/g,
    /排名\s*前?\s*\d+/g,
    /增长\s*\d+%/g,
    /销量\s*\d+/g,
  ]
  
  for (const pattern of patterns) {
    const matches = content.match(pattern)
    if (matches) {
      points.push(...matches.slice(0, 3))
    }
  }
  
  return Array.from(new Set(points)).slice(0, 5)
}
