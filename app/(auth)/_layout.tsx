import { Slot, Stack } from 'expo-router';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          title: 'Register',
        }}
      />
    </Stack>
  );
}