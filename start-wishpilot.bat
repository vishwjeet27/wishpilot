@echo off
title WishPilot - Stealth Live Interview & Coding Copilot
echo ===================================================
echo           WishPilot - Desktop Launching...
echo ===================================================
echo [1/2] Building latest optimized bundle...
call npm run build
echo [2/2] Launching WishPilot in Stealth Mode...
call npm run start
pause
