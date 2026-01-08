# Authentication Middleware - File Summary

## Created Files

### 1. `hooks/useAuth.ts`

**Purpose**: Core authentication hook that manages auth state and operations

**Key Features**:

- Bootstrap async check for stored token/user on app start
- Login function with AsyncStorage persistence
- Register function with automatic login
- Logout function with cleanup
- Token refresh capability
- Returns auth state (isLoading, isSignout, user, token, hasCheckedAuth)

**Usage**: Used by AuthContext internally

---

### 2. `contexts/AuthContext.tsx`

**Purpose**: React Context for sharing auth state across the entire app

**Key Features**:

- AuthProvider wrapper component
- useAuthContext hook for accessing auth state
- Provides all auth methods (login, register, logout, refreshToken)
- Centralized state management

**Usage**:

```tsx
import { useAuthContext } from "@/contexts/AuthContext";
const { user, token, login, logout } = useAuthContext();
```

---

### 3. `middleware/authMiddleware.ts`

**Purpose**: Utility functions for auth operations

**Key Functions**:

- `isUserAuthenticated()` - Check if user is logged in
- `getAuthToken()` - Retrieve stored token
- `getCurrentUser()` - Retrieve stored user data
- `saveAuthData()` - Save token and user to AsyncStorage
- `clearAuthData()` - Clear auth data from AsyncStorage
- `isTokenValid()` - Validate token expiration (customizable for JWT)
- `createAuthHeaders()` - Create auth headers for API calls
- `logout()` - Logout with backend call option

**Usage**:

```tsx
import { getAuthToken, createAuthHeaders } from "@/middleware/authMiddleware";
const token = await getAuthToken();
const headers = await createAuthHeaders();
```

---

### 4. `app/_layout.tsx` (Modified)

**Changes**:

- Added AuthProvider import
- Wrapped app with `<AuthProvider>` context provider
- All auth functionality now available throughout the app

---

### 5. `app/index.tsx` (Modified)

**Changes**:

- Integrated useAuthContext hook
- Added auth state checks (user, token, isLoading)
- Automatic routing based on:
  - Onboarding status
  - Authentication status
  - Loading state
- Routes user to:
  - Onboarding if first time
  - Login if not authenticated
  - Main app (tab navigation) if authenticated

---

### 6. `AUTHENTICATION_MIDDLEWARE.md`

**Purpose**: Comprehensive documentation for the authentication system

**Contains**:

- Overview of features
- File structure explanation
- Setup instructions
- Usage examples
- Middleware utilities documentation
- API integration guide
- Navigation flow diagram
- AsyncStorage keys reference
- State management details
- Protected routes implementation
- Error handling patterns
- Security considerations
- Troubleshooting guide

---

### 7. `INTEGRATION_EXAMPLES.tsx`

**Purpose**: Copy-paste examples for common authentication patterns

**Includes**:

1. Login screen integration
2. Protected route guard
3. Profile screen with logout
4. API call with auth headers
5. Auth status checks in useEffect
6. Registration screen
7. Conditional rendering based on auth
8. Axios interceptor setup
9. Component usage examples
10. Token refresh logic

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          App Root (app/_layout.tsx)     │
│            ↓                             │
│    ┌────────────────────────┐           │
│    │   AuthProvider         │           │
│    │   (AuthContext.tsx)    │           │
│    │       ↓                │           │
│    │   ┌──────────────────┐ │           │
│    │   │  useAuth Hook    │ │           │
│    │   │  (hooks/useAuth) │ │           │
│    │   │   - Bootstrap    │ │           │
│    │   │   - Login/Reg    │ │           │
│    │   │   - Logout       │ │           │
│    │   │   - Refresh      │ │           │
│    │   └──────────────────┘ │           │
│    │       ↓                │           │
│    │   AsyncStorage         │           │
│    │   (persistent state)   │           │
│    └────────────────────────┘           │
│            ↓                             │
│     Components/Screens                  │
│     (useAuthContext hook)               │
│                                         │
│     Utility Functions                   │
│     (middleware/authMiddleware.ts)      │
└─────────────────────────────────────────┘
```

## Data Flow

### On App Start

1. User launches app
2. Root layout renders with AuthProvider
3. useAuth hook checks AsyncStorage for token/user
4. Sets hasCheckedAuth = true
5. Splash screen redirects based on:
   - hasSeenOnboarding → Onboarding or App
   - user && token → Main app (tabs)
   - No token/user → Login screen

### On Login

1. Component calls `login(email, password)`
2. Login makes API call
3. Stores token and user in AsyncStorage
4. Updates auth context state
5. useRouter automatically redirects to main app

### On Logout

1. Component calls `logout()`
2. Clears AsyncStorage
3. Updates auth state
4. Redirects to login screen

## Key Files Modified

- ✅ `app/_layout.tsx` - Added AuthProvider wrapper
- ✅ `app/index.tsx` - Added auth state routing logic

## New Files Created

- ✅ `hooks/useAuth.ts` - Auth hook
- ✅ `contexts/AuthContext.tsx` - Auth context
- ✅ `middleware/authMiddleware.ts` - Utility functions
- ✅ `AUTHENTICATION_MIDDLEWARE.md` - Documentation
- ✅ `INTEGRATION_EXAMPLES.tsx` - Code examples

## Next Steps

1. **Integrate your API**:

   - Update `login()` in `hooks/useAuth.ts` with your API endpoint
   - Update `register()` similarly
   - Update `refreshToken()` if using token refresh

2. **Customize storage** (optional):

   - Replace AsyncStorage with SecureStore for production
   - Update all STORAGE_KEYS in useAuth.ts

3. **Add token validation**:

   - Uncomment JWT validation in `middleware/authMiddleware.ts`
   - Customize based on your token format

4. **Test the flow**:

   - Login with credentials
   - Verify token is stored
   - Kill and reopen app
   - Should stay logged in
   - Logout and verify redirect

5. **Update login/register screens**:
   - Integrate with the examples in `INTEGRATION_EXAMPLES.tsx`
   - Replace mock API calls with real endpoints

## Storage Structure

The middleware stores data in AsyncStorage with these keys:

```
{
  "auth_token": "eyJhbGciOiJIUzI1NiIs...",
  "auth_user": "{\"id\":\"1\",\"email\":\"user@example.com\",\"name\":\"User\"}"
}
```

## Type Definitions

```tsx
interface AuthState {
  isLoading: boolean; // During auth operations
  isSignout: boolean; // Logout state
  user: User | null; // Current user
  token: string | null; // Auth token
  hasCheckedAuth: boolean; // Bootstrap complete
}

interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any; // Additional user fields
}
```

## Security Notes

1. AsyncStorage is not encrypted - use SecureStore for sensitive apps
2. Always use HTTPS for API calls
3. Validate tokens server-side
4. Implement CSRF protection
5. Use refresh tokens for long-lived sessions
6. Clear auth data on logout

## Troubleshooting Quick Links

See `AUTHENTICATION_MIDDLEWARE.md` for:

- User not persisting after login
- Stuck on splash screen
- Token not being included in API calls
- Other common issues
