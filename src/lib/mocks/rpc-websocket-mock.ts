// Mock implementation for rpc-websockets
export default class MockWebSocketClient {
  on() { return this; }
  off() { return this; }
  call() { return Promise.resolve({}); }
  close() {}
  connect() { return Promise.resolve(); }
}

// Export a default function for websocket.browser
export const createRpc = () => new MockWebSocketClient();
