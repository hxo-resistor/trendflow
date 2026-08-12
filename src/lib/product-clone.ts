/**
 * 联盟商品搬运器
 * 从商品链接提取信息并生成各平台推广内容
 */

export interface ProductInfo {
  title: string
  price: string
  originalPrice?: string
  images: string[]
  description: string
  specs?: Record<string, string>
  reviews?: ReviewSummary
  category: string
}

export interface ReviewSummary {
  positiveRate: number
  totalReviews: number
  topComments: string[]
}

export interface PlatformContent {
  platform: string
  title: string
  body: string
  images: string[]
  tags: string[]
  affiliateLink: string
  wordCount: number
}

// 各平台文案模板
interface PlatformTemplate {
  emoji: string[]
  style: string
  structure: string
}

const PLATFORM_TEMPLATES: Record<string, PlatformTemplate> = {
  xiaohongshu: {
    emoji: ['💰', '🔥', '✨', '💕', '😍', '🛒', '✅', '⭐'],
    style: '种草闺蜜风',
    structure: '开头吐槽 → 产品亮点 → 使用体验 → 购买建议'
  },
  zhihu: {
    emoji: [],
    style: '专业评测风',
    structure: '问题引入 → 参数分析 → 优缺点对比 → 购买建议'
  },
  weibo: {
    emoji: ['🔥', '💰', '🛒'],
    style: '短平快带货风',
    structure: '话题标签 → 核心卖点 → 限时优惠 → 购买链接'
  },
  douyin: {
    emoji: ['🎬', '🔥', '💰'],
    style: '口语化推荐风',
    structure: '开场吸引 → 痛点解决 → 产品推荐 → 行动号召'
  },
  wechat: {
    emoji: ['📌', '💡', '✨'],
    style: '深度种草风',
    structure: '场景引入 → 产品体验 → 细节展示 → 购买引导'
  }
}

/**
 * 解析商品链接获取平台类型
 */
export function detectPlatform(url: string): string {
  if (url.includes('jd.com') || url.includes('u.jd.com')) return 'jd'
  if (url.includes('taobao.com') || url.includes('tmall.com') || url.includes('m.tb.cn')) return 'tb'
  if (url.includes('pinduoduo.com') || url.includes('mob.huoshan.com')) return 'pdd'
  if (url.includes('amazon.com')) return 'amazon'
  return 'unknown'
}

/**
 * 模拟商品抓取（实际应从联盟后台或第三方服务获取）
 */
export async function cloneProduct(productUrl: string): Promise<ProductInfo> {
  // 模拟异步请求
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const platform = detectPlatform(productUrl)
  
  // 根据平台返回模拟数据
  const mockProducts: Record<string, ProductInfo> = {
    jd: {
      title: '小佩智能宠物喂食器PRO 自动喂食机 手机APP远程操控 定时定量',
      price: '¥899',
      originalPrice: '¥1299',
      images: [
        'https://img.jd.com/n1/s450x450_jfs/t1/123456/1/12345/123456/5f123456E12345678/12345678.jpg'
      ],
      description: '智能喂食神器，APP远程控制，定时定量，适合忙碌的上班族。大容量设计，一次加粮可用一周。',
      specs: {
        '容量': '4L',
        '供电方式': 'USB+电池',
        '智能功能': 'APP控制、语音播报',
        '适用对象': '猫狗通用'
      },
      reviews: {
        positiveRate: 95,
        totalReviews: 12580,
        topComments: ['质量很好', '操作简便', '猫咪很喜欢']
      },
      category: '宠物用品'
    },
    tb: {
      title: 'Rokid AR智能眼镜 增强现实眼镜 影视游戏两用',
      price: '¥2999',
      originalPrice: '¥3999',
      images: [
        'https://img.alicdn.com/imgextra/i1/O1CN01abc123_!!0-item_pic.jpg'
      ],
      description: 'AR增强现实眼镜，沉浸式观影体验，支持游戏模式，轻便舒适设计。',
      specs: {
        '分辨率': '1920x1080',
        '续航时间': '3小时',
        '重量': '78g',
        '连接方式': '蓝牙5.0'
      },
      reviews: {
        positiveRate: 92,
        totalReviews: 3560,
        topComments: ['画质清晰', '佩戴舒适', '性价比超高']
      },
      category: '数码科技'
    },
    pdd: {
      title: '车载手机支架 汽车用出风口导航支撑架 通用型',
      price: '¥29.9',
      originalPrice: '¥59.9',
      images: [
        'https://img.pddpic.com/mms-material-img/2024-01-01/abc123.jpeg'
      ],
      description: '稳固不晃，适配各种车型，单手操作，安全便捷。',
      specs: {
        '材质': 'ABS+硅胶',
        '适配车型': '通用',
        '安装位置': '出风口',
        '颜色': '黑色/银色'
      },
      reviews: {
        positiveRate: 98,
        totalReviews: 56890,
        topComments: ['很稳', '便宜好用', '物流快']
      },
      category: '汽车配件'
    }
  }
  
  return mockProducts[platform] || mockProducts.jd
}

/**
 * 生成各平台推广内容
 */
