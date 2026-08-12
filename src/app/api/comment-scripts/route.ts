import { NextRequest, NextResponse } from "next/server"

// 评论话术模板库
const SCRIPT_TEMPLATES: Record<string, string[]> = {
  xiaohongshu: [
    "用了一款感觉还不错，分享下链接→{link}",
    "同款已入手，用了半个月，说说真实感受：{link}",
    "之前也纠结过这个，最后入了这款，后悔没早买😭{link}",
    "刚入手的，用了三天来反馈，确实不错👍{link}",
    "踩了不少坑才找到这款，建议看看→{link}",
    "说实话，性价比最高的就是这款了{link}",
    "姐妹们冲这款！已回购第二次{link}",
    "实测有效！用了两个月才来评论的{link}",
    "别的不说，这款真的让我省心不少{link}",
    "对比了好几款，最后留下的只有它{link}"
  ],
  zhihu: [
    "谢邀，刚用完一个月来回答这个问题。结论先行：{product}确实不错。详细测评→{link}",
    "作为{category}爱好者，买了5款做了横评，最终留下了这款。原因有三：{link}",
    "这个问题我来回答一下。先说结论再展开：{link}",
    "看了很多回答，我觉得还是应该客观说一下真实体验：{link}",
    "用了一周，来说几句实话。优缺点都列出来供参考：{link}"
  ],
  weibo: [
    "刚买的，用了几天来说下感受{link}",
    "分享个刚入手的好物，确实不错{link}",
    "求同款的可以看看这个{link}",
    "亲测好用，不踩雷{link}",
    "对比了好几家，最后选了这款，很满意{link}"
  ]
}

// 长尾问题生成规则
const LONG_TAIL_PATTERNS: Record<string, { keywords: string[]; questions: string[] }> = {
  pet: {
    keywords: ["宠物喂食器", "猫砂", "狗粮", "宠物玩具"],
    questions: [
      "{keyword}怎么选？",
      "{keyword}哪款性价比最高？",
      "{keyword}使用教程",
      "{keyword}避坑指南",
      "新手养宠必备{keyword}",
      "{keyword}真假辨别",
      "{keyword}使用技巧",
      "用了{keyword}三个月，来说说感受",
      "{keyword}和{keyword}哪个好？",
      "预算{price}元，{keyword}推荐"
    ]
  },
  digital: {
    keywords: ["蓝牙耳机", "充电宝", "数据线", "手机支架"],
    questions: [
      "{keyword}选购指南",
      "{keyword}哪个牌子好？",
      "{keyword}使用心得",
      "{keyword}避坑必看",
      "学生党必备的{keyword}",
      "{keyword}横评对比",
      "{keyword}深度测评",
      "{price}元档{keyword}推荐",
      "{keyword} vs {keyword}，选哪个？",
      "{keyword}真实体验分享"
    ]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') || 'xiaohongshu'
  const product = searchParams.get('product') || '智能宠物喂食器'
  const category = searchParams.get('category') || 'pet'
  const action = searchParams.get('action')
  
  try {
    // 获取评论话术
    if (action === 'scripts') {
      const templates = SCRIPT_TEMPLATES[platform] || SCRIPT_TEMPLATES.xiaohongshu
      const scripts = templates.map(t => t.replace(/{link}/g, 'https://trendflow-fawn.vercel.app/affiliate').replace(/{product}/g, product))
      return NextResponse.json({ success: true, scripts })
    }
    
    // 生成长尾问题
    if (action === 'questions') {
      const pattern = LONG_TAIL_PATTERNS[category] || LONG_TAIL_PATTERNS.pet
      const questions = pattern.questions.map(q => q.replace(/{keyword}/g, product).replace(/{price}/g, '200'))
      return NextResponse.json({ success: true, questions })
    }
    
    // 默认返回所有话术
    const allScripts = {
      xiaohongshu: SCRIPT_TEMPLATES.xiaohongshu.map(t => t.replace(/{link}/g, 'https://trendflow-fawn.vercel.app/affiliate')),
      zhihu: SCRIPT_TEMPLATES.zhihu.map(t => t.replace(/{link}/g, 'https://trendflow-fawn.vercel.app/affiliate').replace(/{product}/g, product).replace(/{category}/g, category)),
      weibo: SCRIPT_TEMPLATES.weibo.map(t => t.replace(/{link}/g, 'https://trendflow-fawn.vercel.app/affiliate'))
    }
    
    return NextResponse.json({ success: true, data: allScripts })
  } catch (error) {
    console.error('Comment scripts error:', error)
    return NextResponse.json(
      { error: "生成失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, product, count = 10 } = body
    
    if (!platform || !product) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }
    
    const validPlatforms = ['xiaohongshu', 'zhihu', 'weibo'] as const
    const platformKey = validPlatforms.includes(platform as typeof validPlatforms[number]) 
      ? (platform as typeof validPlatforms[number]) 
      : 'xiaohongshu'
    
    const templates = SCRIPT_TEMPLATES[platformKey]
    const selected = templates.slice(0, count)
    const scripts = selected.map(t => t
      .replace(/{link}/g, `https://trendflow-fawn.vercel.app/redirect?to=${platformKey}&product=${encodeURIComponent(product)}`)
      .replace(/{product}/g, product)
    )
    
    return NextResponse.json({ success: true, scripts })
  } catch (error) {
    console.error('Generate scripts error:', error)
    return NextResponse.json(
      { error: "生成失败" },
      { status: 500 }
    )
  }
}
