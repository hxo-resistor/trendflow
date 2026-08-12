"use strict";(()=>{var e={};e.id=3121,e.ids=[3121],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},76458:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>w,requestAsyncStorage:()=>m,routeModule:()=>h,serverHooks:()=>y,staticGenerationAsyncStorage:()=>f});var o={};r.r(o),r.d(o,{GET:()=>u,POST:()=>l});var n=r(49303),a=r(88716),i=r(60670),s=r(87070);let d=[],p=0,c=[{keyword:"智能喂食器",source:"小红书",platform:"xiaohongshu",heat:95,trend:"rising"},{keyword:"扫地机器人",source:"知乎",platform:"zhihu",heat:91,trend:"rising"},{keyword:"蓝牙耳机",source:"微博",platform:"weibo",heat:88,trend:"stable"},{keyword:"猫砂推荐",source:"抖音",platform:"douyin",heat:92,trend:"rising"},{keyword:"空气炸锅",source:"淘宝",platform:"taobao",heat:85,trend:"stable"},{keyword:"瑜伽垫",source:"小红书",platform:"xiaohongshu",heat:78,trend:"falling"},{keyword:"儿童推车",source:"知乎",platform:"zhihu",heat:82,trend:"rising"},{keyword:"行车记录仪",source:"B站",platform:"douyin",heat:75,trend:"stable"}];async function u(e){let t=Date.now();(!d||t-p>3e5)&&(d=c.map((e,t)=>{var r,o;return{id:`hs-${t+1}`,keyword:e.keyword,source:e.source,platform:e.platform,heat:e.heat,trend:e.trend,peakTime:(r=e.heat)>=90?"未来2-4小时":r>=80?"未来6-12小时":"未来24小时内",competition:(o=e.heat)>=90?"high":o>=80?"medium":"low",opportunity:function(e,t){let r={rising:`【${e}】正处于上升期，现在是截流的好时机！建议立即生成${e}相关内容，抢占关键词排名。`,stable:`【${e}】热度稳定，竞争适中。可以生产差异化内容，建立长期流量入口。`,falling:`【${e}】热度下降，建议转向相关新品类。可关注${e}的替代品或升级版本。`};return r[t]||r.stable}(e.keyword,e.trend),recommendedPlatforms:["小红书","知乎","微博"],recommendedAction:"rising"===e.trend?"立即响应，抢占先机":"持续关注，择机而入"}}),p=t);let{searchParams:r}=new URL(e.url),o=r.get("filter"),n=d;return"rising"===o?n=d.filter(e=>"rising"===e.trend):"low_competition"===o&&(n=d.filter(e=>"low"===e.competition)),s.NextResponse.json({success:!0,hotspots:n,total:n.length,lastUpdated:new Date(p).toLocaleString("zh-CN"),interceptWindow:"5分钟内响应效果最佳"})}async function l(e){try{let{keyword:t,autoGenerate:r=!0}=await e.json(),o=d.find(e=>e.keyword.includes(t)||t.includes(e.keyword));if(!o)return s.NextResponse.json({error:"未检测到相关热点，建议先手动搜索"},{status:404});let n={platforms:Object.fromEntries(Object.entries({xiaohongshu:{title:`紧急！${t}突然爆火🔥看完这篇再入手`,hook:`姐妹们！最近${t}在小红书上真的火到不行，我研究了三天三夜，终于把门道摸清楚了！`,body:`【为什么突然火了】
${t}之所以能在短时间内成为热搜，背后有几个关键原因...

【怎么买才不踩坑】
1️⃣ 先看成分/参数
2️⃣ 查真实测评
3️⃣ 对比价格

【我的建议】
如果你正好需要${t}，现在正是好时机！但我建议...`,cta:`关注我，持续追踪${t}最新动向！👉`,hashtags:`#${t} #避坑指南 #好物分享 #趋势观察`},zhihu:{title:`${t}为什么突然火了？深度分析背后的逻辑`,hook:`谢邀。作为一个关注${t}赛道多年的从业者，谈谈我的看法。`,body:`一、现象观察
${t}最近在各大平台迅速升温，这并非偶然...

二、底层逻辑
这种现象反映了几个深层需求：
1. 消费升级的必然结果
2. 信息差的缩小
3. 情绪价值的凸显

三、如何理性看待
虽然热度高，但我们也要保持清醒...

四、机会在哪里
对于普通人来说，${t}仍然是一个值得关注的领域...`,cta:`如果觉得有启发，点个赞支持一下~`},weibo:{title:`#${t}# 突然上热搜了，你怎么看？`,hook:`刷到#${t}#上了热搜，忍不住来聊聊。`,body:`${t}这个产品最近风很大啊，身边好几个朋友都在问。说实话我之前也观望过，但看了看评测，觉得...

你们怎么看？觉得值得入手的扣1，觉得是智商税的扣2。`,cta:`#种草# #拔草# #数码#`},douyin:{title:`${t}突然火了？看完这个视频再决定要不要买！`,hook:`[开场冲击] 注意看，这个东西突然在网上爆火，很多博主都在推，但真相是...`,body:`[问题引出] ${t}为什么突然火了？
[案例分析] 我研究了10款热门产品...
[真实测评] 用了一周，说说我的感受...
[避坑指南] 买之前必看这三点...
[结论] 你觉得值不值？评论区告诉我`,cta:`点赞关注，下期讲${t}的隐藏用法！`},wechat:{title:`深度｜${t}爆火的背后，藏着什么商机？`,hook:`最近，${t}这个话题突然火了。作为一名长期关注消费趋势的人，我想和大家聊聊这件事。`,body:`一、从现象看本质
${t}的突然走红，其实折射出三个重要趋势...

二、市场机会在哪里
对于创业者来说，这个机会窗口期还有多久？

三、给普通人的建议
如果你想抓住这波流量...

四、风险提示
当然，任何风口都有风险...

---
*以上为个人观点，不构成投资建议*`,cta:`觉得有用，点个「在看」支持~`}}).map(([e,r])=>[e,{...r,keyword:t,estimatedTraffic:Math.floor(5e3*Math.random())+1e3}])),recommendedPlatforms:o.recommendedPlatforms,actionPriority:"rising"===o.trend?"IMMEDIATE":"SOON"};return s.NextResponse.json({success:!0,hotspot:o,interceptContent:n,action:r?"已生成截流内容":"建议行动指南",urgency:"rising"===o.trend?"HIGH":"MEDIUM"})}catch(e){return console.error("Intercept error:",e),s.NextResponse.json({error:"截流操作失败"},{status:500})}}let h=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/intercept/hotspot/route",pathname:"/api/intercept/hotspot",filename:"route",bundlePath:"app/api/intercept/hotspot/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\intercept\\hotspot\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:f,serverHooks:y}=h,g="/api/intercept/hotspot/route";function w(){return(0,i.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:f})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,5972],()=>r(76458));module.exports=o})();