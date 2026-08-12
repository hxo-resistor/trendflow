@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════╗
echo ║     TrendFlow v8.0 PWA Deployment         ║
echo ║        ECHO-2027 Production Ready         ║
echo ╚════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    pause
    exit /b 1
)
echo [OK] Node.js ready

echo [2/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
) else (
    echo [OK] Dependencies installed
)

echo [3/5] Running TypeScript check...
npx tsc --noEmit 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] TypeScript errors found, continuing anyway...
) else (
    echo [OK] TypeScript passed
)

echo [4/5] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build successful

echo [5/5] Deploying to Vercel...
call npx vercel --prod
if %errorlevel% neq 0 (
    echo [WARNING] Vercel deployment may have failed
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║           Deployment Complete!            ║
echo ╚════════════════════════════════════════════╝
echo.
echo Access URLs:
echo   Main: https://trendflow-fawn.vercel.app
echo   Health: https://trendflow-fawn.vercel.app/health
echo   Tasks: https://trendflow-fawn.vercel.app/daily-tasks
echo   Radar: https://trendflow-fawn.vercel.app/radar
echo.
echo PWA Features:
echo   - Splash Screen with brand animation
echo   - Mobile Tab Bar for easy navigation
echo   - Push Notifications support
echo   - Offline mode with caching
echo   - Install to home screen prompt
echo.
pause
