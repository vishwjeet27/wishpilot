/**
 * WishPilot - Stealth Live Interview & Preparation Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

const { app, BrowserWindow, ipcMain, globalShortcut, desktopCapturer, screen, shell } = require('electron');
const path = require('path');
const platformModule = require('./platform/index.cjs');

let mainWindow = null;
let isStealthActive = true;
let isClickThrough = false;
let currentMode = 'studio'; // 'studio' | 'hud'


const isDev = process.env.NODE_ENV === 'development';

// Hardware acceleration and GPU shader disk cache flags
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Set application title
app.setName('WishPilot');

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const iconPath = process.platform === 'win32'
    ? path.join(__dirname, '../public/icon.ico')
    : path.join(__dirname, '../public/icon.png');

  mainWindow = new BrowserWindow({
    title: 'WishPilot',
    icon: iconPath,
    width: 960,
    height: 650,
    minWidth: 100,
    minHeight: 28,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    skipTaskbar: true, // Keep out of taskbar for unobtrusive overlay
    hasShadow: false,  // Disable DWM shadow to prevent rectangular borders on transparent window
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  });

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer ${level}]: ${message}`);
  });

  // Grant media permissions for microphone capture
  const { session } = require('electron');
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(true);
  });
  session.defaultSession.setPermissionCheckHandler(() => true);

  const distPath = path.join(__dirname, '../dist/index.html');
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      console.log('[WishPilot] Dev server not reachable, loading built files...');
      mainWindow.loadFile(distPath);
    });
  } else {
    mainWindow.loadFile(distPath);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    const stealthRes = platformModule.enableStealth(mainWindow, true);
    isStealthActive = stealthRes !== false;
  });

  // Handle hotkeys
  registerGlobalShortcuts();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerGlobalShortcuts() {
  // Toggle HUD visibility
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Panic Button: Immediately hide window
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.webContents.send('wishpilot:panic-triggered');
    }
  });

  // Screen Snip for LeetCode / Coding Vision
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (mainWindow) {
      mainWindow.webContents.send('wishpilot:trigger-snip');
    }
  });

  // Toggle Click-Through mode
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow) {
      isClickThrough = !isClickThrough;
      mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
      mainWindow.webContents.send('wishpilot:click-through-changed', isClickThrough);
    }
  });

  // Trigger Instant Answer Shortcut (Ctrl+Shift+A)
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    if (mainWindow) {
      mainWindow.webContents.send('wishpilot:trigger-answer');
    }
  });

  // Mic Mute/Unmute Toggle (Ctrl+Shift+M)
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    if (mainWindow) {
      mainWindow.webContents.send('wishpilot:toggle-mic');
    }
  });
}

// IPC handlers
ipcMain.handle('wishpilot:get-stealth-status', () => isStealthActive);

ipcMain.handle('wishpilot:get-platform-info', () => ({
  platform: process.platform,
  isWayland: !!(process.env.WAYLAND_DISPLAY || process.env.XDG_SESSION_TYPE === 'wayland')
}));

ipcMain.handle('wishpilot:toggle-stealth', (event, enable) => {
  if (!mainWindow) return false;
  isStealthActive = typeof enable === 'boolean' ? enable : !isStealthActive;
  const result = platformModule.enableStealth(mainWindow, isStealthActive);
  return result !== false;
});

ipcMain.handle('wishpilot:set-click-through', (event, enable) => {
  if (!mainWindow) return false;
  isClickThrough = enable;
  mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
  return isClickThrough;
});

ipcMain.handle('wishpilot:set-mode', (event, mode) => {
  if (!mainWindow) return false;
  currentMode = mode;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Always keep on top
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  if (mode === 'notch') {
    // Ultra-compact top-center stealth pill (230x34 px - wider for Answer button)
    const notchWidth = 230;
    const notchHeight = 34;
    mainWindow.setMinimumSize(100, 28);
    mainWindow.setBounds({
      x: Math.round((screenWidth - notchWidth) / 2),
      y: 6,
      width: notchWidth,
      height: notchHeight
    });
  } else if (mode === 'hud') {
    // Floating teleprompter overlay on the right side
    const hudWidth = 460;
    const hudHeight = Math.min(screenHeight - 40, 780);
    mainWindow.setMinimumSize(320, 400);
    mainWindow.setBounds({
      x: screenWidth - hudWidth - 24,
      y: 20,
      width: hudWidth,
      height: hudHeight
    });
  } else {
    // Studio Setup dashboard in center
    const studioWidth = 960;
    const studioHeight = 650;
    mainWindow.setMinimumSize(500, 400);
    mainWindow.setBounds({
      x: Math.round((screenWidth - studioWidth) / 2),
      y: Math.round((screenHeight - studioHeight) / 2),
      width: studioWidth,
      height: studioHeight
    });
  }
  return currentMode;
});

// Capture screen for LeetCode / Coding challenge analysis
ipcMain.handle('wishpilot:capture-screen', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1024, height: 576 }
    });

    if (sources && sources.length > 0) {
      // Primary screen thumbnail resized to 896px for optimal token footprint and crisp text
      const thumbnail = sources[0].thumbnail;
      let dataUrl;
      try {
        const resized = thumbnail.resize({ width: 896, quality: 'better' });
        const jpegBuf = resized.toJPEG(75);
        dataUrl = `data:image/jpeg;base64,${jpegBuf.toString('base64')}`;
      } catch {
        const jpegBuf = thumbnail.toJPEG ? thumbnail.toJPEG(75) : null;
        dataUrl = jpegBuf ? `data:image/jpeg;base64,${jpegBuf.toString('base64')}` : thumbnail.toDataURL();
      }
      return { success: true, image: dataUrl };
    }
    return { success: false, error: 'No screen source found' };
  } catch (err) {
    console.error('[WishPilot] Screen capture error:', err);
    return { success: false, error: err.message };
  }
});

// Proctor Software Blacklist Scanner
const PROCTOR_BLACKLIST = [
  'mettl', 'hirepro', 'seb.exe', 'safeexambrowser', 'proctor', 'cocubes',
  'wheebox', 'talview', 'honorlock', 'examity', 'lockdownbrowser', 'respondus', 'mercer'
];

ipcMain.handle('wishpilot:check-proctors', async () => {
  return platformModule.scanProctors(PROCTOR_BLACKLIST);
});

// Window controls: Dock to top center instead of minimizing to Windows taskbar!
ipcMain.on('wishpilot:minimize', () => {
  if (mainWindow) {
    mainWindow.webContents.send('wishpilot:dock-notch');
  }
});

ipcMain.on('wishpilot:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

// Open URL in system default browser
ipcMain.handle('wishpilot:open-external', (event, url) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    shell.openExternal(url);
  }
});

ipcMain.on('wishpilot:close', () => {
  if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
  createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
