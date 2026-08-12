/**
 * 智能回复引擎 - 根据评论自动生成回复建议
 */

export interface ReplyStrategy {
  id: string
  name: string
  detectKeywords: string[]
  suggestions: string[]
  tone: 'friendly' | 'professional' | 'casual'
}

export const REPLY_STRATEGIES: ReplyStrategy[] = [
  {
    id: 'ask-brand',
    name: '询问品牌',
    detectKeywords: ['自有品牌', '你的店', '你卖的', '哪里买', '旗舰店'],
    suggestions: [
      '不是不是，我自己买来用的，觉得不错分享下~',
      '不是卖货的，纯用户分享，主页有整理你可以看看',
      '哈哈不是，我要是开厂还在这混？',
      '个人自用分享，没有利益关系哦'
    ],
    tone: 'friendly'
  },
  {
    id: 'ask-price',
    name: '询问价格',
    detectKeywords: ['多少钱', '价格', '贵不贵', '多少钱一个', '多少钱一套'],
    suggestions: [
      '我买的时候XX元，现在好像降价了，可以搜搜看',
      '当时活动价入的，现在正常价你可以去比比',
      '记不太清具体价格了，反正性价比很高',
      '几百块的东西，看活动价更划算'
    ],
    tone: 'casual'
  },
  {
    id: 'ask-link',
    name: '询问链接',
    detectKeywords: ['链接', '求链接', '购买链接', '怎么买', '链接在哪'],
    suggestions: [
      '主页有整理，你可以去看看对比',
      '我主页写了对比测评，有链接',
      '搜"XXX推荐"能看到我的主页',
      '主页有详细攻略，需要的自己去看哈'
    ],
    tone: 'casual'
  },
  {
    id: 'positive',
    name: '正面互动',
    detectKeywords: ['不错', '好看', '种草', '想要', '厉害', '赞', '好评'],
    suggestions: [
      '确实可以，用了没后悔',
      '性价比挺高的，推荐入手',
      '感谢认可，真的好用才推荐的',
      '哈哈谢谢，用了一段时间才来分享的'
    ],
    tone: 'friendly'
  },
  {
    id: 'doubt',
    name: '质疑反驳',
    detectKeywords: ['真的假的', '智商税', '别买', '坑', '不好用'],
    suggestions: [
      '每个人感受不一样，我个人是觉得不错的',
      '仅供参考哈，建议多看几家评价再决定',
      '我个人体验很好，不知道你怎么想的',
      '可能适合人群不同吧，我的需求是...'
    ],
    tone: 'professional'
  },
  {
    id: 'comparison',
    name: '比较咨询',
    detectKeywords: ['和XX比', '哪个好', '区别', '对比', '选哪个'],
    suggestions: [
      '两款都好用，我选这款是因为性价比更高',
      '看需求吧，这款更适合日常使用',
      '我对比过几款，最后选的这款，不后悔',
      '各有优势，我个人更推荐这款'
    ],
    tone: 'professional'
  }
]

export interface SmartReplyResult {
  matchedStrategy?: ReplyStrategy
  suggestions: string[]
  confidence: number
}

/**
 * 根据评论内容匹配回复策略
 */
export function matchReplyStrategy(comment: string): SmartReplyResult {
  const commentLower = comment.toLowerCase()
  
  for (const strategy of REPLY_STRATEGIES) {
    const matchCount = strategy.detectKeywords.filter(keyword => 
      commentLower.includes(keyword.toLowerCase())
    ).length
    
    if (matchCount > 0) {
      // 随机选择3条建议
      const shuffled = [...strategy.suggestions].sort(() => 0.5 - Math.random())
      
      return {
        matchedStrategy: strategy,
        suggestions: shuffled.slice(0, 3),
        confidence: (matchCount / strategy.detectKeywords.length) * 100
      }
    }
  }
  
  // 未匹配到特定策略，返回通用建议
  return {
    suggestions: [
      '感谢关注，更多详情可以看我的主页哦~',
      '谢谢支持，有问题可以继续交流',
      '很高兴对你有帮助！'
    ],
    confidence: 30
  }
}

/**
 * 生成批量回复建议
 */
export function generateBatchReplies(comments: string[]): Array<{
  comment: string
  result: SmartReplyResult
}> {
  return comments.map(comment => ({
    comment,
    result: matchReplyStrategy(comment)
  }))
}
