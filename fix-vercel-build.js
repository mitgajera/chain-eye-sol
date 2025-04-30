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

  // Create jsx-runtime.js with mocked exports
  fs.writeFileSync('./node_modules/react/jsx-runtime.js', `
    import React from 'react';
    export const jsx = React.createElement;
    export const jsxs = React.createElement;
    export const Fragment = React.Fragment;
  `);
}

createMockModules();
console.log('Created mock modules for Vercel build');