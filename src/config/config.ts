/**
 * Application Configuration
 * 
 * IMPORTANT:
 * - API_BASE_URL must match the IP address of the server.
 * - If running on Android Emulator: Use 'http://10.0.2.2:2518' (Alias for localhost).
 * - If running on Physical Device: Use your computer's local IP (e.g., 'http://192.168.0.x:2518').
 * - 'localhost' will NOT work on Android devices.
 */
export const CONFIG = {
  // REPLACE THIS WITH YOUR COMPUTER'S IP ADDRESS IF RUNNING ON PHYSICAL DEVICE
  API_BASE_URL: 'http://192.168.0.27:2518',
  
  // WebSocket URL (usually the same as API but with ws:// protocol if needed, though socket.io handles http too)
  SOCKET_URL: 'ws://192.168.0.27:2518',
  
  TIMEOUT: 10000, // 10 seconds
};