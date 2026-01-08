import { StatusBar, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, SplashScreen } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import "../global.css";
import { ToastProvider } from "expo-toast";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { AuthProvider } from "../contexts/AuthContext";
import RootLayoutNav from "./RootLayoutNav";

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
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <StatusBar barStyle="dark-content" />
          <RootLayoutNav />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  );
}
