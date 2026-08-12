# TrendFlow PWA 部署检查脚本
# 使用方法: 双击运行或 PowerShell 执行

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        TrendFlow PWA 部署检查工具 v8.0         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$BaseUrl = "https://trendflow-fawn.vercel.app"
$Checks = @()

# 检查1: Manifest
Write-Host "[1/4] Checking manifest.json..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/manifest.json" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $content = $response.Content
        if ($content -match '"name"' -and $content -match '"short_name"') {
            Write-Host "  ✓ manifest.json is accessible and valid" -ForegroundColor Green
            $Checks += $true
        } else {
            Write-Host "  ✗ manifest.json exists but format is invalid" -ForegroundColor Red
            $Checks += $false
        }
    } else {
        Write-Host "  ✗ manifest.json returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $Checks += $false
    }
} catch {
    Write-Host "  ✗ Failed to access manifest.json: $($_.Exception.Message)" -ForegroundColor Red
    $Checks += $false
}
Write-Host ""

# 检查2: Service Worker
Write-Host "[2/4] Checking sw.js..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/sw.js" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $lines = ($response.Content -split "`n").Count
        if ($lines -ge 100) {
            Write-Host "  ✓ sw.js is accessible ($lines lines)" -ForegroundColor Green
            $Checks += $true
        } else {
            Write-Host "  ✗ sw.js seems incomplete ($lines lines)" -ForegroundColor Yellow
            $Checks += $false
        }
    } else {
        Write-Host "  ✗ sw.js returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $Checks += $false
    }
} catch {
    Write-Host "  ✗ Failed to access sw.js: $($_.Exception.Message)" -ForegroundColor Red
    $Checks += $false
}
Write-Host ""

# 检查3: Icon
Write-Host "[3/4] Checking icon-192.png..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/icons/icon-192.png" -TimeoutSec 10 -UseBasicParsing -Method Head
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ icon-192.png is accessible" -ForegroundColor Green
        $Checks += $true
    } else {
        Write-Host "  ✗ icon-192.png returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $Checks += $false
    }
} catch {
    Write-Host "  ✗ Failed to access icon-192.png: $($_.Exception.Message)" -ForegroundColor Red
    $Checks += $false
}
Write-Host ""

# 检查4: Main Page
Write-Host "[4/4] Checking main page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $BaseUrl -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Main page is accessible" -ForegroundColor Green
        $Checks += $true
    } else {
        Write-Host "  ✗ Main page returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $Checks += $false
    }
} catch {
    Write-Host "  ✗ Failed to access main page: $($_.Exception.Message)" -ForegroundColor Red
    $Checks += $false
}
Write-Host ""

# 总结
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                 检查结果汇总                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$passCount = ($Checks | Where-Object { $_ }).Count
$totalCount = $Checks.Count

if ($passCount -eq $totalCount) {
    Write-Host "✅ All checks passed! PWA deployment is successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open Chrome DevTools (F12) → Application tab" -ForegroundColor White
    Write-Host "2. Check 'Manifest' section for complete PWA config" -ForegroundColor White
    Write-Host "3. Check 'Service Workers' status should be 'activated'" -ForegroundColor White
    Write-Host "4. Look for install icon in address bar (➕ or phone with arrow)" -ForegroundColor White
} else {
    Write-Host "❌ $passCount/$totalCount checks passed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Deployment needed! Please:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Vercel Dashboard (Recommended)" -ForegroundColor Cyan
    Write-Host "  1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "  2. Find 'trendflow-fawn' project" -ForegroundColor White
    Write-Host "  3. Click 'Deployments' tab" -ForegroundColor White
    Write-Host "  4. Click '⋮' on latest deployment → 'Redeploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "Method 2: Git Push" -ForegroundColor Cyan
    Write-Host "  git add ." -ForegroundColor Gray
    Write-Host "  git commit -m 'fix: deploy PWA files'" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After deployment, re-run this script to verify." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Links:" -ForegroundColor Cyan
Write-Host "  Main:      $BaseUrl" -ForegroundColor White
Write-Host "  Manifest:  $BaseUrl/manifest.json" -ForegroundColor White
Write-Host "  Health:    $BaseUrl/health" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
