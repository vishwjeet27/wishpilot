/**
 * WishPilot - Universal Stealth Interview Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

const platform = process.platform;

if (platform === 'win32') {
  module.exports = require('./windows.cjs');
} else if (platform === 'linux') {
  module.exports = require('./linux.cjs');
} else {
  // macOS / other fallback
  module.exports = require('./windows.cjs');
}
