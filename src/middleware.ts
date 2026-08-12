import { NextRequest, NextResponse } from 'next/server'

// 请求日志中间件
export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const method = request.method
  const path = request.nextUrl.pathname
  
  // 跳过静态文件
  if (path.startsWith('/_next') || path.startsWith('/api/health')) {
    return NextResponse.next()
  }

  console.log(`[${new Date().toISOString()}] ${method} ${path}`)

  // 添加请求头追踪
  const requestUuid = crypto.randomUUID()
  const response = NextResponse.next()
  response.headers.set('X-Request-ID', requestUuid)
  response.headers.set('X-Server-Time', new Date().toISOString())
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`)
  
  return response
}

export const config = {
  matcher: ['/api/:path*', '/dashboard', '/nexus', '/matrix'],
}
