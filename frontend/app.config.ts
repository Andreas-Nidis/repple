import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Repple',
  slug: 'repple',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    googleServicesFile: './GoogleService-Info.plist'
  },
  android: {
    googleServicesFile: './google-services.json'
  },
  extra: {
    PORT: process.env.PORT,
    webClientId: process.env.WEB_CLIENT_ID,
    eas: {
        projectId: 'de386b73-4977-44f2-9195-81a08f7fe862',
      },
    // Add other envs here as needed
  }
});
