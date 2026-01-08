import { useReducer, useEffect } from "react";
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

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; user: User | null; refreshToken: string | null }
  | { type: 'SIGN_IN'; token: string; user: User; refreshToken: string | null }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_LOADING'; isLoading: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.token,
        user: action.user,
        refreshToken: action.refreshToken,
        isLoading: false,
        isSignout: !action.token,
        hasCheckedAuth: true,
      };
    case 'SIGN_IN':
      return {
        ...state,
        token: action.token,
        user: action.user,
        refreshToken: action.refreshToken,
        isLoading: false,
        isSignout: false,
        hasCheckedAuth: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
        user: null,
        refreshToken: null,
        isLoading: false,
        isSignout: true,
        hasCheckedAuth: true,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, {
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

        dispatch({
          type: 'RESTORE_TOKEN',
          token,
          user,
          refreshToken,
        });
      } catch (e) {
        console.error("Failed to restore token:", e);
        dispatch({
          type: 'RESTORE_TOKEN',
          token: null,
          user: null,
          refreshToken: null,
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    ...state,
    signIn: async (loginResponse: any) => {
      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });
        
        const { token, refreshToken, user } = loginResponse;

        // Store token in SecureStore
        await SecureStore.setItemAsync("authToken", token);
        if (refreshToken) {
          await SecureStore.setItemAsync("refreshToken", refreshToken);
        }

        // Store user in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: 'SIGN_IN',
          token,
          user,
          refreshToken: refreshToken || null,
        });

        return { success: true, data: loginResponse };
      } catch (error) {
        console.error("Sign in error:", error);
        dispatch({ type: 'SET_LOADING', isLoading: false });
        throw error;
      }
    },

    signUp: async (email: string, password: string, name: string) => {
      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });
        
        // TODO: Replace with actual API call
        // For now, simulate a successful registration for demo purposes
        const demoResponse = {
          token: 'demo_auth_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now(),
          user: {
            id: Date.now().toString(),
            email: email,
            name: name,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email
          }
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { token, refreshToken, user } = demoResponse;

        // Store token in SecureStore
        await SecureStore.setItemAsync("authToken", token);
        if (refreshToken) {
          await SecureStore.setItemAsync("refreshToken", refreshToken);
        }

        // Store user in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: 'SIGN_IN',
          token,
          user,
          refreshToken: refreshToken || null,
        });

        return { success: true, data: demoResponse };
      } catch (error) {
        console.error("Sign up error:", error);
        dispatch({ type: 'SET_LOADING', isLoading: false });
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

        dispatch({ type: 'SIGN_OUT' });

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

          // Update state with new tokens
          dispatch({
            type: 'SIGN_IN',
            token,
            user: state.user!,
            refreshToken: refreshToken || state.refreshToken,
          });

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

    login: async (loginResponse: any) => {
      return authContext.signIn(loginResponse);
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
