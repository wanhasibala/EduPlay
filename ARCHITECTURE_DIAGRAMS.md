# Authentication Middleware Architecture Diagram

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP INITIALIZATION                                 │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  app/_layout.tsx    │
                    │  (Root Layout)      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
          ┌──────────────┐          ┌──────────────────┐
          │   Redux      │          │  AuthProvider    │
          │  Provider    │          │  (AuthContext)   │
          └──────────────┘          └────────┬─────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  useAuth Hook   │
                                    │  (Bootstrap)    │
                                    └────────┬────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      │                      │                      │
                      ▼                      ▼                      ▼
              ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
              │ AsyncStorage │      │ Check Token  │      │ Check User   │
              │ (Persistent) │      │              │      │              │
              └──────────────┘      └──────┬───────┘      └──────┬───────┘
                                           │                     │
                                    ┌──────▼─────────────────────▼──┐
                                    │   Set Auth State & Redirect   │
                                    └──────┬────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
          ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
          │ No Auth      │      │ Has Auth     │      │ No Onboarding│
          │              │      │              │      │              │
          │ /(auth)/login│      │ /(tab)/index │      │ /(onboarding)│
          └──────────────┘      └──────────────┘      └──────────────┘
                │                      │                      │
                └──────────────────────┬──────────────────────┘
                                       ▼
                          ┌─────────────────────────┐
                          │   User Navigates App   │
                          │  (useAuthContext)      │
                          └─────────────┬───────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
        ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
        │ Login/Register│        │ App Screens  │        │  API Calls   │
        │              │        │              │        │              │
        │ login()      │        │ useAuthContext│        │ createAuth   │
        │ register()   │        │              │        │ Headers()    │
        └──────┬───────┘        └──────────────┘        └──────────────┘
               │
               ▼
        ┌──────────────────┐
        │ Save Token+User  │
        │ to AsyncStorage  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Update Auth State│
        │ (Auto Redirect)  │
        └──────────────────┘
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    AuthProvider Wrapper                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              AuthContext (Global State)                         │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │         useAuth Hook (State Management)                  │ │ │
│  │  │  ┌────────────────────────────────────────────────────┐ │ │ │
│  │  │  │         AsyncStorage (Data Persistence)           │ │ │ │
│  │  │  │  - auth_token                                     │ │ │ │
│  │  │  │  - auth_user                                      │ │ │ │
│  │  │  └────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                          │ │ │
│  │  │  State:                                                  │ │ │
│  │  │  - isLoading                                            │ │ │
│  │  │  - user                                                 │ │ │
│  │  │  - token                                                │ │ │
│  │  │  - isSignout                                            │ │ │
│  │  │  - hasCheckedAuth                                       │ │ │
│  │  │                                                          │ │ │
│  │  │  Methods:                                               │ │ │
│  │  │  - login()                                              │ │ │
│  │  │  - register()                                           │ │ │
│  │  │  - logout()                                             │ │ │
│  │  │  - refreshToken()                                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │ │
│  └────────────────────────────────────────────────────────────┘ │ │
│                                                                   │ │
│  useAuthContext Hook (Access in any component)                  │ │
└──────────────────────────────────────────────────────────────────┘
         │
         │ Provided to all child components
         │
    ┌────┴────────────────────────────────────────────────────┐
    │                                                           │
    ▼                                                           ▼
┌─────────────┐                                          ┌──────────────┐
│Auth Screens │                                          │ App Screens  │
│             │                                          │              │
│- Login      │                                          │- Home        │
│- Register   │                                          │- Search      │
│- Onboarding │                                          │- Course      │
│             │                                          │- Profile     │
│ Access:     │                                          │- Wishlist    │
│const {      │                                          │              │
│  login,     │                                          │ Access:      │
│  register,  │                                          │const {       │
│  isLoading  │                                          │  user,       │
│} =          │                                          │  logout      │
│useAuthContext│                                         │} =           │
│             │                                          │useAuthContext│
└─────────────┘                                          └──────────────┘
```

## Data Flow Diagram

```
LOGIN FLOW:
──────────

User Input (email, password)
         │
         ▼
   login() function
         │
         ├─▶ isLoading = true
         │
         ├─▶ API Call
         │   │
         │   ├─▶ On Success:
         │   │   ├─▶ Save token to AsyncStorage
         │   │   ├─▶ Save user to AsyncStorage
         │   │   ├─▶ Update state (user, token)
         │   │   ├─▶ isLoading = false
         │   │   └─▶ useRouter redirects to /(tab)/index
         │   │
         │   └─▶ On Error:
         │       ├─▶ Clear state
         │       ├─▶ isLoading = false
         │       └─▶ Return error message
         │


LOGOUT FLOW:
────────────

User Clicks Logout
         │
         ▼
   logout() function
         │
         ├─▶ Clear AsyncStorage (token, user)
         │
         ├─▶ Update state (token=null, user=null)
         │
         └─▶ useRouter redirects to /(auth)/login


API CALL FLOW:
──────────────

