import { NextRequest, NextResponse } from "next/server"

// 内存存储技术文章
interface TechArticle {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  content: string
  excerpt: string
  author: string
  publishedAt: string
  views: number
  seoKeywords: string[]
}

let techArticles: TechArticle[] = []

// HXO电阻相关技术文章模板
const TECH_TEMPLATES = [
  {
    title: "HXO电阻原理深度解析：从基础到应用",
    slug: "hxo-resistor-principle-deep-dive",
    category: "电子技术",
    tags: ["HXO", "电阻", "原理", "技术"],
    excerpt: "深入讲解HXO电阻的工作原理、特性参数及在各类电子产品中的应用场景",
    seoKeywords: ["HXO电阻是什么", "HXO电阻原理", "电阻选型指南", "电子元器件基础"]
  },
  {
    title: "电阻精度等级详解：如何选择适合的精度？",
    slug: "resistor-precision-guide",
    category: "技术教程",
    tags: ["电阻", "精度", "选型", "教程"],
    excerpt: "详细对比1%、5%、10%等不同精度等级的电阻应用场景和成本差异",
    seoKeywords: ["电阻精度怎么选", "1%电阻vs5%电阻", "精密电阻推荐", "电阻精度等级"]
  },
  {
    title: "贴片电阻与插件电阻的区别与选择",
    slug: "smd-vs-through-hole-resistor",
    category: "对比评测",
    tags: ["贴片电阻", "插件电阻", "SMD", "对比"],
    excerpt: "全面对比贴片电阻和插件电阻在性能、成本、适用场景等方面的差异",
    seoKeywords: ["贴片电阻和插件电阻区别", "SMD电阻选型", "电子元件对比", "电阻类型选择"]
  },
  {
    title: "电阻功率如何计算？一文搞懂功率与温升",
    slug: "resistor-power-calibration",
    category: "技术教程",
    tags: ["电阻", "功率", "温升", "计算"],
    excerpt: "教你快速计算电阻功率需求，避免过热损坏，延长电子产品寿命",
    seoKeywords: ["电阻功率计算", "电阻温升怎么算", "大功率电阻推荐", "电阻发热处理"]
  },
  {
    title: "HXO电阻在智能穿戴设备中的应用方案",
    slug: "hxo-resistor-wearable-applications",
    category: "行业应用",
    tags: ["HXO", "智能穿戴", "应用方案", "IoT"],
    excerpt: "探讨HXO电阻在智能手表、手环等可穿戴设备中的关键作用和选型要点",
    seoKeywords: ["智能穿戴电阻", "可穿戴设备元件", "HXO应用案例", "IoT电阻方案"]
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'list') {
      const limit = parseInt(searchParams.get('limit') || '10')
      const category = searchParams.get('category')
      
      let articles = [...techArticles].reverse()
      
      if (category) {
        articles = articles.filter(a => a.category === category)
      }
      
      return NextResponse.json({
        success: true,
        data: articles.slice(0, limit),
        total: articles.length
      })
    }
    
    if (action === 'hxo-collection') {
      // 返回预设的HXO电阻技术文章库
      return NextResponse.json({
        success: true,
        data: TECH_TEMPLATES,
        total: TECH_TEMPLATES.length
      })
    }
    
    if (action === 'seo-analysis') {
      const keyword = searchParams.get('keyword') || ''
      
      if (!keyword) {
        return NextResponse.json(
          { error: "请提供关键词" },
          { status: 400 }
        )
      }
      
      // 模拟SEO分析
      return NextResponse.json({
        success: true,
        keyword,
        analysis: {
          searchVolume: Math.floor(Math.random() * 10000) + 1000,
          competition: Math.floor(Math.random() * 100),
          difficulty: Math.floor(Math.random() * 100),
          cpc: (Math.random() * 5 + 0.5).toFixed(2),
          trend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)],
          relatedKeywords: [
            `${keyword}是什么`,
            `${keyword}原理`,
            `${keyword}对比`,
            `${keyword}推荐`,
            `${keyword}评测`
          ]
        }
      })
    }
    
    // 默认返回最新文章
    return NextResponse.json({
      success: true,
      data: techArticles.slice(-10).reverse(),
      total: techArticles.length
    })
  } catch (error) {
    console.error('Tech column error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'generate') {
      const topic = data?.topic || '电子技术'
      const count = data?.count || 5
      
      const articles: TechArticle[] = []
      
      for (let i = 0; i < count; i++) {
        articles.push({
          id: `tech-${Date.now()}-${i}`,
          title: `${topic}深度解析：第${i + 1}篇`,
          slug: `${topic}-guide-${i + 1}`,
          category: topic,
          tags: [topic, '技术', '指南'],
          content: `关于${topic}的深度技术文章...\n\n本文详细介绍了${topic}的原理、应用及选型建议...\n\n更多内容请持续关注我们的技术专栏...`,
          excerpt: `${topic}的专业解读，适合技术从业者和爱好者阅读`,
          author: 'ECHO-2027',
          publishedAt: new Date().toISOString(),
          views: 0,
          seoKeywords: [
            `${topic}是什么`,
            `${topic}原理`,
            `${topic}应用`,
            `${topic}对比`,
            `${topic}教程`
          ]
        })
      }
      
      techArticles.push(...articles)
      
      return NextResponse.json({
        success: true,
        generated: articles.length,
        data: articles
      })
    }
    
    if (action === 'publish') {
      const article: TechArticle = {
        id: `tech-${Date.now()}`,
        ...data,
        publishedAt: new Date().toISOString(),
        views: 0
      }
      
      techArticles.push(article)
      
      return NextResponse.json({
        success: true,
        article
      })
    }
    
    if (action === 'update-views') {
      const { id } = data
      const article = techArticles.find(a => a.id === id)
      if (article) {
        article.views++
        return NextResponse.json({ success: true, views: article.views })
      }
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Tech column error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}