"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Check, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateBattleContent } from "@/lib/battle-content-generator"
import type { GeneratedContent } from "@/lib/battle-content-generator"

export default function GeneratePage() {
  const [keyword, setKeyword] = useState("智能宠物喂食器")
  const [platform, setPlatform] = useState("xiaohongshu")
  const [followers, setFollowers] = useState(0)  // 新增：当前粉丝数
  const [loading, setLoading] = useState(false)
  const [contents, setContents] = useState<GeneratedContent[]>([])
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ total: 0, avgAeo: 0 })

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      alert('请输入关键词')
      return
    }
    
    setLoading(true)
    setContents([]) // 清空旧数据
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trendTitle: keyword,
          opportunity: '测试机会',
          platform: platform === 'all' ? 'xiaohongshu' : platform,
          count: 5
        })
      })
      
      if (!response.ok) {
        throw new Error('生成失败')
      }
      
      const data = await response.json()
      
      if (data && Array.isArray(data)) {
        const newContents = data.map((item: any, index: number) => ({
          id: `${index + 1}`,
          title: item.title || keyword,
          content: item.content,
          platform: item.platform || platform,
          product: item.platform || '未知',
          angle: '种草',
          aeoScore: item.aeoScore || 85,
          schemaMarkup: item.schemaMarkup || null
        }))
        setContents(newContents)
        setStats({
          total: data.length,
          avgAeo: Math.round(data.reduce((sum: number, item: any) => sum + (item.aeoScore || 85), 0) / data.length)
        })
      }
    } catch (error) {
      console.error('Generation failed:', error)
      alert('生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAll = () => {
    const allContent = contents.map(c => `## ${c.title}\n\n${c.content}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(allContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      keyword,
      platform,
      contents,
      stats
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `内容矩阵-${keyword.replace(/\s+/g, '-')}.json`
    a.click()
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            实战内容批量生成
          </h1>
          <p className="text-muted-foreground mt-2">
            一键生成30篇高质量内容，自动注入推广链接
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                关键词
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="如：智能宠物喂食器"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                目标平台
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
              >
                <option value="xiaohongshu">小红书</option>
                <option value="zhihu">知乎</option>
                <option value="weibo">微博</option>
                <option value="douyin">抖音</option>
                <option value="wechat">公众号</option>
                <option value="all">全部平台</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  当前粉丝数
                </label>
                <input
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(parseInt(e.target.value) || 0)}
                  placeholder="如：500"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      一键生成
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-4 border border-border text-center">
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">生成内容</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border text-center">
              <div className="text-3xl font-bold text-green-500">{stats.avgAeo}</div>
              <div className="text-sm text-muted-foreground">平均AEO分</div>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border text-center">
              <div className="text-3xl font-bold text-purple-500">30</div>
              <div className="text-sm text-muted-foreground">目标数量</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {contents.length > 0 && (
          <div className="flex gap-4 mb-6">
            <Button onClick={handleCopyAll} variant="outline">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              复制全部内容
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出JSON
            </Button>
          </div>
        )}

        {/* Content List */}
        {contents.length > 0 && (
          <div className="space-y-4">
            {contents.map((content, index) => (
              <ContentCard key={content.id} content={content} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {contents.length === 0 && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">输入关键词，一键生成30篇高质量内容</p>
            <p className="text-sm mt-2">覆盖5个产品 × 6个角度，自动注入推广链接</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ContentCard({ content, index }: { content: GeneratedContent; index: number }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
            {content.product}
          </span>
          <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full">
            {content.angle}
          </span>
        </div>
        <span className={`text-sm font-bold ${
          content.aeoScore >= 85 ? 'text-green-500' : 
          content.aeoScore >= 70 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          AEO: {content.aeoScore}
        </span>
      </div>
      
      <h3 className="font-medium text-foreground mb-2">{content.title}</h3>
      
      {expanded && (
        <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
          {content.content.substring(0, 500)}...
        </pre>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline"
        >
          {expanded ? '收起' : '查看详情'}
        </button>
        
        <button
          onClick={() => navigator.clipboard.writeText(content.content)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          复制
        </button>
      </div>
    </div>
  )
}
