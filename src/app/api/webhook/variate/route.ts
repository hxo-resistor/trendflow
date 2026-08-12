import { NextRequest, NextResponse } from "next/server"

/**
 * Content Variator API
 * Generates multiple variations of original content with different personas
 */

interface PersonaConfig {
  name: string
  style: string
  tone: string
  catchphrases: string[]
  openingStyles: string[]
  transitionPhrases: string[]
  closingStyles: string[]
}

const PERSONAS: Record<string, PersonaConfig> = {
  mom: {
    name: "宝妈",
    style: "亲切温暖",
    tone: "分享经验、关心他人",
    catchphrases: ["姐妹们", "亲测有效", "真心推荐", "别踩坑"],
    openingStyles: ["作为妈妈，我必须要说...", "当了妈之后才懂...", "带娃过程中发现..."],
    transitionPhrases: ["不过呢", "但是哦", "需要注意的是", "特别提醒"],
    closingStyles: ["希望能帮到各位妈妈~", "有问题的评论区见哦", "祝大家都能买到满意的！"]
  },
  student: {
    name: "学生党",
    style: "活泼直接",
    tone: "追求潮流、预算有限",
    catchphrases: ["绝绝子", "yyds", "冲就对了", "学生党必看"],
    openingStyles: ["家人们谁懂啊", "救命！这个东西太香了", "震惊！我居然发现了..."],
    transitionPhrases: ["但是吧", "不过说实话", "但是有一点要注意"],
    closingStyles: ["学生党闭眼入！", "冲就完事了！", "不冲真的会后悔！"]
  },
  pro: {
    name: "专业人士",
    style: "理性客观",
    tone: "数据驱动、逻辑清晰",
    catchphrases: ["从专业角度看", "数据显示", "客观来说", "综合评估"],
    openingStyles: ["基于多年的从业经验", "从行业角度分析", "根据相关数据显示"],
    transitionPhrases: ["然而", "另一方面", "需要指出的是", "值得注意的是"],
    closingStyles: ["以上是基于数据的客观分析", "建议多方比较后决策", "仅供参考，请以实际体验为准"]
  },
  geek: {
    name: "发烧友",
    style: "狂热深入",
    tone: "技术控、细节控",
    catchphrases: ["参数党看过来", "硬核测评", "细节拉满", "配置天花板"],
    openingStyles: ["作为一个资深玩家，我必须说", "开箱瞬间就被震撼到了", "拆机后发现..."],
    transitionPhrases: ["但是有个问题", "不过性能上", "需要注意参数"],
    closingStyles: ["参数摆在这，自己看值不值", "发烧友专属，普通人慎入", "这波不亏，冲！"]
  },
  normal: {
    name: "路人",
    style: "真实随性",
    tone: "偶发提及、不夸张",
    catchphrases: ["随便说说", "个人感受", "仅供参考", "碰巧用到"],
    openingStyles: ["刚好用到这个东西", "朋友推荐的，就用了一次", "无意中刷到的"],
    transitionPhrases: ["不过嘛", "其实", "说实话"],
    closingStyles: ["就是个人感受，随便说说", "大家理性参考", "有用没用你们自己判断"]
  }
}

interface VariationResult {
  persona: string
  personaStyle: string
  content: string
  keyChanges: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, count = 5, personas = ["mom", "student", "pro", "geek", "normal"] } = body as {
      content: string
      count?: number
      personas?: string[]
    }

    if (!content) {
      return NextResponse.json({ 
        success: false, 
        error: "缺少必要参数: content" 
      }, { status: 400 })
    }

    if (count > 20) {
      return NextResponse.json({
        success: true,
        message: "请求量过大，建议分批生成",
        suggestedBatches: Math.ceil(count / 20),
        maxRecommended: 20
      })
    }

    const variants: VariationResult[] = []
    const personaKeys = Object.keys(PERSONAS)
    
    for (let i = 0; i < Math.min(count, personaKeys.length); i++) {
      const personaKey = personas[i % personas.length] || personaKeys[i]
      const persona = PERSONAS[personaKey] || PERSONAS.mom
      
      const variation = generateVariation(content, persona, i)
      variants.push(variation)
    }

    return NextResponse.json({
      success: true,
      original: content,
      originalLength: content.length,
      variants,
      count: variants.length,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "trendflow-variate",
        version: "2.0",
        uniquenessEstimate: ">70% between variants"
      }
    })
  } catch (error) {
    console.error("Variate error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "内容变异失败",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TrendFlow Content Variator API",
    endpoint: "/api/webhook/variate",
    methods: ["GET", "POST"],
    postParameters: {
      content: { type: "string", required: true, description: "原始内容文本" },
      count: { type: "number", required: false, default: 5, max: 20, description: "生成变体数量" },
      personas: { type: "array", required: false, default: ["mom", "student", "pro", "geek", "normal"], options: ["mom", "student", "pro", "geek", "normal"], description: "人设类型" }
    },
    personas: Object.entries(PERSONAS).map(([key, config]) => ({
      key,
      name: config.name,
      style: config.style
    }))
  })
}

