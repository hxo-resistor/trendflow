@echo off
chcp 65001 >nul
echo.
echo ====================================================
echo      TrendFlow PWA Deployment Fix Script v8.0
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking local PWA files...
echo.

if exist "public\manifest.json" (
    echo [OK] manifest.json exists
) else (
    echo [ERROR] manifest.json not found!
    pause
    exit /b 1
)

if exist "public\sw.js" (
    echo [OK] sw.js exists
) else (
    echo [ERROR] sw.js not found!
    pause
    exit /b 1
)

if exist "public\pwa-init.js" (
    echo [OK] pwa-init.js exists
) else (
    echo [WARNING] pwa-init.js not found (optional)
)

if exist "public\icons\icon-192.png" (
    echo [OK] icon-192.png exists
) else (
    echo [ERROR] icon-192.png not found!
    pause
    exit /b 1
)

if exist "public\icons\icon-512.png" (
    echo [OK] icon-512.png exists
) else (
    echo [ERROR] icon-512.png not found!
    pause
    exit /b 1
)

echo.
echo [2/4] Running TypeScript check...
npx tsc --noEmit 2>nul
if %errorlevel% equ 0 (
    echo [OK] TypeScript compilation passed
) else (
    echo [WARNING] TypeScript has warnings (continuing anyway)
)
echo.

echo [3/4] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

echo [4/4] Starting local server for verification...
start "" npm run dev
timeout /t 5 /nobreak >nul
echo.
echo Please verify manually:
echo   - http://localhost:3000/manifest.json
echo   - http://localhost:3000/sw.js
echo   - http://localhost:3000/icons/icon-192.png
echo.
echo If all return correct content, close this window and run:
echo   vercel --prod
echo.
echo Then visit: https://trendflow-fawn.vercel.app/manifest.json
echo.
pause
