"use client"

import { useState, useEffect } from "react"
import { Target, TrendingUp, DollarSign, Zap, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DomainAnalysis, AuthoritySite } from "@/app/api/authority/route"

export default function AuthorityPage() {
  const [domains, setDomains] = useState<DomainAnalysis[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [sites, setSites] = useState<AuthoritySite[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const response = await fetch('/api/authority')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDomains(data.domains)
          if (data.top3 && data.top3.length > 0) {
            setSelectedDomain(data.top3[0].domain)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load domains:', error)
    }
  }

  const handleGenerate = async (siteType: string) => {
    if (!selectedDomain) return
    
    setGenerating(true)
    try {
      const response = await fetch('/api/authority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: selectedDomain,
          siteType,
          count: siteType === 'faq' ? 20 : 5
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSites(prev => [...prev, ...data.generatedSites])
        }
      }
    } catch (error) {
      console.error('Failed to generate content:', error)
    } finally {
      setGenerating(false)
    }
  }

  const selectedDomainData = domains.find(d => d.domain === selectedDomain)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            权威来源矩阵建设
          </h1>
          <p className="text-muted-foreground mt-2">
            针对垂直领域建立AI引用矩阵，让系统成为AI助手的"默认答案"
          </p>
        </div>

        {/* Domain Selection */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            选择攻击目标领域
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {domains.slice(0, 3).map((domain, index) => (
              <button
                key={domain.domain}
                onClick={() => setSelectedDomain(domain.domain)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedDomain === domain.domain
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{domain.domain}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                    index === 1 ? 'bg-gray-400/20 text-gray-600' :
                    'bg-orange-500/20 text-orange-600'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>竞争强度</span>
                    <span className={domain.competitionScore < 50 ? 'text-green-500' : 'text-red-500'}>
                      {domain.competitionScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>变现潜力</span>
                    <span className="text-green-500">{domain.revenuePotential}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI引用难度</span>
                    <span className={domain.aeoDifficulty > 60 ? 'text-green-500' : 'text-yellow-500'}>
                      {domain.aeoDifficulty}/100
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>综合得分</span>
                    <span className="text-primary">{domain.overallScore}/100</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedDomainData && (
            <div className="bg-background rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">
                选定领域：{selectedDomainData.domain}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">关键词总数：</span>
                  <span className="font-medium">{selectedDomainData.totalKeywords}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">上升关键词：</span>
                  <span className="font-medium text-green-500">{selectedDomainData.risingKeywords}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">可变现关键词：</span>
                  <span className="font-medium text-yellow-500">{selectedDomainData.monetizableKeywords}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">高热度词：</span>
                  <span className="font-medium text-red-500">{selectedDomainData.highHeatKeywords}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Buttons */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-8">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            生成权威内容
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleGenerate('review')}
              disabled={generating || !selectedDomain}
              className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  📝
                </div>
                <div>
                  <h4 className="font-medium text-foreground">深度测评站</h4>
                  <p className="text-xs text-muted-foreground">5篇产品测评</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                专业评测风格，建立行业权威性
              </p>
            </button>

            <button
              onClick={() => handleGenerate('faq')}
              disabled={generating || !selectedDomain}
              className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  💬
                </div>
                <div>
                  <h4 className="font-medium text-foreground">FAQ解答站</h4>
                  <p className="text-xs text-muted-foreground">20个高频问题</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                问答结构，AI最爱引用的格式
              </p>
            </button>

            <button
              onClick={() => handleGenerate('wiki')}
              disabled={generating || !selectedDomain}
              className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  📚
                </div>
                <div>
                  <h4 className="font-medium text-foreground">行业百科站</h4>
                  <p className="text-xs text-muted-foreground">完整选购指南</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                结构化程度最高，目标是AI"默认引用源"
              </p>
            </button>
          </div>
        </div>

        {/* Generated Sites */}
        {sites.length > 0 && (
          <div className="bg-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                已生成的权威内容 ({sites.length}篇)
              </h3>
              <span className="text-sm text-muted-foreground">
                平均AEO权威分: {Math.round(sites.reduce((a, b) => a + b.aeoScore, 0) / sites.length)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site) => (
                <div key={site.id} className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {site.type === 'review' ? '📝 测评' : site.type === 'faq' ? '💬 FAQ' : '📚 百科'}
                    </span>
                    <span className="text-xs text-muted-foreground">{site.keyword}</span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                    {site.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      字数: {site.content.length}
                    </span>
                    <span className={`font-medium ${
                      site.aeoScore >= 85 ? 'text-green-500' : 
                      site.aeoScore >= 70 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      AEO: {site.aeoScore}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    预估AI引用率: {site.estimatedAIOcclusion}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="font-semibold text-blue-600 mb-2">💡 战略建议</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>优先选择</strong>：竞争强度低（&lt;50）、变现潜力高（&gt;70）的领域</li>
            <li>• <strong>内容配比</strong>：FAQ站优先级最高（AI最爱引用），其次是百科站和测评站</li>
            <li>• <strong>AEO目标</strong>：每篇文章目标85分以上，确保成为AI的"可信来源"</li>
            <li>• <strong>后续动作</strong>：部署到独立站点，提交给AI助手的数据源</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
