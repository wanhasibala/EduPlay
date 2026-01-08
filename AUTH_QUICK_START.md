# Authentication Middleware - Getting Started Guide

Welcome! Your authentication middleware is now fully integrated into your project. This guide will help you get started.

## 📁 What Was Created

### Core Files (3 files)

1. **`hooks/useAuth.ts`** - Authentication logic and state management
2. **`contexts/AuthContext.tsx`** - Global context provider
3. **`middleware/authMiddleware.ts`** - Utility functions for auth operations

### Modified Files (2 files)

1. **`app/_layout.tsx`** - Added AuthProvider wrapper
2. **`app/index.tsx`** - Added middleware routing logic

### Documentation (4 files)

1. **`AUTHENTICATION_MIDDLEWARE.md`** - Complete documentation
2. **`MIDDLEWARE_FILES_SUMMARY.md`** - File descriptions and architecture
3. **`IMPLEMENTATION_CHECKLIST.md`** - Step-by-step checklist
4. **`ARCHITECTURE_DIAGRAMS.md`** - Visual flow diagrams
5. **`INTEGRATION_EXAMPLES.tsx`** - Code examples and patterns

**This file** - Quick start guide

---

## 🚀 Quick Start (5 Steps)

### Step 1: View the Splash Screen Routing

The middleware automatically routes users:

- **First time?** → Onboarding screen
- **Not logged in?** → Login screen
- **Logged in?** → App (tab navigation)

Check: [app/index.tsx](app/index.tsx)

### Step 2: Update Login Screen

Edit [app/(auth)/login.tsx](<app/(auth)/login.tsx>):

```tsx
import { useAuthContext } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuthContext();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (!result.success) {
      // Show error
    }
    // On success, auto-redirected to app
  };

  return (
    // Your login form...
  );
}
```

### Step 3: Update Register Screen

Similar pattern in [app/(auth)/register.tsx](<app/(auth)/register.tsx>):

```tsx
const { register } = useAuthContext();

const handleRegister = async () => {
  const result = await register(email, password, name);
  // Auto-redirected after successful register
};
```

### Step 4: Add Logout to Profile Screen

Edit [app/(tab)/profile.tsx](<app/(tab)/profile.tsx>):

```tsx
const { user, logout } = useAuthContext();

const handleLogout = async () => {
  await logout();
  router.replace("/(auth)/login");
};
```

### Step 5: Connect Your API

Edit [hooks/useAuth.ts](hooks/useAuth.ts) and replace mock API calls:

Replace:

```tsx
// Line ~100: Login mock API
const mockUser: User = { id: '1', email, name: ... };
const mockToken = 'mock_token_..';
```

With:

```tsx
const response = await fetch("https://your-api.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!response.ok) throw new Error("Login failed");
const { token, user } = await response.json();
```

---

## 📚 Documentation Map

| Document                                                           | Purpose                                |
| ------------------------------------------------------------------ | -------------------------------------- |
| **[AUTHENTICATION_MIDDLEWARE.md](./AUTHENTICATION_MIDDLEWARE.md)** | Complete reference guide with examples |
| **[MIDDLEWARE_FILES_SUMMARY.md](./MIDDLEWARE_FILES_SUMMARY.md)**   | Technical overview of each file        |
| **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)**   | Step-by-step implementation checklist  |
| **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)**         | Visual flow and architecture diagrams  |
| **[INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx)**         | Copy-paste code examples               |

---

## 💡 Common Usage Patterns

### Access Auth State in Any Component

```tsx
import { useAuthContext } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, token, isLoading } = useAuthContext();

  if (isLoading) return <LoadingSpinner />;
  if (!token) return <Redirect href="/(auth)/login" />;

  return <Text>Welcome, {user?.name}</Text>;
}
```

### Make API Calls with Auth Headers

```tsx
import { createAuthHeaders } from "@/middleware/authMiddleware";

async function fetchCourses() {
  const headers = await createAuthHeaders();
  const response = await fetch("https://api.example.com/courses", { headers });
  return response.json();
}
```

### Protect Routes

```tsx
export default function ProtectedScreen() {
  const { token } = useAuthContext();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return <YourContent />;
}
```

---

## 🔧 Key Functions

### In Any Component:

```tsx
import { useAuthContext } from "@/contexts/AuthContext";

const {
  // State
  user, // Current user or null
  token, // Auth token or null
  isLoading, // True during operations
  hasCheckedAuth, // True after bootstrap

  // Methods
  login, // login(email, password)
  register, // register(email, password, name)
  logout, // logout()
  refreshToken, // refreshToken()
} = useAuthContext();
```

### For Utilities:

