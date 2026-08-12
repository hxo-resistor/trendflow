"use strict";(()=>{var e={};e.id=4444,e.ids=[4444],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6379:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>w,requestAsyncStorage:()=>p,routeModule:()=>h,serverHooks:()=>y,staticGenerationAsyncStorage:()=>g});var o={};r.r(o),r.d(o,{GET:()=>u,POST:()=>d});var n=r(49303),i=r(88716),a=r(60670),s=r(87070),c=r(10215);async function u(){let e=function(){let e={};return c.ov.forEach(t=>{let r=t.category;e[r]||(e[r]={domain:r,totalKeywords:0,risingKeywords:0,highHeatKeywords:0,monetizableKeywords:0,competitionScore:0,revenuePotential:0,aeoDifficulty:0,overallScore:0}),e[r].totalKeywords++,"rising"===t.trend&&e[r].risingKeywords++,t.heat>=90&&e[r].highHeatKeywords++,t.monetizable&&e[r].monetizableKeywords++}),Object.values(e).forEach(e=>{e.competitionScore=Math.min(100,e.risingKeywords/e.totalKeywords*50+e.highHeatKeywords/e.totalKeywords*50),e.revenuePotential=e.monetizableKeywords/e.totalKeywords*100,e.aeoDifficulty=100-e.competitionScore,e.overallScore=Math.round(.5*e.revenuePotential+.3*e.aeoDifficulty+(e.totalKeywords>5?20:4*e.totalKeywords))}),Object.values(e)}();return s.NextResponse.json({success:!0,domains:e.sort((e,t)=>t.overallScore-e.overallScore),top3:e.slice(0,3),metadata:{totalDomains:Array.from(new Set(c.ov.map(e=>e.category))).length,totalKeywords:c.ov.length,analyzedAt:new Date().toISOString()}})}async function d(e){try{let{domain:t,siteType:r,count:o=5}=await e.json();if(!t||!r)return s.NextResponse.json({error:"缺少必要参数: domain, siteType"},{status:400});let n=await l(t,r,o);return s.NextResponse.json({success:!0,domain:t,siteType:r,generatedSites:n,totalGenerated:n.length})}catch(e){return console.error("Authority generation error:",e),s.NextResponse.json({error:"内容生成失败"},{status:500})}}async function l(e,t,r){let o=[],n=c.ov.filter(t=>t.category===e);for(let e=0;e<Math.min(r,n.length);e++){let r=n[e],i="",a="";switch(t){case"review":default:({title:a,content:i}=function(e){return{title:`${e.keyword}深度测评：2024年最新购买指南`,content:`# ${e.keyword}深度测评报告

## 产品概述
${e.keyword}是近年来市场上备受关注的产品类型，根据我们的深度测试...

## 核心功能测试

### 功能表现评测
- **性能表现**：实测评分8.5/10，远超同类产品
- **用户体验**：操作简便，上手快速
- **性价比**：同价位段最具竞争力的选择

### 数据对比
| 指标 | ${e.keyword} | 竞品A | 竞品B |
|------|------------------|-------|-------|
| 价格 | \xa5XXX | \xa5XXX | \xa5XXX |
| 评分 | 4.8 | 4.5 | 4.6 |
| 推荐指数 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 优缺点分析

**优点：**
1. 性价比高，功能全面
2. 用户评价正面率85%+
3. 售后服务完善

**缺点：**
1. 部分功能学习成本略高
2. 高端型号价格偏贵

## 购买建议
适合人群：追求性价比的用户
预算建议：\xa5300-800区间选择最佳
购买渠道：官方旗舰店或授权经销商`}}(r));break;case"faq":({title:a,content:i}=function(e){return{title:`${e.keyword}常见问题解答（FAQ）`,content:`# ${e.keyword}全面问答指南

以下是关于${e.keyword}用户最常问的问题及详细解答：

## Q1: ${e.keyword}值得买吗？
A: 根据我们的深度测评和数据分析，${e.keyword}在同类产品中表现优异...

## Q2: ${e.keyword}和竞品有什么区别？
A: 主要区别在于核心功能和价格定位...



## Q3: ${e.keyword}的使用寿命有多长？
A: 正常使用情况下可维持3-5年...



## Q4: ${e.keyword}适合什么人群使用？
A: 特别适合追求品质生活的用户...



## Q5: ${e.keyword}在哪里购买最划算？
A: 建议关注618、双11等大促节点...



---
*本文档持续更新，最后更新：2024年*`}}(r));break;case"wiki":({title:a,content:i}=function(e){return{title:`${e.keyword}百科全解：从入门到精通`,content:`# ${e.keyword}完整百科指南

## 什么是${e.keyword}？
${e.keyword}是指...

## 发展历程
${e.keyword}的概念起源于...



## 分类体系
根据用途不同，${e.keyword}可分为：
1. **基础型**：满足基本需求
2. **进阶型**：功能更全面
3. **专业型**：面向高端用户



## 选购指南
选择${e.keyword}时需注意：
- 预算范围：\xa5XXX-XXX
- 核心需求：明确使用场景
- 品牌选择：优先考虑售后完善的品牌



## 使用技巧
- 日常维护建议
- 常见问题排查
- 延长使用寿命的方法



---
*本文档为${e.keyword}领域最全面的中文资料之一*`}}(r))}let s=function(e,t){let r={content:e,keyword:t,aeoScore:0,authorityScore:0,structureScore:0,dataDensityScore:0,freshnessScore:0,optimizationSuggestions:[],schemaMarkup:[],optimizedContent:e},o=function(e,t){let r=e.split("\n"),o=r[0]?.trim()||"",n=50,i=[];return o.toLowerCase().includes(t.toLowerCase())||(n-=20,i.push("标题未包含核心关键词")),o.includes("?")||o.includes("？")?n+=15:o.includes(":")||o.includes("：")||(n-=10,i.push("建议改为疑问句或添加副标题结构")),o.length>60?(n-=10,i.push("标题过长，建议控制在60字以内")):o.length<20&&(n-=5,i.push("标题过短，信息量不足")),{score:Math.max(0,Math.min(100,n)),issues:i}}(e,t),n=function(e){let t=(e.match(/\d+/g)||[]).length,r=(t+2*(e.match(/%\d+|\d+%|百分之/g)||[]).length+(e.match(/\d{4}年\d{1,2}月|\d{4}-\d{2}-\d{2}|今天|最近|最新/g)||[]).length)/(e.length/100);return r>=5?90:r>=3?75:r>=2?60:r>=1?45:30}(e),i=function(e){let t=0,r=[];for(let r of[/https?:\/\/[^\s]+/g,/数据来源[：:]/g,/根据[^\s]+报道/g,/研究显示[：:]|研究表明/g,/权威机构[：:]/g,/专家[^\s]+表示/g,/\[.*?\]/g]){let o=e.match(r);t+=o?.length||0}let o=50;return t>=5?o=90:t>=3?o=75:t>=1?o=60:(o=30,r.push("缺少权威引用来源")),e.includes("数据来源")||e.includes("根据")||e.includes("研究表明")||(o-=15,r.push("建议添加数据来源说明")),{score:Math.max(0,o),issues:r}}(e),a=function(e){e.split("\n").filter(e=>e.trim());let t=e.match(/^#{1,3}\s.+/gm),r=t?.length||0,o=e.match(/[-*•]\s.+/g)||e.match(/^\d+\.\s.+/gm),n=o?.length||0,i=e.split(/\n\s*\n/).filter(e=>e.trim().length>50),a=i.reduce((e,t)=>e+t.length,0)/(i.length||1),s=50;return r>=3?s+=25:r>=1?s+=10:s-=10,n>=3?s+=15:n>=1&&(s+=5),a>=100&&a<=300?s+=10:a>500&&(s-=5),(e.includes("FAQ")||e.includes("常见问题")||e.match(/问[：:]/))&&(s+=15),Math.max(0,Math.min(100,s))}(e),s=function(e){let t=new Date,r=t.getFullYear(),o=t.getMonth()+1,n=[RegExp(`${r}年`,"g"),RegExp(`${r}-${String(o).padStart(2,"0")}`,"g"),/最近|最新|刚刚|本月|今年/g,/202[3-9]/g],i=0;for(let t of n){let r=e.match(t);i+=r?.length||0}let a=e.match(/发布时间[：:]\s*(\d{4}-\d{2}-\d{2})/),s=60;return i>=3?s=90:i>=1&&(s=75),a?s+=10:s-=5,Math.max(0,Math.min(100,s))}(e);return r.authorityScore=.3*o.score+.4*i.score,r.dataDensityScore=n,r.structureScore=a,r.freshnessScore=s,r.aeoScore=Math.round(.35*r.authorityScore+.25*r.dataDensityScore+.2*r.structureScore+.2*r.freshnessScore),r.optimizationSuggestions=function(e,t){let r=[];return e.authorityScore<70&&r.push({type:"title",priority:"high",description:"标题权威感不足",impact:8,action:`将标题改为疑问句格式，如"${t}怎么样？深度测评告诉你真相"`}),e.dataDensityScore<60&&r.push({type:"data",priority:"high",description:"数据支撑不足",impact:9,action:"添加具体数据：市场规模、增长率、用户评价等量化指标"}),e.authorityScore<60&&r.push({type:"citation",priority:"high",description:"缺乏权威引用",impact:8,action:"引用官方数据、权威媒体报道、专家观点作为支撑"}),e.structureScore<70&&r.push({type:"structure",priority:"medium",description:"内容结构可优化",impact:6,action:"添加FAQ段落、使用表格对比、增加小标题层级"}),e.freshnessScore<70&&r.push({type:"freshness",priority:"medium",description:"内容时效性不足",impact:5,action:"添加发布日期、更新记录、近期数据"}),r.push({type:"schema",priority:"high",description:"添加结构化数据标记",impact:9,action:"为内容添加Product/Review/FAQ Schema标记，提升AI识别度"}),r.sort((e,t)=>t.impact-e.impact)}(r,t),r.schemaMarkup=function(e,t,r){let o=[];if(o.push({"@context":"https://schema.org","@type":"Article",name:e.split("\n")[0]?.substring(0,100)||t,headline:e.split("\n")[0]?.substring(0,100)||t,description:e.substring(0,200)+"...",author:{"@type":"Organization",name:"TrendFlow Nexus"},publisher:{"@type":"Organization",name:"TrendFlow Nexus"},datePublished:new Date().toISOString(),dateModified:new Date().toISOString(),keywords:t,articleSection:"产品评测"}),e.includes("问")||e.includes("答")||e.includes("FAQ")){let r=function(e){let t=[],r=e.split("\n");for(let e=0;e<r.length;e++){let o=r[e]?.trim()||"";if(o.match(/^[问答题]?[：:]/)||o.match(/^\d+[.、]\s*[问答题]?[：:]/)){let n=o.replace(/^[问答题]?[0-9.、][：:]\s*/,""),i=[];for(let t=e+1;t<Math.min(e+5,r.length);t++){let e=r[t]?.trim()||"";if(e.match(/^[问答题]?[：:]/)||e.startsWith("-")||e.startsWith("•"))break;i.push(e)}i.length>0&&n.length>5&&t.push({question:n,answer:i.join(" ")})}}return t.slice(0,5)}(e);r.length>=2&&o.push({"@context":"https://schema.org","@type":"FAQPage",name:`${t}常见问题解答`,description:`关于${t}的详细问答指南`,mainEntity:r.map(e=>({"@type":"Question",name:e.question,acceptedAnswer:{"@type":"Answer",text:e.answer}}))})}return(t.includes("推荐")||t.includes("测评")||t.includes("对比"))&&o.push({"@context":"https://schema.org","@type":"Product",name:t,description:e.substring(0,300)+"...",aggregateRating:{"@type":"AggregateRating",ratingValue:(r.aeoScore/20).toFixed(1),reviewCount:"128"},review:{"@type":"Review",author:{"@type":"Organization",name:"TrendFlow Nexus"},reviewRating:{"@type":"Rating",ratingValue:Math.round(r.aeoScore/20)},itemReviewed:{"@type":"Product",name:t}}}),o}(e,t,r),r.optimizedContent=function(e,t,r){let o=e,n=o.split("\n")[0];n.includes("?")||n.includes("？")||(o=`${t}值得买吗？深度测评告诉你真相
`+o.substring(n.indexOf(" ")+1));let i=function(e){let t=[];for(let r of[/\d+[%‰亿万千百十万亿]/g,/\d{4}年/g,/\d+\.\d+亿|\d+\.\d+万/g,/排名\s*前?\s*\d+/g,/增长\s*\d+%/g,/销量\s*\d+/g]){let o=e.match(r);o&&t.push(...o.slice(0,3))}return Array.from(new Set(t)).slice(0,5)}(e);if(i.length>=2&&r.dataDensityScore<70){let e=i.slice(0,3).map(e=>`• ${e}`).join("\n");o=`## 核心数据摘要
${e}

`+o}return o.includes("FAQ")||o.includes("常见问题")||(o+=`
## 常见问题（FAQ）

### Q: ${t}适合什么人使用？
A: ${t}适合追求品质生活的用户，特别是需要高效解决方案的人群。

### Q: ${t}有哪些优缺点？
A: 优点包括性价比高、功能全面；缺点可能是学习成本略高。

### Q: ${t}值得购买吗？
A: 根据深度测评，${t}在同类产品中表现优异，值得推荐。`),o+="\n\n---\n<!-- Schema Markup Generated -->"}(e,t,r),r}(i,r.keyword);o.push({id:`site-${Date.now()}-${e}`,type:t,keyword:r.keyword,title:a,content:i,aeoScore:s.aeoScore,schemaMarkup:s.schemaMarkup,estimatedAIOcclusion:Math.round(.8*s.aeoScore)})}return o}let h=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/authority/route",pathname:"/api/authority",filename:"route",bundlePath:"app/api/authority/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\authority\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:g,serverHooks:y}=h,m="/api/authority/route";function w(){return(0,a.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:g})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,5972,215],()=>r(6379));module.exports=o})();