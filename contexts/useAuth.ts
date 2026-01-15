import { useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/components/utils/supabase";
import { signUpWithEmail, AuthPayload } from "@/services/supabaseApi";

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
  | {
      type: "RESTORE_TOKEN";
      token: string | null;
      user: User | null;
      refreshToken: string | null;
    }
  | { type: "SIGN_IN"; token: string; user: User; refreshToken: string | null }
  | { type: "SIGN_OUT" }
  | { type: "SET_LOADING"; isLoading: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        token: action.token,
        user: action.user,
        refreshToken: action.refreshToken,
        isLoading: false,
        isSignout: !action.token,
        hasCheckedAuth: true,
      };
    case "SIGN_IN":
      return {
        ...state,
        token: action.token,
        user: action.user,
        refreshToken: action.refreshToken,
        isLoading: false,
        isSignout: false,
        hasCheckedAuth: true,
      };
    case "SIGN_OUT":
      return {
        ...state,
        token: null,
        user: null,
        refreshToken: null,
        isLoading: false,
        isSignout: true,
        hasCheckedAuth: true,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

const mapSupabaseUser = (user: any): User => ({
  id: user?.id ?? "",
  email: user?.email ?? "",
  name:
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    user?.name ??
    "User",
  avatar: user?.user_metadata?.avatar_url,
});

const persistAuthState = async (
  token: string,
  user: User,
  refreshToken?: string | null
) => {
  await SecureStore.setItemAsync("authToken", token);
  if (refreshToken) {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  }
  await AsyncStorage.setItem("user", JSON.stringify(user));
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
          type: "RESTORE_TOKEN",
          token,
          user,
          refreshToken,
        });
      } catch (e) {
        console.error("Failed to restore token:", e);
        dispatch({
          type: "RESTORE_TOKEN",
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
    signIn: async (loginResponse: AuthPayload) => {
      try {
        dispatch({ type: "SET_LOADING", isLoading: true });

        const { token, refreshToken, user } = loginResponse;

        await persistAuthState(token, user, refreshToken);

        dispatch({
          type: "SIGN_IN",
          token,
          user,
          refreshToken: refreshToken || null,
        });

        return { success: true, data: loginResponse };
      } catch (error) {
        console.error("Sign in error:", error);
        dispatch({ type: "SET_LOADING", isLoading: false });
        throw error;
      }
    },

    signUp: async (email: string, password: string, name: string) => {
      try {
        dispatch({ type: "SET_LOADING", isLoading: true });
        const { authPayload, message } = await signUpWithEmail(
          email,
          password,
          name
        );

        if (authPayload) {
          await persistAuthState(
            authPayload.token,
            authPayload.user,
            authPayload.refreshToken
          );

          dispatch({
            type: "SIGN_IN",
            token: authPayload.token,
            user: authPayload.user,
            refreshToken: authPayload.refreshToken,
          });

          return { success: true, data: authPayload };
        }

        dispatch({ type: "SET_LOADING", isLoading: false });

        return {
          success: true,
          data: { message },
        };
      } catch (error) {
        console.error("Sign up error:", error);
        dispatch({ type: "SET_LOADING", isLoading: false });
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

        dispatch({ type: "SIGN_OUT" });

        return { success: true };
      } catch (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    },

    doRefreshToken: async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();

        if (error || !data.session || !data.user) {
          throw new Error(error?.message || "Token refresh failed");
        }

        const mappedUser = mapSupabaseUser(data.user);

        await persistAuthState(
          data.session.access_token,
          mappedUser,
          data.session.refresh_token
        );

        dispatch({
          type: "SIGN_IN",
          token: data.session.access_token,
          user: mappedUser,
          refreshToken: data.session.refresh_token ?? state.refreshToken,
        });

        return { success: true, data };
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
