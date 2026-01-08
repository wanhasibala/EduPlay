# Authentication Middleware Documentation

This document describes the authentication middleware system for your Expo project.

## Overview

The authentication middleware provides:

- Automatic token and user persistence in AsyncStorage
- Authentication state management across the app
- Automatic route navigation based on auth state
- Token validation and refresh utilities
- Logout functionality with cleanup

## File Structure

```
hooks/
├── useAuth.ts                 # Main auth hook with bootstrap logic

contexts/
├── AuthContext.tsx            # Context provider for auth state

middleware/
├── authMiddleware.ts          # Utility functions for auth operations

app/
├── _layout.tsx                # Root layout with AuthProvider
└── index.tsx                  # Splash screen with middleware routing
```

## Setup

The middleware is already integrated into your root layout. The `AuthProvider` wraps your entire app:

```tsx
// app/_layout.tsx
<Provider store={store}>
  <AuthProvider>
    <ToastProvider>{/* Your app */}</ToastProvider>
  </AuthProvider>
</Provider>
```

## Usage

### 1. Using Authentication State in Components

```tsx
import { useAuthContext } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, token, isLoading, login, logout } = useAuthContext();

  return <View>{user && <Text>Welcome, {user.name}</Text>}</View>;
}
```

### 2. Login

```tsx
const { login } = useAuthContext();

const handleLogin = async () => {
  const result = await login("user@example.com", "password");
  if (result.success) {
    // User is logged in and data is persisted
  }
};
```

### 3. Register

```tsx
const { register } = useAuthContext();

const handleRegister = async () => {
  const result = await register("user@example.com", "password", "User Name");
  if (result.success) {
    // User is registered and logged in
  }
};
```

### 4. Logout

```tsx
const { logout } = useAuthContext();

const handleLogout = async () => {
  await logout();
  // User is logged out and redirected to login
};
```

### 5. Token Refresh

```tsx
const { refreshToken } = useAuthContext();

const handleTokenRefresh = async () => {
  const result = await refreshToken();
  if (result.success) {
    // Token is valid or refreshed
  }
};
```

## Middleware Utilities

The `authMiddleware.ts` file provides utility functions:

### Check Authentication Status

```tsx
import { isUserAuthenticated } from "@/middleware/authMiddleware";

const isAuth = await isUserAuthenticated();
```

### Get Auth Token

```tsx
import { getAuthToken } from "@/middleware/authMiddleware";

const token = await getAuthToken();
```

### Get Current User

```tsx
import { getCurrentUser } from "@/middleware/authMiddleware";

const user = await getCurrentUser();
```

### Create Auth Headers for API Calls

```tsx
import { createAuthHeaders } from "@/middleware/authMiddleware";

const headers = await createAuthHeaders();
// Use in fetch or axios requests
```

### Validate Token

```tsx
import { isTokenValid } from "@/middleware/authMiddleware";

const isValid = await isTokenValid();
```

## API Integration

To integrate with your actual backend API, update the login and register functions in `hooks/useAuth.ts`:

### Step 1: Update Login Function

```tsx
const login = useCallback(
  async (email: string, password: string) => {
    try {
      dispatch({ ...state, isLoading: true });

      // Replace this with your actual API call
      const response = await fetch("https://your-api.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token, user } = data;

      // Save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      dispatch({
        isLoading: false,
        isSignout: false,
        user,
        token,
        hasCheckedAuth: true,
      });

      return { success: true, user, token };
    } catch (error) {
      // ... error handling
    }
  },
  [state]
);
```

### Step 2: Update Register Function

Similar pattern to login, but call your registration endpoint.

### Step 3: Update Token Validation

In `middleware/authMiddleware.ts`, if your API uses JWT tokens, uncomment and customize the `isTokenValid` function:

```tsx
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return false;
    }

    // Decode JWT and check expiration
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const decoded = JSON.parse(atob(parts[1]));
    if (decoded.exp) {
      return Date.now() < decoded.exp * 1000;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};
```

## Navigation Flow

The middleware automatically handles navigation:

```
App Start
  ↓
Check onboarding status
Check auth token & user in AsyncStorage
  ↓
Auth Check:
├─ No onboarding → Show welcome screen
├─ No auth → Show login screen
└─ Has auth → Show main app (tab navigation)
```

## AsyncStorage Keys

The middleware uses these storage keys:

```
auth_token   - Stores the authentication token
auth_user    - Stores the user object (JSON)
```

## State Management

The auth context provides these states:

```tsx
interface AuthState {
  isLoading: boolean; // Loading during auth operations
  isSignout: boolean; // True when user is logged out
  user: User | null; // Current user object
  token: string | null; // Auth token
  hasCheckedAuth: boolean; // Whether auth check is complete
}
```

## Protected Routes

To create protected routes that require authentication:

```tsx
import { useAuthContext } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function ProtectedScreen() {
  const { token } = useAuthContext();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return <View>{/* Protected content */}</View>;
}
```

## Error Handling

Always wrap auth operations in try-catch:

```tsx
try {
  const result = await login(email, password);
  if (result.success) {
    // Handle success
  } else {
    // Handle error from result.error
  }
} catch (error) {
  console.error("Unexpected error:", error);
}
```

## Security Considerations

1. **Token Storage**: AsyncStorage is not encrypted by default. For sensitive apps, consider using Expo SecureStore or react-native-keychain.

2. **Token Expiration**: Implement token refresh logic in the `refreshToken` function.

3. **HTTPS Only**: Always use HTTPS for API calls.

4. **Token in Headers**: The `createAuthHeaders` utility automatically includes the token in API requests.

## Examples

### Example: Protected API Call

```tsx
import { createAuthHeaders } from "@/middleware/authMiddleware";

const fetchUserCourses = async () => {
  const headers = await createAuthHeaders();

  const response = await fetch("https://api.example.com/courses", {
    headers,
  });

  return response.json();
};
```

### Example: Logout with Navigation

```tsx
const { logout } = useAuthContext();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.replace("/(auth)/login");
};
```

### Example: Check Auth Before Action

```tsx
const { token, user } = useAuthContext();

useEffect(() => {
  if (!token || !user) {
    // User not authenticated, redirect
    router.replace("/(auth)/login");
  }
}, [token, user]);
```

## Troubleshooting

### User not persisting after login

- Check that `saveAuthData` is being called with valid token and user object
- Verify AsyncStorage is working: `AsyncStorage.getItem('auth_token')`

### Stuck on splash screen

- Check console for errors in `useAuth` hook
- Verify `hasCheckedAuth` is being set to true
- Check that onboarding status is being set correctly

### Token not being included in API calls

- Verify `createAuthHeaders` is being used
- Check that token is stored in AsyncStorage
- Ensure headers are passed correctly to fetch/axios

## Next Steps

1. Integrate your backend API endpoints
2. Implement token refresh logic
3. Consider using SecureStore for production
4. Add password reset functionality
5. Implement multi-factor authentication if needed
