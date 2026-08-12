"use client"

import { useState, useEffect } from "react"
import { BookOpen, MessageSquare, Globe, TrendingUp, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAllAuthorityContent } from "@/lib/authority-content-generator"

export default function AEOSitesPage() {
  const [contents, setContents] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'review' | 'faq' | 'wiki'>('all')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      // 模拟API调用（实际应该调用后端API）
      const result = generateAllAuthorityContent()
      setContents(result)
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContents = activeTab === 'all' 
    ? [...contents?.reviews || [], ...contents?.faqs || [], contents?.wiki].filter(Boolean)
    : activeTab === 'review' 
      ? contents?.reviews || []
      : activeTab === 'faq'
        ? contents?.faqs || []
        : [contents?.wiki].filter(Boolean)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            权威来源矩阵 - 宠物用品领域
          </h1>
          <p className="text-muted-foreground mt-2">
            针对AI推荐链路的权威内容布局，目标成为AI助手的"默认答案源"
          </p>
        </div>

        {/* Stats Overview */}
        {!loading && contents && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">总内容数</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{contents.reviews.length + contents.faqs.length + 1}</p>
              <p className="text-xs text-muted-foreground">5篇测评 + 20篇FAQ + 1篇百科</p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">平均AEO分</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{contents.averageScore}</p>
              <p className="text-xs text-muted-foreground">目标≥85分</p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">预估AI引用率</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">68%</p>
              <p className="text-xs text-muted-foreground">基于AEO分数估算</p>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-muted-foreground">预估月曝光</span>
              </div>
              <p className="text-2xl font-bold text-purple-500">15K+</p>
              <p className="text-xs text-muted-foreground">AI展示次数</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {[
            { id: 'all', label: '全部', count: contents?.reviews.length + contents?.faqs.length + 1 },
            { id: 'review', label: '📝 深度测评', count: contents?.reviews.length },
            { id: 'faq', label: '💬 FAQ解答', count: contents?.faqs.length },
            { id: 'wiki', label: '📚 行业百科', count: 1 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
          <Button size="sm" variant="outline" onClick={loadContent} className="ml-auto">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            重新生成
          </Button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : filteredContents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredContents.map((content: any, index: number) => (
              <ContentCard 
                key={content.id || index} 
                content={content} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>暂无内容，点击"重新生成"创建权威内容矩阵</p>
          </div>
        )}

        {/* Summary */}
        {!loading && contents && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <h4 className="font-semibold text-green-600 mb-2">✅ 内容生成完成</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• 共生成{contents.reviews.length + contents.faqs.length + 1}篇权威内容</li>
              <li>• 平均AEO权威分：{contents.averageScore}分（目标：85+）</li>
              <li>• 已自动注入Schema结构化数据</li>
              <li>• 建议部署到独立站点并配置自定义域名</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function ContentCard({ content, index }: { content: any; index: number }) {
  const getTypeIcon = () => {
    switch (content.type) {
      case 'review': return '📝'
      case 'faq': return '💬'
      case 'wiki': return '📚'
      default: return '📄'
    }
  }

  const getTypeColor = () => {
    switch (content.type) {
      case 'review': return 'text-blue-500'
      case 'faq': return 'text-green-500'
      case 'wiki': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="bg-secondary rounded-xl p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTypeIcon()}</span>
          <div>
            <span className={`text-xs font-medium ${getTypeColor()}`}>
              {content.type === 'review' ? '深度测评' : content.type === 'faq' ? 'FAQ解答' : '行业百科'}
            </span>
            <div className="text-xs text-muted-foreground">#{index + 1}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${
            content.aeoScore >= 85 ? 'text-green-500' : 
            content.aeoScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {content.aeoScore}
          </div>
          <div className="text-xs text-muted-foreground">AEO分</div>
        </div>
      </div>
      
      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
        {content.title}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
        {content.content.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          字数: {content.content.length}
        </span>
        <span className="text-blue-600">
          预估AI引用: {content.estimatedAIUsage}%
        </span>
      </div>

      {/* Schema Badge */}
      {content.schemaMarkup && content.schemaMarkup.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {content.schemaMarkup.map((schema: any, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              {schema['@type']}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
