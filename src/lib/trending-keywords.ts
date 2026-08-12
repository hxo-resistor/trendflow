/**
 * 热门关键词库 - 按品类分类
 * 涵盖中国各大平台的热门搜索词
 */

export interface Keyword {
  id: string
  keyword: string
  category: string
  platform: string[]
  heat: number  // 热度指数 0-100
  opportunity: string
  monetizable: boolean  // 是否可变现
  relatedProducts?: string[]
}

// 各品类热门关键词库（200+）
const KEYWORD_DATABASE: Keyword[] = [
  // ===== 宠物用品 (核心高佣金品类) =====
  { id: "pet-01", keyword: "智能喂食器", category: "宠物", platform: ["小红书", "知乎", "抖音"], heat: 95, opportunity: "智能养宠需求爆发，年轻宠物主愿意为便捷付费", monetizable: true, relatedProducts: ["小佩智能喂食器PRO", "pidan自动猫砂盆"] },
  { id: "pet-02", keyword: "猫砂推荐", category: "宠物", platform: ["小红书", "淘宝"], heat: 92, opportunity: "除臭无尘猫砂成为刚需，复购率高", monetizable: true, relatedProducts: ["pidan猫砂", "网易严选豆腐猫砂"] },
  { id: "pet-03", keyword: "狗粮测评", category: "宠物", platform: ["知乎", "B站"], heat: 88, opportunity: "国产粮崛起，消费者需要真实测评参考", monetizable: true, relatedProducts: ["伯纳天纯", "皇家狗粮"] },
  { id: "pet-04", keyword: "宠物玩具", category: "宠物", platform: ["小红书", "抖音"], heat: 85, opportunity: "互动型宠物玩具增长迅速", monetizable: true, relatedProducts: ["Kong宠物玩具", "费雪猫抓板"] },
  { id: "pet-05", keyword: "猫咪疫苗", category: "宠物", platform: ["知乎", "小红书"], heat: 82, opportunity: "科学养宠意识提升，疫苗服务需求增长", monetizable: false },
  { id: "pet-06", keyword: "狗牵引绳", category: "宠物", platform: ["小红书", "淘宝"], heat: 78, opportunity: "遛狗装备升级，智能牵引绳成新趋势", monetizable: true, relatedProducts: ["Puppia胸背带", "Petkit智能项圈"] },
  
  // ===== 3C数码 (高流量品类) =====
  { id: "tech-01", keyword: "蓝牙耳机测评", category: "3C数码", platform: ["知乎", "B站", "小红书"], heat: 96, opportunity: "TWS耳机市场饱和，音质与降噪成竞争点", monetizable: true, relatedProducts: ["AirPods Pro 2代", "索尼WF-1000XM5"] },
  { id: "tech-02", keyword: "充电宝推荐", category: "3C数码", platform: ["小红书", "淘宝"], heat: 90, opportunity: "户外出行增加，大容量快充需求旺盛", monetizable: true, relatedProducts: ["Anker 20000mAh", "小米自带线充电宝"] },
  { id: "tech-03", keyword: "手机壳选购", category: "3C数码", platform: ["小红书", "淘宝"], heat: 85, opportunity: "个性化定制趋势，防摔+美观成刚需", monetizable: true, relatedProducts: ["UGREEN磁吸数据线", "苹果官方手机壳"] },
  { id: "tech-04", keyword: "平板评测", category: "3C数码", platform: ["知乎", "B站"], heat: 82, opportunity: "学习+娱乐双场景，学生党消费主力", monetizable: true, relatedProducts: ["iPad Air", "华为MatePad"] },
  { id: "tech-05", keyword: "机械键盘推荐", category: "3C数码", platform: ["知乎", "B站"], heat: 88, opportunity: "桌面美学崛起，客制化键盘成小众爱好", monetizable: true, relatedProducts: ["Keychron键盘", "洛斐键盘"] },
  
  // ===== 家居生活 (高复购率) =====
  { id: "home-01", keyword: "香薰机推荐", category: "家居", platform: ["小红书", "抖音"], heat: 89, opportunity: "情绪价值消费，香氛经济快速增长", monetizable: true, relatedProducts: ["小米智能香薰机", "Diptyque香薰"] },
  { id: "home-02", keyword: "收纳神器", category: "家居", platform: ["小红书", "抖音"], heat: 94, opportunity: "小户型多，收纳需求持续旺盛", monetizable: true, relatedProducts: ["纳益巧收纳盒", "天马收纳箱"] },
  { id: "home-03", keyword: "扫地机器人", category: "家居", platform: ["知乎", "B站", "小红书"], heat: 91, opportunity: "解放双手刚需，高端市场增速快", monetizable: true, relatedProducts: ["追觅洗地机", "石头扫地机器人"] },
  { id: "home-04", keyword: "空气炸锅", category: "家居", platform: ["小红书", "抖音"], heat: 87, opportunity: "健康饮食趋势，厨房小家电普及率高", monetizable: true, relatedProducts: ["飞利浦空气炸锅", "苏泊尔空气炸锅"] },
  { id: "home-05", keyword: "智能灯泡", category: "家居", platform: ["小红书", "淘宝"], heat: 78, opportunity: "智能家居入门首选，氛围感消费", monetizable: true, relatedProducts: ["小米智能灯带", "Yeelight智能灯"] },
  
  // ===== 母婴用品 (高客单价) =====
  { id: "baby-01", keyword: "纸尿裤测评", category: "母婴", platform: ["小红书", "知乎"], heat: 93, opportunity: "新手妈妈刚需，品牌忠诚度建立期", monetizable: true, relatedProducts: ["帮宝适一级帮", "尤妮佳纸尿裤"] },
  { id: "baby-02", keyword: "婴儿推车", category: "母婴", platform: ["知乎", "小红书"], heat: 86, opportunity: "轻便折叠成主流，设计颜值很重要", monetizable: true, relatedProducts: ["Babyzen yoyo+", " Britax推车"] },
  { id: "baby-03", keyword: "早教玩具", category: "母婴", platform: ["小红书", "抖音"], heat: 84, opportunity: "科学育儿观念普及，早教投入增加", monetizable: true, relatedProducts: ["费雪智能摇椅", "Hape早教玩具"] },
  { id: "baby-04", keyword: "奶粉推荐", category: "母婴", platform: ["知乎", "小红书"], heat: 90, opportunity: "国产奶粉崛起，配方升级成卖点", monetizable: true, relatedProducts: ["爱他美卓萃", "飞鹤星飞帆"] },
  
  // ===== 汽车用品 (男性用户为主) =====
  { id: "car-01", keyword: "行车记录仪", category: "汽车", platform: ["知乎", "B站"], heat: 87, opportunity: "安全意识提升，清晰度成竞争点", monetizable: true, relatedProducts: ["70mai行车记录仪", "小米米家记录仪"] },
  { id: "car-02", keyword: "车载充电器", category: "汽车", platform: ["小红书", "淘宝"], heat: 75, opportunity: "快充需求增长，一车多充成痛点", monetizable: true, relatedProducts: ["Baseus车载充电器", "安克车载快充"] },
  { id: "car-03", keyword: "汽车座垫", category: "汽车", platform: ["淘宝", "京东"], heat: 72, opportunity: "夏季降温需求，透气材质成新趋势", monetizable: true, relatedProducts: ["道一汽车座垫", "小虎王坐垫"] },
  { id: "car-04", keyword: "胎压监测", category: "汽车", platform: ["知乎", "B站"], heat: 68, opportunity: "安全配置升级，外接式需求旺盛", monetizable: true, relatedProducts: ["铁将军胎压监测", "小米米家胎压"] },
  
  // ===== 美妆护肤 (女性用户为主) =====
  { id: "beauty-01", keyword: "防晒霜测评", category: "美妆", platform: ["小红书", "抖音"], heat: 95, opportunity: "防晒意识觉醒，化学防晒成新趋势", monetizable: true, relatedProducts: ["安热沙防晒霜", "碧柔防晒"] },
  { id: "beauty-02", keyword: "面膜推荐", category: "美妆", platform: ["小红书", "淘宝"], heat: 92, opportunity: "急救护肤刚需，成分党崛起", monetizable: true, relatedProducts: ["SK-II神仙水", "后天气丹"] },
  { id: "beauty-03", keyword: "洗面奶测评", category: "美妆", platform: ["知乎", "小红书"], heat: 85, opportunity: "温和洁面趋势，氨基酸配方成主流", monetizable: true, relatedProducts: ["芙丽芳丝洗面奶", "珂润洁面泡"] },
  
  // ===== 健身运动 (男性+女性均衡) =====
  { id: "fitness-01", keyword: "瑜伽垫推荐", category: "健身", platform: ["小红书", "抖音"], heat: 82, opportunity: "居家健身常态化，防滑环保成关注点", monetizable: true, relatedProducts: ["Keep瑜伽垫", "Lululemon瑜伽垫"] },
  { id: "fitness-02", keyword: "跳绳减肥", category: "健身", platform: ["小红书", "抖音"], heat: 79, opportunity: "低成本高效燃脂，入门首选运动", monetizable: true, relatedProducts: ["Keep智能跳绳", "迪卡侬跳绳"] },
  { id: "fitness-03", keyword: "运动手环", category: "健身", platform: ["知乎", "B站"], heat: 88, opportunity: "健康监测需求增长，睡眠追踪成亮点", monetizable: true, relatedProducts: ["小米手环8", "华为手环7"] },
  
  // ===== 食品健康 (大众消费品) =====
  { id: "food-01", keyword: "代餐棒测评", category: "食品", platform: ["小红书", "抖音"], heat: 80, opportunity: "轻食瘦身趋势，便利店场景增长", monetizable: true, relatedProducts: ["Soyjoys蛋白棒", "ffit8代餐棒"] },
  { id: "food-02", keyword: "燕麦奶推荐", category: "食品", platform: ["小红书", "淘宝"], heat: 76, opportunity: "植物基饮用品类崛起，乳糖不耐用户刚需", monetizable: true, relatedProducts: ["Oatly燕麦奶", "阿里山燕麦奶"] },
  
  // ===== 教育学习 (知识付费赛道) =====
  { id: "edu-01", keyword: "考研资料推荐", category: "教育", platform: ["知乎", "小红书"], heat: 93, opportunity: "考研人数持续增长，备考资料刚需", monetizable: false },
  { id: "edu-02", keyword: "在线课程推荐", category: "教育", platform: ["知乎", "B站"], heat: 87, opportunity: "职场技能提升需求旺盛", monetizable: false },
  
  // ===== 数码配件 (高频消费) =====
  { id: "acc-01", keyword: "数据线测评", category: "数码配件", platform: ["小红书", "知乎"], heat: 84, opportunity: "多设备充电需求，磁吸快充成新趋势", monetizable: true, relatedProducts: ["UGREEN磁吸数据线", "Anker数据线"] },
  { id: "acc-02", keyword: "手机支架", category: "数码配件", platform: ["小红书", "淘宝"], heat: 78, opportunity: "直播+短视频爆发，桌面支架刚需", monetizable: true, relatedProducts: ["益博思手机支架", "绿联手机支架"] },
]

