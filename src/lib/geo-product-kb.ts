/**
 * GEO产品知识库 - 确保所有账号对同一产品的信息一致
 */

export interface ProductKnowledgeBase {
  productId: string
  name: string
  brand: string
  category: string
  priceRange: { min: number; max: number; currency: string }
  keyFeatures: string[]
  pros: string[]
  cons: string[]
  targetUsers: string[]
  specs: Record<string, string>
  sharedDataPoints: {
    salesVolume?: string
    rating?: string
    reviewCount?: string
    comparisonData?: string
  }
  personaVariations: PersonaVariation[]
}

export interface PersonaVariation {
  personaId: string
  personaName: string
  emphasis: string[]      // 强调点
  avoid: string[]          // 避免提及
  style: string            // 表达风格
  dataEmphasis: string[]   // 重点数据
}

// 核心产品知识库（示例数据，实际应从联盟API获取）
export const PRODUCT_KB: Record<string, ProductKnowledgeBase> = {
  'smart-feeder': {
    productId: 'smart-feeder',
    name: '智能宠物喂食器',
    brand: '小佩/霍曼/CATLINK',
    category: '宠物用品',
    priceRange: { min: 299, max: 899, currency: 'CNY' },
    keyFeatures: [
      'APP远程控制',
      '定时定量投喂',
      '高清摄像头监控',
      '双电源供电',
      '防卡粮设计'
    ],
    pros: [
      '解决上班族喂食痛点',
      '科学定时定量',
      '手机随时查看宠物状态',
      '大容量储粮仓',
      '低噪音设计'
    ],
    cons: [
      '需要定期清理',
      '价格偏高',
      '部分型号需配合专用粮',
      '智能功能依赖网络'
    ],
    targetUsers: [
      '上班族',
      '出差频繁者',
      '多宠家庭',
      '科学养宠人群'
    ],
    specs: {
      '容量': '2-6L可选',
      '供电': '插电+电池双供电',
      '连接': 'WiFi/蓝牙',
      '材质': '食品级ABS'
    },
    sharedDataPoints: {
      salesVolume: '月销10000+',
      rating: '4.8/5.0',
      reviewCount: '好评率98%',
      comparisonData: '同价位销量第一'
    },
    personaVariations: [
      {
        personaId: 'tech-guy',
        personaName: '数码极客男',
        emphasis: ['技术参数', '智能功能', '对比评测'],
        avoid: ['萌系表达', '情感化描述'],
        style: '理性、参数党、数据说话',
        dataEmphasis: ['容量', '续航', '连接稳定性']
      },
      {
        personaId: 'mom',
        personaName: '精致宝妈',
        emphasis: ['安全性', '易用性', '性价比'],
        avoid: ['硬核参数', '技术术语'],
        style: '感性、实用、亲测分享',
        dataEmphasis: ['使用便捷度', '清理方便程度']
      },
      {
        personaId: 'student',
        personaName: '学生党省钱王',
        emphasis: ['价格优势', '平替推荐', '优惠券信息'],
        avoid: ['高端定位', '奢侈品描述'],
        style: '直白、接地气、穷但精致',
        dataEmphasis: ['性价比', '学生优惠']
      }
    ]
  },
  'noise-cancelling-earbuds': {
    productId: 'noise-cancelling-earbuds',
    name: 'TWS降噪蓝牙耳机',
    brand: 'AirPods/索尼/漫步者',
    category: '数码配件',
    priceRange: { min: 99, max: 1999, currency: 'CNY' },
    keyFeatures: [
      '主动降噪',
      '蓝牙5.3',
      '长续航',
      '触控操作',
      'IPX4防水'
    ],
    pros: [
      '通勤降噪效果明显',
      '音质比预期好',
      '续航约30小时',
      '佩戴舒适不压耳',
      '连接稳定不掉线'
    ],
    cons: [
      '降噪深度有限',
      '通话质量一般',
      '高音量有底噪',
      '充电盒偏大'
    ],
    targetUsers: [
      '通勤族',
      '学生党',
      '健身爱好者',
      '音乐爱好者'
    ],
    specs: {
      '驱动单元': '10mm动圈',
      '降噪深度': '35dB',
      '续航': '单次8h+充电盒22h',
      '重量': '单耳4.5g'
    },
    sharedDataPoints: {
      salesVolume: '月销50000+',
      rating: '4.7/5.0',
      reviewCount: '好评率96%',
      comparisonData: '百元档销量TOP3'
    },
    personaVariations: [
      {
        personaId: 'tech-guy',
        personaName: '数码极客男',
        emphasis: ['降噪深度', '音质解析', '续航实测'],
        avoid: ['外观颜色'],
        style: '专业评测、数据对比',
        dataEmphasis: ['频响范围', '阻抗', '续航时长']
      },
      {
        personaId: 'commuter',
        personaName: '通勤上班族',
        emphasis: ['降噪效果', '佩戴舒适度', '便携性'],
        avoid: ['极限参数'],
        style: '真实体验、场景化描述',
        dataEmphasis: ['地铁降噪效果', '续航够用天数']
      }
    ]
  },
  'car-phone-mount': {
    productId: 'car-phone-mount',
    name: '车载手机支架',
    brand: '倍思/绿联/邦纳仕',
    category: '汽车用品',
    priceRange: { min: 29, max: 199, currency: 'CNY' },
    keyFeatures: [
      '磁吸/重力夹持',
      '360度旋转',
      '稳固不抖动',
      '不挡视线',
      '适配各种车型'
    ],
    pros: [
      '安装简单',
      '取放方便',
      '导航定位准确',
      '行车稳定不晃',
      '性价比高'
    ],
    cons: [
      '磁吸款可能影响无线充电',
      '出风口款部分车型不适用',
      '夏季暴晒后粘合剂可能失效'
    ],
    targetUsers: [
      '网约车司机',
      '日常通勤族',
      '自驾游爱好者',
      '外卖骑手'
    ],
    specs: {
      '固定方式': '出风口/仪表台/挡风玻璃',
      '兼容尺寸': '4.7-6.8英寸手机',
      '材质': '铝合金+硅胶',
      '重量': '约50g'
    },
    sharedDataPoints: {
      salesVolume: '月销30000+',
      rating: '4.6/5.0',
      reviewCount: '好评率95%'
    },
    personaVariations: [
      {
        personaId: 'car-enthusiast',
        personaName: '汽车发烧友',
        emphasis: ['稳固性', '安装便捷', '兼容性'],
        avoid: ['过于技术化'],
        style: '专业、实测、对比',
        dataEmphasis: ['震动测试数据', '兼容性列表']
      }
    ]
  }
}

