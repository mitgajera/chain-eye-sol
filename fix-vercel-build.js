import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create mock modules to satisfy problematic imports
function createMockModules() {
  // Create directory if it doesn't exist
  const dir = './node_modules/react/jsx-runtime';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create jsx-runtime.js with CommonJS-compatible exports
  fs.writeFileSync('./node_modules/react/jsx-runtime.js', `
    const React = require('react');
    exports.jsx = React.createElement;
    exports.jsxs = React.createElement;
    exports.Fragment = React.Fragment;
  `);
  
  console.log('Created mock modules for Vercel build');
}

createMockModules();