/**
 * Platform Threshold Adaptation Engine
 * Handles different platform requirements for monetization
 */

export interface PlatformThreshold {
  platform: string
  minFollowers?: number
  minLevel?: number
  minDays?: number
  minLiveDays?: number
  features: string[]
}

export interface ContentStrategy {
  mode: 'soft' | 'direct' | 'lead'
  title: string
  bodyTemplate: string
  cta: string
  expectedCTR: number
}

// Platform threshold configurations
export const PLATFORM_THRESHOLDS: Record<string, PlatformThreshold> = {
  xiaohongshu: {
    platform: '小红书',
    minFollowers: 1000,
    features: ['商品笔记', '品牌合作', '直播带货']
  },
  zhihu: {
    platform: '知乎',
    minLevel: 5,
    minDays: 90,
    features: ['好物推荐', '盐选专栏', '知+自选']
  },
  weibo: {
    platform: '微博',
    minFollowers: 100,
    features: ['微博带货', '超话带货', '微海报']
  },
  douyin: {
    platform: '抖音',
    minFollowers: 1000,
    minLiveDays: 30,
    features: ['小黄车', '直播带货', '短视频带货']
  },
  wechat: {
    platform: '公众号',
    minFollowers: 500,
    features: ['小程序带货', '公众号带货', '视频号带货']
  }
}

/**
 * Get content strategy based on platform and follower count
 */
export function getPlatformStrategy(
  platform: string,
  currentFollowers: number = 0,
  currentLevel: number = 1
): ContentStrategy {
  const threshold = PLATFORM_THRESHOLDS[platform]
  
  if (!threshold) {
    return getDefaultStrategy(platform)
  }
  
  // Check if threshold is met
  const hasEnoughFollowers = !threshold.minFollowers || currentFollowers >= threshold.minFollowers
  const hasEnoughLevel = threshold.minLevel ? currentLevel >= threshold.minLevel : true
  const thresholdMet = hasEnoughFollowers && hasEnoughLevel
  
  if (thresholdMet) {
    return getDirectPromotionStrategy(platform)
  } else {
    return getSoftPromotionStrategy(platform, currentFollowers, threshold)
  }
}

/**
 * Direct promotion strategy (for accounts that meet thresholds)
 */
function getDirectPromotionStrategy(platform: string): ContentStrategy {
  switch (platform) {
    case 'xiaohongshu':
      return {
        mode: 'direct',
        title: '实测！这款XX真的好用',
        bodyTemplate: `姐妹们！今天必须给你们安利一款我最近超爱的{product}！

💰 价格：{price}元
📦 购买链接：{affiliateLink}
⭐ 亲测有效，已回购第2次！

#好物分享 #亲测有效 #宝藏单品`,
        cta: '点击链接直接购买',
        expectedCTR: 5
      }
    
    case 'zhihu':
      return {
        mode: 'direct',
        title: '{product}值得买吗？真实体验告诉你',
        bodyTemplate: `作为{product}的资深用户，我来客观分析一下。

## 基本信息
- **价格**：{price}元
- **我的使用时长**：3个月

## 优点
1. {advantage1}
2. {advantage2}

## 缺点
- {disadvantage}

## 购买建议
如果你也在考虑入手：
{affiliateLink}

以上纯属个人使用体验，仅供参考。`,
        cta: '点击查看详情',
        expectedCTR: 3
      }
    
    default:
      return getDefaultStrategy(platform)
  }
}

/**
 * Soft promotion strategy (for accounts below threshold)
 */
