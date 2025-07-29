import { io } from 'socket.io-client';
import { BASE_URL } from './api';
import Toast from 'react-native-toast-message';

const socket = io(`${BASE_URL}`, {
  transports: ['websocket'],
  forceNew: true,
  autoConnect: false, // So you can connect manually after auth
});

socket.on('connect_error', (err) => {
  console.log('Connect error:', err.message);
});

socket.on('friendActivity', (payload: any) => {
  const { user, workoutId, action } = payload;
  
  Toast.show({
    type: 'info',
    text1: `${user.name} has ${action} a workout!`,
    position: 'top',
    visibilityTime: 3000,
  });
});

socket.on('friendRequest', (payload: any) => {
  const { user, friendId } = payload;

  Toast.show({
    type: 'info',
    text1: `${user.name} sent you a friend request!`,
    position: 'top',
    visibilityTime: 3000,
  })
})

socket.on('acceptFriendRequest', (payload: any) => {
  const { user, friendId } = payload;

  Toast.show({
    type: 'info',
    text1: `${user.name} accepted your friend request!`,
    position: 'top',
    visibilityTime: 3000,
  })
})



export default socket;