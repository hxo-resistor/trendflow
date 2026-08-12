# Test the API endpoints
Write-Host "=== Testing TrendFlow API ===" -ForegroundColor Cyan

# Test 1: GET /api/generate
Write-Host "`n1. Testing GET /api/generate..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri 'https://trendflow-fawn.vercel.app/api/generate' -UseBasicParsing
    Write-Host "   Status: $($r.StatusCode)" -ForegroundColor Green
    $json = $r.Content | ConvertFrom-Json
    Write-Host "   Success: $($json.success)"
    Write-Host "   History count: $($json.historyCount)"
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 2: POST /api/generate
Write-Host "`n2. Testing POST /api/generate..." -ForegroundColor Yellow
try {
    $body = @{
        trendTitle = "AI Pet Feeder"
        opportunity = "Pet market booming in China with 20% YoY growth"
        platform = "xiaohongshu"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri 'https://trendflow-fawn.vercel.app/api/generate' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
    Write-Host "   Status: $($r.StatusCode)" -ForegroundColor Green
    $json = $r.Content | ConvertFrom-Json
    Write-Host "   Content length: $($json.content.Length) characters"
    Write-Host "   Source: $($json.source)"
    Write-Host "   Quality: $($json.quality)"
    Write-Host "`n   Content preview:" -ForegroundColor Cyan
    Write-Host $json.content.Substring(0, [Math]::Min(150, $json.content.Length)) + "..."
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 3: GET /api/discover
Write-Host "`n3. Testing GET /api/discover..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri 'https://trendflow-fawn.vercel.app/api/discover' -UseBasicParsing
    Write-Host "   Status: $($r.StatusCode)" -ForegroundColor Green
    $json = $r.Content | ConvertFrom-Json
    Write-Host "   Trends found: $($json.trends.Count)"
    Write-Host "   First trend: $($json.trends[0].title)"
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 4: GET /api/evolve
Write-Host "`n4. Testing GET /api/evolve..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri 'https://trendflow-fawn.vercel.app/api/evolve' -UseBasicParsing
    Write-Host "   Status: $($r.StatusCode)" -ForegroundColor Green
    $json = $r.Content | ConvertFrom-Json
    Write-Host "   Total calls: $($json.stats.totalCalls)"
    Write-Host "   Top keyword: $($json.stats.topKeyword)"
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host "`n=== All tests completed ===" -ForegroundColor Cyan