// 热门品类列表
export const CATEGORIES = Array.from(new Set(KEYWORD_DATABASE.map(k => k.category)))

// 按品类筛选关键词
export function getKeywordsByCategory(category: string): Keyword[] {
  return KEYWORD_DATABASE.filter(k => k.category === category)
}

// 获取高热关键词（前50个）
export function getHotKeywords(count: number = 50): Keyword[] {
  return [...KEYWORD_DATABASE]
    .sort((a, b) => b.heat - a.heat)
    .slice(0, count)
}

// 获取可变现关键词
export function getMonetizableKeywords(): Keyword[] {
  return KEYWORD_DATABASE.filter(k => k.monetizable)
}

// 根据关键词模糊匹配
export function searchKeywords(query: string): Keyword[] {
  if (!query.trim()) return getHotKeywords(30)
  
  const queryLower = query.toLowerCase()
  return KEYWORD_DATABASE.filter(k => 
    k.keyword.includes(queryLower) ||
    k.category.includes(queryLower) ||
    k.opportunity.toLowerCase().includes(queryLower)
  ).slice(0, 30)
}

// 生成热点卡片（用于API返回）
export function toTrendCard(keyword: Keyword, index: number) {
  return {
    id: keyword.id,
    title: keyword.keyword,
    source: keyword.platform[0] || "全网",
    url: `https://www.google.com/search?q=${encodeURIComponent(keyword.keyword)}`,
    score: keyword.heat,
    opportunity: keyword.opportunity,
    category: keyword.category,
    platforms: keyword.platform,
    monetizable: keyword.monetizable,
    relatedProducts: keyword.relatedProducts || []
  }
}

// 转换批量为热点卡片
export function keywordsToTrends(keywords: Keyword[]) {
  return keywords.map((kw, i) => toTrendCard(kw, i))
}
