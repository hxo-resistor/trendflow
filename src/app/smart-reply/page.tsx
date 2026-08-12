'use client'

import { useState } from 'react'
import { MessageSquare, Copy, RefreshCw, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface MatchResult {
  matchedStrategy?: {
    id: string
    name: string
    tone: string
  }
  suggestions: string[]
  confidence: number
}

interface BatchResult {
  comment: string
  result: MatchResult
}

export default function SmartReplyPage() {
  const [comment, setComment] = useState('')
  const [batchComments, setBatchComments] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [loading, setLoading] = useState(false)
  
  async function handleMatch() {
    if (!comment.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'match',
          data: { comment }
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      }
    } catch (error) {
      console.error('Match failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleBatchMatch() {
    if (!batchComments.trim()) return
    
    setLoading(true)
    try {
      const comments = batchComments.split('\n').filter(c => c.trim())
      
      const res = await fetch('/api/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch',
          data: { comments }
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setBatchResults(data.data)
      }
    } catch (error) {
      console.error('Batch match failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板！')
    } catch (error) {
      alert('复制失败，请手动复制')
    }
  }
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            智能回复系统
          </h1>
          <p className="text-muted-foreground mt-2">
            AI自动匹配评论意图，生成3条高情商回复建议
          </p>
        </div>
        
        {/* Single Comment Test */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">单条评论测试</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">输入用户评论</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="粘贴用户评论..."
                className="w-full h-24 px-4 py-3 bg-background border border-border rounded-lg resize-none"
              />
            </div>
            
            <Button
              onClick={handleMatch}
              disabled={loading || !comment.trim()}
              className="w-full"
            >
              {loading ? '分析中...' : '生成回复建议'}
            </Button>
            
            {result && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {result.matchedStrategy?.name || '通用回复'}
                  </span>
                  <span>置信度: {Math.round(result.confidence)}%</span>
                </div>
                
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                      <span className="text-sm flex-1">{suggestion}</span>
                      <button
                        onClick={() => copyToClipboard(suggestion)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Batch Test */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">批量测试</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                输入多条评论（每行一条）
              </label>
              <textarea
                value={batchComments}
                onChange={(e) => setBatchComments(e.target.value)}
                placeholder="每行一条评论...\n这条评论问价格\n那条评论问链接\n这条说不错"
                className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none"
              />
            </div>
            
            <Button
              onClick={handleBatchMatch}
              disabled={loading || !batchComments.trim()}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              批量生成回复建议
            </Button>
            
            {batchResults.length > 0 && (
              <div className="mt-4 space-y-4">
                {batchResults.map((item, idx) => (
                  <div key={idx} className="p-4 bg-background rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-2">
                      原评论: {item.comment}
                    </div>
                    <div className="space-y-1">
                      {item.result.suggestions.map((suggestion, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-sm">
                          <span className="flex-1 text-green-600">{suggestion}</span>
                          <button
                            onClick={() => copyToClipboard(suggestion)}
                            className="p-1 hover:bg-accent rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Strategy Info */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: '询问品牌', count: 4, color: 'blue' },
            { name: '询问价格', count: 4, color: 'green' },
            { name: '询问链接', count: 4, color: 'purple' },
            { name: '正面互动', count: 4, color: 'yellow' },
            { name: '质疑反驳', count: 4, color: 'orange' },
            { name: '比较咨询', count: 4, color: 'pink' }
          ].map((strategy, idx) => (
            <div key={idx} className="p-4 bg-secondary rounded-lg border text-center">
              <div className="font-medium">{strategy.name}</div>
              <div className="text-sm text-muted-foreground">{strategy.count}条话术</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}