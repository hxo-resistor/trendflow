import { NextResponse } from "next/server"

// This route is called by Vercel Cron Jobs every day at 3 AM
export async function GET() {
  // Mock implementation for now - in production, this would fetch trends and generate drafts
  return NextResponse.json({
    success: true,
    message: "定时任务已触发（模拟模式）",
    draftsGenerated: 3,
    timestamp: new Date().toISOString(),
  })
}
