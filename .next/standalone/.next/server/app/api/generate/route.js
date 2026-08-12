"use strict";(()=>{var e={};e.id=8290,e.ids=[8290],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},16065:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>v,patchFetch:()=>A,requestAsyncStorage:()=>w,routeModule:()=>k,serverHooks:()=>x,staticGenerationAsyncStorage:()=>y});var n={};o.r(n),o.d(n,{GET:()=>p,POST:()=>$});var a=o(49303),r=o(88716),i=o(60670),s=o(87070),l=o(91534),c=o(58055),u=o(465);let h={xiaohongshu:["说真的","姐妹们","踩坑了","亲测有效","真的绝了","无语子","绝绝子","救命","谁懂啊","我真的会谢","栓Q","笑死","蚌埠住了","泰裤辣","YYDS","种草","拔草","智商税"],zhihu:["说句实话","个人经验","供参考","不吹不黑","客观来说","说实话","有一说一","理性看待","个人观点"],weibo:["啊啊啊","绝了","太香了","冲!","爱了爱了","哭死","笑死","救命","真的假的"],douyin:["家人们","兄弟们","姐妹们","真的绝","太香了","冲就完了","闭眼入","按头安利"],wechat:["大家好","我来说两句","真心觉得","实不相瞒","掏心窝子说"]},m=["拍照技术太烂了凑合看","懒得修图了","随手拍的","原相机直出","没打光","随便拍拍","手机拍的","将就着看","画质渣勿喷","设备有限"],d={这个:["介个","这该","这嘎"],真的:["真滴","珍的","真个"],特别:["特变","提别","忒别"],非常:["灰常","肥常","非偿"],但是:["但系","但西","担是"],什么:["神马","嘛什","撒"],不是:["部是","不事","不私"],现在:["线在","现咱","现拽"]},g=["随着","在当今","近年来","众所周知","总的来说","首先","其次","最后","综上所述","总而言之"],f=["深度测评","全面分析","推荐","指南","攻略","详解","评测","报告","总结","汇总"];async function p(){return s.NextResponse.json({success:!0,message:"TrendFlow API is running",aiStatus:process.env.OPENAI_API_KEY?"Configured":"Fallback mode (template)"})}async function $(e){let t;try{let{trendTitle:o,opportunity:n,platform:a,keyword:r,autoMonetize:i=!0,count:p=1,sourceInfo:$,humanLevel:k=3,maxWords:w}=t=await e.json();if(!o||!n||!a)return s.NextResponse.json({error:"请填写完整信息"},{status:400});let y=[];for(let e=0;e<p;e++){let e=await (0,l.Bq)({trendTitle:o,opportunity:n,platform:a,keyword:r}),t=e.content,s="";if(k>0){let n=function(e,t){let o=t.emotion||["后悔","震惊","真香","踩坑","逆袭"],n=["3天","7天","15天","30天","半年","一年"],a=[`用了${n[Math.floor(Math.random()*n.length)]}，我决定${Math.random()>.5?"把"+e+"退了":"又买了"+e}`,`${e}真实体验：${o[Math.floor(Math.random()*o.length)]}`,`千万别买${e}！除非...`,`${e}大实话：${o[Math.floor(Math.random()*o.length)]}`,`用了${e}${n[Math.floor(Math.random()*n.length)]}，终于敢说真话了`,`${e}到底是不是智商税？亲测告诉你答案`],r=a[Math.floor(Math.random()*a.length)];return r.length>30&&(r=r.slice(0,27)+"..."),r}(o||r,{emotion:{xiaohongshu:"真香",zhihu:"理性",weibo:"震惊",douyin:"太香",wechat:"走心"}[a]||"真实"});s=!function(e){return!f.some(t=>e.includes(t))}(n)?o||r:n,t=function(e,t){let o=e,n=h[t.platform]||h.xiaohongshu;o=function(e){let t=e.split("\n");if(0===t.length)return e;let o=t[0];if(g.some(e=>o.includes(e))){let e=["说实话","用了30天","踩过坑","亲测","姐妹们","家人们","今天","最近"],n=e[Math.floor(Math.random()*e.length)];t[0]=`${n}，${o.replace(RegExp(`^${g.find(e=>o.includes(e))}|^[^s]+`),"")}`}return t.join("\n")}(o);let a=Math.ceil(t.humanLevel/2);for(let e=0;e<a;e++)o=function(e,t){let o=e.split(/[。！？\n]/).filter(e=>e.trim());if(o.length<2)return e;let n=Math.floor(Math.random()*(o.length-1))+1,a=o.slice(0,n).join("。")+"。",r=o.slice(n).join("。")+"。";return`${a}${t}，${r}`}(o,n[Math.floor(Math.random()*n.length)]);return .3>Math.random()&&(o=function(e,t){for(let o of["图","照片","视频","截图","实拍"]){let n=e.indexOf(o);if(-1!==n&&n>0)return e.slice(0,n)+t+e.slice(n)}return e+"\n\n"+t}(o,m[Math.floor(Math.random()*m.length)])),.2>Math.random()&&t.humanLevel>=4&&(o=function(e,t){let o=Object.keys(t),n=o[Math.floor(Math.random()*o.length)],a=t[n],r=a[Math.floor(Math.random()*a.length)],i=e.indexOf(n);return -1===i?e:e.slice(0,i)+r+e.slice(i+n.length)}(o,d)),t.maxWords&&(o=function(e,t){var o;let n=(e.match(/[\u4e00-\u9fa5]/g)||[]).length,a=(e.match(/[a-zA-Z]+/g)||[]).length;if(n+a<=t)return e;let r=e;for(;((o=r).match(/[\u4e00-\u9fa5]/g)||[]).length+(o.match(/[a-zA-Z]+/g)||[]).length>t;)r=r.slice(0,-1);let i=Math.max(r.lastIndexOf("。"),r.lastIndexOf("！"),r.lastIndexOf("？"),r.lastIndexOf("\n"));return i>.8*t?r=r.slice(0,i+1):r+="...",r}(o,t.maxWords)),o}(e.content,{platform:a,humanLevel:k,maxWords:w||({xiaohongshu:800,zhihu:5e3,weibo:140,douyin:800,wechat:3e3})[a]||800})}else s=o||r;let p=function(e,t,o){let n="";for(let t of[/核心观点?[是：:](.+?)[\n。]/,/总结[：:](.+?)[\n。]/,/主要[是：](.+?)[\n。]/]){let o=e.match(t);if(o){n=o[1].trim();break}}n||(n=`本文通过对${t}的深入分析，提供了客观实用的购买建议`);let a=function(e,t){let o=[],n=e.match(/\d+[万千万亿个%°米kg美元元]/g);return n&&n.length>0&&o.push(...n.slice(0,3)),"xiaohongshu"===t&&(o.push("小红书热门话题"),o.push("种草转化率高达15%")),o.length<2&&(o.push("市场热度持续上升"),o.push("用户评价正面率85%+")),o.slice(0,5)}(e,o),r=function(e){let t=[];for(let[o,n]of Object.entries({惊讶:["震惊","意外","没想到","竟然"],焦虑:["担心","害怕","担忧","坑","踩雷"],兴奋:["兴奋","期待","太棒了","神器"],信任:["真实","亲测","认证","保证"]}))for(let o of n)e.includes(o)&&t.length<3&&t.push(o);return t.length>=2?t:["实用","真实"]}(e);return{coreArgument:n,keyData:a,emotionKeywords:r,controversyPoints:function(e,t){let o={宠物:["价格贵vs实用性强","智能vs手动哪个更好","国产vs进口对比"],"3C数码":["性能vs价格","新功能vs稳定性","品牌溢价是否值得"],家居:["颜值vs实用","智能化vs传统化","品牌 vs 性价比"]},n="通用";for(let[t,a]of Object.entries(o))for(let o of a)if(e.includes(o)||o.includes(e)){n=t;break}return o[n]?.slice(0,2)||["价格 vs 价值","需求 vs 冲动"]}(t,0)}}(t,s,a),x=null;if(i){let n=(0,c.e)(t,a),r=null,i=[],l="",h=null;n.length>0&&(i=(r=(0,c.a)(t,n,a)).insertedProducts,l=r.estimatedCommission,h=n[0]),x=(0,u.trackContentGeneration)(o,a,s,t,{injectedProducts:i.map(e=>e.name),coreArgument:p.coreArgument,keyData:p.keyData,emotionKeywords:p.emotionKeywords,controversyPoints:p.controversyPoints,recommendedProduct:h,sourceInfo:$}),y.push({...e,content:t,title:s,...p,monetizedContent:r?.monetizedContent||t,insertedProducts:i,estimatedCommission:l,hasMonetization:i.length>0,trackedId:x?.id,wordCount:t.length,humanLevel:k})}else x=(0,u.trackContentGeneration)(o,a,s,t,{coreArgument:p.coreArgument,keyData:p.keyData,emotionKeywords:p.emotionKeywords,sourceInfo:$}),y.push({...e,content:t,title:s,...p,trackedId:x?.id,wordCount:t.length,humanLevel:k})}return s.NextResponse.json(1===p?y[0]:y)}catch(e){return console.error("Generation error:",e),s.NextResponse.json({content:`这是一篇关于${t?.trendTitle||"产品"}的种草文章。`,source:"fallback",quality:"fallback"})}}let k=new a.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\generate\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:w,staticGenerationAsyncStorage:y,serverHooks:x}=k,v="/api/generate/route";function A(){return(0,i.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:y})}},47853:(e,t,o)=>{o.d(t,{D:()=>i,X:()=>s});let n={jd:process.env.JD_UNION_ID||"2038448747",taobao:process.env.TB_UNION_ID||"10458946368",pdd:process.env.PDD_UNION_ID||"44672749"},a="https://u.jd.com/",r="https://p.pinduoduo.com/",i=[{id:"jd-01",name:"AirPods Pro 2代",category:"3C数码",link:`${a}UafAw4j`,commission:5,platform:["xiaohongshu","zhihu","wechat"],tags:["耳机","数码","苹果"]},{id:"jd-02",name:"Anker 20000mAh充电宝",category:"3C数码",link:`${a}UafAw5k`,commission:8,platform:["xiaohongshu","weibo"],tags:["充电宝","便携","数码"]},{id:"tb-01",name:"Rokid AR智能眼镜",category:"3C数码",link:"https://m.tb.cn/h.8Tzy8la",commission:6,platform:["xiaohongshu","wechat"],tags:["AR","眼镜","数码"]},{id:"jd-04",name:"小米智能灯带",category:"家居",link:`${a}UafAw6m`,commission:7,platform:["xiaohongshu","zhihu"],tags:["智能","灯光","家居"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`${r}AqokQvI9?sc=${n.pdd}`,commission:15,platform:["xiaohongshu","wechat","pinduoduo"],tags:["收纳","桌面","整理"]},{id:"jd-06",name:"追觅洗地机",category:"家居",link:`${a}UafAw7n`,commission:5,platform:["xiaohongshu","zhihu"],tags:["清洁","智能","家居"]},{id:"jd-07",name:"帮宝适一级帮纸尿裤",category:"母婴",link:`${a}UafAw8o`,commission:4,platform:["xiaohongshu","wechat"],tags:["纸尿裤","母婴","婴儿"]},{id:"jd-08",name:"Babyzen yoyo+推车",category:"母婴",link:`${a}UafAw9p`,commission:3,platform:["xiaohongshu"],tags:["推车","母婴","出行"]},{id:"jd-09",name:"费雪智能摇椅",category:"母婴",link:`${a}UafAw0q`,commission:6,platform:["xiaohongshu","wechat"],tags:["早教","玩具","母婴"]},{id:"jd-10",name:"70mai行车记录仪",category:"汽车",link:`${a}UafAx1r`,commission:8,platform:["zhihu","weibo"],tags:["行车记录","汽车","安全"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`${r}AqokQvJ0?sc=${n.pdd}`,commission:8,platform:["xiaohongshu","weibo","pinduoduo"],tags:["车载","手机架","汽车"]},{id:"jd-11",name:"Baseus车载充电器",category:"汽车",link:`${a}UafAx2s`,commission:10,platform:["xiaohongshu","weibo"],tags:["车载","充电","汽车"]},{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`${r}AqokQvK1?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","wechat","pinduoduo"],tags:["喂食器","宠物","智能"]},{id:"jd-12",name:"小佩智能喂食器PRO",category:"宠物",link:`${a}UafAx3t`,commission:6,platform:["xiaohongshu","zhihu","wechat"],tags:["喂食器","宠物","智能"]},{id:"jd-13",name:"pidan猫砂",category:"宠物",link:`${a}UafAx4u`,commission:12,platform:["xiaohongshu","wechat"],tags:["猫砂","宠物","除臭"]},{id:"jd-14",name:"伯纳天纯狗粮",category:"宠物",link:`${a}UafAx5v`,commission:8,platform:["xiaohongshu","zhihu"],tags:["狗粮","宠物","食品"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`${r}AqokQvL2?sc=${n.pdd}`,commission:12,platform:["xiaohongshu","zhihu","pinduoduo"],tags:["耳机","蓝牙","数码"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`${r}AqokQvM3?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","weibo","pinduoduo"],tags:["数据线","充电","便携"]},{id:"jd-16",name:"薇诺娜宝贝舒润霜",category:"美妆",link:`${a}UafAw4j`,commission:3,platform:["xiaohongshu","wechat"],tags:["护肤","美妆","精华"]},{id:"jd-17",name:"安热沙防晒霜",category:"美妆",link:`${a}UafAx6w`,commission:5,platform:["xiaohongshu","weibo"],tags:["防晒","美妆","夏季"]},{id:"jd-18",name:"Keep瑜伽垫",category:"健身",link:`${a}UafAx7x`,commission:8,platform:["xiaohongshu","weibo"],tags:["瑜伽","健身","运动"]},{id:"jd-19",name:"小米手环8",category:"健身",link:`${a}UafAx8y`,commission:6,platform:["xiaohongshu","zhihu"],tags:["手环","健身","智能"]}],s={xiaohongshu:{introInsert:e=>`

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
💬 想了解更多？点击链接查看详情 👉 ${e.link}`},weibo:{introInsert:(e,t)=>`#${t}#${e.name}相关 #种草#`,outroInsert:e=>`

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
🔗 购买链接：${e.link}?tag=20d-20`}}},58055:(e,t,o)=>{o.d(t,{a:()=>r,e:()=>a});var n=o(47853);function a(e,t){let o=e.toLowerCase(),a=new Map;for(let e of n.D){if(!e.platform.includes(t))continue;let n=e.tags.some(e=>o.includes(e.toLowerCase())||o.includes(e)),r=e.name.split(/[\s\u4e00-\u9fa5]+/).some(e=>o.includes(e.toLowerCase()));if(n||r){let t=a.get(e.category);(!t||e.commission>t.commission)&&a.set(e.category,e)}}return Array.from(a.values()).slice(0,3)}function r(e,t,o){let a=[],r=e,i=n.X[o]||n.X.xiaohongshu;t.forEach((t,o)=>{if(0===o){let o=e.slice(0,Math.floor(.3*e.length)),n=e.slice(Math.floor(.3*e.length));r=o+i.introInsert(t)+"\n\n"+n,a.push({name:t.name,link:t.link,position:"intro",insertionType:"自然植入"})}else 1===o?(r+=i.outroInsert(t),a.push({name:t.name,link:t.link,position:"outro",insertionType:"文末推荐"})):(r+=`

另外这款${t.name}也不错：${t.link}`,a.push({name:t.name,link:t.link,position:"outro",insertionType:"相关推荐"}))});let s=t.reduce((e,t)=>e+t.commission,0),l=t.length>0?`${Math.round(s/t.length)}% 平均佣金`:"无推广",c=[];return"xiaohongshu"===o?c.push("• 推广链接建议放在评论区置顶","• 不要在正文中直接放外链",'• 用"主页"、"笔记"等引导词更安全'):"zhihu"===o?c.push("• 知乎允许直接放链接","• 但要注意不要过度营销",'• 可以用"好物推荐"卡片'):"wechat"===o?c.push("• 公众号可以放跳转链接","• 用小程序卡片更自然","• 文末放二维码转化率高"):"weibo"===o&&c.push("• 微博短链接会被折叠","• 建议用品牌词+话题词引导","• 评论区放链接更稳妥"),{monetizedContent:r,insertedProducts:a,estimatedCommission:l,platformTips:c}}},465:(e,t,o)=>{o.d(t,{Ll:()=>l,N3:()=>c,clearAllData:()=>u,tQ:()=>s,trackContentGeneration:()=>r,trackPerformance:()=>i});let n=[],a=[];function r(e,t,o,a,r={}){let i={id:`content-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,keyword:e,platform:t,title:o,generatedAt:new Date().toISOString(),contentLength:a.length,injectedProducts:r.injectedProducts||[],coreArgument:r.coreArgument,keyData:r.keyData,emotionKeywords:r.emotionKeywords,controversyPoints:r.controversyPoints,recommendedProduct:r.recommendedProduct,sourceInfo:r.sourceInfo};return n.push(i),i}function i(e,t){let o={contentId:e,views:t.views,clicks:t.clicks,conversions:t.conversions,revenue:t.revenue,platformFlagged:t.platformFlagged||!1,recordedAt:new Date().toISOString()};return a.push(o),o}function s(){let e={},t={};n.forEach(o=>{e[o.platform]||(e[o.platform]={count:0,totalViews:0,totalRevenue:0}),e[o.platform].count++,t[o.keyword]=(t[o.keyword]||0)+1});let o=0,r=0,i=0;a.forEach(t=>{o+=t.views,r+=t.clicks,i+=t.conversions;let a=n.find(e=>e.id===t.contentId);a&&e[a.platform]&&(e[a.platform].totalRevenue+=t.revenue,e[a.platform].totalViews+=t.views)});let s=o>0?r/o*100:0,l=r>0?i/r*100:0;return{totalGenerated:n.length,totalPerformance:a.length,byPlatform:e,byKeyword:t,recentRecords:n.slice(-20).reverse(),averageCTR:s,averageCVR:l}}function l(e){let t=[...n];e?.keyword&&(t=t.filter(t=>t.keyword.includes(e.keyword))),e?.platform&&(t=t.filter(t=>t.platform===e.platform));let o=e?.limit||50;return t.slice(-o).reverse()}function c(e){return e?a.filter(t=>t.contentId===e):[...a].reverse()}function u(){n=[],a=[]}},91534:(e,t,o)=>{o.d(t,{Bq:()=>i});let n=["https://openai.api2d.net/v1","https://api.openai-proxy.com/v1","https://api.v5.lc/openai/v1","https://api.chatanywhere.tech/v1"],a={xiaohongshu:[(e,t)=>`姐妹们！终于发现了一个超宝藏的海外趋势！🔥

最近刷到一个超火的${e}，在TikTok和Instagram上已经爆火很久了！

🤔为什么这么火？
${t}

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

#${e.replace(/\s+/g,"")} #海外潮流 #趋势发现 #消费指南`,(e,t)=>`被问爆了！终于把${e}搞明白了 😭

说实话，之前对这个完全不感兴趣，直到看到它在国外火了...

📊 数据说话：
${t}

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

#${e.replace(/\s+/g,"")} #消费心得 #真实测评`],zhihu:[(e,t)=>`如何评价${e}在中国的可行性？

谢邀。

先从数据来源说起。最近在研究海外市场时注意到${e}在欧美的兴起，背后反映的是一些有趣的市场规律。

## 一、现象观察

${t}

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

以上是我的个人观点，欢迎交流讨论。`],wechat:[(e,t)=>`${e}——一个让我重新思考消费的文章

文/趋势洞察

最近，${e}这个话题在我的朋友圈里悄悄火起来了。

一开始我也没在意，觉得不就是个普通的趋势吗？但当我深入了解后，发现这件事远比想象中更有意思。

---

## 背后的逻辑

${t}

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
喜欢这篇文章吗？欢迎点赞、在看、转发~`],weibo:[(e,t)=>`#${e.replace(/\s+/g,"")}# 最近刷到这个趋势，有点意思 🤔

${t}

关键是：中国市场的供应链完全跟得上，差距正在缩小。

你怎么看？支持还是反对？评论区聊聊 👇

#${e.replace(/\s+/g,"")} #趋势观察`]};async function r(e){let t=process.env.OPENAI_API_KEY;if(!t||"sk-placeholder-for-testing"===t||t.startsWith("sk-placeholder"))return console.log("⚠️ OPENAI_API_KEY not configured"),null;let o={model:"gpt-4o-mini",messages:[{role:"system",content:"你是一位专业的内容创作者，擅长将海外热点本地化为适合中国平台的优质内容。要求：真实自然、客观中立、遵守广告法、价值导向。平台规范：小红书口语化加emoji、知乎结构化论述、公众号故事感、微博精炼话题词。输出纯文章内容，末尾添加合规声明。"},{role:"user",content:`请为"${e.platform}"平台写一篇种草文章。

趋势标题：${e.trendTitle}
市场机会：${e.opportunity}`}],temperature:.7,max_tokens:800},a=Date.now(),r="";for(let e of n)try{console.log(`🔄 尝试代理: ${e}`);let n=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(o),signal:AbortSignal.timeout(3e4)});if(n.ok){let t=await n.json(),o=Date.now()-a;if(t.choices?.[0]?.message?.content)return console.log(`✅ OpenAI API 通过代理 ${e} 成功，耗时 ${o}ms`),{content:t.choices[0].message.content,source:"openai",quality:"high",latency:o}}else{let t=await n.text().catch(()=>"");console.warn(`⚠️ 代理 ${e} 返回错误 ${n.status}: ${t.substring(0,100)}`),r=`HTTP ${n.status}: ${t.substring(0,50)}`}}catch(o){let t=o instanceof Error?o.message:"Unknown error";console.warn(`❌ 代理 ${e} 连接失败: ${t}`),r=t}return console.error(`❌ 所有代理均失败，最后错误: ${r}`),null}async function i(e){let t=await r(e);return t?(console.log(`🎉 AI生成成功！耗时: ${t.latency}ms`),t):(console.log("⚠️ OpenAI 不可用，回退到模板引擎"),function(e){let t=a[e.platform||"xiaohongshu"]||a.xiaohongshu,o=Math.floor(Math.random()*t.length);return{content:t[o](e.trendTitle,e.opportunity),source:"local",quality:"template"}}(e))}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),n=t.X(0,[8948,5972],()=>o(16065));module.exports=n})();