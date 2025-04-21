import { StatusBar, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, SplashScreen } from "expo-router";
import Toast from 'react-native-toast-message';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { AuthProvider } from '../components/auth/AuthProvider';

import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
        <Stack.Screen
          name="(tab)"
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
