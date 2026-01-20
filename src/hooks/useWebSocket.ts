import { useEffect } from 'react';
import { setWsHandler, clearWsHandler, initWebSocket } from '../lib/websocket';

export function useWebSocket<T = any>(onMessage: (data: T) => void) {
  useEffect(() => {
    initWebSocket();
    setWsHandler(onMessage);
    return () => clearWsHandler();
  }, [onMessage]);
}
