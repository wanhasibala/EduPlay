import React from "react";
import { Stack } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";

export default function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Always show all screens - routing logic handled in index.tsx */}
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tab)" />
    </Stack>
  );
}