function getSoftPromotionStrategy(
  platform: string,
  followers: number,
  threshold: PlatformThreshold
): ContentStrategy {
  const minFollowers = threshold.minFollowers || 0
  const deficit = minFollowers - followers
  
  switch (platform) {
    case 'xiaohongshu':
      return {
        mode: 'soft',
        title: `${deficit > 0 ? '坚持发第' + deficit + '篇笔记' : ''}终于找到好用的XX了！`,
        bodyTemplate: `用了半年，踩过无数坑，终于找到这款好物！

说实话一开始也是被种草的，结果...（踩坑经历）

最后发现还是这款最香，主要原因：
1. 性价比高
2. 实用性强
3. 售后放心

👉 **获取方式：**
评论区扣"1"，我私你链接～
或者搜索关键词就能找到！

#好物分享 #亲测有效`,
        cta: `私信我获取购买链接`,
        expectedCTR: 8
      }
    
    case 'zhihu':
      return {
        mode: 'lead',
        title: `还在努力涨粉的第${deficit}天，关于好物的真实体验`,
        bodyTemplate: `作为一个好物的资深玩家，说几句实话。

## 为什么选这款？
- 对比了5款同类产品
- 最终选择了性价比最高的这款
- 用了3个月，确实没让我失望

## 使用感受
（详细使用体验...）

## 怎么买？
因为还在成长期，暂时不能直接放链接。
但你可以：
1. 直接搜索关键词
2. 或者关注我，后续会出详细测评

希望能帮到大家～`,
        cta: `关注我，持续更新测评`,
        expectedCTR: 6
      }
    
    case 'weibo':
      return {
        mode: 'soft',
        title: `今日份种草`,
        bodyTemplate: `今日份种草💡

用了半个月，真心觉得这款好物不错。

价格实惠，性价比很高。
想要链接的宝子们评论区见～

#好物分享`,
        cta: '评论区求链接',
        expectedCTR: 10
      }
    
    default:
      return {
        mode: 'soft',
        title: `${platform}种草`,
        bodyTemplate: '软性内容模板',
        cta: '私信获取链接',
        expectedCTR: 5
      }
  }
}

/**
 * Default strategy
 */
function getDefaultStrategy(platform: string): ContentStrategy {
  return {
    mode: 'soft',
    title: `${platform}内容模板`,
    bodyTemplate: '请根据平台特点定制内容',
    cta: '查看详情',
    expectedCTR: 3
  }
}

/**
 * Generate growth guide
 */
export function generateGrowthGuide(platform: string, currentFollowers: number): string {
  const threshold = PLATFORM_THRESHOLDS[platform]
  if (!threshold || !threshold.minFollowers) {
    return '该平台暂无粉丝门槛要求'
  }
  
  const deficit = threshold.minFollowers - currentFollowers
  
  if (deficit <= 0) {
    return `恭喜！你的${platform}账号已达到${threshold.minFollowers}粉丝门槛，可以开启带货功能了！`
  }
  
  const guides: Record<string, string[]> = {
    xiaohongshu: [
      '每天发布1-2篇高质量笔记',
      '保持垂直领域，不要乱发',
      '多用emoji和话题标签',
      '互动回复要快，提升活跃度',
      '周五六日发内容效果最好',
      `还需要${deficit}粉丝，加油！`
    ],
    zhihu: [
      '每天回答2-3个相关问题',
      '选择热门问题先回答',
      '内容要有深度，配图精美',
      '关注同领域大V互动',
      '坚持日更，保持稳定输出',
      '等级提升中，继续加油！'
    ],
    weibo: [
      '每天发3-5条微博',
      '参与热门话题讨论',
      '@官方账号增加曝光',
      '转发抽奖活动吸粉',
      '与其他博主互关互推',
      `还需要${deficit}粉丝！`
    ]
  }
  
  return `【${platform}养号攻略】

当前粉丝：${currentFollowers}
目标粉丝：${threshold.minFollowers}
差距：${deficit}粉丝

建议做法：
${(guides[platform] || guides.xiaohongshu).map((g, i) => `${i + 1}. ${g}`).join('\n')}`
}

/**
 * Estimate time to reach threshold
 */
export function estimateTimeToThreshold(
  platform: string,
  currentFollowers: number,
  dailyGrowth: number = 5
): string {
  const threshold = PLATFORM_THRESHOLDS[platform]
  if (!threshold || !threshold.minFollowers) return '无门槛要求'
  
  const deficit = threshold.minFollowers - currentFollowers
  if (deficit <= 0) return '已达到门槛'
  
  const days = Math.ceil(deficit / dailyGrowth)
  
  if (days <= 7) return `预计${days}天后达标`
  if (days <= 30) return `预计${days}天（约${Math.ceil(days/7)}周）后达标`
  if (days <= 90) return `预计${days}天（约${Math.ceil(days/30)}个月）后达标`
  return `预计${Math.ceil(days/30)}个月后达标，建议多平台布局`
}
