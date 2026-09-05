#!/bin/bash
# WishPilot — Linux Launcher
export NODE_ENV=production
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "==================================================="
echo "          WishPilot - Desktop Launching..."
echo "==================================================="
echo "[1/2] Building latest optimized bundle..."
npm run build
echo "[2/2] Launching WishPilot in Stealth Mode..."
npm run start
