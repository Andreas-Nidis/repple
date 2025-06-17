import { getAuth } from '@react-native-firebase/auth';
import { Redirect, Stack } from 'expo-router';
import { useState, useEffect } from 'react';

export default function AuthLayout() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged(user => {
            setUser(user);
            setInitializing(false);
        });
        return unsubscribe;
    }, [])

    if (initializing) {
        return null;
    }

    if (!user) {
        return <Redirect href="/" />;
    }

    return <Stack />;
}