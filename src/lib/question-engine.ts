/**
 * 问题库引擎 - Question Library Engine
 * 为每个商品生成50个SEO长尾问题
 */

export interface GeneratedQuestion {
  id: string
  question: string
  category: '购买决策' | '使用技巧' | '对比评测' | '避坑指南' | '场景应用'
  difficulty: 'easy' | 'medium' | 'hard'
  searchVolume: number  // 预估搜索量 0-100
  competition: number   // 竞争度 0-100
  suggestedAnswer?: string
}

// 问题生成模板库
const QUESTION_TEMPLATES = {
  // 购买决策类
  buying: [
    '{keyword}哪个好？',
    '{keyword}推荐',
    '{keyword}性价比最高',
    '{keyword}值得买吗',
    '{keyword}选购指南',
    '{keyword}哪款最好用',
    '{keyword}十大品牌排行榜',
    '{keyword}口碑最好的品牌',
    '{keyword}学生党必备',
    '{keyword}新手入门推荐'
  ],
  // 使用技巧类
  usage: [
    '{keyword}怎么用',
    '{keyword}使用教程',
    '{keyword}使用方法',
    '{keyword}正确用法',
    '{keyword}技巧分享',
    '{keyword}注意事项',
    '{keyword}保养方法',
    '{keyword}清洗技巧',
    '{keyword}日常维护',
    '{keyword}延长使用寿命'
  ],
  // 对比评测类
  compare: [
    '{keyword}对比',
    '{keyword} vs {keyword}',
    '{keyword}和{keyword}哪个好',
    '{keyword}横评',
    '{keyword}评测报告',
    '{keyword}实测体验',
    '{keyword}优缺点分析',
    '{keyword}真实测评',
    '{keyword}深度解析',
    '{keyword}全面对比'
  ],
  // 避坑指南类
  avoid: [
    '{keyword}避坑指南',
    '{keyword}不要买这几种',
    '{keyword}智商税吗',
    '{keyword}踩过的坑',
    '{keyword}常见问题',
    '{keyword}翻车经历',
    '{keyword}后悔买了',
    '{keyword}别被坑了',
    '{keyword}真相揭秘',
    '{keyword}内幕曝光'
  ],
  // 场景应用类
  scene: [
    '{keyword}适合什么人',
    '{keyword}什么场景用',
    '{keyword}家庭必备',
    '{keyword}办公室神器',
    '{keyword}旅行必备',
    '{keyword}送礼推荐',
    '{keyword}居家好物',
    '{keyword}提升幸福感',
    '{keyword}懒人必备',
    '{keyword}省钱攻略'
  ]
}

/**
 * 生成指定数量的高质量SEO问题
 */
export function generateQuestions(keyword: string, count: number = 50): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  const categories = Object.keys(QUESTION_TEMPLATES) as Array<keyof typeof QUESTION_TEMPLATES>
  
  // 确保均匀分布各类别
  const perCategory = Math.floor(count / categories.length)
  const remainder = count % categories.length
  
  let usedCount = 0
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const templates = QUESTION_TEMPLATES[category]
    const countForThis = i < remainder ? perCategory + 1 : perCategory
    
    for (let j = 0; j < countForThis && questions.length < count; j++) {
      const template = templates[j % templates.length]
      const question = template.replace(/{keyword}/g, keyword)
      
      questions.push({
        id: `q-${questions.length + 1}`,
        question,
        category: getQuestionCategory(category),
        difficulty: getDifficulty(question),
        searchVolume: getRandomSearchVolume(category),
        competition: getRandomCompetition(),
        suggestedAnswer: generateAnswerHint(keyword, question)
      })
    }
  }
  
  return questions
}

/**
 * 获取问题分类
 */
function getQuestionCategory(templateKey: string): GeneratedQuestion['category'] {
  const mapping: Record<string, GeneratedQuestion['category']> = {
    buying: '购买决策',
    usage: '使用技巧',
    compare: '对比评测',
    avoid: '避坑指南',
    scene: '场景应用'
  }
  return mapping[templateKey] || '购买决策'
}

/**
 * 判断难度等级
 */
