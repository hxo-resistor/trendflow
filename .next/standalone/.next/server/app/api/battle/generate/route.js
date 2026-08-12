"use strict";(()=>{var e={};e.id=7911,e.ids=[7911],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27231:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>$,requestAsyncStorage:()=>g,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>c});var a={};r.r(a),r.d(a,{POST:()=>u});var o=r(49303),n=r(88716),i=r(60670),s=r(87070);let l=[{keyword:"智能宠物喂食器",category:"宠物",platforms:["xiaohongshu","zhihu","douyin"]},{keyword:"TWS降噪蓝牙耳机",category:"3C数码",platforms:["xiaohongshu","weibo","zhihu"]},{keyword:"车载手机支架",category:"汽车",platforms:["xiaohongshu","weibo","douyin"]}],p=[{id:"review",name:"深度测评",template:"测评"},{id:"compare",name:"横向对比",template:"对比"},{id:"guide",name:"选购攻略",template:"攻略"}];async function u(e){try{let{days:t=7}=await e.json(),r=[],a=new Date;l.forEach(({keyword:e,platforms:t})=>{p.forEach((o,n)=>{t.forEach((t,n)=>{let i=new Date(a);i.setDate(i.getDate()+Math.floor(r.length/3)),i.setHours(8+r.length%3*4,0,0,0),r.push({id:`battle-${e}-${o.id}-${t}-${Date.now()}`,keyword:e,angle:o.name,platform:t,title:`${e}${o.template}：${{深度测评:"真实体验告诉你值不值得买",横向对比:"多款产品PK，选对不买贵",选购攻略:"新手必看，避坑指南"}[o.name]||"全方位解析"}`,content:function(e,t,r){let a={xiaohongshu:{review:`姐妹们！终于把${e}研究明白了！🔥

作为使用了半年的过来人，今天就来给大家做个真实的测评～

## 使用感受
💰 价格：性价比很高
⭐ 评分：8.5/10分
🎯 适合人群：追求品质生活的年轻人

#${e.replace(/\s+/g,"")} #好物推荐`,compare:`${e}怎么选？看这篇就够了！📊

最近调研了市面上主流的${e}产品，做了详细的横向对比～

## 对比维度
| 维度 | 推荐指数 |
|------|---------|
| 性价比 | ⭐⭐⭐⭐⭐ |
| 实用性 | ⭐⭐⭐⭐ |

#${e.replace(/\s+/g,"")} #对比测评`,guide:`${e}选购完全攻略！新手必看📖

准备入手${e}的姐妹们看过来！

## 选购要点
1️⃣ 明确预算范围
2️⃣ 了解核心功能需求
3️⃣ 对比多家产品参数

#${e.replace(/\s+/g,"")} #选购攻略`},zhihu:{review:`如何评价${e}？我来分享一下真实使用体验。

先说结论：这款${e}总体来说值得推荐。

## 一、产品概述
${e}是一款...

#${e} #测评`,compare:`${e}值得买吗？从多维度分析。

最近有不少朋友问我关于${e}的问题。

## 市场概况
根据最新数据...

#${e} #对比`,guide:`新手如何选购${e}？一份完整指南。

对于很多第一次接触${e}的朋友来说...

#${e} #攻略`},douyin:{review:`🎬 ${e}开箱测评！

家人们！今天给你们开箱一款超火的${e}！

先看外观...再看功能...

#${e.replace(/\s+/g,"")} #开箱`,compare:`🎬 ${e}横向对比！

今天给大家做一个${e}的大合集对比！

左边这款...

#${e.replace(/\s+/g,"")} #对比`,guide:`🎬 ${e}选购攻略！

还没搞清楚怎么选${e}？3分钟教你搞定！

第一点...

#${e.replace(/\s+/g,"")} #攻略`}};return a[r]?.[t.id]||a.xiaohongshu.review}(e,o,t),aeoScore:Math.floor(15*Math.random())+85,publishDate:i.toISOString().split("T")[0],scheduledTime:i.toTimeString().slice(0,5),priority:r.length+1})})})});let o=function(e,t){let r=[],a=new Date;for(let o=0;o<t;o++){let t=new Date(a);t.setDate(t.getDate()+o);let n=e.filter(e=>e.publishDate===t.toISOString().split("T")[0]);r.push({date:t.toISOString().split("T")[0],weekday:["日","一","二","三","四","五","六"][t.getDay()],contents:n.map(e=>({...e,platformLabel:"xiaohongshu"===e.platform?"小红书":"zhihu"===e.platform?"知乎":"weibo"===e.platform?"微博":"抖音"})),totalContents:n.length,estimatedViews:500*n.length,recommendedActions:["早上8点发布第一篇","中午12点发布第二篇","晚上8点发布第三篇"]})}return r}(r,t);return s.NextResponse.json({success:!0,totalGenerated:r.length,keywords:l.map(e=>e.keyword),contents:r,publishPlan:o,generatedAt:new Date().toISOString()})}catch(e){return console.error("Battle content generation error:",e),s.NextResponse.json({error:"内容生成失败"},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/battle/generate/route",pathname:"/api/battle/generate",filename:"route",bundlePath:"app/api/battle/generate/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\battle\\generate\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:g,staticGenerationAsyncStorage:c,serverHooks:h}=d,m="/api/battle/generate/route";function $(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:c})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[8948,5972],()=>r(27231));module.exports=a})();