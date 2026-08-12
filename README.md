# TrendFlow v8.0 - AI内容自动化平台

## 🎯 项目概述

TrendFlow是一个基于AI的内容自动化平台，专注于趋势发现、内容生成和联盟变现。采用Next.js 14 + TypeScript技术栈，支持PWA离线使用和推送通知。

## ✨ 核心功能

### 1. PWA极致体验
- ✅ 启动画面动画
- ✅ Service Worker三级缓存
- ✅ 离线模式支持
- ✅ 推送通知
- ✅ 添加到主屏幕

### 2. 每日任务系统
- ✅ 热词自动生成任务
- ✅ 话术一键生成
- ✅ 进度追踪可视化
- ✅ 快速数据录入

### 3. 趋势雷达
- ✅ 实时监控热词动态
- ✅ 一键生成截流话术
- ✅ 多维度数据分析

### 4. 数据看板
- ✅ 收益统计
- ✅ 点击转化追踪
- ✅ 实时数据展示

## 🚀 快速开始

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 生产构建
```bash
# TypeScript检查
npx tsc --noEmit

# 生产构建
npm run build

# 启动生产服务器
npm start
```

### Vercel部署
```bash
# 登录Vercel
vercel login

# 绑定项目
vercel link

# 部署到生产
vercel --prod
```

## 📁 项目结构

```
trendflow/
├── public/                    # 静态资源
│   ├── manifest.json         # PWA配置
│   ├── sw.js                 # Service Worker
│   ├── pwa-init.js          # PWA初始化
│   └── icons/               # 应用图标
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API路由
│   │   ├── daily-tasks/     # 每日任务
│   │   ├── radar/           # 趋势雷达
│   │   ├── dashboard/       # 数据看板
│   │   └── health/          # 健康检查
│   ├── components/          # React组件
│   │   ├── ErrorBoundary.tsx
│   │   ├── Loading.tsx
│   │   ├── MobileTabBar.tsx
│   │   └── SplashScreen.tsx
│   └── hooks/               # 自定义Hooks
│       ├── useNetwork.ts
│       └── useCachedFetch.ts
└── package.json
```

## 🔧 技术栈

- **前端框架**: Next.js 14.2.3
- **语言**: TypeScript
- **样式**: Tailwind CSS + Shadcn/ui
- **PWA**: Service Worker + Web Push
- **部署**: Vercel

## 📊 API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/daily-tasks` | GET/POST | 每日任务管理 |
| `/api/radar/hot-words` | GET | 热词数据 |
| `/api/generate-comment` | POST | 话术生成 |
| `/api/data/record` | POST | 数据录入 |
| `/api/data/stats` | GET | 数据统计 |
| `/api/push/subscribe` | POST | 推送订阅 |
| `/api/health` | GET | 系统健康检查 |

## 🔐 环境变量

创建 `.env.local` 文件：

```env
# OpenAI API（可选，用于AI生成功能）
OPENAI_API_KEY=your_key_here
API2D_KEY=your_key_here

# VAPID密钥（用于推送通知）
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

## 📱 PWA安装指南

### iOS (Safari)
1. 打开 https://trendflow-fawn.vercel.app
2. 点击底部分享按钮
3. 选择"添加到主屏幕"
4. 确认添加

### Android (Chrome)
1. 打开 https://trendflow-fawn.vercel.app
2. 点击右上角菜单（⋮）
3. 选择"安装应用"或"添加到主屏幕"
4. 确认添加

## ⚠️ 已知限制

1. **数据存储**: 当前使用localStorage，建议后续迁移到Supabase
2. **热点数据**: 当前为模拟数据，需接入真实API
3. **推送通知**: 需要VAPID密钥才能正常工作
4. **并发限制**: Vercel免费层有请求限制

## 🔮 未来规划

### P0 - 核心功能
- [ ] 接入真实热点发现API
- [ ] 数据持久化到Supabase
- [ ] 集成联盟商品实时库存

### P1 - 体验优化
- [ ] WebSocket实时推送
- [ ] 多用户协作功能
- [ ] 移动端原生应用

### P2 - 功能扩展
- [ ] AI内容质量评分
- [ ] 竞品分析模块
- [ ] 自动化工作流

## 📄 License

MIT License

## 👥 团队

Created by AgnesCode for ECHO-2027 Project

---

**版本**: v8.0.0  
**最后更新**: 2026-08-12  
**状态**: Production Ready