Component needs data
         │
         ▼
   createAuthHeaders()
         │
         ├─▶ Get token from AsyncStorage
         │
         ├─▶ Create headers:
         │   {
         │     'Content-Type': 'application/json',
         │     'Authorization': 'Bearer <token>'
         │   }
         │
         ▼
   Fetch with headers
         │
         ├─▶ On 401: Auto logout
         │
         └─▶ Return data


APP START FLOW:
───────────────

App Launches
   │
   ▼
Root Layout (_layout.tsx)
   │
   ▼
AuthProvider wrapper
   │
   ▼
useAuth hook (bootstrap)
   │
   ├─▶ Check AsyncStorage for token & user
   │
   ├─▶ Set hasCheckedAuth = true
   │
   ▼
Splash Screen (app/index.tsx)
   │
   ├─▶ Check onboarding status
   │
   ├─▶ Check auth status (token & user)
   │
   ▼
ROUTE DECISION:
   │
   ├──▶ No onboarding? ──▶ /(onboarding)/welcome
   │
   ├──▶ No token/user? ──▶ /(auth)/login
   │
   └──▶ Has token & user? ──▶ /(tab)/index
```

## State Management Diagram

```
┌─────────────────────────────────────────────────────────┐
│               AuthState (State Machine)                 │
└──────────────────────┬──────────────────────────────────┘

INITIAL STATE:
┌──────────────────────────────────────────┐
│ isLoading: true                          │
│ isSignout: false                         │
│ user: null                               │
│ token: null                              │
│ hasCheckedAuth: false                    │
└──────────────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼

LOADING STATE:          AUTHENTICATED STATE:      SIGNED OUT STATE:
┌──────────────┐        ┌──────────────────┐     ┌──────────────┐
│ isLoading:   │        │ isLoading: false │     │ isSignout:   │
│ true         │        │ isSignout: false │     │ true         │
│ isSignout:   │        │ user: {id, ...}  │     │ user: null   │
│ false        │        │ token: "abc..."  │     │ token: null  │
│ user: null   │        │ hasCheckedAuth:  │     │ hasCheckedAuth│
│ token: null  │        │ true             │     │ true         │
│ hasCheckedAuth        └──────────────────┘     └──────────────┘
│ false        │             │                    │
└──────────────┘             │                    │
                             │                    │
                        ┌────▼────┐          ┌────▼────┐
                        │ Redirect │          │ Redirect │
                        │  to app  │          │to login  │
                        └──────────┘          └──────────┘
```

## File Dependencies Diagram

```
app/_layout.tsx (Root)
   │
   ├─▶ Import: AuthProvider
   │   │
   │   └─▶ contexts/AuthContext.tsx
   │       │
   │       ├─▶ Import: useAuth
   │       │   │
   │       │   └─▶ hooks/useAuth.ts
   │       │       │
   │       │       └─▶ Import: AsyncStorage
   │       │           └─▶ @react-native-async-storage/async-storage
   │       │
   │       └─▶ Export: useAuthContext hook
   │
   └─▶ Provides AuthContext to all children

app/index.tsx (Splash Screen)
   │
   ├─▶ Import: useAuthContext
   │   └─▶ Accesses auth state for routing
   │
   └─▶ Routes based on:
       - onboarding status
       - auth state (token + user)

app/(auth)/login.tsx
   │
   └─▶ Import: useAuthContext
       └─▶ Call: login()

app/(tab)/profile.tsx
   │
   └─▶ Import: useAuthContext
       └─▶ Call: logout()

Any Component needing auth:
   │
   ├─▶ Import: useAuthContext
   │   └─▶ Access: user, token, isLoading
   │
   └─▶ Import: middleware/authMiddleware
       ├─▶ createAuthHeaders() for API calls
       ├─▶ getAuthToken() for token access
       ├─▶ getCurrentUser() for user access
       └─▶ isUserAuthenticated() for checks
```

## Security Layer Diagram

```
┌──────────────────────────────────────────────────────┐
│           API Request (Component)                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  createAuthHeaders()       │
        │  (Middleware Utility)      │
        └────────┬───────────────────┘
                 │
        ┌────────▼─────────────┐
        │  AsyncStorage.get    │
        │  (STORAGE_KEYS.TOKEN)│
        └────────┬─────────────┘
                 │
        ┌────────▼──────────────────────┐
        │  Validate Token (optional)    │
        │  - Check expiration (JWT)     │
        │  - Validate format            │
        └────────┬──────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │  Add to Headers               │
        │  Authorization: Bearer <token>│
        └────────┬──────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │  Send API Request             │
        │  with Auth Headers            │
        └────────┬──────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │  Receive Response             │
        └────────┬──────────────────────┘
                 │
        ┌────────▼────────────────────────┐
        │  Check Status Code              │
        │  ├─ 200: Success               │
        │  ├─ 401: Auto Logout           │
        │  └─ 5xx: Error handling        │
        └────────────────────────────────┘
```

This shows how the authentication middleware:

1. ✅ Manages user state persistently
2. ✅ Handles login/register/logout
3. ✅ Routes based on auth status
4. ✅ Provides auth context to all components
5. ✅ Adds auth headers to API calls
6. ✅ Validates and refreshes tokens
