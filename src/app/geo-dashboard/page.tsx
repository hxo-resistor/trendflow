'use client'

import { useState } from 'react'
import { Brain, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface GEOScore {
  total: number
  structureScore: number
  dataScore: number
  semanticScore: number
  authorityScore: number
}

export default function GeoDashboardPage() {
  const [content, setContent] = useState('')
  const [productId, setProductId] = useState('')
  const [platform, setPlatform] = useState('xiaohongshu')
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<GEOScore | null>(null)
  const [result, setResult] = useState<any>(null)
  
  async function handleScore() {
    if (!content.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'score',
          data: { content, productId, platform }
        })
      })
      const data = await res.json()
      if (data.success) {
        setScore(data.score)
        setResult(data)
      }
    } catch (error) {
      console.error('Score failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleStructure() {
    if (!content.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'structure',
          data: { content, productId }
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
      }
    } catch (error) {
      console.error('Structure failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            GEO优化引擎
          </h1>
          <p className="text-muted-foreground mt-2">
            让内容被AI优先引用 · 结构化数据注入 · 语义一致性检查
          </p>
        </div>
        
        {/* Input Section */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">内容输入</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴你的内容..."
                className="w-full h-40 px-4 py-3 bg-background border border-border rounded-lg resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">产品ID（可选）</label>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="如：smart-feeder"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">平台</label>
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
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleScore}
                disabled={loading || !content.trim()}
                className="flex-1"
              >
                <Brain className="w-4 h-4 mr-2" />
                GEO评分
              </Button>
              <Button
                onClick={handleStructure}
                variant="outline"
                disabled={loading || !content.trim()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                结构化注入
              </Button>
            </div>
          </div>
        </div>
        
        {/* Score Display */}
        {score && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-6 border border-border text-center">
              <div className={`text-4xl font-bold ${score.total >= 70 ? 'text-green-500' : score.total >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {score.total}
              </div>
              <div className="text-sm text-muted-foreground mt-1">总分</div>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border">
              <div className="text-2xl font-bold text-blue-500">{score.structureScore}</div>
              <div className="text-xs text-muted-foreground">结构化</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${score.structureScore}%` }}></div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border">
              <div className="text-2xl font-bold text-green-500">{score.dataScore}</div>
              <div className="text-xs text-muted-foreground">数据支撑</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${score.dataScore}%` }}></div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-xl p-4 border">
              <div className="text-2xl font-bold text-purple-500">{score.authorityScore}</div>
              <div className="text-xs text-muted-foreground">可信度</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${score.authorityScore}%` }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Result Display */}
        {result && (
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">优化结果</h2>
            
            {result.verdict && (
              <div className={`p-4 rounded-lg mb-4 ${
                result.verdict.level === 'optimal' ? 'bg-green-500/10 border border-green-500/30' :
                result.verdict.level === 'publishable' ? 'bg-blue-500/10 border border-blue-500/30' :
                'bg-yellow-500/10 border border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {result.verdict.level === 'optimal' || result.verdict.level === 'publishable' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">{result.verdict.message}</span>
                </div>
              </div>
            )}
            
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">优化建议：</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.structured && (
              <div>
                <h3 className="font-medium mb-2">结构化后内容：</h3>
                <pre className="bg-background p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
                  {result.structured.substring(0, 500)}...
                </pre>
              </div>
            )}
          </div>
        )}
        
        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">输入内容开始GEO优化</p>
            <p className="text-sm mt-2">AI将分析你的内容并给出优化建议</p>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">正在分析...</p>
          </div>
        )}
      </div>
    </div>
  )
}