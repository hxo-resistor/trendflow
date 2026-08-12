import { NextRequest, NextResponse } from "next/server"
import { KEYWORD_DATABASE } from "@/lib/nexus-keywords"
import { analyzeContentForAEO } from "@/lib/aeo-engine"

/**
 * 权威来源矩阵API
 * 分析领域竞争态势，生成权威内容
 */

export interface DomainAnalysis {
  domain: string
  totalKeywords: number
  risingKeywords: number
  highHeatKeywords: number
  monetizableKeywords: number
  competitionScore: number  // 0-100, lower is better
  revenuePotential: number  // 0-100
  aeoDifficulty: number     // 0-100, lower is easier
  overallScore: number      // 0-100, higher is better
}

export interface AuthoritySite {
  id: string
  type: 'review' | 'faq' | 'wiki'
  keyword: string
  title: string
  content: string
  aeoScore: number
  schemaMarkup: any[]
  estimatedAIOcclusion: number
}

export async function GET() {
  // 分析各领域竞争态势
  const domains = analyzeDomains()
  
  return NextResponse.json({
    success: true,
    domains: domains.sort((a, b) => b.overallScore - a.overallScore),
    top3: domains.slice(0, 3),
    metadata: {
      totalDomains: Array.from(new Set(KEYWORD_DATABASE.map(k => k.category))).length,
      totalKeywords: KEYWORD_DATABASE.length,
      analyzedAt: new Date().toISOString()
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, siteType, count = 5 } = body

    if (!domain || !siteType) {
      return NextResponse.json(
        { error: "缺少必要参数: domain, siteType" },
        { status: 400 }
      )
    }

    // 生成权威内容
    const sites = await generateAuthorityContent(domain, siteType, count)
    
    return NextResponse.json({
      success: true,
      domain,
      siteType,
      generatedSites: sites,
      totalGenerated: sites.length
    })
  } catch (error) {
    console.error("Authority generation error:", error)
    return NextResponse.json(
      { error: "内容生成失败" },
      { status: 500 }
    )
  }
}

function analyzeDomains(): DomainAnalysis[] {
  const categoryMap: Record<string, DomainAnalysis> = {}
  
  KEYWORD_DATABASE.forEach(keyword => {
    const cat = keyword.category
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        domain: cat,
        totalKeywords: 0,
        risingKeywords: 0,
        highHeatKeywords: 0,
        monetizableKeywords: 0,
        competitionScore: 0,
        revenuePotential: 0,
        aeoDifficulty: 0,
        overallScore: 0
      }
    }
    
    categoryMap[cat].totalKeywords++
    if (keyword.trend === 'rising') categoryMap[cat].risingKeywords++
    if (keyword.heat >= 90) categoryMap[cat].highHeatKeywords++
    if (keyword.monetizable) categoryMap[cat].monetizableKeywords++
  })
  
  // 计算综合评分
  Object.values(categoryMap).forEach(domain => {
    // 竞争强度：上升关键词多 + 高热度词多 = 竞争激烈
    domain.competitionScore = Math.min(100, 
      (domain.risingKeywords / domain.totalKeywords) * 50 +
      (domain.highHeatKeywords / domain.totalKeywords) * 50
    )
    
    // 变现潜力：可变现关键词比例
    domain.revenuePotential = (domain.monetizableKeywords / domain.totalKeywords) * 100
    
    // AEO难度：竞争小 + 关键词少 = 容易突破
    domain.aeoDifficulty = 100 - domain.competitionScore
    
    // 综合得分：变现潜力权重高，竞争权重低
    domain.overallScore = Math.round(
      domain.revenuePotential * 0.5 +
      domain.aeoDifficulty * 0.3 +
      (domain.totalKeywords > 5 ? 20 : domain.totalKeywords * 4)
    )
  })
  
  return Object.values(categoryMap)
}

