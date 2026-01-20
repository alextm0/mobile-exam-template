import { CONFIG } from '../config/config';

let socket: WebSocket | null = null;
let onMessageCallback: ((data: any) => void) | null = null;

export const initWebSocket = () => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket(CONFIG.SOCKET_URL);

  socket.onopen = () => console.log('✅ WS Connected');
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessageCallback) onMessageCallback(data);
    } catch (e) {
      console.error('❌ WS Parse Error:', e);
    }
  };

  socket.onerror = (e) => console.error('❌ WS Error:', e);
  
  socket.onclose = () => {
    console.log('resetting WS...');
    socket = null;
    setTimeout(initWebSocket, 3000);
  };
};

export const setWsHandler = (callback: (data: any) => void) => {
  onMessageCallback = callback;
};

export const clearWsHandler = () => {
  onMessageCallback = null;
};
