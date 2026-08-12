"use strict";(()=>{var e={};e.id=9597,e.ids=[9597],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},32284:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>w,patchFetch:()=>k,requestAsyncStorage:()=>f,routeModule:()=>$,serverHooks:()=>y,staticGenerationAsyncStorage:()=>x});var n={};t.r(n),t.d(n,{GET:()=>g,POST:()=>h});var i=t(49303),a=t(88716),s=t(60670),r=t(87070),l=t(91534),m=t(58055);let c=[{id:"review",name:"深度测评",description:"全面评测产品优缺点",template:"测评"},{id:"compare",name:"横向对比",description:"多品牌型号对比",template:"对比"},{id:"avoid",name:"避坑指南",description:"指出常见误区",template:"避坑"},{id:"guide",name:"选购攻略",description:"系统性选购指南",template:"攻略"},{id:"list",name:"盘点汇总",description:"同类产品汇总",template:"盘点"},{id:"scene",name:"场景应用",description:"特定场景使用体验",template:"场景"},{id:"pain",name:"痛点解决",description:"解决用户核心痛点",template:"痛点"},{id:"persona",name:"人群定位",description:"针对不同人群的推荐",template:"人群"},{id:"price",name:"价格分析",description:"性价比和价格趋势",template:"价格"},{id:"trend",name:"趋势洞察",description:"行业趋势和未来展望",template:"趋势"}],u={xiaohongshu:[(e,o)=>`被问爆了！${e}${o}到底值不值得买？`,(e,o)=>`${e}${o}指南｜真实测评来了`,(e,o)=>`后悔没早知道！${e}的${o}技巧`,(e,o)=>`${e}${o}深度测评｜看完这篇再决定`,(e,o)=>`全网最详细的${e}${o}攻略！`],zhihu:[(e,o)=>`如何看待${e}的${o}？`,(e,o)=>`${e}值得买吗？从${o}维度分析`,(e,o)=>`使用${e}进行${o}后的真实感受`,(e,o)=>`${e}的${o}：哪个更适合中国家庭？`,(e,o)=>`为什么越来越多人选择${e}做${o}？`],weibo:[(e,o)=>`#${e}#${o} 你们觉得怎么样？`,(e,o)=>`今天聊聊${e}的${o}，你踩过哪些坑？`,(e,o)=>`实测${e}做${o}一周，说说优缺点`,(e,o)=>`${e}的${o}值不值得入？我来告诉你实话`,(e,o)=>`关于${e}的${o}，这篇文章说透了`],douyin:[(e,o)=>`${e}的${o}教程：3分钟教会你`,(e,o)=>`千万别买${e}，除非你看完这个${o}视频`,(e,o)=>`${e}${o}开箱测评｜效果太惊艳了`,(e,o)=>`${e}十大${o}技巧，最后一个绝了`,(e,o)=>`挑战全网最便宜的${e}${o}方案`],wechat:[(e,o)=>`深度：${e}的${o}如何改变我们的生活方式`,(e,o)=>`${e}${o}全攻略：从入门到精通`,(e,o)=>`实测一个月，我为什么推荐${e}做${o}`,(e,o)=>`${e}的${o}真相：你不得不知道的5件事`,(e,o)=>`从${e}的${o}看消费趋势`]},d=[{id:"mom",name:"宝妈",style:"亲切、接地气、注重性价比"},{id:"student",name:"学生党",style:"活泼、爱玩、价格敏感"},{id:"pro",name:"专业人士",style:"严谨、有深度、强调专业度"},{id:"geek",name:"发烧友",style:"懂行、追求极致、重参数"},{id:"normal",name:"普通用户",style:"真实、中立、代表大众视角"}];async function h(e){try{let{keyword:o,opportunity:t,platforms:n=["xiaohongshu","zhihu","weibo","douyin","wechat"],angleCount:i=10,contentPerAngle:a=2,autoMonetize:s=!0}=await e.json();if(!o||!t)return r.NextResponse.json({error:"缺少必要参数: keyword, opportunity"},{status:400});let l=0,u=[];for(let e=0;e<Math.min(i,c.length);e++){let i=c[e];for(let e=0;e<n.length;e++){let r=n[e];for(let e=0;e<a;e++){let n=p({keyword:o,opportunity:t,angle:i,platform:r,index:e}).then(e=>{if(e&&s){let o=(0,m.e)(e.content,r);if(o.length>0){let t=(0,m.a)(e.content,o,r);e.monetizedContent=t.monetizedContent,e.insertedProducts=t.insertedProducts,e.estimatedCommission=t.estimatedCommission,l+=parseInt(t.estimatedCommission)||10}}return e});u.push(n)}}}let d=(await Promise.all(u)).filter(e=>null!=e).sort((e,o)=>{let t={xiaohongshu:0,zhihu:1,weibo:2,douyin:3,wechat:4},n=c.findIndex(o=>o.id===e.angle),i=c.findIndex(e=>e.id===o.angle);return(t[e.platform]||0)-(t[o.platform]||0)||n-i}),h={success:!0,keyword:o,angles:c.slice(0,i),titles:d.map(e=>e.title),contents:d,totalGenerated:d.length,estimatedRevenue:`\xa5${Math.round(l/Math.max(d.length,1))}-\xa5${Math.round(2*l/Math.max(d.length,1))}/月`,generatedAt:new Date().toISOString()};return r.NextResponse.json(h)}catch(e){return console.error("Produce API error:",e),r.NextResponse.json({error:"蜂群生成失败"},{status:500})}}async function p(e){let{keyword:o,opportunity:t,angle:n,platform:i,index:a}=e,s=u[i]||u.xiaohongshu,r=(0,s[a%s.length])(o,n.name),m=await (0,l.Bq)({trendTitle:`${o} ${n.name}`,opportunity:t,platform:i,keyword:o}),c=d[Math.floor(Math.random()*d.length)],h=function(e){let o={xiaohongshu:["12:00-13:00","18:00-20:00","21:00-22:00"],zhihu:["08:00-09:00","12:00-13:00","20:00-22:00"],weibo:["08:00-09:00","12:00-13:00","18:00-19:00","21:00-22:00"],douyin:["12:00-13:00","18:00-20:00","21:00-23:00"],wechat:["07:00-08:00","12:00-13:00","20:00-21:00"]};return o[e]||o.xiaohongshu}(i),p=h[a%h.length];return{id:`produce-${Date.now()}-${i}-${n.id}-${a}`,angle:n.name,title:r,content:m.content,platform:i,persona:c.name,bestTime:p}}async function g(){return r.NextResponse.json({success:!0,message:"Nexus Produce API",supportedAngles:c.length,supportedPlatforms:Object.keys(u).length,endpoints:["POST /api/nexus/produce"]})}let $=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/nexus/produce/route",pathname:"/api/nexus/produce",filename:"route",bundlePath:"app/api/nexus/produce/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\nexus\\produce\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:f,staticGenerationAsyncStorage:x,serverHooks:y}=$,w="/api/nexus/produce/route";function k(){return(0,s.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:x})}},47853:(e,o,t)=>{t.d(o,{D:()=>s,X:()=>r});let n={jd:process.env.JD_UNION_ID||"2038448747",taobao:process.env.TB_UNION_ID||"10458946368",pdd:process.env.PDD_UNION_ID||"44672749"},i="https://u.jd.com/",a="https://p.pinduoduo.com/",s=[{id:"jd-01",name:"AirPods Pro 2代",category:"3C数码",link:`${i}UafAw4j`,commission:5,platform:["xiaohongshu","zhihu","wechat"],tags:["耳机","数码","苹果"]},{id:"jd-02",name:"Anker 20000mAh充电宝",category:"3C数码",link:`${i}UafAw5k`,commission:8,platform:["xiaohongshu","weibo"],tags:["充电宝","便携","数码"]},{id:"tb-01",name:"Rokid AR智能眼镜",category:"3C数码",link:"https://m.tb.cn/h.8Tzy8la",commission:6,platform:["xiaohongshu","wechat"],tags:["AR","眼镜","数码"]},{id:"jd-04",name:"小米智能灯带",category:"家居",link:`${i}UafAw6m`,commission:7,platform:["xiaohongshu","zhihu"],tags:["智能","灯光","家居"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`${a}AqokQvI9?sc=${n.pdd}`,commission:15,platform:["xiaohongshu","wechat","pinduoduo"],tags:["收纳","桌面","整理"]},{id:"jd-06",name:"追觅洗地机",category:"家居",link:`${i}UafAw7n`,commission:5,platform:["xiaohongshu","zhihu"],tags:["清洁","智能","家居"]},{id:"jd-07",name:"帮宝适一级帮纸尿裤",category:"母婴",link:`${i}UafAw8o`,commission:4,platform:["xiaohongshu","wechat"],tags:["纸尿裤","母婴","婴儿"]},{id:"jd-08",name:"Babyzen yoyo+推车",category:"母婴",link:`${i}UafAw9p`,commission:3,platform:["xiaohongshu"],tags:["推车","母婴","出行"]},{id:"jd-09",name:"费雪智能摇椅",category:"母婴",link:`${i}UafAw0q`,commission:6,platform:["xiaohongshu","wechat"],tags:["早教","玩具","母婴"]},{id:"jd-10",name:"70mai行车记录仪",category:"汽车",link:`${i}UafAx1r`,commission:8,platform:["zhihu","weibo"],tags:["行车记录","汽车","安全"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`${a}AqokQvJ0?sc=${n.pdd}`,commission:8,platform:["xiaohongshu","weibo","pinduoduo"],tags:["车载","手机架","汽车"]},{id:"jd-11",name:"Baseus车载充电器",category:"汽车",link:`${i}UafAx2s`,commission:10,platform:["xiaohongshu","weibo"],tags:["车载","充电","汽车"]},{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`${a}AqokQvK1?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","wechat","pinduoduo"],tags:["喂食器","宠物","智能"]},{id:"jd-12",name:"小佩智能喂食器PRO",category:"宠物",link:`${i}UafAx3t`,commission:6,platform:["xiaohongshu","zhihu","wechat"],tags:["喂食器","宠物","智能"]},{id:"jd-13",name:"pidan猫砂",category:"宠物",link:`${i}UafAx4u`,commission:12,platform:["xiaohongshu","wechat"],tags:["猫砂","宠物","除臭"]},{id:"jd-14",name:"伯纳天纯狗粮",category:"宠物",link:`${i}UafAx5v`,commission:8,platform:["xiaohongshu","zhihu"],tags:["狗粮","宠物","食品"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`${a}AqokQvL2?sc=${n.pdd}`,commission:12,platform:["xiaohongshu","zhihu","pinduoduo"],tags:["耳机","蓝牙","数码"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`${a}AqokQvM3?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","weibo","pinduoduo"],tags:["数据线","充电","便携"]},{id:"jd-16",name:"薇诺娜宝贝舒润霜",category:"美妆",link:`${i}UafAw4j`,commission:3,platform:["xiaohongshu","wechat"],tags:["护肤","美妆","精华"]},{id:"jd-17",name:"安热沙防晒霜",category:"美妆",link:`${i}UafAx6w`,commission:5,platform:["xiaohongshu","weibo"],tags:["防晒","美妆","夏季"]},{id:"jd-18",name:"Keep瑜伽垫",category:"健身",link:`${i}UafAx7x`,commission:8,platform:["xiaohongshu","weibo"],tags:["瑜伽","健身","运动"]},{id:"jd-19",name:"小米手环8",category:"健身",link:`${i}UafAx8y`,commission:6,platform:["xiaohongshu","zhihu"],tags:["手环","健身","智能"]}],r={xiaohongshu:{introInsert:e=>`

💡 **相关好物推荐：**
我最近在用这款[${e.name}]，效果真的很不错！链接放在主页了，姐妹们自己去看不迷路～`,outroInsert:e=>`

---
🛍️ **同款好物：** ${e.name}
🔗 购买链接：${e.link}
💰 预计佣金：${e.commission}%`},zhihu:{introInsert:e=>`

关于这个问题，我实际使用过一款相关产品——**${e.name}**。从专业角度来看，它在XXX方面表现确实不错...`,outroInsert:e=>`

---
*以上为个人真实体验分享。如需购买，可参考：[${e.name}](${e.link})*
*本文含 affiliate 链接，支持我的创作，感谢~*`},wechat:{introInsert:e=>`

说到这个话题，不得不提我现在在用的[${e.name}]，真的是解决了我很大的痛点...`,outroInsert:e=>`

---
📌 **同款指路：** ${e.name}
💬 想了解更多？点击链接查看详情 👉 ${e.link}`},weibo:{introInsert:(e,o)=>`#${o}#${e.name}相关 #种草#`,outroInsert:e=>`

👉 同款在这里：${e.link} #种草# #好物推荐#`},pinduoduo:{introInsert:e=>`

💰 **拼多多超值推荐：**
这款[${e.name}]在拼多多上超便宜！比我之前在其他平台买的划算多了～`,outroInsert:e=>`

---
🛒 **拼多多同款：** ${e.name}
💸 拼夕夕价格更香：${e.link}
✨ 新人优惠+百亿补贴，省钱必备！`},amazon:{introInsert:e=>`

🌍 **海外好物推荐：**
这款[${e.name}]在美国亚马逊很火，性价比超高！`,outroInsert:e=>`

---
📦 **亚马逊同款：** ${e.name}
🔗 购买链接：${e.link}?tag=20d-20`}}},58055:(e,o,t)=>{t.d(o,{a:()=>a,e:()=>i});var n=t(47853);function i(e,o){let t=e.toLowerCase(),i=new Map;for(let e of n.D){if(!e.platform.includes(o))continue;let n=e.tags.some(e=>t.includes(e.toLowerCase())||t.includes(e)),a=e.name.split(/[\s\u4e00-\u9fa5]+/).some(e=>t.includes(e.toLowerCase()));if(n||a){let o=i.get(e.category);(!o||e.commission>o.commission)&&i.set(e.category,e)}}return Array.from(i.values()).slice(0,3)}function a(e,o,t){let i=[],a=e,s=n.X[t]||n.X.xiaohongshu;o.forEach((o,t)=>{if(0===t){let t=e.slice(0,Math.floor(.3*e.length)),n=e.slice(Math.floor(.3*e.length));a=t+s.introInsert(o)+"\n\n"+n,i.push({name:o.name,link:o.link,position:"intro",insertionType:"自然植入"})}else 1===t?(a+=s.outroInsert(o),i.push({name:o.name,link:o.link,position:"outro",insertionType:"文末推荐"})):(a+=`

另外这款${o.name}也不错：${o.link}`,i.push({name:o.name,link:o.link,position:"outro",insertionType:"相关推荐"}))});let r=o.reduce((e,o)=>e+o.commission,0),l=o.length>0?`${Math.round(r/o.length)}% 平均佣金`:"无推广",m=[];return"xiaohongshu"===t?m.push("• 推广链接建议放在评论区置顶","• 不要在正文中直接放外链",'• 用"主页"、"笔记"等引导词更安全'):"zhihu"===t?m.push("• 知乎允许直接放链接","• 但要注意不要过度营销",'• 可以用"好物推荐"卡片'):"wechat"===t?m.push("• 公众号可以放跳转链接","• 用小程序卡片更自然","• 文末放二维码转化率高"):"weibo"===t&&m.push("• 微博短链接会被折叠","• 建议用品牌词+话题词引导","• 评论区放链接更稳妥"),{monetizedContent:a,insertedProducts:i,estimatedCommission:l,platformTips:m}}},91534:(e,o,t)=>{t.d(o,{Bq:()=>s});let n=["https://openai.api2d.net/v1","https://api.openai-proxy.com/v1","https://api.v5.lc/openai/v1","https://api.chatanywhere.tech/v1"],i={xiaohongshu:[(e,o)=>`姐妹们！终于发现了一个超宝藏的海外趋势！🔥

最近刷到一个超火的${e}，在TikTok和Instagram上已经爆火很久了！

🤔为什么这么火？
${o}

💡我对比了国内外几个品牌，发现这个趋势其实特别适合咱们国内市场：
1️⃣ 中国人越来越注重品质生活
2️⃣ 年轻消费者愿意为创新买单
3️⃣ 国内供应链完全能跟上

📌选购建议：
不要盲目跟风！先明确自己的需求，多做功课再看评价。我建议大家：
• 先看真实用户测评
• 注意对比参数细节
• 关注售后服务质量

总之，选对适合自己的才是最重要的！你们觉得呢？评论区聊聊～

#${e.replace(/\s+/g,"")} #海外潮流 #趋势发现 #消费指南`,(e,o)=>`被问爆了！终于把${e}搞明白了 😭

说实话，之前对这个完全不感兴趣，直到看到它在国外火了...

📊 数据说话：
${o}

✨ 我的使用感受：
确实有一些很打动人的地方，但也有需要避坑的点。今天就来客观分享一下～

✅ 值得入手的地方：
• 设计新颖，解决了传统产品的痛点
• 性价比不错，比同类产品便宜
• 容易上手，学习成本低

⚠️ 需要注意的地方：
• 售后服务参差不齐
• 部分功能可能需要额外付费
• 建议选择官方渠道购买

🎯 总结：适合追求新鲜感、有一定预算的用户。如果你是重度使用者，建议再等等看国内有没有更好的替代品。

你们用过类似的产品吗？感觉如何？

#${e.replace(/\s+/g,"")} #消费心得 #真实测评`],zhihu:[(e,o)=>`如何评价${e}在中国的可行性？

谢邀。

先从数据来源说起。最近在研究海外市场时注意到${e}在欧美的兴起，背后反映的是一些有趣的市场规律。

## 一、现象观察

${o}

这个趋势有几个关键特征值得注意：
1. **需求前置**：不是创造了需求，而是放大了已有需求
2. **场景细分**：针对不同人群有差异化的解决方案
3. **复购率高**：一旦形成使用习惯，用户粘性很强

## 二、市场机会分析

从国内来看，有几个有利条件：

**优势：**
- 供应链成熟，成本可控
- 消费市场庞大，容错空间大
- 数字基础设施完善

**挑战：**
- 用户教育需要时间
- 竞品涌入速度快
- 合规风险需要警惕

## 三、建议与展望

以上是我的个人观点，欢迎交流讨论。`],wechat:[(e,o)=>`${e}——一个让我重新思考消费的文章

文/趋势洞察

最近，${e}这个话题在我的朋友圈里悄悄火起来了。

一开始我也没在意，觉得不就是个普通的趋势吗？但当我深入了解后，发现这件事远比想象中更有意思。

---

## 背后的逻辑

${o}

这让我想起一句话："最好的商业模式，是解决一个真实存在的问题。"

---

## 给我们的启示

看完这篇文章，我想分享三个思考：

**第一，趋势不等于风口。**
很多所谓的"风口"只是营销话术，真正有价值的趋势是那些能解决实际问题的创新。

**第二，本土化是关键。**
国外成功的经验可以借鉴，但不能照搬。每个市场都有自己独特的用户习惯和文化背景。

**第三，选择比努力更重要。**
在面对众多机会时，选择一个真正有价值的赛道，比盲目追逐热门更重要。

---

*本文仅代表个人观点，不构成投资建议。*

---
喜欢这篇文章吗？欢迎点赞、在看、转发~`],weibo:[(e,o)=>`#${e.replace(/\s+/g,"")}# 最近刷到这个趋势，有点意思 🤔

${o}

关键是：中国市场的供应链完全跟得上，差距正在缩小。

你怎么看？支持还是反对？评论区聊聊 👇

#${e.replace(/\s+/g,"")} #趋势观察`]};async function a(e){let o=process.env.OPENAI_API_KEY;if(!o||"sk-placeholder-for-testing"===o||o.startsWith("sk-placeholder"))return console.log("⚠️ OPENAI_API_KEY not configured"),null;let t={model:"gpt-4o-mini",messages:[{role:"system",content:"你是一位专业的内容创作者，擅长将海外热点本地化为适合中国平台的优质内容。要求：真实自然、客观中立、遵守广告法、价值导向。平台规范：小红书口语化加emoji、知乎结构化论述、公众号故事感、微博精炼话题词。输出纯文章内容，末尾添加合规声明。"},{role:"user",content:`请为"${e.platform}"平台写一篇种草文章。

趋势标题：${e.trendTitle}
市场机会：${e.opportunity}`}],temperature:.7,max_tokens:800},i=Date.now(),a="";for(let e of n)try{console.log(`🔄 尝试代理: ${e}`);let n=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(t),signal:AbortSignal.timeout(3e4)});if(n.ok){let o=await n.json(),t=Date.now()-i;if(o.choices?.[0]?.message?.content)return console.log(`✅ OpenAI API 通过代理 ${e} 成功，耗时 ${t}ms`),{content:o.choices[0].message.content,source:"openai",quality:"high",latency:t}}else{let o=await n.text().catch(()=>"");console.warn(`⚠️ 代理 ${e} 返回错误 ${n.status}: ${o.substring(0,100)}`),a=`HTTP ${n.status}: ${o.substring(0,50)}`}}catch(t){let o=t instanceof Error?t.message:"Unknown error";console.warn(`❌ 代理 ${e} 连接失败: ${o}`),a=o}return console.error(`❌ 所有代理均失败，最后错误: ${a}`),null}async function s(e){let o=await a(e);return o?(console.log(`🎉 AI生成成功！耗时: ${o.latency}ms`),o):(console.log("⚠️ OpenAI 不可用，回退到模板引擎"),function(e){let o=i[e.platform||"xiaohongshu"]||i.xiaohongshu,t=Math.floor(Math.random()*o.length);return{content:o[t](e.trendTitle,e.opportunity),source:"local",quality:"template"}}(e))}}};var o=require("../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),n=o.X(0,[8948,5972],()=>t(32284));module.exports=n})();