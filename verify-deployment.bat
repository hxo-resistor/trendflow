@echo off
chcp 65001 >nul
echo.
echo ============================================
echo    TrendFlow PWA Deployment Verification
echo ============================================
echo.

set URL=https://trendflow-fawn.vercel.app

echo [1/4] Testing manifest.json...
curl -s -o nul -w "HTTP %%{http_code}" %URL%/manifest.json
if %%errorlevel%% neq 0 (
    echo [FAIL] Cannot access manifest.json
) else (
    echo [OK] manifest.json accessible
)
echo.

echo [2/4] Testing sw.js...
curl -s -o nul -w "HTTP %%{http_code}" %URL%/sw.js
echo.

echo [3/4] Testing icon-192.png...
curl -s -o nul -w "HTTP %%{http_code}" %URL%/icons/icon-192.png
echo.

echo [4/4] Main page...
curl -s -o nul -w "HTTP %%{http_code}" %URL%
echo.
echo.

echo ============================================
echo    Manual Verification Steps:
echo ============================================
echo.
echo 1. Open Chrome browser
echo 2. Go to: https://trendflow-fawn.vercel.app
echo 3. Press F12 to open DevTools
echo 4. Click "Application" tab
echo 5. Check "Manifest" section - should show complete config
echo 6. Check "Service Workers" - should show "activated"
echo 7. Look for install icon in address bar
echo.
echo If all shows 200 OK above, deployment is successful!
echo.
pause
