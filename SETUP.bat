@echo off
echo ========================================
echo  PAGERANK PROJECT SETUP
echo ========================================
echo.
echo Running setup script...
echo.

python SETUP_ALL.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SETUP COMPLETED SUCCESSFULLY!
    echo ========================================
    echo.
    echo Next steps:
    echo   1. Open a terminal and run: cd backend ^&^& pip install -r requirements.txt ^&^& python app.py
    echo   2. Open another terminal and run: cd frontend ^&^& npm install ^&^& npm start
    echo   3. Open browser at http://localhost:3000
    echo.
) else (
    echo.
    echo ========================================
    echo  SETUP FAILED!
    echo ========================================
    echo Please check if Python is installed.
    echo.
)

pause
