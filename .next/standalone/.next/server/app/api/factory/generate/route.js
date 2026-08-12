"use strict";(()=>{var e={};e.id=9611,e.ids=[9611],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},12287:(e,o,n)=>{n.r(o),n.d(o,{originalPathname:()=>y,patchFetch:()=>w,requestAsyncStorage:()=>g,routeModule:()=>p,serverHooks:()=>f,staticGenerationAsyncStorage:()=>$});var t={};n.r(t),n.d(t,{POST:()=>d});var a=n(49303),i=n(88716),s=n(60670),r=n(87070),l=n(91534),c=n(58055);let m={xiaohongshu:[e=>`被问爆了！${e}到底值不值得买？真实测评来了`,e=>`${e}避坑指南｜5年资深玩家血泪总结`,e=>`后悔没早知道！${e}的这些隐藏功能90%的人不知道`,e=>`${e}深度测评｜看完这篇再决定要不要买`,e=>`全网最详细的${e}选购攻略！小白必看`],zhihu:[e=>`如何看待${e}在国内的流行趋势？`,e=>`${e}值得买吗？从这三个维度分析告诉你真相`,e=>`使用${e}三个月后，来说说我的真实感受`,e=>`${e}和传统方案的对比：哪个更适合中国家庭？`,e=>`为什么越来越多人选择${e}？背后的逻辑是什么`],weibo:[e=>`#${e}# 你们觉得这个趋势怎么样？聊聊`,e=>`今天聊点${e}，你踩过哪些坑？`,e=>`实测${e}一周，说说优缺点#种草# #拔草#`,e=>`{kw}值不值得入？我来告诉你实话`,e=>`关于${e}，这篇文章说透了`],douyin:[e=>`${e}使用教程：3分钟教会你所有功能`,e=>`千万别买${e}，除非你看完这个视频`,e=>`${e}开箱测评｜效果太惊艳了`,e=>`${e}十大使用技巧，最后一个绝了`,e=>`挑战全网最便宜的${e}，你能接受吗`],wechat:[e=>`深度：${e}如何改变我们的生活方式`,e=>`${e}选购全攻略：从入门到精通`,e=>`实测一个月，我为什么推荐${e}`,e=>`${e}的真相：你不得不知道的5件事`,e=>`从${e}看消费升级的趋势`]},h={xiaohongshu:[{angle:"种草",description:"以亲身体验分享为主，强调使用场景和情感共鸣"},{angle:"测评",description:"客观评测优缺点，建立信任感"},{angle:"避坑",description:"指出常见误区，提供实用建议"},{angle:"对比",description:"横向对比不同产品，帮助决策"},{angle:"攻略",description:"系统性介绍，成为权威指南"}],zhihu:[{angle:"深度分析",description:"从专业角度拆解问题本质"},{angle:"经验分享",description:"以过来人身份分享实战经验"},{angle:"争议讨论",description:"引发思考，促进互动"},{angle:"数据论证",description:"用数据说话，增强说服力"},{angle:"趋势解读",description:"洞察行业趋势，展示前瞻性"}],weibo:[{angle:"热点蹭流",description:"借势热门话题扩大曝光"},{angle:"互动提问",description:"引导用户评论参与"},{angle:"观点输出",description:"鲜明立场引发讨论"},{angle:"实用技巧",description:"简短干货，便于传播"},{angle:"情绪共鸣",description:"触动情感，激发转发"}],douyin:[{angle:"口播讲解",description:"真人出镜，增强信任"},{angle:"剧情植入",description:"场景化展示使用效果"},{angle:"干货教学",description:"解决问题导向"},{angle:"开箱测评",description:"第一视角体验"},{angle:"挑战赛",description:"参与热门挑战获取流量"}],wechat:[{angle:"深度故事",description:"通过故事传递价值"},{angle:"清单汇总",description:"系统性整理，便于收藏"},{angle:"案例解析",description:"真实案例证明效果"},{angle:"趋势报告",description:"行业洞察，建立专业形象"},{angle:"实用手册",description:"操作步骤清晰可执行"}]},u=[{id:"mom",name:"宝妈",style:"亲切、接地气、注重性价比"},{id:"student",name:"学生党",style:"活泼、爱玩、价格敏感"},{id:"pro",name:"专业人士",style:"严谨、有深度、强调专业度"},{id:"geek",name:"发烧友",style:"懂行、追求极致、重参数"},{id:"normal",name:"普通用户",style:"真实、中立、代表大众视角"}];async function d(e){try{let{keyword:o,platforms:n=["xiaohongshu","zhihu","weibo"],countPerPlatform:t=5,opportunity:a}=await e.json();if(!o||!a)return r.NextResponse.json({error:"缺少必要参数: keyword, opportunity"},{status:400});let i=[],s=0;for(let e of n){let n=h[e]||h.xiaohongshu,r=m[e]||m.xiaohongshu;for(let m=0;m<Math.min(t,n.length);m++){let t=n[m],h=await (0,l.Bq)({trendTitle:`${o} ${t.angle}`,opportunity:a,platform:e,keyword:o}),d=(0,c.e)(h.content,e),p=null,g=[],$="";d.length>0&&(g=(p=(0,c.a)(h.content,d,e)).insertedProducts,$=p.estimatedCommission,s+=parseInt($)||10);let f=function(e){let o={xiaohongshu:["12:00-13:00","18:00-20:00","21:00-22:00"],zhihu:["08:00-09:00","12:00-13:00","20:00-22:00"],weibo:["08:00-09:00","12:00-13:00","18:00-19:00","21:00-22:00"],douyin:["12:00-13:00","18:00-20:00","21:00-23:00"],wechat:["07:00-08:00","12:00-13:00","20:00-21:00"]};return o[e]||o.xiaohongshu}(e),y=u[Math.floor(Math.random()*u.length)];i.push({id:`factory-${Date.now()}-${e}-${m}`,platform:e,angle:t.angle,title:r[m%r.length]?.(o)||`${o} ${t.angle}`,content:h.content,monetizedContent:p?.monetizedContent||null,insertedProducts:g,estimatedCommission:$,persona:y.name,bestTime:f[m%f.length]})}}return r.NextResponse.json({success:!0,keyword:o,totalContents:i.length,contents:i,summary:{byPlatform:i.reduce((e,o)=>(e[o.platform]=(e[o.platform]||0)+1,e),{}),totalEstimateRevenue:`\xa5${Math.round(s/i.length)}-\xa5${Math.round(2*s/i.length)}/月`,generatedAt:new Date().toISOString()}})}catch(e){return console.error("Factory generation error:",e),r.NextResponse.json({error:"工厂生成失败"},{status:500})}}let p=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/factory/generate/route",pathname:"/api/factory/generate",filename:"route",bundlePath:"app/api/factory/generate/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\factory\\generate\\route.ts",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:g,staticGenerationAsyncStorage:$,serverHooks:f}=p,y="/api/factory/generate/route";function w(){return(0,s.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:$})}},47853:(e,o,n)=>{n.d(o,{D:()=>s,X:()=>r});let t={jd:process.env.JD_UNION_ID||"2038448747",taobao:process.env.TB_UNION_ID||"10458946368",pdd:process.env.PDD_UNION_ID||"44672749"},a="https://u.jd.com/",i="https://p.pinduoduo.com/",s=[{id:"jd-01",name:"AirPods Pro 2代",category:"3C数码",link:`${a}UafAw4j`,commission:5,platform:["xiaohongshu","zhihu","wechat"],tags:["耳机","数码","苹果"]},{id:"jd-02",name:"Anker 20000mAh充电宝",category:"3C数码",link:`${a}UafAw5k`,commission:8,platform:["xiaohongshu","weibo"],tags:["充电宝","便携","数码"]},{id:"tb-01",name:"Rokid AR智能眼镜",category:"3C数码",link:"https://m.tb.cn/h.8Tzy8la",commission:6,platform:["xiaohongshu","wechat"],tags:["AR","眼镜","数码"]},{id:"jd-04",name:"小米智能灯带",category:"家居",link:`${a}UafAw6m`,commission:7,platform:["xiaohongshu","zhihu"],tags:["智能","灯光","家居"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`${i}AqokQvI9?sc=${t.pdd}`,commission:15,platform:["xiaohongshu","wechat","pinduoduo"],tags:["收纳","桌面","整理"]},{id:"jd-06",name:"追觅洗地机",category:"家居",link:`${a}UafAw7n`,commission:5,platform:["xiaohongshu","zhihu"],tags:["清洁","智能","家居"]},{id:"jd-07",name:"帮宝适一级帮纸尿裤",category:"母婴",link:`${a}UafAw8o`,commission:4,platform:["xiaohongshu","wechat"],tags:["纸尿裤","母婴","婴儿"]},{id:"jd-08",name:"Babyzen yoyo+推车",category:"母婴",link:`${a}UafAw9p`,commission:3,platform:["xiaohongshu"],tags:["推车","母婴","出行"]},{id:"jd-09",name:"费雪智能摇椅",category:"母婴",link:`${a}UafAw0q`,commission:6,platform:["xiaohongshu","wechat"],tags:["早教","玩具","母婴"]},{id:"jd-10",name:"70mai行车记录仪",category:"汽车",link:`${a}UafAx1r`,commission:8,platform:["zhihu","weibo"],tags:["行车记录","汽车","安全"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`${i}AqokQvJ0?sc=${t.pdd}`,commission:8,platform:["xiaohongshu","weibo","pinduoduo"],tags:["车载","手机架","汽车"]},{id:"jd-11",name:"Baseus车载充电器",category:"汽车",link:`${a}UafAx2s`,commission:10,platform:["xiaohongshu","weibo"],tags:["车载","充电","汽车"]},{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`${i}AqokQvK1?sc=${t.pdd}`,commission:10,platform:["xiaohongshu","wechat","pinduoduo"],tags:["喂食器","宠物","智能"]},{id:"jd-12",name:"小佩智能喂食器PRO",category:"宠物",link:`${a}UafAx3t`,commission:6,platform:["xiaohongshu","zhihu","wechat"],tags:["喂食器","宠物","智能"]},{id:"jd-13",name:"pidan猫砂",category:"宠物",link:`${a}UafAx4u`,commission:12,platform:["xiaohongshu","wechat"],tags:["猫砂","宠物","除臭"]},{id:"jd-14",name:"伯纳天纯狗粮",category:"宠物",link:`${a}UafAx5v`,commission:8,platform:["xiaohongshu","zhihu"],tags:["狗粮","宠物","食品"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`${i}AqokQvL2?sc=${t.pdd}`,commission:12,platform:["xiaohongshu","zhihu","pinduoduo"],tags:["耳机","蓝牙","数码"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`${i}AqokQvM3?sc=${t.pdd}`,commission:10,platform:["xiaohongshu","weibo","pinduoduo"],tags:["数据线","充电","便携"]},{id:"jd-16",name:"薇诺娜宝贝舒润霜",category:"美妆",link:`${a}UafAw4j`,commission:3,platform:["xiaohongshu","wechat"],tags:["护肤","美妆","精华"]},{id:"jd-17",name:"安热沙防晒霜",category:"美妆",link:`${a}UafAx6w`,commission:5,platform:["xiaohongshu","weibo"],tags:["防晒","美妆","夏季"]},{id:"jd-18",name:"Keep瑜伽垫",category:"健身",link:`${a}UafAx7x`,commission:8,platform:["xiaohongshu","weibo"],tags:["瑜伽","健身","运动"]},{id:"jd-19",name:"小米手环8",category:"健身",link:`${a}UafAx8y`,commission:6,platform:["xiaohongshu","zhihu"],tags:["手环","健身","智能"]}],r={xiaohongshu:{introInsert:e=>`

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
🔗 购买链接：${e.link}?tag=20d-20`}}},58055:(e,o,n)=>{n.d(o,{a:()=>i,e:()=>a});var t=n(47853);function a(e,o){let n=e.toLowerCase(),a=new Map;for(let e of t.D){if(!e.platform.includes(o))continue;let t=e.tags.some(e=>n.includes(e.toLowerCase())||n.includes(e)),i=e.name.split(/[\s\u4e00-\u9fa5]+/).some(e=>n.includes(e.toLowerCase()));if(t||i){let o=a.get(e.category);(!o||e.commission>o.commission)&&a.set(e.category,e)}}return Array.from(a.values()).slice(0,3)}function i(e,o,n){let a=[],i=e,s=t.X[n]||t.X.xiaohongshu;o.forEach((o,n)=>{if(0===n){let n=e.slice(0,Math.floor(.3*e.length)),t=e.slice(Math.floor(.3*e.length));i=n+s.introInsert(o)+"\n\n"+t,a.push({name:o.name,link:o.link,position:"intro",insertionType:"自然植入"})}else 1===n?(i+=s.outroInsert(o),a.push({name:o.name,link:o.link,position:"outro",insertionType:"文末推荐"})):(i+=`

另外这款${o.name}也不错：${o.link}`,a.push({name:o.name,link:o.link,position:"outro",insertionType:"相关推荐"}))});let r=o.reduce((e,o)=>e+o.commission,0),l=o.length>0?`${Math.round(r/o.length)}% 平均佣金`:"无推广",c=[];return"xiaohongshu"===n?c.push("• 推广链接建议放在评论区置顶","• 不要在正文中直接放外链",'• 用"主页"、"笔记"等引导词更安全'):"zhihu"===n?c.push("• 知乎允许直接放链接","• 但要注意不要过度营销",'• 可以用"好物推荐"卡片'):"wechat"===n?c.push("• 公众号可以放跳转链接","• 用小程序卡片更自然","• 文末放二维码转化率高"):"weibo"===n&&c.push("• 微博短链接会被折叠","• 建议用品牌词+话题词引导","• 评论区放链接更稳妥"),{monetizedContent:i,insertedProducts:a,estimatedCommission:l,platformTips:c}}},91534:(e,o,n)=>{n.d(o,{Bq:()=>s});let t=["https://openai.api2d.net/v1","https://api.openai-proxy.com/v1","https://api.v5.lc/openai/v1","https://api.chatanywhere.tech/v1"],a={xiaohongshu:[(e,o)=>`姐妹们！终于发现了一个超宝藏的海外趋势！🔥

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

#${e.replace(/\s+/g,"")} #趋势观察`]};async function i(e){let o=process.env.OPENAI_API_KEY;if(!o||"sk-placeholder-for-testing"===o||o.startsWith("sk-placeholder"))return console.log("⚠️ OPENAI_API_KEY not configured"),null;let n={model:"gpt-4o-mini",messages:[{role:"system",content:"你是一位专业的内容创作者，擅长将海外热点本地化为适合中国平台的优质内容。要求：真实自然、客观中立、遵守广告法、价值导向。平台规范：小红书口语化加emoji、知乎结构化论述、公众号故事感、微博精炼话题词。输出纯文章内容，末尾添加合规声明。"},{role:"user",content:`请为"${e.platform}"平台写一篇种草文章。

趋势标题：${e.trendTitle}
市场机会：${e.opportunity}`}],temperature:.7,max_tokens:800},a=Date.now(),i="";for(let e of t)try{console.log(`🔄 尝试代理: ${e}`);let t=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(n),signal:AbortSignal.timeout(3e4)});if(t.ok){let o=await t.json(),n=Date.now()-a;if(o.choices?.[0]?.message?.content)return console.log(`✅ OpenAI API 通过代理 ${e} 成功，耗时 ${n}ms`),{content:o.choices[0].message.content,source:"openai",quality:"high",latency:n}}else{let o=await t.text().catch(()=>"");console.warn(`⚠️ 代理 ${e} 返回错误 ${t.status}: ${o.substring(0,100)}`),i=`HTTP ${t.status}: ${o.substring(0,50)}`}}catch(n){let o=n instanceof Error?n.message:"Unknown error";console.warn(`❌ 代理 ${e} 连接失败: ${o}`),i=o}return console.error(`❌ 所有代理均失败，最后错误: ${i}`),null}async function s(e){let o=await i(e);return o?(console.log(`🎉 AI生成成功！耗时: ${o.latency}ms`),o):(console.log("⚠️ OpenAI 不可用，回退到模板引擎"),function(e){let o=a[e.platform||"xiaohongshu"]||a.xiaohongshu,n=Math.floor(Math.random()*o.length);return{content:o[n](e.trendTitle,e.opportunity),source:"local",quality:"template"}}(e))}}};var o=require("../../../../webpack-runtime.js");o.C(e);var n=e=>o(o.s=e),t=o.X(0,[8948,5972],()=>n(12287));module.exports=t})();