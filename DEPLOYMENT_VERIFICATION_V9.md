# 🚀 TrendFlow v9.0 部署验证清单

**部署时间**: 2026-08-12  
**版本**: v9.0.0 (流量分发生态平台)

---

## ✅ 代码状态检查

### TypeScript编译
```bash
npx tsc --noEmit
# 预期: (no output) 表示通过
```

### 生产构建
```bash
npm run build
# 预期: ✓ Compiled successfully
# 预期: ✓ Generating static pages (95+95)
```

### 新增文件确认
```
src/app/api/
├── weibo/route.ts          ✅ 微博API
├── affiliate/route.ts      ✅ 联盟API
├── scheduler/route.ts      ✅ 调度引擎API
├── report/route.ts         ✅ 战报生成API
└── product-recommend/route.ts ✅ 选品推荐API

src/app/
├── recommend/page.tsx      ✅ 选品推荐页面
├── battle-report/page.tsx  ✅ 战报看板页面
└── scheduler/page.tsx      ✅ 调度引擎页面
```

---

## 🔧 部署步骤

### 第一步: 环境配置
```bash
cd "C:\Users\Administrator\.agnes\temporary\2026-08-08\20260808_1\work\trendflow"

# 检查Node.js版本
node --version
# 预期: v18.x.x 或更高

# 检查npm版本
npm --version
# 预期: 9.x.x 或更高

# 安装依赖（如果需要）
npm install
```

### 第二步: 本地测试
```bash
# 启动开发服务器
npm run dev

# 访问以下地址测试
http://localhost:3000              # 首页
http://localhost:3000/daily-tasks  # 每日任务
http://localhost:3000/recommend    # 选品推荐
http://localhost:3000/battle-report # 战报看板
http://localhost:3000/scheduler    # 调度引擎
http://localhost:3000/health       # 健康检查
```

### 第三步: Vercel部署
```bash
# 方式1: 命令行部署
vercel login
vercel link
vercel --prod

# 方式2: 手动触发（推荐）
# 1. 打开 https://vercel.com/dashboard
# 2. 找到 trendflow-fawn 项目
# 3. 点击 Deployments → ⋮ → Redeploy
```

---

## ✅ 功能验证清单

### P0 - 必须验证
- [ ] 今日任务页面正常显示
- [ ] 自动截流关键词精确匹配生效
- [ ] AEO引擎"开始分析"按钮可点击
- [ ] 收益仪表盘显示"暂无数据"而非模拟数据
- [ ] Ctrl+Shift+N 快捷键跳转到今日任务

### P1 - 核心功能验证
- [ ] /recommend 选品推荐页面可访问
- [ ] 选品卡片显示评分、热度、佣金等信息
- [ ] 筛选器正常工作（按品类、排序方式）
- [ ] /battle-report 战报看板可访问
- [ ] 战报数据正确展示（浏览量、点击数、佣金等）
- [ ] /scheduler 调度引擎页面可访问
- [ ] 添加任务功能正常
- [ ] 任务队列显示正确

### PWA验证
- [ ] manifest.json 可访问（非404）
- [ ] Service Worker注册成功
- [ ] 图标正确显示
- [ ] 可以添加到主屏幕

---

## 🧪 测试用例

### 测试1: 选品推荐功能
```
1. 访问 https://trendflow-fawn.vercel.app/recommend
2. 查看推荐的商品列表
3. 尝试筛选「宠物用品」品类
4. 尝试按「综合评分」排序
5. 验证商品卡片显示完整信息
```

**预期结果**:
- ✅ 显示5个推荐商品
- ✅ 每个商品有评分（0-100）
- ✅ 显示搜索热度、竞争度、佣金率等数据
- ✅ 显示推荐理由和风险提示

---

### 测试2: 战报生成功能
```
1. 访问 https://trendflow-fawn.vercel.app/battle-report
2. 点击「刷新」按钮生成今日战报
3. 查看各项指标数据
4. 点击「导出」下载报告
```

**预期结果**:
- ✅ 显示今日日期和标题
- ✅ 显示4个关键指标卡片
- ✅ 显示流量趋势折线图
- ✅ 显示收益分布柱状图
- ✅ 显示详细指标分析
- ✅ 显示热门关键词和运营建议
- ✅ 导出文件为Markdown格式

---

### 测试3: 调度引擎功能
```
1. 访问 https://trendflow-fawn.vercel.app/scheduler
2. 点击「启动」按钮
3. 观察状态变化
4. 点击「添加任务」→「搜索任务」
5. 查看任务队列更新
```

**预期结果**:
- ✅ 状态从"已停止"变为"运行中"
- ✅ 显示绿色脉冲指示灯
- ✅ 任务添加到队列
- ✅ 队列显示任务类型、状态、时间
- ✅ 频率限制配置正确

---

### 测试4: 快捷键功能
```
1. 在任意页面按下 Ctrl+Shift+N
2. 观察是否跳转到 /daily-tasks
```

**预期结果**:
- ✅ 成功跳转到今日任务页面
- ✅ 不触发浏览器新标签页

---

### 测试5: PWA功能
```
1. 访问 https://trendflow-fawn.vercel.app
2. F12 → Application → Manifest
3. 检查配置是否正确
4. 地址栏右侧应出现安装图标
5. 点击安装图标，添加到主屏幕
6. 从桌面启动APP，验证独立窗口模式
```

**预期结果**:
- ✅ Manifest显示完整配置
- ✅ 安装图标出现
- ✅ 安装后无浏览器控件
- ✅ 标题显示"TrendFlow 指挥官"

---

## 📊 性能指标验收

| 指标 | 目标值 | 实测值 | 状态 |
|------|--------|--------|------|
| LCP | <2.5s | ? | ⏳ |
| FID | <100ms | ? | ⏳ |
| CLS | <0.1 | ? | ⏳ |
| TTFB | <200ms | ? | ⏳ |
| 首次加载 | <3s | ? | ⏳ |

**测试方法**:
```bash
# 使用Lighthouse测试
npx lhci autorun
# 或使用Chrome DevTools → Lighthouse标签
```

---

## ⚠️ 已知限制

1. **API接入**: 当前使用模拟数据，需申请真实API密钥
   - 微博开放平台: https://open.weibo.com
   - 京东联盟: https://union.jd.com
   - 淘宝联盟: https://pub.alimama.com
   - 拼多多: https://open.jinritemai.com
   - 抖音: https://open.douyin.com

2. **数据存储**: 当前使用localStorage，需迁移到Supabase

3. **推送通知**: 需要配置VAPID密钥

---

## 🎯 上线检查清单

部署前确认：
- [ ] TypeScript编译通过（0错误）
- [ ] 生产构建成功
- [ ] 所有新增页面可访问
- [ ] API端点响应正常
- [ ] PWA功能完整
- [ ] 快捷键正常工作
- [ ] 移动端适配良好

---

## 📞 问题排查

### 问题1: 页面404
```bash
# 检查next.config.js是否正确配置
cat next.config.js

# 清除.next缓存
rm -rf .next
npm run build
```

### 问题2: API返回500
```bash
# 检查环境变量
cat .env.local

# 查看Vercel日志
vercel logs
```

### 问题3: PWA无法安装
```
1. 确认HTTPS（Vercel自动提供）
2. 检查manifest.json格式
3. 清除浏览器缓存重试
4. 确保icons目录存在且文件大小正确
```

---

**完成标准**: 所有检查项通过 ✅  
**下次检查**: 部署完成后立即执行
