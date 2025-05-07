#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script checks if the current bundle.js is a production version before allowing commits to main branch
 */

// Get the current branch
let currentBranch;
try {
  currentBranch = execSync('git symbolic-ref --short HEAD').toString().trim();
} catch (error) {
  console.error('Error determining current branch:', error.message);
  process.exit(1);
}

// Only check on main branch
if (currentBranch !== 'main') {
  process.exit(0); // Not on main branch, allow commit
}

// Path to bundle.js
const bundlePath = path.join(__dirname, '..', 'js', 'bundle.js');

// Check if bundle.js exists
if (!fs.existsSync(bundlePath)) {
  console.error('\x1b[31mError: bundle.js does not exist. Run npm run build:webpack first.\x1b[0m');
  process.exit(1);
}

// Read bundle.js content
const bundleContent = fs.readFileSync(bundlePath, 'utf8');

// Characteristics of a production bundle:
// 1. No source map comments
// 2. Minified (no unnecessary whitespace)
// 3. Obfuscated code (containing obfuscated identifiers)

const isProduction = 
  !bundleContent.includes('//# sourceMappingURL=') && // No source maps
  !bundleContent.includes('debugger;') && // No debugger statements
  bundleContent.indexOf('\n\n') === -1 && // Minified (crude check)
  /[_$a-zA-Z0-9]{1,3}=/.test(bundleContent); // Obfuscated identifiers

if (!isProduction) {
  console.error('\x1b[31mError: It appears you are trying to commit a development version of bundle.js to main branch.\x1b[0m');
  console.error('\x1b[31mPlease run "npm run build:webpack" to create a production build before committing.\x1b[0m');
  process.exit(1);
}

// Bundle is production version, allow commit
console.log('\x1b[32mProduction bundle.js verified.\x1b[0m');
process.exit(0); 