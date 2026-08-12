/**
 * TrendFlow Service Worker v8.2
 * 智能缓存策略：API/静态/图片分别处理
 */

const CACHE_VERSION = 'v8.2'
const STATIC_CACHE = `trendflow-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `trendflow-dynamic-${CACHE_VERSION}`
const API_CACHE = `trendflow-api-${CACHE_VERSION}`

// 静态资源预缓存列表
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/sw.js',
  '/pwa-init.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png'
]

// 安装时预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      console.log('[SW] Skipping waiting')
      self.skipWaiting()
    })
  )
})

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('trendflow-') && 
            name !== STATIC_CACHE && 
            name !== DYNAMIC_CACHE && 
            name !== API_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => {
      console.log('[SW] Claiming clients')
      return self.clients.claim()
    })
  )
})

// 拦截请求，智能路由
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // API请求 - 网络优先 + 短期缓存
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request))
    return
  }
  
  // 静态资源 - 缓存优先
  if (url.pathname.match(/\.(js|css|woff2|ttf)$/)) {
    event.respondWith(handleStaticRequest(event.request))
    return
  }
  
  // 图片资源 - 长期缓存
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
    event.respondWith(handleImageRequest(event.request))
    return
  }
  
  // 页面请求 - 网络优先，失败回退到缓存
  event.respondWith(handlePageRequest(event.request))
})

// API请求处理 - 网络优先
async function handleApiRequest(request) {
  try {
    const cache = await caches.open(API_CACHE)
    
    // 尝试从缓存获取
    const cached = await cache.match(request)
    if (cached) {
      console.log('[SW] API cache hit:', request.url)
      // 后台更新缓存
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone())
        }
      }).catch(() => {})
      return cached
    }
    
    // 无缓存，从网络获取
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('[SW] API request failed:', error)
    // 返回错误响应
    return new Response(JSON.stringify({ error: 'Offline mode', cached: false }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    })
  }
}

// 静态资源处理 - 缓存优先
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  
  if (cached) {
    console.log('[SW] Static cache hit:', request.url)
    // 后台更新
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response)
      }
    }).catch(() => {})
    return cached
  }
  
  const response = await fetch(request)
  if (response.ok) {
    cache.put(request, response.clone())
  }
  return response
}

// 图片处理 - 长期缓存
async function handleImageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  const response = await fetch(request)
  if (response.ok) {
    cache.put(request, response.clone())
  }
  return response
}

// 页面请求处理
async function handlePageRequest(request) {
  try {
    const response = await fetch(request)
    // 成功则缓存
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    // 失败则尝试从缓存获取
    const cache = await caches.open(DYNAMIC_CACHE)
    const cached = await cache.match(request)
    return cached || new Response('Offline mode', { status: 503 })
  }
}

// 推送通知处理
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'TrendFlow Update',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { date: Date.now(), url: '/' },
    actions: [
      { action: 'open', title: '打开 TrendFlow' },
      { action: 'dismiss', title: '忽略' }
    ],
    tag: 'trendflow-notification',
    renotify: true
  }
  
  event.waitUntil(
    self.registration.showNotification('TrendFlow 指挥官', options)
  )
})

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// 消息事件（页面与SW通信）
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }
})

console.log('[SW] Service Worker loaded - v8.2')
