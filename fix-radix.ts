import fs from 'fs';
import path from 'path';

// Find and fix all problematic radix-ui context files
function findAndFixRadixContextFiles() {
  const basePath = 'node_modules';
  const targetFiles = [
    path.join(basePath, '@radix-ui/react-context/dist/index.mjs'),
    path.join(basePath, '@radix-ui/react-collection/node_modules/@radix-ui/react-context/dist/index.mjs')
  ];
  
  for (const filePath of targetFiles) {
    if (fs.existsSync(filePath)) {
      console.log(`Fixing ${filePath}...`);
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(
        `import { jsx } from "react/jsx-runtime";`, 
        `import * as jsxRuntime from "react/jsx-runtime"; const { jsx } = jsxRuntime;`
      );
      content = content.replace(
        `import { useMemo } from "react";`, 
        `import React from "react"; const { useMemo } = React;`
      );
      fs.writeFileSync(filePath, content);
    }
  }
}

findAndFixRadixContextFiles();
console.log('Radix UI dependencies patched successfully');