/**
 * 根据产品ID获取知识库
 */
export function getProductKB(productId: string): ProductKnowledgeBase | null {
  return PRODUCT_KB[productId] || null
}

/**
 * 搜索相关产品
 */
export function searchProducts(keyword: string): ProductKnowledgeBase[] {
  return Object.values(PRODUCT_KB).filter(p =>
    p.name.includes(keyword) ||
    p.category.includes(keyword) ||
    p.keyFeatures.some(f => f.includes(keyword))
  )
}

/**
 * 获取人设差异化的内容建议
 */
export function getPersonaContentAdvice(
  productId: string,
  personaId: string
): {
  emphasis: string[]
  avoid: string[]
  style: string
  dataEmphasis: string[]
} | null {
  const product = PRODUCT_KB[productId]
  if (!product) return null
  
  const persona = product.personaVariations.find(p => p.personaId === personaId)
  if (!persona) return null
  
  return {
    emphasis: persona.emphasis,
    avoid: persona.avoid,
    style: persona.style,
    dataEmphasis: persona.dataEmphasis
  }
}

/**
 * 生成产品摘要（用于FAQ结构）
 */
export function generateProductSummary(productId: string): string {
  const product = PRODUCT_KB[productId]
  if (!product) return ''
  
  return `## ${product.name}\n\n**品牌**: ${product.brand}\n**价格区间**: ¥${product.priceRange.min}-${product.priceRange.max}\n\n### 核心特点\n${product.keyFeatures.map(f => `- ${f}`).join('\n')}\n\n### 优点\n${product.pros.map(p => `- ${p}`).join('\n')}\n\n### 缺点\n${product.cons.map(c => `- ${c}`).join('\n')}\n\n### 适合人群\n${product.targetUsers.map(u => `- ${u}`).join('\n')}`
}