import { Platform } from 'react-native';
import Constants from 'expo-constants';
const { PORT } = (Constants.expoConfig?.extra as { PORT: string });

export const BASE_URL = Platform.select({
  ios: `http://localhost:${PORT}`,
  android: `http://192.168.18.211:${PORT}`,
});