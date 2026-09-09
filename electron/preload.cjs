const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wishpilot', {
  // Stealth protection
  getStealthStatus: () => ipcRenderer.invoke('wishpilot:get-stealth-status'),
  toggleStealth: (enable) => ipcRenderer.invoke('wishpilot:toggle-stealth', enable),
  getPlatformInfo: () => ipcRenderer.invoke('wishpilot:get-platform-info'),
  
  // Click-through & overlay control
  setClickThrough: (enable) => ipcRenderer.invoke('wishpilot:set-click-through', enable),
  setMode: (mode) => ipcRenderer.invoke('wishpilot:set-mode', mode),
  
  // LeetCode / Screen capture
  captureScreen: () => ipcRenderer.invoke('wishpilot:capture-screen'),
  
  // Proctor Security Scanner
  checkProctors: () => ipcRenderer.invoke('wishpilot:check-proctors'),
  // Window control buttons
  minimize: () => ipcRenderer.send('wishpilot:minimize'),
  maximize: () => ipcRenderer.send('wishpilot:maximize'),
  close: () => ipcRenderer.send('wishpilot:close'),

  // Open URL in system default browser
  openExternal: (url) => ipcRenderer.invoke('wishpilot:open-external', url),

  // Check for updates via GitHub Releases API
  checkUpdate: () => ipcRenderer.invoke('wishpilot:check-update'),

  // Event listeners
  onPanicTriggered: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('wishpilot:panic-triggered', handler);
    return () => ipcRenderer.removeListener('wishpilot:panic-triggered', handler);
  },
  onTriggerSnip: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('wishpilot:trigger-snip', handler);
    return () => ipcRenderer.removeListener('wishpilot:trigger-snip', handler);
  },
  onClickThroughChanged: (callback) => {
    const handler = (event, val) => callback(val);
    ipcRenderer.on('wishpilot:click-through-changed', handler);
    return () => ipcRenderer.removeListener('wishpilot:click-through-changed', handler);
  },
  onTriggerAnswer: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('wishpilot:trigger-answer', handler);
    return () => ipcRenderer.removeListener('wishpilot:trigger-answer', handler);
  },
  onDockNotch: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('wishpilot:dock-notch', handler);
    return () => ipcRenderer.removeListener('wishpilot:dock-notch', handler);
  },
  onToggleMic: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('wishpilot:toggle-mic', handler);
    return () => ipcRenderer.removeListener('wishpilot:toggle-mic', handler);
  }
});
