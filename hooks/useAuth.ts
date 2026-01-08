import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

export interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  user: User | null;
  token: string | null;
  hasCheckedAuth: boolean;
}

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

export const useAuth = () => {
  const [state, dispatch] = useState<AuthState>({
    isLoading: true,
    isSignout: false,
    user: null,
    token: null,
    hasCheckedAuth: false,
  });

  // Bootstrap async check for token/user on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Check if token and user exist in storage
        const [token, userJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
        ]);

        let user: User | null = null;

        if (userJson) {
          try {
            user = JSON.parse(userJson);
          } catch (e) {
            console.error('Failed to parse user from storage:', e);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
          }
        }

        // Validate token and user exist
        if (token && user) {
          dispatch({
            isLoading: false,
            isSignout: false,
            user,
            token,
            hasCheckedAuth: true,
          });
        } else {
          dispatch({
            isLoading: false,
            isSignout: true,
            user: null,
            token: null,
            hasCheckedAuth: true,
          });
        }
      } catch (e) {
        console.error('Failed to bootstrap authentication:', e);
        dispatch({
          isLoading: false,
          isSignout: true,
          user: null,
          token: null,
          hasCheckedAuth: true,
        });
      }
    };

    bootstrapAsync();
  }, []);

  // Login action
  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ ...state, isLoading: true });
      
      // Replace with your actual API call
      // const response = await loginAPI(email, password);
      // const { token, user } = response.data;

      // Temporary mock - remove and replace with real API
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      const mockToken = 'mock_token_' + Date.now();

      // Save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser)),
      ]);

      dispatch({
        isLoading: false,
        isSignout: false,
        user: mockUser,
        token: mockToken,
        hasCheckedAuth: true,
      });

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({
        isLoading: false,
        isSignout: true,
        user: null,
        token: null,
        hasCheckedAuth: true,
      });
      return { success: false, error };
    }
  }, [state]);

  // Register action
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      dispatch({ ...state, isLoading: true });

      // Replace with your actual API call
      // const response = await registerAPI(email, password, name);
      // const { token, user } = response.data;

      // Temporary mock - remove and replace with real API
      const mockUser: User = {
        id: '1',
        email,
        name,
      };
      const mockToken = 'mock_token_' + Date.now();

      // Save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser)),
      ]);

      dispatch({
        isLoading: false,
        isSignout: false,
        user: mockUser,
        token: mockToken,
        hasCheckedAuth: true,
      });

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Register failed:', error);
      dispatch({
        isLoading: false,
        isSignout: true,
        user: null,
        token: null,
        hasCheckedAuth: true,
      });
      return { success: false, error };
    }
  }, [state]);

  // Logout action
  const logout = useCallback(async () => {
    try {
      dispatch({ ...state, isLoading: true });

      // Clear AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
      ]);

      dispatch({
        isLoading: false,
        isSignout: true,
        user: null,
        token: null,
        hasCheckedAuth: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error };
    }
  }, [state]);

  // Refresh/validate token (useful for token expiration)
  const refreshToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error('No token found');
      }

      // Replace with your actual API call to refresh token
      // const response = await refreshTokenAPI(token);
      // const newToken = response.data.token;

      // For now, just validate token exists
      return { success: true, token };
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      return { success: false, error };
    }
  }, [logout]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  };
};
