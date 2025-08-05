import { Platform, StatusBar, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react'
import { FirebaseAuthTypes, GoogleAuthProvider, getAuth, signInWithCredential, onAuthStateChanged } from '@react-native-firebase/auth';
import {
    GoogleSignin,
    statusCodes,
    isErrorWithCode,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { BASE_URL } from '@/utils/api';
import socket from '@/utils/socket';

import Constants from 'expo-constants';
const { webClientId } = (Constants.expoConfig?.extra as { webClientId: string });

GoogleSignin.configure({
    webClientId: webClientId,
    offlineAccess: true,
    scopes: ['profile', 'email']
});


export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

    const onGoogleButtonPress = async () => {
        console.log('onGoogleButtonPress started');

        try {
            // Check if device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            console.log('Attempting Google sign in...');
            const response = await GoogleSignin.signIn();
            let idToken = response.data?.idToken;
            if (!idToken) {
                // For older versions of google-signin
                idToken = response.idToken;
            }
            if (!idToken) {
                throw new Error('No ID token found');
            }

            // Create a Google credential with the token
            const googleCredential = GoogleAuthProvider.credential(idToken);
            
            // Sign-in the user with the credential
            const firebaseUserCredential = await signInWithCredential(getAuth(), googleCredential);
            const firebaseUser = firebaseUserCredential.user;

            return firebaseUser;
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            if (typeof error === 'object' && error !== null && 'code' in error) {
                console.error('Error code:', (error as { code: string }).code);
            }
            
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    // Handle user state changes
    async function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
        setUser(user);
        if (user) {
            const idToken = await user.getIdToken(true);
            console.log(BASE_URL);

            try {
                const response = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Backend login success:');
                    console.log('Signed in with Google!')
                    router.replace('/(logged-in)/screens')
                } else {
                    console.error('Backend login failed:', data);
                }
            } catch (error) {
                console.error('Error sending ID token to server:', error);
            }
        } else {
            // User logged out — disconnect the socket
            console.log('Disconnecting socket');
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Repple</Text>
            <Text style={styles.subtitle}>Create an account</Text>
            <GoogleSigninButton
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={onGoogleButtonPress}
                disabled={false}
            />
        </SafeAreaView>
    )
}

// Styles for component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    paddingBottom: 12,
    fontWeight: 'bold',
  }, 
  googleButton: {
    height: 48, 
    width: 192,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});