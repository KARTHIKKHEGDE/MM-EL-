@echo off
setlocal

echo ========================================
echo  STARTING PAGERANK FRONTEND + BACKEND
echo ========================================
echo.

echo Launching backend...
start "PageRank Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && python app.py"

echo Launching frontend...
start "PageRank Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm start"

echo.
echo Servers are starting in separate terminals.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
endlocal
