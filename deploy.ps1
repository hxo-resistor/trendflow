# TrendFlow Deployment Script
# Usage: .\deploy.ps1 [options]
# Options:
#   -m, --monitor    Run health check monitoring
#   -b, --build      Force rebuild
#   -d, --deploy     Deploy to Vercel
#   -h, --help       Show help

param(
    [string]$Action = "check",
    [switch]$Monitor,
    [switch]$Build,
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"

Write-Host @"
╔════════════════════════════════════════════╗
║     TrendFlow Deployment System v3.1.0     ║
║         ECHO-2027 Production Ready         ║
╚════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found!" -ForegroundColor Red
    exit 1
}

# Check dependencies
Write-Host "[2/5] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "$ProjectRoot\node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
}

# TypeScript compilation
Write-Host "[3/5] Running TypeScript check..." -ForegroundColor Yellow
$npxResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ TypeScript compilation passed" -ForegroundColor Green
} else {
    Write-Host "  ✗ TypeScript errors found:" -ForegroundColor Red
    Write-Host $npxResult
    exit 1
}

# Build
if ($Build) {
    Write-Host "[4/5] Building production bundle..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Build successful" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Build failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[4/5] Skipping build (use --build to force)" -ForegroundColor Gray
}

# Health check
Write-Host "[5/5] Running health checks..." -ForegroundColor Yellow
$healthUrl = "http://localhost:3000/api/health"
try {
    # Start dev server in background
    $process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 5
    
    # Wait for server to be ready
    $maxAttempts = 10
    for ($i = 0; $i -lt $maxAttempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✓ Server is running" -ForegroundColor Green
                break
            }
        } catch {}
        Start-Sleep -Seconds 2
    }
    
    # Run health checks
    $endpoints = @(
        "/api/health",
        "/api/dashboard",
        "/api/discover",
        "/api/generate",
        "/api/matrix",
        "/api/smart-reply",
        "/api/nexus/sense",
        "/api/affiliate/products",
        "/api/auto-publish?action=safety-report",
        "/api/daily-tasks",
        "/api/anti-ban",
        "/api/geo",
        "/api/test"
    )
    
    $passed = 0
    $failed = 0
    
    foreach ($endpoint in $endpoints) {
        try {
            $url = "http://localhost:3000$endpoint"
            $resp = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
            if ($resp.StatusCode -eq 200) {
                Write-Host "  ✓ $endpoint" -ForegroundColor Green
                $passed++
            } else {
                Write-Host "  ✗ $endpoint (HTTP $($resp.StatusCode))" -ForegroundColor Red
                $failed++
            }
        } catch {
            Write-Host "  ✗ $endpoint (Connection failed)" -ForegroundColor Red
            $failed++
        }
    }
    
    Write-Host ""
    Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if($failed -eq 0){'Green'}else{'Red'})
    
    # Stop dev server
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "  ⚠ Health check skipped (server start failed)" -ForegroundColor Yellow
}

# Deploy
if ($Deploy) {
    Write-Host ""
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    npx vercel --prod
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Deployment failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Deployment check completed!" -ForegroundColor Cyan
Write-Host "Dashboard: https://trendflow-fawn.vercel.app" -ForegroundColor Green
Write-Host "Health: https://trendflow-fawn.vercel.app/health" -ForegroundColor Green
Write-Host "API Docs: https://trendflow-fawn.vercel.app/api/test" -ForegroundColor Green
Write-Host ""
Write-Host "Access URL: https://trendflow-fawn.vercel.app" -ForegroundColor Cyan
