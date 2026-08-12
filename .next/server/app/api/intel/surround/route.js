"use strict";(()=>{var e={};e.id=3765,e.ids=[3765],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},30206:(e,n,t)=>{t.r(n),t.d(n,{originalPathname:()=>c,patchFetch:()=>w,requestAsyncStorage:()=>l,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var r={};t.r(r),t.d(r,{POST:()=>m});var a=t(49303),o=t(88716),i=t(60670),s=t(87070);let $=[{name:"宝妈",age:30,style:"亲切温暖",traits:["关注性价比","看重安全性","分享经验"]},{name:"学生党",age:22,style:"活泼直接",traits:["追求潮流","预算有限","喜欢测评"]},{name:"专业人士",age:35,style:"理性专业",traits:["注重数据","强调逻辑","引用来源"]},{name:"发烧友",age:28,style:"狂热深入",traits:["深挖细节","对比参数","技术控"]},{name:"路人",age:25,style:"真实随性",traits:["偶尔提及","真实感受","不夸张"]}],u=["deep_review","warning","guide","comparison","tips"],p=["xiaohongshu","zhihu","weibo","douyin","wechat"];async function m(e){try{let{competitor:n,platforms:t=p,personas:r=$}=await e.json();if(!n)return s.NextResponse.json({error:"请提供竞品名称"},{status:400});let a=[`${n}哪个好`,`${n}推荐`,`${n}避坑`,`${n}测评`,`${n}选购指南`,`${n}真实体验`,`${n}值不值得买`,`${n}对比`,`${n}最新款`,`${n}平价替代`],o=[];for(let e of a)for(let a of u)for(let i of t)for(let t of r){let r=function(e,n,t,r){let a={xiaohongshu:{deep_review:e=>`姐妹们！${e}的深度测评来了！🔍

作为${r.name}，我用了两周时间...`,warning:e=>`⚠️ ${e}避坑指南！别踩这些雷💣

作为${r.name}，我真的踩了不少坑...`,guide:e=>`保姆级${e}选购攻略📚

${r.name}手把手教你选...`,comparison:e=>`${e}横评：A/B/C三款对比🆚

${r.name}实测结果...`,tips:e=>`${e}隐藏技巧大公开🤫

${r.name}才知道的5个方法...`},zhihu:{deep_review:e=>`如何评价${e}？

谢邀。作为一个${r.name}，我来客观分析一下...`,warning:e=>`哪些${e}坑必须避开？

基于${r.name}的真实经历...`,guide:e=>`${e}选购完全指南（${r.name}版）

从需求分析到最终选择...`,comparison:e=>`${e}横向评测报告

${r.name}的多维度对比分析...`,tips:e=>`${e}的高级用法：${r.name}的独家技巧

99%的人不知道的...`},weibo:{deep_review:e=>`#${e}# 深度测评来了！作为${r.name}...`,warning:e=>`#${e}# 避坑提醒！${r.name}的血泪教训...`,guide:e=>`#${e}# 选购攻略，${r.name}亲测有效...`,comparison:e=>`#${e}# 三款对比，${r.name}说...`,tips:e=>`#${e}# 这些小技巧，${r.name}今天告诉你...`},douyin:{deep_review:e=>`[口播脚本]
${r.name}来测评${e}了！...`,warning:e=>`[口播脚本]
${e}千万别乱买！${r.name}告诉你为什么...`,guide:e=>`[口播脚本]
${e}怎么买？${r.name}手把手教你...`,comparison:e=>`[口播脚本]
${e}买哪款？${r.name}实测给你看...`,tips:e=>`[口播脚本]
${e}隐藏功能曝光！${r.name}独门秘籍...`},wechat:{deep_review:e=>`深度 | ${e}全面测评：${r.name}的真实体验

...
`,warning:e=>`警惕！${e}的这些坑，${r.name}全踩过了

...
`,guide:e=>`干货 | ${e}选购指南，${r.name}总结了这些经验

...
`,comparison:e=>`实测 | ${e}三款对比，${r.name}告诉你怎么选

...
`,tips:e=>`揭秘 | ${e}的隐藏技巧，${r.name}独享的秘籍

...
`}},o=a[t]||a.xiaohongshu;return(o[n]||o.deep_review)(e)}(e,a,i,t);o.push({id:`${e}-${a}-${i}-${t.name}`,keyword:e,angle:a,platform:i,persona:t,title:`${n} ${a} - ${t.name}`,body:r,format:{xiaohongshu:"图文",zhihu:"长文",weibo:"短帖",douyin:"视频脚本",wechat:"公众号文章"}[i]||"未知"})}return s.NextResponse.json({success:!0,competitor:n,totalGenerated:o.length,contents:o,breakdown:{keywords:a.length,angles:u.length,platforms:t.length,personas:r.length,total:a.length*u.length*t.length*r.length}})}catch(e){return console.error("Surround error:",e),s.NextResponse.json({error:"生成失败"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/intel/surround/route",pathname:"/api/intel/surround",filename:"route",bundlePath:"app/api/intel/surround/route"},resolvedPagePath:"C:\\Users\\Administrator\\.agnes\\temporary\\2026-08-08\\20260808_1\\work\\trendflow\\src\\app\\api\\intel\\surround\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:g,serverHooks:h}=d,c="/api/intel/surround/route";function w(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}}};var n=require("../../../../webpack-runtime.js");n.C(e);var t=e=>n(n.s=e),r=n.X(0,[8948,5972],()=>t(30206));module.exports=r})();