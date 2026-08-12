/**
 * TrendFlow App Shell - 关键路径CSS内联优化
 * 减少首屏渲染时间
 */

export const CRITICAL_CSS = `
/* 基础重置 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

body {
  background: #0f0f1a;
  color: #ffffff;
  min-height: 100vh;
}

/* Splash Screen 动画 */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 常用工具类 */
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 骨架屏样式 */
.skeleton {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mobile-safe-area {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .mobile-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* 触摸优化 */
.touch-active:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}

/* 性能优化 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
`

/**
 * 预连接关键域名
 */
export const PRECONNECT_HREFS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://api.openai.com',
  'https://cdn.jsdelivr.net'
]

/**
 * 预加载关键资源
 */
export const PRELOAD_HREFS = [
  {
    href: '/icons/icon-192.png',
    as: 'image',
    type: 'image/png'
  },
  {
    href: '/icons/icon-512.png',
    as: 'image',
    type: 'image/png'
  }
]

/**
 * 懒加载图片配置
 */
export const LAZY_LOAD_CONFIG = {
  rootMargin: '50px 0px',
  threshold: 0.1
}

/**
 * 图片压缩配置
 */
export const IMAGE_OPTIMIZATION = {
  formats: ['webp', 'avif'],
  quality: 80,
  breakpoints: [320, 640, 768, 1024, 1280]
}
