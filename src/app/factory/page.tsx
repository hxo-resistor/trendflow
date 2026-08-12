'use client'

import { useState } from 'react'
import { Factory, Play, CheckCircle, Loader2, Copy, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function FactoryPage() {
  const [keywords, setKeywords] = useState('')
  const [platform, setPlatform] = useState('xiaohongshu')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])
  
  async function handleGenerate() {
    if (!keywords.trim()) return
    
    setGenerating(true)
    setProgress(0)
    setResults([])
    
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k)
    
    try {
      const res = await fetch('/api/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch-generate',
          data: {
            keywords: keywordList,
            platform,
            angles: ['review', 'compare', 'guide'],
            countPerAngle: 3
          }
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setResults(data.data)
        setProgress(100)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Factory className="w-8 h-8 text-primary" />
            批量内容工厂
          </h1>
          <p className="text-muted-foreground mt-2">
            1个关键词→100篇内容，自动去AI化+注入推广链接
          </p>
        </div>
        
        {/* Input Section */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                关键词（逗号分隔）
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="如：智能宠物喂食器,降噪耳机,车载支架"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                目标平台
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg"
              >
                <option value="xiaohongshu">小红书</option>
                <option value="zhihu">知乎</option>
                <option value="weibo">微博</option>
                <option value="douyin">抖音</option>
                <option value="wechat">公众号</option>
              </select>
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={generating || !keywords.trim()}
              className="w-full h-12 bg-gradient-to-r from-primary to-purple-600"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中... {progress}%
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  一键生成内容
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">生成结果 ({results.length}篇)</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  复制全部
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {results.map((item, index) => (
                <div key={index} className="bg-secondary rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (item.aeoScore || 0) >= 80 ? 'bg-green-500/10 text-green-600' :
                      (item.aeoScore || 0) >= 60 ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      AEO: {item.aeoScore || 0}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    关键词: {item.keyword} | 平台: {item.platform} | 字数: {item.wordCount}
                  </div>
                  <pre className="text-xs bg-background p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {item.content.substring(0, 300)}...
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!generating && results.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Factory className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">输入关键词，一键生成100篇高质量内容</p>
            <p className="text-sm mt-2">支持去AI化处理 + AEO优化 + 推广链接注入</p>
          </div>
        )}
      </div>
    </div>
  )
}