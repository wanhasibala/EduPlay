# API Setup Guide

## Current Configuration

**Base URL:** `http://192.168.100.20` (Change to your server IP/domain)

## Public URLs (No Authentication Required)

These endpoints don't require a token:

```
POST   /api/users/login       - User login
POST   /api/users/register    - User registration
GET    /api/courses           - Get all courses (if public)
GET    /api/courses/:id       - Get course details (if public)
```

## Protected URLs (Require Authentication)

These endpoints require a valid token in the `Authorization` header:

```
GET    /api/courses/enrolled  - Get enrolled courses
GET    /api/user/profile      - Get user profile
PUT    /api/user/profile      - Update user profile
POST   /api/courses/:id/enroll - Enroll in a course
GET    /api/user/wishlist     - Get wishlist
POST   /api/wishlist/:id      - Add to wishlist
```

## How to Update the Base URL

Edit `/Users/mac/Mobile/Course/services/api.ts`:

```typescript
// Line 5 - Change to your backend URL
const API_BASE_URL = "http://192.168.100.20";

// For production:
// const API_BASE_URL = 'https://yourdomain.com';
```

## Token Handling

- **Token Storage:** Stored in `SecureStore` (encrypted)
- **Automatic Injection:** Token is automatically added to all requests via `prepareHeaders`
- **Token Refresh:** Handled by `doRefreshToken()` in auth context

## Making API Calls

### Using Redux Hooks (Recommended)

```tsx
import { useLoginMutation, useGetQuery } from "@/services/api";

// Login
const [login] = useLoginMutation();
const response = await login({ email, password }).unwrap();

// Get data with token
const { data } = useGetQuery({
  url: "/api/courses/enrolled",
});

// Create/Update/Delete
const [create] = useCreateMutation();
await create({
  url: "/api/wishlist",
  data: { courseId: 123 },
}).unwrap();
```

### Direct Fetch (Without Token)

```tsx
// Public endpoints only
const response = await fetch(
  'http://192.168.100.20/api/users/login',
  { method: 'POST', body: JSON.stringify({...}) }
);
```

## Testing the API

Use Postman or curl:

```bash
# Test login (public)
curl -X POST http://192.168.100.20/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Test protected endpoint (with token)
curl -X GET http://192.168.100.20/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues

| Issue                   | Solution                                               |
| ----------------------- | ------------------------------------------------------ |
| Connection refused      | Check if backend is running on 192.168.100.20:PORT     |
| 401 Unauthorized        | Token expired or missing - need to login/refresh       |
| CORS errors             | Backend needs to allow your mobile app domain          |
| `localhost` not working | Use actual IP (192.168.100.20) not localhost on phones |

## Environment Variables (Optional)

Create `.env` file in project root:

```
API_BASE_URL=http://192.168.100.20
API_VERSION=v1
```

Then import:

```typescript
import { API_BASE_URL } from "@env";
const API_BASE_URL = "http://192.168.100.20";
```
