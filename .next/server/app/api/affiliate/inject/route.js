"use strict";(()=>{var o={};o.id=5312,o.ids=[5312],o.modules={20399:o=>{o.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:o=>{o.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},93679:(o,e,i)=>{i.r(e),i.d(e,{originalPathname:()=>$,patchFetch:()=>k,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>f,staticGenerationAsyncStorage:()=>g});var n={};i.r(n),i.d(n,{GET:()=>h,POST:()=>c});var t=i(49303),a=i(88716),s=i(60670),r=i(87070),m=i(58055);let d=process.env.PDD_UNION_ID||"44672749",u=[{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`https://mob.huoshan.com/item/?id=PDD_GOODS_01&pid=${d}`,commission:10,tags:["喂食器","宠物","智能","自动"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`https://mob.huoshan.com/item/?id=PDD_GOODS_02&pid=${d}`,commission:12,tags:["耳机","蓝牙","降噪","数码"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`https://mob.huoshan.com/item/?id=PDD_GOODS_03&pid=${d}`,commission:8,tags:["车载","手机架","汽车","支架"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`https://mob.huoshan.com/item/?id=PDD_GOODS_04&pid=${d}`,commission:15,tags:["收纳","桌面","整理","家居"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`https://mob.huoshan.com/item/?id=PDD_GOODS_05&pid=${d}`,commission:10,tags:["数据线","充电","便携","快充"]}];async function c(o){try{let{content:e,platform:i,keyword:n,enablePDD:t=!0}=await o.json();if(!e||!i)return r.NextResponse.json({error:"缺少必要参数: content, platform"},{status:400});let a=(0,m.e)(e,i),s=(0,m.a)(e,a,i),d=s.monetizedContent,c=[...s.insertedProducts],h=0;if(t){let o=function(o){let e=o.toLowerCase(),i=[];for(let o of u){let n=o.tags.some(o=>e.includes(o.toLowerCase())),t=o.name.split(/[\s\u4e00-\u9fa5]+/).some(o=>e.includes(o.toLowerCase()));(n||t)&&i.push(o)}return i.slice(0,2)}(d);if(o.length>0){let e=o[0],t={xiaohongshu:`

💰 **拼多多超值推荐：** ${e.name}，百亿补贴超便宜！`,zhihu:`

关于${n||"这款产品"}，拼多多上价格更优，建议对比后再入手。`,wechat:`

📌 **拼多多同款：** ${e.name}，搜索即可找到`,weibo:`

#${n||e.name}# 拼多多价格更香！`,douyin:`

🎬 同款在这里：${e.link}`};d+=t[i]||t.xiaohongshu,c.push({name:e.name,link:e.link,position:"outro",insertionType:"拼多多推荐"}),h=1}}return r.NextResponse.json({success:!0,monetizedContent:d,insertedProducts:c,estimatedCommission:s.estimatedCommission,pddEnabled:t,metadata:{jdProductCount:a.length,pddProductCount:h,generatedAt:new Date().toISOString(),source:"trendflow-affiliate-v2"}})}catch(o){return console.error("Affiliate injection error:",o),r.NextResponse.json({error:"变现注入失败"},{status:500})}}async function h(){return r.NextResponse.json({success:!0,message:"TrendFlow Affiliate Injection API v2",endpoint:"/api/affiliate/inject",features:["京东/淘宝联盟支持","拼多多多多进宝支持 ⭐","多平台话术适配","智能商品匹配"],platforms:["xiaohongshu","zhihu","wechat","weibo","douyin","pinduoduo"],productCount:24,pddProductCount:5})}let l=new t.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/affiliate/inject/route",pathname:"/api/affiliate/inject",filename:"route",bundlePath:"app/api/affiliate/inject/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\affiliate\\inject\\route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:p,staticGenerationAsyncStorage:g,serverHooks:f}=l,$="/api/affiliate/inject/route";function k(){return(0,s.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:g})}},47853:(o,e,i)=>{i.d(e,{D:()=>s,X:()=>r});let n={jd:process.env.JD_UNION_ID||"2038448747",taobao:process.env.TB_UNION_ID||"10458946368",pdd:process.env.PDD_UNION_ID||"44672749"},t="https://u.jd.com/",a="https://p.pinduoduo.com/",s=[{id:"jd-01",name:"AirPods Pro 2代",category:"3C数码",link:`${t}UafAw4j`,commission:5,platform:["xiaohongshu","zhihu","wechat"],tags:["耳机","数码","苹果"]},{id:"jd-02",name:"Anker 20000mAh充电宝",category:"3C数码",link:`${t}UafAw5k`,commission:8,platform:["xiaohongshu","weibo"],tags:["充电宝","便携","数码"]},{id:"tb-01",name:"Rokid AR智能眼镜",category:"3C数码",link:"https://m.tb.cn/h.8Tzy8la",commission:6,platform:["xiaohongshu","wechat"],tags:["AR","眼镜","数码"]},{id:"jd-04",name:"小米智能灯带",category:"家居",link:`${t}UafAw6m`,commission:7,platform:["xiaohongshu","zhihu"],tags:["智能","灯光","家居"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`${a}AqokQvI9?sc=${n.pdd}`,commission:15,platform:["xiaohongshu","wechat","pinduoduo"],tags:["收纳","桌面","整理"]},{id:"jd-06",name:"追觅洗地机",category:"家居",link:`${t}UafAw7n`,commission:5,platform:["xiaohongshu","zhihu"],tags:["清洁","智能","家居"]},{id:"jd-07",name:"帮宝适一级帮纸尿裤",category:"母婴",link:`${t}UafAw8o`,commission:4,platform:["xiaohongshu","wechat"],tags:["纸尿裤","母婴","婴儿"]},{id:"jd-08",name:"Babyzen yoyo+推车",category:"母婴",link:`${t}UafAw9p`,commission:3,platform:["xiaohongshu"],tags:["推车","母婴","出行"]},{id:"jd-09",name:"费雪智能摇椅",category:"母婴",link:`${t}UafAw0q`,commission:6,platform:["xiaohongshu","wechat"],tags:["早教","玩具","母婴"]},{id:"jd-10",name:"70mai行车记录仪",category:"汽车",link:`${t}UafAx1r`,commission:8,platform:["zhihu","weibo"],tags:["行车记录","汽车","安全"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`${a}AqokQvJ0?sc=${n.pdd}`,commission:8,platform:["xiaohongshu","weibo","pinduoduo"],tags:["车载","手机架","汽车"]},{id:"jd-11",name:"Baseus车载充电器",category:"汽车",link:`${t}UafAx2s`,commission:10,platform:["xiaohongshu","weibo"],tags:["车载","充电","汽车"]},{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`${a}AqokQvK1?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","wechat","pinduoduo"],tags:["喂食器","宠物","智能"]},{id:"jd-12",name:"小佩智能喂食器PRO",category:"宠物",link:`${t}UafAx3t`,commission:6,platform:["xiaohongshu","zhihu","wechat"],tags:["喂食器","宠物","智能"]},{id:"jd-13",name:"pidan猫砂",category:"宠物",link:`${t}UafAx4u`,commission:12,platform:["xiaohongshu","wechat"],tags:["猫砂","宠物","除臭"]},{id:"jd-14",name:"伯纳天纯狗粮",category:"宠物",link:`${t}UafAx5v`,commission:8,platform:["xiaohongshu","zhihu"],tags:["狗粮","宠物","食品"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`${a}AqokQvL2?sc=${n.pdd}`,commission:12,platform:["xiaohongshu","zhihu","pinduoduo"],tags:["耳机","蓝牙","数码"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`${a}AqokQvM3?sc=${n.pdd}`,commission:10,platform:["xiaohongshu","weibo","pinduoduo"],tags:["数据线","充电","便携"]},{id:"jd-16",name:"薇诺娜宝贝舒润霜",category:"美妆",link:`${t}UafAw4j`,commission:3,platform:["xiaohongshu","wechat"],tags:["护肤","美妆","精华"]},{id:"jd-17",name:"安热沙防晒霜",category:"美妆",link:`${t}UafAx6w`,commission:5,platform:["xiaohongshu","weibo"],tags:["防晒","美妆","夏季"]},{id:"jd-18",name:"Keep瑜伽垫",category:"健身",link:`${t}UafAx7x`,commission:8,platform:["xiaohongshu","weibo"],tags:["瑜伽","健身","运动"]},{id:"jd-19",name:"小米手环8",category:"健身",link:`${t}UafAx8y`,commission:6,platform:["xiaohongshu","zhihu"],tags:["手环","健身","智能"]}],r={xiaohongshu:{introInsert:o=>`

💡 **相关好物推荐：**
我最近在用这款[${o.name}]，效果真的很不错！链接放在主页了，姐妹们自己去看不迷路～`,outroInsert:o=>`

---
🛍️ **同款好物：** ${o.name}
🔗 购买链接：${o.link}
💰 预计佣金：${o.commission}%`},zhihu:{introInsert:o=>`

关于这个问题，我实际使用过一款相关产品——**${o.name}**。从专业角度来看，它在XXX方面表现确实不错...`,outroInsert:o=>`

---
*以上为个人真实体验分享。如需购买，可参考：[${o.name}](${o.link})*
*本文含 affiliate 链接，支持我的创作，感谢~*`},wechat:{introInsert:o=>`

说到这个话题，不得不提我现在在用的[${o.name}]，真的是解决了我很大的痛点...`,outroInsert:o=>`

---
📌 **同款指路：** ${o.name}
💬 想了解更多？点击链接查看详情 👉 ${o.link}`},weibo:{introInsert:(o,e)=>`#${e}#${o.name}相关 #种草#`,outroInsert:o=>`

👉 同款在这里：${o.link} #种草# #好物推荐#`},pinduoduo:{introInsert:o=>`

💰 **拼多多超值推荐：**
这款[${o.name}]在拼多多上超便宜！比我之前在其他平台买的划算多了～`,outroInsert:o=>`

---
🛒 **拼多多同款：** ${o.name}
💸 拼夕夕价格更香：${o.link}
✨ 新人优惠+百亿补贴，省钱必备！`},amazon:{introInsert:o=>`

🌍 **海外好物推荐：**
这款[${o.name}]在美国亚马逊很火，性价比超高！`,outroInsert:o=>`

---
📦 **亚马逊同款：** ${o.name}
🔗 购买链接：${o.link}?tag=20d-20`}}},58055:(o,e,i)=>{i.d(e,{a:()=>a,e:()=>t});var n=i(47853);function t(o,e){let i=o.toLowerCase(),t=new Map;for(let o of n.D){if(!o.platform.includes(e))continue;let n=o.tags.some(o=>i.includes(o.toLowerCase())||i.includes(o)),a=o.name.split(/[\s\u4e00-\u9fa5]+/).some(o=>i.includes(o.toLowerCase()));if(n||a){let e=t.get(o.category);(!e||o.commission>e.commission)&&t.set(o.category,o)}}return Array.from(t.values()).slice(0,3)}function a(o,e,i){let t=[],a=o,s=n.X[i]||n.X.xiaohongshu;e.forEach((e,i)=>{if(0===i){let i=o.slice(0,Math.floor(.3*o.length)),n=o.slice(Math.floor(.3*o.length));a=i+s.introInsert(e)+"\n\n"+n,t.push({name:e.name,link:e.link,position:"intro",insertionType:"自然植入"})}else 1===i?(a+=s.outroInsert(e),t.push({name:e.name,link:e.link,position:"outro",insertionType:"文末推荐"})):(a+=`

另外这款${e.name}也不错：${e.link}`,t.push({name:e.name,link:e.link,position:"outro",insertionType:"相关推荐"}))});let r=e.reduce((o,e)=>o+e.commission,0),m=e.length>0?`${Math.round(r/e.length)}% 平均佣金`:"无推广",d=[];return"xiaohongshu"===i?d.push("• 推广链接建议放在评论区置顶","• 不要在正文中直接放外链",'• 用"主页"、"笔记"等引导词更安全'):"zhihu"===i?d.push("• 知乎允许直接放链接","• 但要注意不要过度营销",'• 可以用"好物推荐"卡片'):"wechat"===i?d.push("• 公众号可以放跳转链接","• 用小程序卡片更自然","• 文末放二维码转化率高"):"weibo"===i&&d.push("• 微博短链接会被折叠","• 建议用品牌词+话题词引导","• 评论区放链接更稳妥"),{monetizedContent:a,insertedProducts:t,estimatedCommission:m,platformTips:d}}}};var e=require("../../../../webpack-runtime.js");e.C(o);var i=o=>e(e.s=o),n=e.X(0,[8948,5972],()=>i(93679));module.exports=n})();