export function generatePlatformContents(
  product: ProductInfo,
  affiliateLink: string,
  pid: string
): Record<string, PlatformContent> {
  const platforms = Object.keys(PLATFORM_TEMPLATES)
  const contents: Record<string, PlatformContent> = {}
  
  for (const platform of platforms) {
    contents[platform] = generateSinglePlatformContent(product, affiliateLink, pid, platform)
  }
  
  return contents
}

/**
 * 生成单个平台内容
 */
function generateSinglePlatformContent(
  product: ProductInfo,
  affiliateLink: string,
  pid: string,
  platform: string
): PlatformContent {
  const template = PLATFORM_TEMPLATES[platform]
  let title = ''
  let body = ''
  let tags: string[] = []
  
  switch (platform) {
    case 'xiaohongshu':
      title = `${product.category} | ${product.title.split(' ')[0]}真实体验`
      body = generateXiaohongshuBody(product, affiliateLink, template)
      tags = [product.category, '好物分享', '亲测有效', '宝藏好物']
      break
      
    case 'zhihu':
      title = `${product.title}值得买吗？真实体验告诉你`
      body = generateZhihuBody(product, affiliateLink, template)
      tags = [product.category, '评测', '推荐']
      break
      
    case 'weibo':
      title = `#${product.category}#${product.title.split(' ')[0]}真实感受`
      body = generateWeiboBody(product, affiliateLink, template)
      tags = [product.category, '#好物推荐#', '#种草#']
      break
      
    case 'douyin':
      title = `${product.title}真实测评`
      body = generateDouyinBody(product, affiliateLink, template)
      tags = [product.category, '#测评#', '#好物#']
      break
      
    case 'wechat':
      title = `${product.category} | ${product.title}`
      body = generateWechatBody(product, affiliateLink, template)
      tags = [product.category, '推荐', '亲测']
      break
      
    default:
      title = product.title
      body = product.description
  }
  
  return {
    platform,
    title,
    body,
    images: product.images,
    tags,
    affiliateLink,
    wordCount: body.length
  }
}

/**
 * 生成小红书文案
 */
function generateXiaohongshuBody(product: ProductInfo, link: string, template: any): string {
  const emojis = template.emoji
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  
  return `姐妹们！今天必须给你们安利一个我用过最好用的${product.category}！

之前真的踩过好多坑，买了好几款都不是太满意...直到我遇见了这款${product.title.split(' ')[0]}！

💰 价格：${product.price}（原价${product.originalPrice || '较高'}，现在真的很划算）
📦 特点：${product.description.substring(0, 50)}...

真心觉得好用才分享的！用了两周了，感觉太香了～

👉 我买的链接在这里：${link}
（自己搜同款也可以哦～）

#${product.category} #好物分享 #亲测有效 #宝藏好物`
}

/**
 * 生成知乎文案
 */
function generateZhihuBody(product: ProductInfo, link: string, template: any): string {
  return `作为${product.category}的资深用户，我来分享一下这款${product.title.split(' ')[0]}的真实体验。

## 基本信息
- **价格**：${product.price}（原价${product.originalPrice || product.price}）
- **销量**：${product.reviews?.totalReviews || 0}人评价，好评率${product.reviews?.positiveRate || 95}%

## 主要特点
${product.description}

## 我的使用体验
用了一段时间后，最大的感受就是：

1. **性价比高** - 同价位里表现突出
2. **实用性强** - 解决了我的实际需求
3. **质量稳定** - 没有出现什么问题

## 购买建议
如果你也在考虑入手这类产品，可以看看这个：
${link}

以上纯属个人使用体验，仅供参考。`
}

/**
 * 生成微博文案
 */
function generateWeiboBody(product: ProductInfo, link: string, template: any): string {
  return `#${product.category}# ${product.title.split(' ')[0]}真实感受来了！

💰价格：${product.price}
📝特点：${product.description.substring(0, 30)}...

亲测好用！链接在这→${link}

#${product.category} #好物推荐 #种草`
}

/**
 * 生成抖音文案
 */
function generateDouyinBody(product: ProductInfo, link: string, template: any): string {
  return `家人们！发现一款超好用的${product.category}！

${product.title.split(' ')[0]}
💰只要${product.price}！

真的太香了！链接在评论区👇
${link}`
}

/**
 * 生成朋友圈文案
 */
function generateWechatBody(product: ProductInfo, link: string, template: any): string {
  return `自用推荐📌

${product.category} - ${product.title.split(' ')[0]}
💰${product.price}（比专柜便宜）

亲测好用，链接👉${link}

#${product.category} #好物推荐`
}

/**
 * 将推广链接中的PID替换为总指挥的PID
 */
export function replaceAffiliatePID(originalLink: string, newPID: string): string {
  // 京东链接处理
  if (originalLink.includes('u.jd.com')) {
    return originalLink.replace(/f=\w+/, `f=${newPID}`)
  }
  
  // 淘宝链接处理
  if (originalLink.includes('m.tb.cn')) {
    return originalLink.replace(/pid=\w+/, `pid=${newPID}`)
  }
  
  // 拼多多链接处理
  if (originalLink.includes('p.pinduoduo.com') || originalLink.includes('mob.huoshan.com')) {
    return originalLink.replace(/sc=\w+/, `sc=${newPID}`)
  }
  
  // 亚马逊链接处理
  if (originalLink.includes('amazon.com')) {
    return originalLink.replace(/tag=\w+-\d+/, `tag=${newPID}-20`)
  }
  
  return originalLink
}
