const { exec } = require('child_process');

// Linux stealth strategy:
//   Wayland → Privacy by design (OS handles it, no code needed)
//   X11     → Set window type to DOCK (many screen recorders skip dock windows)
function enableStealth(win, enable = true) {
  if (!win) return false;
  const isWayland = process.env.WAYLAND_DISPLAY || process.env.XDG_SESSION_TYPE === 'wayland';

  if (isWayland) {
    console.log('[WishPilot] Linux/Wayland: stealth by design — captures require user selection.');
    return 'wayland';
  }

  if (!enable) {
    return false;
  }

  // X11: attempt DOCK window type hint
  try {
    const handle = win.getNativeWindowHandle();
    const winId = handle.readUInt32LE ? handle.readUInt32LE(0) : handle.readInt32LE(0);
    exec(`xprop -id ${winId} -f _NET_WM_WINDOW_TYPE 32a -set _NET_WM_WINDOW_TYPE _NET_WM_WINDOW_TYPE_DOCK`,
      (err) => {
        if (err) console.warn('[WishPilot] X11 DOCK hint failed:', err.message);
        else console.log('[WishPilot] X11 DOCK hint applied (recorder-level stealth).');
      }
    );
    return 'x11-partial';
  } catch (e) {
    console.warn('[WishPilot] Linux stealth unavailable:', e.message);
    return false;
  }
}

// Linux: ps aux process scanner (works on all distros)
function scanProctors(blacklist) {
  return new Promise((resolve) => {
    exec('ps aux --no-headers', (err, stdout) => {
      if (err || !stdout) return resolve({ safe: true, detected: [] });
      const lower = stdout.toLowerCase();
      const detected = blacklist.filter(p => lower.includes(p));
      resolve({ safe: detected.length === 0, detected });
    });
  });
}

module.exports = { enableStealth, scanProctors };
