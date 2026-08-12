#!/usr/bin/env node
/**
 * VAPID密钥生成脚本
 * 用于Web Push推送通知
 * 
 * 使用方法:
 * node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push')

// 生成VAPID密钥对
const vapidKeys = webpush.generateVapidKeys()

console.log('╔════════════════════════════════════════════════╗')
console.log('║      TrendFlow VAPID 密钥生成成功!             ║')
console.log('╚════════════════════════════════════════════════╝')
console.log('')
console.log('📋 请将这些密钥添加到 .env.local 文件:')
console.log('')
console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey)
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey)
console.log('')
console.log('⚠️  安全提示:')
console.log('  - 请勿将私钥提交到Git仓库')
console.log('  - 私钥应存储在安全的环境变量中')
console.log('  - 建议每90天轮换一次密钥')
console.log('')
console.log('📖 更多信息:')
console.log('  https://web-push-book.gauntface.com/')
console.log('')

// 保存到文件（可选）
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
}

const newEntry = `\n# VAPID Keys for Web Push\nVAPID_PUBLIC_KEY=${vapidKeys.publicKey}\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`

if (!envContent.includes('VAPID_PUBLIC_KEY')) {
  fs.writeFileSync(envPath, envContent + newEntry, 'utf8')
  console.log('✅ 密钥已自动添加到 .env.local')
} else {
  console.log('ℹ️  .env.local 已存在VAPID密钥，未覆盖')
}

console.log('')
console.log('下一步: 重启开发服务器使环境变量生效')
console.log('  npm run dev')
console.log('')