function getDifficulty(question: string): GeneratedQuestion['difficulty'] {
  if (question.includes('怎么选') || question.includes('哪个')) return 'easy'
  if (question.includes('对比') || question.includes('评测')) return 'medium'
  if (question.includes('内幕') || question.includes('真相')) return 'hard'
  return 'medium'
}

/**
 * 获取搜索量（模拟数据）
 */
function getRandomSearchVolume(category: string): number {
  const ranges: Record<string, [number, number]> = {
    buying: [70, 100],
    usage: [50, 80],
    compare: [60, 90],
    avoid: [40, 70],
    scene: [30, 60]
  }
  const [min, max] = ranges[category] || [50, 80]
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * 获取竞争度（模拟数据）
 */
function getRandomCompetition(): number {
  return Math.floor(Math.random() * 60 + 20) // 20-80
}

/**
 * 生成答案提示
 */
function generateAnswerHint(keyword: string, question: string): string {
  const hints: Record<string, string[]> = {
    '购买决策': [
      `从性价比角度分析，${keyword}建议选择...`,
      `根据预算不同，${keyword}可分为...`,
      `经过多方对比，${keyword}推荐...`
    ],
    '使用技巧': [
      `使用${keyword}时注意...`,
      `${keyword}的正确打开方式...`,
      `掌握这些${keyword}使用技巧...`
    ],
    '对比评测': [
      `通过${keyword}实测对比...`,
      `${keyword}各品牌深度横评...`,
      `真实体验后，${keyword}优劣势分析...`
    ],
    '避坑指南': [
      `关于${keyword}的避坑指南...`,
      `${keyword}常见误区及正确做法...`,
      `买${keyword}前必看...`
    ],
    '场景应用': [
      `${keyword}在以下场景特别实用...`,
      `适合使用${keyword}的人群有...`,
      `${keyword}让日常生活更便捷...`
    ]
  }
  
  // 简化版：随机选择一个提示
  const categories = Object.keys(hints) as Array<keyof typeof hints>
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const categoryHints = hints[randomCategory]
  return categoryHints[Math.floor(Math.random() * categoryHints.length)]
}

/**
 * 批量生成问题（多个关键词）
 */
export function batchGenerateQuestions(keywords: string[], countPerKeyword: number = 50): GeneratedQuestion[] {
  const allQuestions: GeneratedQuestion[] = []
  
  for (const keyword of keywords) {
    const questions = generateQuestions(keyword, countPerKeyword)
    allQuestions.push(...questions)
  }
  
  // 去重并返回
  const uniqueQuestions = allQuestions.filter((q, index, self) => 
    index === self.findIndex(t => t.question === q.question)
  )
  
  return uniqueQuestions
}

/**
 * 导出为CSV格式
 */
export function exportQuestionsToCSV(questions: GeneratedQuestion[]): string {
  const headers = ['问题ID', '问题内容', '分类', '难度', '搜索量', '竞争度', '答案提示']
  const rows = questions.map(q => [
    q.id,
    `"${q.question}"`,
    q.category,
    q.difficulty,
    q.searchVolume,
    q.competition,
    `"${q.suggestedAnswer || ''}"`
  ])
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

/**
 * 获取热门问题组合
 */
export function getHotQuestionCombination(keyword: string): {
  topQuestions: GeneratedQuestion[]
  seoKeywords: string[]
  contentAngles: string[]
} {
  const questions = generateQuestions(keyword, 50)
  
  // 按搜索量排序取Top 10
  const topQuestions = questions
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 10)
  
  // 提取SEO关键词
  const seoKeywords = [
    keyword,
    `${keyword}推荐`,
    `${keyword}哪个好`,
    `${keyword}评测`,
    `${keyword}使用`,
    `${keyword}对比`,
    `${keyword}性价比`,
    `${keyword}品牌`
  ]
  
  // 内容角度建议
  const contentAngles = [
    '真实使用体验分享',
    '多品牌横向对比测评',
    '选购避坑指南',
    '使用教程和技巧',
    '价格对比分析',
    '用户真实评价汇总'
  ]
  
  return {
    topQuestions,
    seoKeywords,
    contentAngles
  }
}