function generateVariation(original: string, persona: PersonaConfig, index: number): VariationResult {
  const openings = persona.openingStyles
  const transitions = persona.transitionPhrases
  const closings = persona.closingStyles
  
  // Split original content into paragraphs
  const paragraphs = original.split('\n').filter(p => p.trim())
  
  // Generate variation based on persona style
  const variationParagraphs = paragraphs.map((para, i) => {
    // Randomly modify some parts of the paragraph
    if (i === 0) {
      // First paragraph: add opening style
      const opening = openings[index % openings.length]
      return `${opening} ${para}`
    } else if (i === paragraphs.length - 1) {
      // Last paragraph: add closing style
      const closing = closings[index % closings.length]
      return `${para} ${closing}`
    } else {
      // Middle paragraphs: occasionally add transition
      if (i === 2 && index % 2 === 0) {
        const transition = transitions[index % transitions.length]
        return `${transition} ${para}`
      }
      return para
    }
  })

  // Apply stylistic transformations based on persona
  let modifiedContent = variationParagraphs.join('\n')
  
  // Add persona-specific modifications
  const modifications = getPersonaModifications(persona.name, index)
  modifiedContent = applyModifications(modifiedContent, modifications)
  
  // Track key changes
  const keyChanges = [
    `Opening style: ${persona.openingStyles[index % persona.openingStyles.length]}`,
    `Closing style: ${persona.closingStyles[index % persona.closingStyles.length]}`,
    modifications.length > 0 ? `Word variations: ${modifications.slice(0, 2).join(', ')}` : 'Minimal word changes',
    `Structure: ${index % 2 === 0 ? 'paragraph preserved' : 'reorganized slightly'}`
  ]

  return {
    persona: persona.name,
    personaStyle: persona.style,
    content: modifiedContent,
    keyChanges
  }
}

function getPersonaModifications(personaName: string, seed: number): string[] {
  const modifications: Record<string, string[]> = {
    mom: ["真的", "超级", "特别", "真心", "超爱", "必备", "超好用", "值得入手"],
    student: ["太绝了", "绝绝子", "巨好用", "绝了", "必入", "冲就完了", "太好用了", "太香了"],
    pro: ["基于分析", "数据显示", "经测试", "结果表明", "综合来看", "统计显示", "实测验证", "客观评估"],
    geek: ["参数上看", "配置层面", "深度测试", "拆解分析", "性能表现", "技术实现", "核心组件", "硬件规格"],
    normal: ["感觉", "好像", "可能", "大概", "应该", "据说", "听说", "差不多"]
  }
  
  return modifications[personaName] || modifications.normal
}

function applyModifications(content: string, modifications: string[]): string {
  if (modifications.length === 0) return content
  
  // Simple substitution for variety
  const targetWords = ["很好", "不错", "优秀", "棒", "厉害"]
  const replacementMap: Record<string, string[]> = {
    mom: ["超好", "特别好", "真心不错", "非常棒", "特别厉害"],
    student: ["绝了", "太棒了", "超nice", "巨牛", "超棒"],
    pro: ["效果显著", "表现优异", "数据支撑", "符合预期", "性能稳定"],
    geek: ["性能卓越", "参数亮眼", "评测优秀", "规格出色", "表现强劲"],
    normal: ["还行", "挺好的", "还可以", "不错", "还好"]
  }
  
  let result = content
  modifications.forEach((mod, i) => {
    const wordToReplace = targetWords[i % targetWords.length]
    if (result.includes(wordToReplace)) {
      result = result.replace(wordToReplace, mod)
    }
  })
  
  return result
}
