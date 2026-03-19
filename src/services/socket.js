import { io } from 'socket.io-client';

let socket;

export function getSocket(token) {
  if (!token) return null;

  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
