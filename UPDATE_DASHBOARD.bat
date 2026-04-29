@echo off
echo.
echo ========================================
echo   UPDATING DASHBOARD TO NEW VERSION
echo ========================================
echo.

cd /d "%~dp0"

if exist "frontend\src\pages\Dashboard-New.tsx" (
    copy /Y "frontend\src\pages\Dashboard-New.tsx" "frontend\src\pages\Dashboard.tsx"
    echo ✓ Dashboard updated successfully!
    echo.
    echo New features:
    echo   • 4 realistic graph datasets
    echo   • Custom graph input
    echo   • Enhanced UI with graph selector
    echo   • Better explanations
    echo.
    echo Next step: Restart frontend (npm start)
) else (
    echo ✗ Error: Dashboard-New.tsx not found
)

echo.
pause
