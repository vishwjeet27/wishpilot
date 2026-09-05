const platform = process.platform;

if (platform === 'win32') {
  module.exports = require('./windows.cjs');
} else if (platform === 'linux') {
  module.exports = require('./linux.cjs');
} else {
  // macOS / other fallback
  module.exports = require('./windows.cjs');
}
