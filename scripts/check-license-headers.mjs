/**
 * WishPilot - GPL-3 Copyright & Attribution Enforcer
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */

import fs from 'fs';
import path from 'path';

const COPYRIGHT_HEADER = `/**
 * WishPilot - Universal Stealth Interview Copilot
 * Copyright (C) 2026 Vishwjeet Singh Vilkhu (https://github.com/vishwjeet27)
 * Licensed under the GNU General Public License v3.0 (GPL-3.0-or-later)
 */
`;

const REQUIRED_TOKENS = [
  'Vishwjeet Singh Vilkhu',
  'WishPilot',
  'GPL'
];

const TARGET_DIRECTORIES = ['src', 'electron'];
const TARGET_EXTENSIONS = ['.js', '.jsx', '.cjs', '.mjs'];
const IGNORE_PATTERNS = ['node_modules', 'dist', 'release', 'coverage', '.git'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (IGNORE_PATTERNS.some((p) => fullPath.includes(p))) return;

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (TARGET_EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const shouldFix = process.argv.includes('--fix');
let hasError = false;
let verifiedCount = 0;
let fixedCount = 0;

console.log('🛡️  Scanning WishPilot source files for GPL-3 Copyright & Attribution headers...\n');

const allFiles = TARGET_DIRECTORIES.flatMap((dir) => getAllFiles(dir));

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  const hasAllTokens = REQUIRED_TOKENS.every((token) => content.includes(token));

  if (!hasAllTokens) {
    if (shouldFix) {
      // Prepend header cleanly
      const updatedContent = COPYRIGHT_HEADER + '\n' + content.trimStart();
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`🔧 [FIXED] Added copyright header to: ${relativePath}`);
      fixedCount++;
      verifiedCount++;
    } else {
      console.error(`❌ [VIOLATION] Missing or modified copyright header in: ${relativePath}`);
      console.error(`   Required attribution: "Vishwjeet Singh Vilkhu" under GNU GPL v3.0`);
      hasError = true;
    }
  } else {
    verifiedCount++;
  }
}

console.log('\n────────────────────────────────────────────────────────────');
if (hasError) {
  console.error(`💥 Verification FAILED! One or more source files do not contain the required copyright & attribution headers.`);
  console.error(`👉 Run 'npm run license:fix' to automatically apply headers to all compliant files.`);
  process.exit(1);
} else {
  console.log(`✅ SUCCESS: All ${verifiedCount} source files are 100% compliant with GPL-3 attribution.`);
  if (fixedCount > 0) {
    console.log(`   (${fixedCount} files were automatically updated with the standard header)`);
  }
  process.exit(0);
}
