"use strict";(()=>{var o={};o.id=2873,o.ids=[2873],o.modules={20399:o=>{o.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:o=>{o.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9593:(o,e,a)=>{a.r(e),a.d(e,{originalPathname:()=>g,patchFetch:()=>f,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>h});var t={};a.r(t),a.d(t,{GET:()=>m,POST:()=>u});var i=a(49303),n=a(88716),s=a(60670),r=a(87070);let d=[...a(47853).D];async function m(){return r.NextResponse.json({success:!0,products:d,count:d.length,categories:Array.from(new Set(d.map(o=>o.category)))})}async function u(o){try{let{action:e,product:a}=await o.json();if("add"===e){let o={id:Date.now().toString(),...a};return d.push(o),r.NextResponse.json({success:!0,product:o})}if("update"===e){let o=d.findIndex(o=>o.id===a.id);if(-1!==o)return d[o]={...d[o],...a},r.NextResponse.json({success:!0,product:d[o]});return r.NextResponse.json({error:"商品不存在"},{status:404})}if("delete"===e){let o=d.findIndex(o=>o.id===a.id);if(-1!==o)return d.splice(o,1),r.NextResponse.json({success:!0});return r.NextResponse.json({error:"商品不存在"},{status:404})}return r.NextResponse.json({error:"未知操作"},{status:400})}catch(o){return console.error("Product API error:",o),r.NextResponse.json({error:"操作失败"},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/affiliate/products/route",pathname:"/api/affiliate/products",filename:"route",bundlePath:"app/api/affiliate/products/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\affiliate\\products\\route.ts",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:p,staticGenerationAsyncStorage:h,serverHooks:l}=c,g="/api/affiliate/products/route";function f(){return(0,s.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:h})}},47853:(o,e,a)=>{a.d(e,{D:()=>s,X:()=>r});let t={jd:process.env.JD_UNION_ID||"2038448747",taobao:process.env.TB_UNION_ID||"10458946368",pdd:process.env.PDD_UNION_ID||"44672749"},i="https://u.jd.com/",n="https://p.pinduoduo.com/",s=[{id:"jd-01",name:"AirPods Pro 2代",category:"3C数码",link:`${i}UafAw4j`,commission:5,platform:["xiaohongshu","zhihu","wechat"],tags:["耳机","数码","苹果"]},{id:"jd-02",name:"Anker 20000mAh充电宝",category:"3C数码",link:`${i}UafAw5k`,commission:8,platform:["xiaohongshu","weibo"],tags:["充电宝","便携","数码"]},{id:"tb-01",name:"Rokid AR智能眼镜",category:"3C数码",link:"https://m.tb.cn/h.8Tzy8la",commission:6,platform:["xiaohongshu","wechat"],tags:["AR","眼镜","数码"]},{id:"jd-04",name:"小米智能灯带",category:"家居",link:`${i}UafAw6m`,commission:7,platform:["xiaohongshu","zhihu"],tags:["智能","灯光","家居"]},{id:"pdd-04",name:"桌面收纳盒套装",category:"家居",link:`${n}AqokQvI9?sc=${t.pdd}`,commission:15,platform:["xiaohongshu","wechat","pinduoduo"],tags:["收纳","桌面","整理"]},{id:"jd-06",name:"追觅洗地机",category:"家居",link:`${i}UafAw7n`,commission:5,platform:["xiaohongshu","zhihu"],tags:["清洁","智能","家居"]},{id:"jd-07",name:"帮宝适一级帮纸尿裤",category:"母婴",link:`${i}UafAw8o`,commission:4,platform:["xiaohongshu","wechat"],tags:["纸尿裤","母婴","婴儿"]},{id:"jd-08",name:"Babyzen yoyo+推车",category:"母婴",link:`${i}UafAw9p`,commission:3,platform:["xiaohongshu"],tags:["推车","母婴","出行"]},{id:"jd-09",name:"费雪智能摇椅",category:"母婴",link:`${i}UafAw0q`,commission:6,platform:["xiaohongshu","wechat"],tags:["早教","玩具","母婴"]},{id:"jd-10",name:"70mai行车记录仪",category:"汽车",link:`${i}UafAx1r`,commission:8,platform:["zhihu","weibo"],tags:["行车记录","汽车","安全"]},{id:"pdd-03",name:"车载手机支架",category:"汽车",link:`${n}AqokQvJ0?sc=${t.pdd}`,commission:8,platform:["xiaohongshu","weibo","pinduoduo"],tags:["车载","手机架","汽车"]},{id:"jd-11",name:"Baseus车载充电器",category:"汽车",link:`${i}UafAx2s`,commission:10,platform:["xiaohongshu","weibo"],tags:["车载","充电","汽车"]},{id:"pdd-01",name:"小佩智能宠物喂食器PRO",category:"宠物",link:`${n}AqokQvK1?sc=${t.pdd}`,commission:10,platform:["xiaohongshu","wechat","pinduoduo"],tags:["喂食器","宠物","智能"]},{id:"jd-12",name:"小佩智能喂食器PRO",category:"宠物",link:`${i}UafAx3t`,commission:6,platform:["xiaohongshu","zhihu","wechat"],tags:["喂食器","宠物","智能"]},{id:"jd-13",name:"pidan猫砂",category:"宠物",link:`${i}UafAx4u`,commission:12,platform:["xiaohongshu","wechat"],tags:["猫砂","宠物","除臭"]},{id:"jd-14",name:"伯纳天纯狗粮",category:"宠物",link:`${i}UafAx5v`,commission:8,platform:["xiaohongshu","zhihu"],tags:["狗粮","宠物","食品"]},{id:"pdd-02",name:"TWS降噪蓝牙耳机",category:"3C数码",link:`${n}AqokQvL2?sc=${t.pdd}`,commission:12,platform:["xiaohongshu","zhihu","pinduoduo"],tags:["耳机","蓝牙","数码"]},{id:"pdd-05",name:"快充数据线三件套",category:"3C数码",link:`${n}AqokQvM3?sc=${t.pdd}`,commission:10,platform:["xiaohongshu","weibo","pinduoduo"],tags:["数据线","充电","便携"]},{id:"jd-16",name:"薇诺娜宝贝舒润霜",category:"美妆",link:`${i}UafAw4j`,commission:3,platform:["xiaohongshu","wechat"],tags:["护肤","美妆","精华"]},{id:"jd-17",name:"安热沙防晒霜",category:"美妆",link:`${i}UafAx6w`,commission:5,platform:["xiaohongshu","weibo"],tags:["防晒","美妆","夏季"]},{id:"jd-18",name:"Keep瑜伽垫",category:"健身",link:`${i}UafAx7x`,commission:8,platform:["xiaohongshu","weibo"],tags:["瑜伽","健身","运动"]},{id:"jd-19",name:"小米手环8",category:"健身",link:`${i}UafAx8y`,commission:6,platform:["xiaohongshu","zhihu"],tags:["手环","健身","智能"]}],r={xiaohongshu:{introInsert:o=>`

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
🔗 购买链接：${o.link}?tag=20d-20`}}}};var e=require("../../../../webpack-runtime.js");e.C(o);var a=o=>e(e.s=o),t=e.X(0,[8948,5972],()=>a(9593));module.exports=t})();