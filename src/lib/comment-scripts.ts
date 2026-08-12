/**
 * 评论区话术生成器
 * 为各平台生成不同风格的截流话术
 */

export interface CommentScript {
  id: string
  platform: string
  style: 'soft' | 'direct' | 'question' | 'experience'
  content: string
  riskLevel: 'low' | 'medium' | 'high'  // 被识别为广告的风险
  expectedCTR: number  // 预期点击率
}

// 各平台评论话术模板
const SCRIPT_TEMPLATES: Record<string, Array<{ style: string; template: string; risk: 'low' | 'medium' | 'high' }>> = {
  xiaohongshu: [
    { style: 'experience', template: '用了半个月，确实不错，链接放主页了～', risk: 'low' },
    { style: 'experience', template: '姐妹们！这款真的绝绝子，已回购第3次！', risk: 'low' },
    { style: 'question', template: '求问大家，这款有优惠券吗？', risk: 'low' },
    { style: 'soft', template: '刚入坑，求推荐靠谱店铺', risk: 'low' },
    { style: 'experience', template: '对比了好几家，最后选了这家，性价比超高', risk: 'medium' },
    { style: 'direct', template: '同款链接→[商品链接]', risk: 'high' },
    { style: 'experience', template: '用了三个月来反馈，真的香！', risk: 'low' },
    { style: 'question', template: '有没有人用过这款？感觉怎么样？', risk: 'low' },
    { style: 'soft', template: '收藏了，等降价再买', risk: 'low' },
    { style: 'experience', template: '实物比图片还好看，爱了爱了💕', risk: 'low' }
  ],
  zhihu: [
    { style: 'experience', template: '刚买了用了两周，说说真实感受...', risk: 'low' },
    { style: 'direct', template: '个人觉得这款不错，可以参考：[链接]', risk: 'medium' },
    { style: 'question', template: '有没有用过的朋友来说说？', risk: 'low' },
    { style: 'experience', template: '作为该领域十年用户，说几句实话...', risk: 'low' },
    { style: 'soft', template: '这个问题我研究过，整理了一些心得', risk: 'low' },
    { style: 'experience', template: '买前必看！踩了无数坑总结出来的经验', risk: 'medium' },
    { style: 'direct', template: '实测数据如下，仅供参考：[链接]', risk: 'medium' },
    { style: 'question', template: '大家觉得这款和XXX相比怎么样？', risk: 'low' }
  ],
  weibo: [
    { style: 'direct', template: '买了！确实不错👍 [链接]', risk: 'high' },
    { style: 'experience', template: '刚入手，用了两天，感觉很香～', risk: 'low' },
    { style: 'soft', template: '求问有买过的吗？质量如何？', risk: 'low' },
    { style: 'experience', template: '亲测有效，不踩雷！', risk: 'medium' },
    { style: 'direct', template: '同款在这里→[链接]', risk: 'high' },
    { style: 'question', template: '姐妹们，这款值得入手吗？', risk: 'low' }
  ]
}

/**
 * 根据平台和关键词生成评论话术
 */
export function generateCommentScripts(
  platform: string,
  keyword: string,
  count: number = 10
): CommentScript[] {
  const templates = SCRIPT_TEMPLATES[platform] || SCRIPT_TEMPLATES.xiaohongshu
  const scripts: CommentScript[] = []
  
  for (let i = 0; i < Math.min(count, templates.length); i++) {
    const template = templates[i]
    scripts.push({
      id: `script-${Date.now()}-${i}`,
      platform,
      style: template.style as any,
      content: template.template.replace('{keyword}', keyword),
      riskLevel: template.risk,
      expectedCTR: calculateExpectedCTR(template.risk)
    })
  }
  
  return scripts
}

/**
 * 计算预期点击率（风险越低，CTR越高）
 */
function calculateExpectedCTR(risk: 'low' | 'medium' | 'high'): number {
  const ctrMap = { low: 8, medium: 5, high: 2 }
  return ctrMap[risk]
}

/**
 * 获取高风险话术过滤后的安全列表
 */
export function getSafeScripts(scripts: CommentScript[]): CommentScript[] {
  return scripts.filter(s => s.riskLevel === 'low')
}

/**
 * 生成长尾问题（用于知乎SEO）
 */
export function generateLongTailQuestions(keyword: string, count: number = 20): string[] {
  const patterns = [
    `${keyword}哪个好？`,
    `${keyword}值得买吗？`,
    `${keyword}使用教程`,
    `${keyword}避坑指南`,
    `${keyword}真实测评`,
    `${keyword}vs${keyword}哪个更好`,
    `${keyword}十大品牌排行`,
    `${keyword}多少钱合适`,
    `${keyword}使用方法`,
    `${keyword}真假辨别`
  ]
  
  // 随机选择并返回指定数量
  const shuffled = patterns.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * 生成搜索热点词（用于微博截流）
 */
export function getTrendingSearchKeywords(category: string): string[] {
  const keywords: Record<string, string[]> = {
    pet: ['宠物喂食器', '智能猫砂盆', '狗粮推荐', '猫粮测评', '宠物玩具'],
    digital: ['蓝牙耳机', '充电宝', '数据线', '手机支架', '降噪耳机'],
    home: ['收纳盒', '扫地机器人', '空气净化器', '智能灯具', '除湿机']
  }
  
  return keywords[category] || keywords.pet
}
