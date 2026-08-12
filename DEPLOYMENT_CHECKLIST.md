# 🚀 TrendFlow PWA 部署检查清单

## ✅ 文件完整性检查

### public/ 目录
```
□ manifest.json      - PWA应用清单（必须）
□ sw.js              - Service Worker（必须）
□ pwa-init.js        - PWA初始化脚本（推荐）
□ icons/             - 图标目录
    □ icon-192.png   - 必需（至少192x192）
    □ icon-512.png   - 必需（至少512x512）
    □ icon-1024.png  - 可选（推荐）
```

### src/app/layout.tsx 检查项
```
□ <link rel="manifest" href="/manifest.json">
□ <meta name="theme-color" content="#0f0f1a">
□ <script src="/pwa-init.js">
□ apple-touch-icon 链接
```

---

## 🔧 立即执行操作

### 第一步: 本地验证
```bash
cd "C:\Users\Administrator\.agnes\temporary\2026-08-08\20260808_1\work\trendflow"
npm run dev
```

打开浏览器访问:
- http://localhost:3000/manifest.json → 应该显示JSON
- http://localhost:3000/sw.js → 应该显示JS代码
- http://localhost:3000/icons/icon-192.png → 应该显示图片

**如果本地正常但线上404，说明是部署问题**

---

### 第二步: 触发Vercel重新部署

**方法1: Vercel Dashboard（推荐）**
1. 打开 https://vercel.com/dashboard
2. 点击 trendflow-fawn 项目
3. 点击右上角 **"Redeploy"** 按钮
4. 等待2-3分钟完成
5. 访问 https://trendflow-fawn.vercel.app/manifest.json 验证

**方法2: Git Push**
```bash
git add .
git commit -m "fix: deploy PWA files"
git push origin main
```

**方法3: Vercel CLI**
```bash
vercel login
vercel link
vercel --prod
```

---

### 第三步: 验证部署成功

#### 命令行验证
```bash
curl https://trendflow-fawn.vercel.app/manifest.json
# 预期输出: {"name":"TrendFlow 指挥官",...}

curl https://trendflow-fawn.vercel.app/sw.js
# 预期输出: 188行JavaScript代码
```

#### 浏览器验证
1. 打开 https://trendflow-fawn.vercel.app
2. F12 → Application 标签
3. 左侧找到 **Manifest**
4. 检查以下内容：
   - Name: TrendFlow 指挥官
   - Short Name: TrendFlow
   - Start URL: /daily-tasks
   - Display: standalone
   - Icons: 3个图标已列出
5. 左侧找到 **Service Workers**
6. 状态应该显示：**activated**
7. 地址栏右侧应该出现 **安装图标**

---

## ⚠️ 故障排查

### 问题: 仍然返回404
**解决方案**:
```bash
# 方案1: 强制清除缓存部署
vercel --prod --force

# 方案2: 修改文件触发重新构建
echo "" >> public/manifest.json
git add . && git commit -m "trigger rebuild" && git push

# 方案3: 在Vercel Dashboard删除项目后重新导入
```

### 问题: Manifest格式错误
**检查**:
1. 确保UTF-8编码（无BOM）
2. 确保是合法JSON（用jsonlint.com验证）
3. 确保start_url是相对路径（不以https://开头）

### 问题: Service Worker未注册
**检查**:
1. Console是否有错误信息
2. Network标签中sw.js是否200 OK
3. pwa-init.js是否正确加载
4. 是否在HTTPS环境（本地http://localhost可以）

---

## 📊 完成标准

部署成功后，你应该能够：

✅ 访问 `/manifest.json` 看到完整配置  
✅ 在Chrome DevTools看到完整的PWA信息  
✅ 地址栏右侧出现安装图标  
✅ 可以将应用添加到主屏幕  
✅ 以独立应用模式运行（无浏览器控件）  

---

## 🎯 快速验证脚本

复制以下命令到PowerShell执行：

```powershell
$url = "https://trendflow-fawn.vercel.app"
Write-Host "Testing PWA endpoints..."
Write-Host ""

# Test manifest
try {
    $r1 = Invoke-WebRequest -Uri "$url/manifest.json" -TimeoutSec 10 -UseBasicParsing
    if ($r1.StatusCode -eq 200 -and $r1.Content -match '"name"') {
        Write-Host "[OK] manifest.json" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] manifest.json - Invalid content" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] manifest.json - $($Error[0].Exception.Message)" -ForegroundColor Red
}

# Test SW
try {
    $r2 = Invoke-WebRequest -Uri "$url/sw.js" -TimeoutSec 10 -UseBasicParsing
    if ($r2.StatusCode -eq 200 -and $r2.Content -match "serviceWorker") {
        Write-Host "[OK] sw.js" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] sw.js - Invalid content" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] sw.js - $($Error[0].Exception.Message)" -ForegroundColor Red
}

# Test icon
try {
    $r3 = Invoke-WebRequest -Uri "$url/icons/icon-192.png" -TimeoutSec 10 -UseBasicParsing
    if ($r3.StatusCode -eq 200) {
        Write-Host "[OK] icon-192.png" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] icon-192.png" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] icon-192.png - $($Error[0].Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "All checks completed!" -ForegroundColor Cyan
```

---

**创建时间**: 2026-08-12  
**状态**: 等待部署执行  
**预计完成时间**: 5分钟内
