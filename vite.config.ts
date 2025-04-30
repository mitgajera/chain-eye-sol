import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }: { mode: string }) => ({
  base: './',  // Set base path to relative for better compatibility
  build: {
    outDir: 'dist',  // Explicitly set output directory
    assetsDir: 'assets',  // Explicitly set assets directory
    emptyOutDir: true,  // Clean output directory before building
    sourcemap: false,  // Disable source maps for production
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
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
          return `
            export default class MockWebSocketClient {
              on() { return this; }
              off() { return this; }
              call() { return Promise.resolve({}); }
              close() {}
              connect() { return Promise.resolve(); }
            }
            export const createRpc = () => new MockWebSocketClient();
          `;
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
    exclude: ['rpc-websockets/dist/lib/client', 'rpc-websockets/dist/lib/client/websocket.browser'],
  }
}));