```tsx
import {
  getAuthToken, // Get stored token
  getCurrentUser, // Get stored user
  isUserAuthenticated, // Check if logged in
  createAuthHeaders, // Create auth headers
  isTokenValid, // Validate token
  saveAuthData, // Save token+user
  clearAuthData, // Clear storage
} from "@/middleware/authMiddleware";
```

---

## 🔐 AsyncStorage Data

The middleware stores:

```
auth_token  → "your-jwt-token-here"
auth_user   → '{"id":"1","email":"user@example.com","name":"User"}'
```

These persist across app restarts automatically.

---

## 🌊 Data Flow Overview

```
User Login
   ↓
login(email, password)
   ↓
API call (replace mock)
   ↓
Save token + user to AsyncStorage
   ↓
Update auth context state
   ↓
Auto-redirect to app (/(tab)/index)
```

---

## ✅ What's Already Done

- ✅ AuthProvider wrapping entire app
- ✅ useAuth hook with bootstrap logic
- ✅ AuthContext for state sharing
- ✅ Splash screen routing based on auth
- ✅ AsyncStorage persistence
- ✅ Login/register/logout functions
- ✅ Auth utility functions
- ✅ Complete documentation
- ✅ Code examples

---

## ⚠️ Required Actions

1. **Replace mock API calls** in `hooks/useAuth.ts`

   - Update `login()` function
   - Update `register()` function
   - Update `refreshToken()` if needed

2. **Update login/register screens** with error handling

   - See `INTEGRATION_EXAMPLES.tsx` for patterns

3. **Test the flow**
   - Login, refresh app, should stay logged in
   - Logout, should go to login screen

---

## 🐛 Troubleshooting

**Issue**: User not persisting after login

- Check that BOTH token AND user are being saved
- Verify API returns both fields

**Issue**: Stuck on splash screen

- Check browser console for errors
- Verify onboarding status is set correctly

**Issue**: Token not in API requests

- Use `createAuthHeaders()` utility
- Or implement axios interceptor (see examples)

**Issue**: Need more help?\*\*

- See: [AUTHENTICATION_MIDDLEWARE.md](./AUTHENTICATION_MIDDLEWARE.md#troubleshooting)

---

## 📖 Next Reading

Based on your next step:

- **Implementing login screen?** → [INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx#1-login-screen-integration)
- **Making API calls?** → [INTEGRATION_EXAMPLES.tsx](./INTEGRATION_EXAMPLES.tsx#4-api-call-with-auth-headers)
- **Understanding the flow?** → [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)
- **Full details?** → [AUTHENTICATION_MIDDLEWARE.md](./AUTHENTICATION_MIDDLEWARE.md)
- **File structure?** → [MIDDLEWARE_FILES_SUMMARY.md](./MIDDLEWARE_FILES_SUMMARY.md)
- **Implementation checklist?** → [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)

---

## 💼 File Locations

```
Course/
├── hooks/
│   └── useAuth.ts                          ← Core hook
├── contexts/
│   └── AuthContext.tsx                     ← Context provider
├── middleware/
│   └── authMiddleware.ts                   ← Utilities
├── app/
│   ├── _layout.tsx                         ← Modified (added AuthProvider)
│   └── index.tsx                           ← Modified (added routing)
├── AUTHENTICATION_MIDDLEWARE.md            ← Full documentation
├── MIDDLEWARE_FILES_SUMMARY.md             ← File descriptions
├── IMPLEMENTATION_CHECKLIST.md             ← Checklist
├── ARCHITECTURE_DIAGRAMS.md                ← Flow diagrams
├── INTEGRATION_EXAMPLES.tsx                ← Code examples
└── AUTH_QUICK_START.md                     ← This file
```

---

## 🎯 Success Criteria

Your middleware is working when:

1. ✅ First app launch shows splash screen
2. ✅ Not logged in → Shows login screen
3. ✅ Login with credentials → Saves token and user
4. ✅ Kill and reopen app → Still logged in
5. ✅ Logout → Back to login screen
6. ✅ API calls include auth headers
7. ✅ Login/register/logout forms work
8. ✅ No errors in console

---

## 📞 Getting Help

1. Check the relevant documentation
2. Review code examples in `INTEGRATION_EXAMPLES.tsx`
3. Look at architecture diagrams in `ARCHITECTURE_DIAGRAMS.md`
4. Verify your API endpoint returns correct format
5. Check console logs for error messages

---

## 🎉 Ready to Go!

Your authentication middleware is fully set up. Just:

1. Update your login/register screens
2. Connect your API endpoints
3. Test the flow
4. Deploy!

**Questions?** Check the documentation files above or review the integration examples.

**Happy coding!** 🚀
