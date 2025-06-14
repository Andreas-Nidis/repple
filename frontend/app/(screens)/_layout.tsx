import { Stack } from 'expo-router';
import React from 'react';

export default function StackLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />  
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Stack>
  );
}
