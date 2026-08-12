import { NextRequest, NextResponse } from "next/server"

// 内存存储截流任务
interface InterceptTask {
  id: string
  platform: string
  postId: string
  postContent: string
  author: string
  hotScore: number
  generatedScripts: string[]
  status: 'pending' | 'processed'
  createdAt: string
}

let interceptTasks: InterceptTask[] = []

// 各品类专属帖子池 - 精确匹配关键词
const POST_POOL: Record<string, Array<{
  content: string
  author: string
  category: string
}>> = {
  // 3C数码类
  '耳机': [
    { content: '降噪蓝牙耳机推荐哪款？用了两周来说说感受', author: '数码测评师', category: '3C数码' },
    { content: 'AirPods Pro平替！这款百元降噪耳机关不掉', author: '耳机控小王', category: '3C数码' },
    { content: '打工人必备：地铁上终于能安静了，这款耳机真香', author: '上班族阿杰', category: '3C数码' }
  ],
  '蓝牙耳机': [
    { content: '蓝牙5.3终于来了！延迟低到打游戏都流畅', author: '科技达人', category: '3C数码' },
    { content: '运动必备！跑步时掉不下来的蓝牙耳机推荐', author: '健身教练小李', category: '3C数码' }
  ],
  // 家居类
  '空气炸锅': [
    { content: '空气炸锅真的好用吗？用了三个月真实体验', author: '厨房小白', category: '家居电器' },
    { content: '懒人必备！不用油的空气炸锅美食教程', author: '美食博主', category: '家居电器' }
  ],
  // 宠物类
  '宠物喂食器': [
    { content: '出门旅游再也不用担心主子饿肚子了！', author: '猫咪家长', category: '宠物用品' },
    { content: '自动喂食器实测！定时定量真香警告', author: '宠物达人', category: '宠物用品' }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'analyze') {
      const { keyword, platform, exactMatch = true } = data
      
      if (!keyword) {
        return NextResponse.json({ error: "请输入关键词" }, { status: 400 })
      }
      
      // 精确匹配查找相关帖子
      const relevantPosts = findRelevantPosts(keyword, exactMatch)
      
      if (relevantPosts.length === 0) {
        return NextResponse.json({
          success: true,
          foundPosts: 0,
          tasks: [],
          message: `未找到与"${keyword}"直接相关的热门帖子`
        })
      }
      
      // 生成截流话术
      const tasks: InterceptTask[] = relevantPosts.map(post => ({
        id: `intercept-${Date.now()}-${Math.random()}`,
        platform: platform || 'auto',
        postId: `post-${Date.now()}-${Math.random()}`,
        postContent: post.content,
        author: post.author,
        hotScore: Math.floor(Math.random() * 30) + 70,
        generatedScripts: generateNaturalScripts(keyword, post.content),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      }))
      
      interceptTasks.push(...tasks)
      
      return NextResponse.json({
        success: true,
        foundPosts: relevantPosts.length,
        tasks: tasks.length,
        data: tasks
      })
    }
    
    return NextResponse.json({ error: "未知操作" }, { status: 400 })
  } catch (error) {
    console.error('Intercept error:', error)
    return NextResponse.json({ error: "分析失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'list') {
      const limit = parseInt(searchParams.get('limit') || '50')
      return NextResponse.json({
        success: true,
        data: [...interceptTasks].reverse().slice(0, limit),
        total: interceptTasks.length
      })
    }
    
    return NextResponse.json({ success: true, total: interceptTasks.length })
  } catch (error) {
    return NextResponse.json({ error: "获取数据失败" }, { status: 500 })
  }
}

// 根据关键词查找相关帖子
function findRelevantPosts(keyword: string, exactMatch: boolean = true) {
  const posts: Array<{ content: string; author: string; category: string }> = []
  
  if (exactMatch) {
    for (const [key, pool] of Object.entries(POST_POOL)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        posts.push(...pool)
      }
    }
  }
  
  const uniquePosts = posts.filter((post, index, self) => 
    index === self.findIndex(p => p.content === post.content)
  )
  
  return uniquePosts.slice(0, 5)
}

// 生成自然的话术
function generateNaturalScripts(keyword: string, postContent: string): string[] {
  const templates = [
    `刚看到这条！我也在用${keyword}，用了半个月确实不错👍`,
    `同款已入手！${keyword}亲测有效，已经回购第2次了`,
    `求链接！${keyword}在哪里买？`,
    `博主同款！${keyword}确实好用，感谢分享`,
    `收藏了！正在找${keyword}，这下有方向了`
  ]
  
  return templates.slice(0, 3)
}
