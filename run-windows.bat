@echo off
cd /d %~dp0
if "%PORT%"=="" set PORT=8123
if "%HOST%"=="" set HOST=127.0.0.1
set URL=http://127.0.0.1:%PORT%
echo Starting Acquisition Strategy Agent on %URL%
echo Set HOST=0.0.0.0 before running this script if you want LAN sharing.
start "" %URL%
python server.py --host %HOST% --port %PORT%
pause
