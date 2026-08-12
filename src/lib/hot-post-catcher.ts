import { NextRequest, NextResponse } from "next/server"

// 模拟热帖数据（实际应接入各平台API）
const MOCK_HOT_POSTS = [
  {
    id: "hot-001",
    platform: "weibo",
    author: "宠物达人小王",
    content: "求推荐一款靠谱的宠物喂食器，家里猫粮总撒得到处都是😭",
    publishedAt: new Date(Date.now() - 1800000).toISOString(), // 30分钟前
    likes: 156,
    comments: 23,
    shares: 8,
    hotScore: 92,
    keywords: ["宠物", "喂食器", "猫粮"],
    url: "https://weibo.com/xxx"
  },
  {
    id: "hot-002",
    platform: "zhihu",
    author: "数码测评师",
    content: "蓝牙耳机的降噪效果到底是不是智商税？实测告诉你真相",
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1小时前
    likes: 892,
    comments: 156,
    shares: 45,
    hotScore: 88,
    keywords: ["耳机", "降噪", "蓝牙耳机"],
    url: "https://zhihu.com/xxx"
  },
  {
    id: "hot-003",
    platform: "xiaohongshu",
    author: "精致宝妈",
    content: "带娃两年总结出来的收纳神器，小户型必备！",
    publishedAt: new Date(Date.now() - 1200000).toISOString(), // 20分钟前
    likes: 2341,
    comments: 567,
    shares: 234,
    hotScore: 95,
    keywords: ["收纳", "家居", "宝妈"],
    url: "https://xiaohongshu.com/xxx"
  }
]

interface HotPost {
  id: string
  platform: string
  author: string
  content: string
  publishedAt: string
  likes: number
  comments: number
  shares: number
  hotScore: number
  keywords: string[]
  url: string
}

// 根据商品库匹配热帖
export function matchHotPosts(posts: HotPost[], productKeywords: string[]): Array<HotPost & { matchedProducts: string[] }> {
  return posts
    .filter(post => {
      const postKeywords = post.keywords.join(' ').toLowerCase()
      return productKeywords.some(kw => postKeywords.includes(kw.toLowerCase()))
    })
    .map(post => ({
      ...post,
      matchedProducts: productKeywords.filter(kw => 
        post.keywords.some(pk => pk.toLowerCase() === kw.toLowerCase() || 
          post.content.toLowerCase().includes(kw.toLowerCase()))
      )
    }))
    .sort((a, b) => b.hotScore - a.hotScore)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取当前热帖
    if (action === 'hot-posts') {
      const limit = parseInt(searchParams.get('limit') || '10')
      const platform = searchParams.get('platform')
      
      let posts = [...MOCK_HOT_POSTS]
      
      if (platform) {
        posts = posts.filter(p => p.platform === platform)
      }
      
      // 只返回1小时内的帖子
      const oneHourAgo = new Date(Date.now() - 3600000)
      posts = posts.filter(p => new Date(p.publishedAt) >= oneHourAgo)
      
      return NextResponse.json({
        success: true,
        data: posts.slice(0, limit),
        total: posts.length
      })
    }
    
    // 根据商品匹配热帖
    if (action === 'match') {
      const keyword = searchParams.get('keyword') || '宠物喂食器'
      const posts = await getRecentHotPosts()
      
      const matched = matchHotPosts(posts, [keyword])
      
      return NextResponse.json({
        success: true,
        keyword,
        matchedPosts: matched,
        totalMatched: matched.length
      })
    }
    
    // 默认返回所有热帖
    return NextResponse.json({
      success: true,
      data: MOCK_HOT_POSTS,
      total: MOCK_HOT_POSTS.length
    })
  } catch (error) {
    console.error('Hot post error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}

// 获取近期热帖（模拟）
async function getRecentHotPosts(): Promise<HotPost[]> {
  // 实际应从各平台API获取
  return MOCK_HOT_POSTS
}

/**
 * 生成热帖专属评论话术
 */
export function generateHotPostComment(post: HotPost, product: string): string {
  const templates = {
    weibo: [
      `刚看到这条！我最近也在找${product}，用了半个月感觉不错👍`,
      `求同款！我家猫也用这个，确实省心`,
      `收藏了！回头去试试这个牌子`,
      `博主在用哪款？求链接！`
    ],
    zhihu: [
      `谢邀！这个问题我也研究过，说几点个人经验...`,
      `作为${product}的深度用户，来分享下真实感受`,
      `其实这个问题可以从几个角度分析...`,
      `刚买了用了两周，来说几句实话`
    ],
    xiaohongshu: [
      `姐妹们！这款真的绝绝子！已回购第3次💕`,
      `亲测有效！用了半个月才来评论的`,
      `踩了好多坑才找到这款，真心推荐~`,
      `救命！为什么现在才发现这个神器😭`
    ]
  }
  
  const platformTemplates = templates[post.platform as keyof typeof templates] || templates.weibo
  return platformTemplates[Math.floor(Math.random() * platformTemplates.length)]
}
