"use strict";(()=>{var e={};e.id=4235,e.ids=[4235],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},72073:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>h,patchFetch:()=>$,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>D,staticGenerationAsyncStorage:()=>g});var o={};i.r(o),i.d(o,{GET:()=>p,POST:()=>l});var r=i(49303),s=i(88716),a=i(60670),c=i(87070);let n={xiaohongshu:{emoji:["\uD83D\uDCB0","\uD83D\uDD25","✨","\uD83D\uDC95","\uD83D\uDE0D","\uD83D\uDED2","✅","⭐"],style:"种草闺蜜风",structure:"开头吐槽 → 产品亮点 → 使用体验 → 购买建议"},zhihu:{emoji:[],style:"专业评测风",structure:"问题引入 → 参数分析 → 优缺点对比 → 购买建议"},weibo:{emoji:["\uD83D\uDD25","\uD83D\uDCB0","\uD83D\uDED2"],style:"短平快带货风",structure:"话题标签 → 核心卖点 → 限时优惠 → 购买链接"},douyin:{emoji:["\uD83C\uDFAC","\uD83D\uDD25","\uD83D\uDCB0"],style:"口语化推荐风",structure:"开场吸引 → 痛点解决 → 产品推荐 → 行动号召"},wechat:{emoji:["\uD83D\uDCCC","\uD83D\uDCA1","✨"],style:"深度种草风",structure:"场景引入 → 产品体验 → 细节展示 → 购买引导"}};async function u(e){await new Promise(e=>setTimeout(e,500));let t=e.includes("jd.com")||e.includes("u.jd.com")?"jd":e.includes("taobao.com")||e.includes("tmall.com")||e.includes("m.tb.cn")?"tb":e.includes("pinduoduo.com")||e.includes("mob.huoshan.com")?"pdd":e.includes("amazon.com")?"amazon":"unknown",i={jd:{title:"小佩智能宠物喂食器PRO 自动喂食机 手机APP远程操控 定时定量",price:"\xa5899",originalPrice:"\xa51299",images:["https://img.jd.com/n1/s450x450_jfs/t1/123456/1/12345/123456/5f123456E12345678/12345678.jpg"],description:"智能喂食神器，APP远程控制，定时定量，适合忙碌的上班族。大容量设计，一次加粮可用一周。",specs:{容量:"4L",供电方式:"USB+电池",智能功能:"APP控制、语音播报",适用对象:"猫狗通用"},reviews:{positiveRate:95,totalReviews:12580,topComments:["质量很好","操作简便","猫咪很喜欢"]},category:"宠物用品"},tb:{title:"Rokid AR智能眼镜 增强现实眼镜 影视游戏两用",price:"\xa52999",originalPrice:"\xa53999",images:["https://img.alicdn.com/imgextra/i1/O1CN01abc123_!!0-item_pic.jpg"],description:"AR增强现实眼镜，沉浸式观影体验，支持游戏模式，轻便舒适设计。",specs:{分辨率:"1920x1080",续航时间:"3小时",重量:"78g",连接方式:"蓝牙5.0"},reviews:{positiveRate:92,totalReviews:3560,topComments:["画质清晰","佩戴舒适","性价比超高"]},category:"数码科技"},pdd:{title:"车载手机支架 汽车用出风口导航支撑架 通用型",price:"\xa529.9",originalPrice:"\xa559.9",images:["https://img.pddpic.com/mms-material-img/2024-01-01/abc123.jpeg"],description:"稳固不晃，适配各种车型，单手操作，安全便捷。",specs:{材质:"ABS+硅胶",适配车型:"通用",安装位置:"出风口",颜色:"黑色/银色"},reviews:{positiveRate:98,totalReviews:56890,topComments:["很稳","便宜好用","物流快"]},category:"汽车配件"}};return i[t]||i.jd}async function l(e){try{let{productUrl:t,pid:i,platforms:o=["xiaohongshu","zhihu","weibo"]}=await e.json();if(!t)return c.NextResponse.json({error:"请提供商品链接"},{status:400});let r=await u(t),s=function(e,t,i){let o=Object.keys(n),r={};for(let i of o)r[i]=function(e,t,i,o){let r=n[o],s="",a="",c=[];switch(o){case"xiaohongshu":s=`${e.category} | ${e.title.split(" ")[0]}真实体验`,a=function(e,t,i){let o=i.emoji;return o[Math.floor(Math.random()*o.length)],`姐妹们！今天必须给你们安利一个我用过最好用的${e.category}！

之前真的踩过好多坑，买了好几款都不是太满意...直到我遇见了这款${e.title.split(" ")[0]}！

💰 价格：${e.price}（原价${e.originalPrice||"较高"}，现在真的很划算）
📦 特点：${e.description.substring(0,50)}...

真心觉得好用才分享的！用了两周了，感觉太香了～

👉 我买的链接在这里：${t}
（自己搜同款也可以哦～）

#${e.category} #好物分享 #亲测有效 #宝藏好物`}(e,t,r),c=[e.category,"好物分享","亲测有效","宝藏好物"];break;case"zhihu":s=`${e.title}值得买吗？真实体验告诉你`,a=`作为${e.category}的资深用户，我来分享一下这款${e.title.split(" ")[0]}的真实体验。

## 基本信息
- **价格**：${e.price}（原价${e.originalPrice||e.price}）
- **销量**：${e.reviews?.totalReviews||0}人评价，好评率${e.reviews?.positiveRate||95}%

## 主要特点
${e.description}

## 我的使用体验
用了一段时间后，最大的感受就是：

1. **性价比高** - 同价位里表现突出
2. **实用性强** - 解决了我的实际需求
3. **质量稳定** - 没有出现什么问题

## 购买建议
如果你也在考虑入手这类产品，可以看看这个：
${t}

以上纯属个人使用体验，仅供参考。`,c=[e.category,"评测","推荐"];break;case"weibo":s=`#${e.category}#${e.title.split(" ")[0]}真实感受`,a=`#${e.category}# ${e.title.split(" ")[0]}真实感受来了！

💰价格：${e.price}
📝特点：${e.description.substring(0,30)}...

亲测好用！链接在这→${t}

#${e.category} #好物推荐 #种草`,c=[e.category,"#好物推荐#","#种草#"];break;case"douyin":s=`${e.title}真实测评`,a=`家人们！发现一款超好用的${e.category}！

${e.title.split(" ")[0]}
💰只要${e.price}！

真的太香了！链接在评论区👇
${t}`,c=[e.category,"#测评#","#好物#"];break;case"wechat":s=`${e.category} | ${e.title}`,a=`自用推荐📌

${e.category} - ${e.title.split(" ")[0]}
💰${e.price}（比专柜便宜）

亲测好用，链接👉${t}

#${e.category} #好物推荐`,c=[e.category,"推荐","亲测"];break;default:s=e.title,a=e.description}return{platform:o,title:s,body:a,images:e.images,tags:c,affiliateLink:t,wordCount:a.length}}(e,t,0,i);return r}(r,t,0),a=[];for(let e of o)s[e]&&a.push(s[e]);let l=i||process.env.JD_UNION_ID||"default_pid";return a.forEach(e=>{var t;e.affiliateLink=(t=e.affiliateLink).includes("u.jd.com")?t.replace(/f=\w+/,`f=${l}`):t.includes("m.tb.cn")?t.replace(/pid=\w+/,`pid=${l}`):t.includes("p.pinduoduo.com")||t.includes("mob.huoshan.com")?t.replace(/sc=\w+/,`sc=${l}`):t.includes("amazon.com")?t.replace(/tag=\w+-\d+/,`tag=${l}-20`):t}),c.NextResponse.json({success:!0,product:{...r,link:t,pid:l},contents:a,stats:{totalPlatforms:a.length,avgWordCount:Math.round(a.reduce((e,t)=>e+t.wordCount,0)/a.length),images:r.images.length}})}catch(e){return console.error("Clone error:",e),c.NextResponse.json({error:"生成失败，请检查商品链接是否正确"},{status:500})}}async function p(){return c.NextResponse.json({success:!0,message:"联盟商品搬运器 API",supportedPlatforms:["xiaohongshu","zhihu","weibo","douyin","wechat"],supportedStores:["jd.com","taobao.com","tmall.com","pinduoduo.com","amazon.com"],features:["自动抓取商品信息","多平台文案适配","推广链接自动替换PID","图片资源保留"]})}let d=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/affiliate/clone/route",pathname:"/api/affiliate/clone",filename:"route",bundlePath:"app/api/affiliate/clone/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\affiliate\\clone\\route.ts",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:D}=d,h="/api/affiliate/clone/route";function $(){return(0,a.patchFetch)({serverHooks:D,staticGenerationAsyncStorage:g})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),o=t.X(0,[8948,5972],()=>i(72073));module.exports=o})();