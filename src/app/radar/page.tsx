'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Eye, MessageSquare, Copy, RefreshCw } from 'lucide-react'

interface HotWord {
  id: string
  name: string
  score: number
  searchVolume: number
  trend: 'rising' | 'stable' | 'falling'
  changePercent: number
  category: string
  source: string
}

interface CommentResult {
  success: boolean
  comments: string[]
  keyword: string
}

export default function RadarPage() {
  const [hotWords, setHotWords] = useState<HotWord[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingComment, setGeneratingComment] = useState<string | null>(null)
  const [commentResults, setCommentResults] = useState<Record<string, CommentResult>>({})
  const [showCommentSheet, setShowCommentSheet] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState('')

  useEffect(() => {
    fetchHotWords()
  }, [])

  async function fetchHotWords() {
    setLoading(true)
    try {
      const res = await fetch('/api/radar/hot-words?limit=20')
      const data = await res.json()
      if (data.success) {
        setHotWords(data.words || [])
      }
    } catch (error) {
      console.error('Failed to fetch hot words:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateComments(keyword: string) {
    setGeneratingComment(keyword)
    setSelectedKeyword(keyword)
    setShowCommentSheet(true)
    
    try {
      const res = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      })
      const data = await res.json()
      if (data.success) {
        setCommentResults(prev => ({ ...prev, [keyword]: data }))
      }
    } catch (error) {
      console.error('Failed to generate comments:', error)
    } finally {
      setGeneratingComment(null)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      alert('复制失败')
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-yellow-400">📡</span>
            趋势雷达
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            实时监控热词动态，一键生成截流话术
          </p>
        </div>
        <button
          onClick={fetchHotWords}
          disabled={loading}
          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400">{hotWords.length}</div>
          <div className="text-xs text-slate-400">监测热词</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-green-400">
            {hotWords.filter(w => w.trend === 'rising').length}
          </div>
          <div className="text-xs text-slate-400">上升趋势</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(hotWords.reduce((acc, w) => acc + w.searchVolume, 0) / 1000)}K
          </div>
          <div className="text-xs text-slate-400">总搜索量</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400">
            {hotWords.filter(w => w.score >= 85).length}
          </div>
          <div className="text-xs text-slate-400">高热度词</div>
        </div>
      </div>

      {/* Hot Words Grid */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-slate-400">正在加载热词数据...</p>
        </div>
      ) : hotWords.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">暂无热词数据</p>
          <p className="text-sm mt-2">请刷新或稍后重试</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotWords.map((word) => (
            <div
              key={word.id}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{word.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      word.trend === 'rising' ? 'bg-red-500/20 text-red-400' :
                      word.trend === 'falling' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {word.trend === 'rising' ? '↑' : word.trend === 'falling' ? '↓' : '→'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {word.source} · {word.category}
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className={`text-xl font-bold ${word.score >= 90 ? 'text-red-400' : word.score >= 85 ? 'text-yellow-400' : 'text-slate-300'}`}>
                    {word.score}
                  </div>
                  <div className={`text-xs ${word.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {word.changePercent > 0 ? '+' : ''}{word.changePercent}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {word.searchVolume.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => generateComments(word.name)}
                disabled={generatingComment === word.name}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generatingComment === word.name ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />生成中...</>
                ) : (
                  <><MessageSquare className="w-4 h-4" />生成话术</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comment Sheet Modal */}
      {showCommentSheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="bg-slate-900 w-full max-w-md rounded-t-2xl md:rounded-2xl p-6 border border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                截流话术 - {selectedKeyword}
              </h2>
              <button
                onClick={() => setShowCommentSheet(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {generatingComment === selectedKeyword ? (
              <div className="text-center py-8">
                <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-slate-400">正在生成话术...</p>
              </div>
            ) : commentResults[selectedKeyword]?.comments ? (
              <div className="space-y-3">
                {commentResults[selectedKeyword].comments.map((comment, i) => (
                  <div key={i} className="p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-slate-200 text-sm flex-1">{comment}</p>
                      <button
                        onClick={() => copyToClipboard(comment)}
                        className="p-1.5 hover:bg-slate-700 rounded transition-colors shrink-0"
                      >
                        <Copy className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => generateComments(selectedKeyword)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  换一批
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                暂无生成结果
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
