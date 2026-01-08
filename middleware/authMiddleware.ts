import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const [token, user] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.USER),
    ]);

    return !!(token && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current authentication token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

/**
 * Save authentication data
 */
export const saveAuthData = async (
  token: string,
  user: any,
): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

/**
 * Clear authentication data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Validate token expiration (if applicable)
 * Customize based on your token format
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return false;
    }

    // Example: Check if token has expiration claim (JWT)
    // Uncomment and customize based on your token format
    /*
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const decoded = JSON.parse(atob(parts[1]));
    if (decoded.exp) {
      return Date.now() < decoded.exp * 1000;
    }
    */

    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Middleware for API requests - adds token to headers
 */
export const createAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Logout and clear authentication
 */
export const logout = async (): Promise<void> => {
  try {
    // Optional: Call logout endpoint on your backend
    // await logoutAPI();

    await clearAuthData();
  } catch (error) {
    console.error('Error during logout:', error);
    // Clear local data even if API call fails
    await clearAuthData().catch(() => {});
  }
};
