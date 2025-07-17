import { Platform } from 'react-native';

export const BASE_URL = Platform.select({
  ios: 'http://localhost:3001',
  android: 'http://192.168.18.211:3001',
});