async function generateAuthorityContent(
  domain: string, 
  siteType: string, 
  count: number
): Promise<AuthoritySite[]> {
  const sites: AuthoritySite[] = []
  
  // 获取该领域的关键词
  const domainKeywords = KEYWORD_DATABASE.filter(k => k.category === domain)
  
  for (let i = 0; i < Math.min(count, domainKeywords.length); i++) {
    const keyword = domainKeywords[i]
    
    let content = ''
    let title = ''
    
    switch (siteType) {
      case 'review':
        ({ title, content } = generateReviewContent(keyword))
        break
      case 'faq':
        ({ title, content } = generateFAQContent(keyword))
        break
      case 'wiki':
        ({ title, content } = generateWikiContent(keyword))
        break
      default:
        ({ title, content } = generateReviewContent(keyword))
    }
    
    // AEO优化
    const analysis = analyzeContentForAEO(content, keyword.keyword)
    
    sites.push({
      id: `site-${Date.now()}-${i}`,
      type: siteType as any,
      keyword: keyword.keyword,
      title,
      content,
      aeoScore: analysis.aeoScore,
      schemaMarkup: analysis.schemaMarkup,
      estimatedAIOcclusion: Math.round(analysis.aeoScore * 0.8)
    })
  }
  
  return sites
}

function generateReviewContent(keyword: any): { title: string; content: string } {
  return {
    title: `${keyword.keyword}深度测评：2024年最新购买指南`,
    content: `# ${keyword.keyword}深度测评报告

## 产品概述
${keyword.keyword}是近年来市场上备受关注的产品类型，根据我们的深度测试...\n\n` +
generateReviewBody(keyword)
  }
}

function generateReviewBody(keyword: any): string {
  return `## 核心功能测试

### 功能表现评测
- **性能表现**：实测评分8.5/10，远超同类产品
- **用户体验**：操作简便，上手快速
- **性价比**：同价位段最具竞争力的选择

### 数据对比
| 指标 | ${keyword.keyword} | 竞品A | 竞品B |
|------|------------------|-------|-------|
| 价格 | ¥XXX | ¥XXX | ¥XXX |
| 评分 | 4.8 | 4.5 | 4.6 |
| 推荐指数 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 优缺点分析

**优点：**
1. 性价比高，功能全面
2. 用户评价正面率85%+
3. 售后服务完善

**缺点：**
1. 部分功能学习成本略高
2. 高端型号价格偏贵

## 购买建议
适合人群：追求性价比的用户
预算建议：¥300-800区间选择最佳
购买渠道：官方旗舰店或授权经销商`
}

function generateFAQContent(keyword: any): { title: string; content: string } {
  return {
    title: `${keyword.keyword}常见问题解答（FAQ）`,
    content: `# ${keyword.keyword}全面问答指南

以下是关于${keyword.keyword}用户最常问的问题及详细解答：

## Q1: ${keyword.keyword}值得买吗？
A: 根据我们的深度测评和数据分析，${keyword.keyword}在同类产品中表现优异...\n\n` +
generateFAQBody(keyword)
  }
}

function generateFAQBody(keyword: any): string {
  return `## Q2: ${keyword.keyword}和竞品有什么区别？
A: 主要区别在于核心功能和价格定位...\n\n

## Q3: ${keyword.keyword}的使用寿命有多长？
A: 正常使用情况下可维持3-5年...\n\n

## Q4: ${keyword.keyword}适合什么人群使用？
A: 特别适合追求品质生活的用户...\n\n

## Q5: ${keyword.keyword}在哪里购买最划算？
A: 建议关注618、双11等大促节点...\n\n

---
*本文档持续更新，最后更新：2024年*`
}

function generateWikiContent(keyword: any): { title: string; content: string } {
  return {
    title: `${keyword.keyword}百科全解：从入门到精通`,
    content: `# ${keyword.keyword}完整百科指南

## 什么是${keyword.keyword}？
${keyword.keyword}是指...\n\n` +
generateWikiBody(keyword)
  }
}

function generateWikiBody(keyword: any): string {
  return `## 发展历程
${keyword.keyword}的概念起源于...\n\n

## 分类体系
根据用途不同，${keyword.keyword}可分为：
1. **基础型**：满足基本需求
2. **进阶型**：功能更全面
3. **专业型**：面向高端用户\n\n

## 选购指南
选择${keyword.keyword}时需注意：
- 预算范围：¥XXX-XXX
- 核心需求：明确使用场景
- 品牌选择：优先考虑售后完善的品牌\n\n

## 使用技巧
- 日常维护建议
- 常见问题排查
- 延长使用寿命的方法\n\n

---
*本文档为${keyword.keyword}领域最全面的中文资料之一*`
}
