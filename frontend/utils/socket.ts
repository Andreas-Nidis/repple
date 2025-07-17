import { io } from 'socket.io-client';
import { BASE_URL } from './api';

const socket = io(`${BASE_URL}`, {
  transports: ['websocket'],
  forceNew: true,
  autoConnect: false, // So you can connect manually after auth
});

socket.on('connect_error', (err) => {
  console.log('Connect error:', err.message);
});

export default socket;