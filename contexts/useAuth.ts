import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isSignup: boolean;
  hasCheckedAuth: boolean;
}

export const useAuth = () => {
  const [state, dispatch] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: true,
    isSignout: false,
    isSignup: false,
    hasCheckedAuth: false,
  });

  // Initialize auth state from AsyncStorage and SecureStore
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Retrieve token from SecureStore
        const token = await SecureStore.getItemAsync("authToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        // Retrieve user from AsyncStorage
        const userJson = await AsyncStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (token && user) {
          dispatch({
            user,
            token,
            refreshToken,
            isLoading: false,
            isSignout: false,
            isSignup: false,
            hasCheckedAuth: true,
          });
        } else {
          dispatch({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            isSignout: true,
            isSignup: false,
            hasCheckedAuth: true,
          });
        }
      } catch (e) {
        console.error("Failed to restore token:", e);
        dispatch({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
          isSignout: true,
          isSignup: false,
          hasCheckedAuth: true,
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    ...state,
    signIn: async (email: string, password: string) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch("YOUR_API_URL/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          const { token, refreshToken, user } = data;

          // Store token in SecureStore
          await SecureStore.setItemAsync("authToken", token);
          if (refreshToken) {
            await SecureStore.setItemAsync("refreshToken", refreshToken);
          }

          // Store user in AsyncStorage
          await AsyncStorage.setItem("user", JSON.stringify(user));

          dispatch({
            user,
            token,
            refreshToken: refreshToken || null,
            isLoading: false,
            isSignout: false,
            isSignup: false,
          });

          return { success: true, data };
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },

    signUp: async (email: string, password: string, name: string) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch("YOUR_API_URL/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (response.ok) {
          const { token, refreshToken, user } = data;

          // Store token in SecureStore
          await SecureStore.setItemAsync("authToken", token);
          if (refreshToken) {
            await SecureStore.setItemAsync("refreshToken", refreshToken);
          }

          // Store user in AsyncStorage
          await AsyncStorage.setItem("user", JSON.stringify(user));

          dispatch({
            user,
            token,
            refreshToken: refreshToken || null,
            isLoading: false,
            isSignout: false,
            isSignup: false,
          });

          return { success: true, data };
        } else {
          throw new Error(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },

    signOut: async () => {
      try {
        // TODO: Call logout API if needed
        // await fetch("YOUR_API_URL/logout", { method: "POST", headers: { Authorization: `Bearer ${state.token}` } });

        // Clear SecureStore
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("refreshToken");

        // Clear AsyncStorage
        await AsyncStorage.removeItem("user");

        dispatch({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
          isSignout: true,
          isSignup: false,
        });

        return { success: true };
      } catch (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    },

    doRefreshToken: async () => {
      try {
        if (!state.refreshToken) {
          throw new Error("No refresh token available");
        }

        // TODO: Replace with actual API call
        const response = await fetch("YOUR_API_URL/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.refreshToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const { token, refreshToken } = data;

          // Update token in SecureStore
          await SecureStore.setItemAsync("authToken", token);
          if (refreshToken) {
            await SecureStore.setItemAsync("refreshToken", refreshToken);
          }

          dispatch((prev) => ({
            ...prev,
            token,
            refreshToken: refreshToken || prev.refreshToken,
          }));

          return { success: true, data };
        } else {
          throw new Error(data.message || "Token refresh failed");
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        // On refresh failure, sign out the user
        await authContext.signOut();
        throw error;
      }
    },

    login: async (email: string, password: string) => {
      return authContext.signIn(email, password);
    },

    register: async (email: string, password: string, name: string) => {
      return authContext.signUp(email, password, name);
    },

    logout: async () => {
      return authContext.signOut();
    },
  };

  return authContext;
};
