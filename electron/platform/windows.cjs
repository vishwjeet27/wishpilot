// Windows: SetWindowDisplayAffinity stealth
function enableStealth(win, enable = true) {
  if (!win) return false;
  try {
    win.setContentProtection(enable);
    console.log(`[WishPilot] Windows stealth: content protection set to ${enable}.`);
    return enable;
  } catch (e) {
    console.error('[WishPilot] Stealth failed:', e.message);
    return false;
  }
}

// Windows: tasklist process scanner
function scanProctors(blacklist) {
  const { exec } = require('child_process');
  return new Promise((resolve) => {
    exec('tasklist /FO CSV /NH', (err, stdout) => {
      if (err || !stdout) return resolve({ safe: true, detected: [] });
      const lower = stdout.toLowerCase();
      const detected = blacklist.filter(p => lower.includes(p));
      resolve({ safe: detected.length === 0, detected });
    });
  });
}

module.exports = { enableStealth, scanProctors };
