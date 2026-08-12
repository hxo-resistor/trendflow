/**
 * GEO语义一致性引擎 - 确保多平台信息一致
 */

import { ProductKnowledgeBase } from './geo-product-kb'

export interface ConsistencyCheck {
  productId: string
  issues: ConsistencyIssue[]
  overallScore: number
  recommendations: string[]
}

export interface ConsistencyIssue {
  type: 'contradiction' | 'missing' | 'inconsistency'
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestion: string
}

// 平台间必须一致的核心字段
const CORE_FIELDS = ['name', 'brand', 'priceRange', 'keyFeatures', 'pros', 'cons']

/**
 * 检查产品知识的一致性
 */
export function checkProductConsistency(
  productId: string,
  platforms: string[],
  contents: Record<string, string>
): ConsistencyCheck {
  const issues: ConsistencyIssue[] = []
  const kb = getKBForProduct(productId)
  
  if (!kb) {
    return {
      productId,
      issues: [{
        type: 'missing',
        severity: 'high',
        description: `产品知识库中未找到 ${productId}`,
        suggestion: '请先在知识库中添加该产品'
      }],
      overallScore: 0,
      recommendations: ['请在知识库中添加该产品']
    }
  }
  
  // 检查各平台对核心字段的使用一致性
  CORE_FIELDS.forEach(field => {
    const values = platforms.map(p => contents[p]?.toLowerCase())
    if (values.some(v => v && !v.includes(kb[field as keyof typeof kb]?.toString().toLowerCase()))) {
      issues.push({
        type: 'inconsistency',
        severity: 'medium',
        description: `${field}在不同平台描述不一致`,
        suggestion: `确保所有平台使用相同的产品${field}描述`
      })
    }
  })
  
  // 检查数据点一致性
  if (kb.sharedDataPoints) {
    Object.entries(kb.sharedDataPoints).forEach(([key, value]) => {
      if (value) {
        const inconsistentPlatforms = platforms.filter(p => {
          const content = contents[p] || ''
          return !content.includes(value.toString()) && content.length > 100
        })
        if (inconsistentPlatforms.length > 0) {
          issues.push({
            type: 'inconsistency',
            severity: 'low',
            description: `数据点"${key}"在${inconsistentPlatforms.length}个平台未提及`,
            suggestion: '建议在主要平台添加关键数据点'
          })
        }
      }
    })
  }
  
  // 计算一致性评分
  const maxPossibleIssues = platforms.length * CORE_FIELDS.length
  const overallScore = Math.max(0, 100 - (issues.length / Math.max(maxPossibleIssues, 1)) * 100)
  
  return {
    productId,
    issues,
    overallScore: Math.round(overallScore),
    recommendations: generateRecommendations(issues)
  }
}

/**
 * 获取产品知识库
 */
function getKBForProduct(productId: string): any {
  // 从geo-product-kb导入
  const { PRODUCT_KB } = require('./geo-product-kb')
  return PRODUCT_KB[productId] || null
}

/**
 * 根据问题生成建议
 */
function generateRecommendations(issues: ConsistencyIssue[]): string[] {
  const recommendations: string[] = []
  
  issues.forEach(issue => {
    if (issue.type === 'missing') {
      recommendations.push(`添加缺失的${issue.description}`)
    } else if (issue.severity === 'high') {
      recommendations.push(`修复高优先级问题：${issue.description}`)
    } else if (issue.severity === 'medium') {
      recommendations.push(`优化中等优先级问题：${issue.description}`)
    }
  })
  
  if (recommendations.length === 0) {
    recommendations.push('保持一致性良好，继续保持！')
  }
  
  return recommendations
}

/**
 * 生成一致性报告
 */
export function generateConsistencyReport(check: ConsistencyCheck): string {
  let report = `# 产品一致性检查报告\n\n`
  report += `**产品ID**: ${check.productId}\n`
  report += `**整体评分**: ${check.overallScore}/100\n\n`
  
  if (check.issues.length === 0) {
    report += '✅ 通过！所有内容保持一致性。\n'
  } else {
    report += '## 发现的问题\n\n'
    check.issues.forEach((issue, idx) => {
      const severity = issue.severity === 'high' ? '🔴 高' : 
                       issue.severity === 'medium' ? '🟡 中' : '🟢 低'
      report += `${idx + 1}. ${severity} - ${issue.description}\n`
      report += `   建议：${issue.suggestion}\n\n`
    })
  }
  
  return report
}