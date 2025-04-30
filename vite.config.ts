import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';


export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'vite-plugin-mock-rpc-websockets',
      resolveId(id) {
        if (id === 'rpc-websockets/dist/lib/client' || 
            id === 'rpc-websockets/dist/lib/client/websocket.browser') {
          return path.resolve(__dirname, 'src/lib/mocks/rpc-websocket-mock.js');
        }
        return undefined;
      },
      load(id) {
        if (id.includes('rpc-websocket-mock.js')) {
          const mockContent = `
            // Mock implementation for rpc-websockets
            export default class MockWebSocketClient {
              on() { return this; }
              off() { return this; }
              call() { return Promise.resolve({}); }
              close() {}
              connect() { return Promise.resolve(); }
            }
            export const createRpc = () => new MockWebSocketClient();
          `;
          return mockContent;
        }
        return undefined;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
    },
    exclude: ['rpc-websockets/dist/lib/client', 'rpc-websockets/dist/lib/client/websocket.browser'],
  },
  build: {
    commonjsOptions: {
      include: [],
    },
    rollupOptions: {
      // External packages that shouldn't be bundled
      external: [],
      output: {
        manualChunks: {
          // Optimize chunks as needed
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
}));
