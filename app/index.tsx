import { View, Image, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { useAuthContext } from "../contexts/AuthContext";

const HAS_SEEN_ONBOARDING = "hasSeenOnboarding";

export default function Index() {
  const router = useRouter();
  const { isLoading, user, token, hasCheckedAuth } = useAuthContext();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    // Start animation
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );

    scale.value = withSequence(
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
  }, [opacity, scale]);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING);
        setHasSeenOnboarding(value === "true");
        setHasCheckedOnboarding(true);
      } catch (error) {
        console.log("Error checking onboarding status:", error);
        setHasSeenOnboarding(false);
        setHasCheckedOnboarding(true);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    // Wait for auth checks to complete
    if (!isLoading && hasCheckedAuth && hasCheckedOnboarding) {
      const timer = setTimeout(() => {
        // Route based on authentication state and onboarding
        if (!hasSeenOnboarding) {
          router.push("/(onboarding)/welcome");
        } else if (user && token) {
          // User is authenticated, go to main app
          router.push("/(tab)/(home)");
        } else {
          // No auth, go to login
          router.push("/(auth)/login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, hasCheckedAuth, hasSeenOnboarding, hasCheckedOnboarding]);

  // Show splash while loading
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    bottom: 50,
  },
});
