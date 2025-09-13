@echo off
echo 🔄 Restarting LMS-kinG Server...
echo.

echo 📋 Stopping any existing server processes...
taskkill /f /im node.exe >nul 2>&1

echo.
echo 🚀 Starting server with updated CORS configuration...
cd server
npm start

pause
