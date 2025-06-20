import { StyleSheet, Text } from 'react-native'
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

import Constants from 'expo-constants';
const { webClientId } = (Constants.expoConfig?.extra as { webClientId: string });

GoogleSignin.configure({
    webClientId: webClientId,
    offlineAccess: true,
    scopes: ['profile', 'email']
});



export default function Login() {
    const router = useRouter();
    // console.log('index started');
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

    const onGoogleButtonPress = async () => {
        console.log('onGoogleButtonPress started');

        console.log('Google Signin configured');
        // Check if the user is already signed in
        let currentUser;
                
        try {
            currentUser = GoogleSignin.getCurrentUser();
            // console.log('Current user:', currentUser);
        } catch (error) {
            console.error('Error getting current user:', error);
        }
        
        console.log('Checking if user is already signed in...');
        const isSignedIn = !!currentUser;
        console.log('Is user signed in:', isSignedIn);

        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log('Google Play Services are available');
            // Get the users ID token
            console.log('Attempting Google sign in...');
            const response = await GoogleSignin.signIn();
            // console.log('Google sign in response:', response.data?.idToken);
            // Try the new style of google-sign in result, from v13+ of that module
            let idToken = response.data?.idToken;
            // console.log('idToken', idToken);
            if (!idToken) {
                // if you are using older versions of google-signin, try old style result
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

            //Retrieve profile picture from google and store it in firebase
            const photoURL = response.data?.user.photo;
            if (photoURL) {
                await firebaseUser.updateProfile({ photoURL });
                // console.log('Firebase user profile updated with photoURL:', photoURL);
            } else {
                console.warn('No photo URL found in Google user profile');
            }

            return firebaseUser;
        } catch (error) {
            console.error('Error during Google sign-in:', error);
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
            // console.log('Sending ID token to server', idToken);
            let response;
            
            try {
                response = await fetch('http://localhost:3001/api/auth/firebase-login', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                // console.log('Response from server:', response);
            } catch (error) {
                console.error('Error sending ID token to server:', error);
            }

            let data;
            if (response) {
                data = await response.json();
                // console.log('Response data:', data);

                if (response.ok) {
                    console.log('Backend login success:', data);
                } else {
                    console.error('Backend login failed:', data.error);
                }
            } else {
                console.error('No response received from server.');
            }
        }

        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    });

    if (initializing) return null;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Repple</Text>
            <Text style={styles.subtitle}>Create an account</Text>
            <GoogleSigninButton
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={() => onGoogleButtonPress().then(() => {
                    console.log('Signed in with Google!')
                    router.replace('/(logged-in)/screens')
                })}
                disabled={false}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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