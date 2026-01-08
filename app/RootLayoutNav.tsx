import React from "react";
import { Stack } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";

/**
 * Protected Route Navigation
 * Handles authentication-based route protection
 *
 * Routes breakdown:
 * - (auth): Login/Register - Only accessible when NOT authenticated
 * - (onboarding): Onboarding screens - Only accessible when NOT authenticated
 * - (tab): Main app - Only accessible when authenticated
 * - index: Splash screen - Always accessible (loading screen)
 */

export default function RootLayoutNav() {
  const { token, hasCheckedAuth } = useAuthContext();
  const isAuthenticated = !!token;

  // Show nothing while checking authentication
  if (!hasCheckedAuth) {
    return null;
  }

  return (
    <Stack>
      {/* Splash/Loading Screen - Always shown first */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />

      {/* Authentication Screens - Only when NOT authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack.Protected>

      {/* Onboarding Screens - Only when NOT authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack.Protected>

      {/* Main App Screens - Only when authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(tab)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
