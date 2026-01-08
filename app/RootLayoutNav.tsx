import React from "react";
import { Stack } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";

export default function RootLayoutNav() {
  const { token, hasCheckedAuth, isLoading } = useAuthContext();
  const isAuthenticated = !!token;

  // Show nothing while checking authentication
  if (!hasCheckedAuth || isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Always show index screen for initial routing logic */}
      <Stack.Screen name="index" />

      {/* Conditional screens based on auth status */}
      {!isAuthenticated ? (
        <>
          {/* Auth screens - only when not authenticated */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
        </>
      ) : (
        <>
          {/* Main app - only when authenticated */}
          <Stack.Screen name="(tab)" />
        </>
      )}
    </Stack>
  );
}
