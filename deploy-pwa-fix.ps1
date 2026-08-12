# TrendFlow PWA 部署修复脚本
# 使用方法: .\deploy-pwa-fix.ps1

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     TrendFlow PWA 部署修复工具 v8.0        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = $PSScriptRoot
$Errors = @()

# 步骤1: 检查本地文件
Write-Host "[1/5] 检查本地PWA文件..." -ForegroundColor Yellow
$files = @(
    "$ProjectRoot\public\manifest.json",
    "$ProjectRoot\public\sw.js",
    "$ProjectRoot\public\pwa-init.js",
    "$ProjectRoot\public\icons\icon-192.png",
    "$ProjectRoot\public\icons\icon-512.png",
    "$ProjectRoot\public\icons\icon-1024.png"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "  ✓ $(Split-Path $file -Leaf) ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $(Split-Path $file -Leaf) - 文件不存在！" -ForegroundColor Red
        $Errors += "Missing: $file"
    }
}

if ($Errors.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ 发现 $([math]::Min($Errors.Count, 6)) 个文件缺失，无法继续部署" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步骤2: TypeScript检查
Write-Host "[2/5] 运行TypeScript编译检查..." -ForegroundColor Yellow
$tscResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ TypeScript编译通过" -ForegroundColor Green
} else {
    Write-Host "  ⚠ TypeScript有警告（不影响构建）" -ForegroundColor Yellow
    Write-Host $tscResult | Select-Object -First 10
}
Write-Host ""

# 步骤3: 生产构建
Write-Host "[3/5] 运行生产构建..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 构建成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 构建失败！" -ForegroundColor Red
    Write-Host $buildResult | Select-Object -Last 20
    exit 1
}
Write-Host ""

# 步骤4: 本地验证
Write-Host "[4/5] 启动本地开发服务器验证..." -ForegroundColor Yellow
$process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 5

$success = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/manifest.json" -TimeoutSec 3 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $content = $response.Content
            if ($content -match '"name"') {
                Write-Host "  ✓ manifest.json 可访问且内容正确" -ForegroundColor Green
                $success = $true
                break
            }
        }
    } catch {}
    Start-Sleep -Seconds 2
}

if (-not $success) {
    Write-Host "  ⚠ 本地验证超时，请手动检查 http://localhost:3000/manifest.json" -ForegroundColor Yellow
}

# 停止服务器
Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
Write-Host ""

# 步骤5: 部署指导
Write-Host "[5/5] Vercel部署指导..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ 本地文件已验证，构建成功！" -ForegroundColor Green
Write-Host ""
Write-Host "现在请执行以下任一方法触发Vercel部署：" -ForegroundColor Cyan
Write-Host ""
Write-Host "方法1: Vercel Dashboard（推荐）" -ForegroundColor White
Write-Host "  1. 打开 https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  2. 找到 trendflow-fawn 项目" -ForegroundColor Gray
Write-Host "  3. 点击 'Redeploy' 按钮" -ForegroundColor Gray
Write-Host "  4. 等待部署完成（约2-3分钟）" -ForegroundColor Gray
Write-Host ""
Write-Host "方法2: Git Push（如果有仓库）" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor Gray
Write-Host "  git commit -m 'fix: deploy PWA files'" -ForegroundColor Gray
Write-Host "  git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "方法3: Vercel CLI" -ForegroundColor White
Write-Host "  vercel login" -ForegroundColor Gray
Write-Host "  vercel link" -ForegroundColor Gray
Write-Host "  vercel --prod" -ForegroundColor Gray
Write-Host ""

# 最终验证链接
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           部署后验证链接                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "主站:      https://trendflow-fawn.vercel.app" -ForegroundColor Green
Write-Host "Manifest:  https://trendflow-fawn.vercel.app/manifest.json" -ForegroundColor Green
Write-Host "SW:        https://trendflow-fawn.vercel.app/sw.js" -ForegroundColor Green
Write-Host "健康检查:   https://trendflow-fawn.vercel.app/health" -ForegroundColor Green
Write-Host ""
Write-Host "验证步骤:" -ForegroundColor Yellow
Write-Host "1. 访问上述链接确认返回正确内容" -ForegroundColor White
Write-Host "2. F12 → Application → Manifest 查看完整配置" -ForegroundColor White
Write-Host "3. 地址栏右侧应出现安装图标" -ForegroundColor White
Write-Host ""
