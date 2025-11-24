# 🔐 Authentication & Profile System Guide

## Overview

I've added a complete **Login/Signup system** and **Profile page** to SentinelGRC!

---

## ✨ What's New

### 1. **Login Page** (`/login`)
- Beautiful branded login form
- Email + password fields
- "Forgot password?" link
- Link to signup page
- **Demo mode**: Accept ANY email/password for testing
- Persists login state to localStorage

**Try it:**
```
Email: demo@sentinelgrc.com
Password: password123
```
(Or literally any email/password works!)

---

### 2. **Signup Page** (`/signup`)
- Full name, email, password, confirm password
- Password validation (min 6 characters)
- Password match validation
- Auto-login after signup
- Links to Terms of Service & Privacy Policy

---

### 3. **Profile Page** (`/profile`)
Located at the top-right avatar → Click it!

**Features:**
- **Avatar with initials** (e.g., "Alex Davis" → "AD")
- **Profile card** showing:
  - Name, email, role, department
  - Member since date
  - User ID
- **3 Tabs:**
  - **General**: Edit name, email, role, department
  - **Security**: Change password, 2FA, active sessions
  - **Preferences**: Email notifications, timezone, date format
- **Sign Out** button

**Edit mode:**
1. Click "Edit Profile"
2. Change any fields
3. Click "Save Changes"
4. Updates persist to localStorage

---

### 4. **User Dropdown Menu** (Topbar)
Click the avatar in top-right corner:
- **Profile**: Go to profile page
- **Settings**: Also goes to profile page
- **Sign Out**: Logout and redirect to login

---

### 5. **Improved "Simulate Audit" Button**

#### What It Does Now:
The button **runs a real-time compliance audit** across your actual data:

**Calculations:**
1. Counts **critical risks** (score ≥ 20) from Risk Register
2. Calculates **compliance score** from implemented ISO controls
3. Checks for **pending controls**
4. Generates a **real audit report**

**Example Outputs:**

✅ **If everything is good:**
```
✅ Audit Complete! 95% compliance score
No issues found
```

⚠️ **If there are issues:**
```
⚠️ Audit Complete - 65% compliance score
3 critical risks • 35% controls pending
```

🔴 **If things are bad:**
```
⚠️ Audit Complete - 40% compliance score
5 critical risks • 60% controls pending
```

**How to test it:**
1. Go to Risk Register → Add some high-risk items (Likelihood 5, Impact 5)
2. Go to ISO Controls → Mark some as implemented
3. Click "Simulate Audit" in topbar
4. See your REAL compliance score!

---

## 🔄 Authentication Flow

### Current State (Demo Mode)
- **Auto-logged in** as "Alex Davis" on first load
- Can log out and log back in
- Any email/password accepted for demo

### For Production (Future)
You would replace the mock login with a real API:

```typescript
// In store/auth-store.ts
login: async (email: string, password: string) => {
  // Replace this mock with real API call:
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const user = await response.json();
  set({ user, isAuthenticated: true });
}
```

---

## 📊 State Management

### Auth Store (`store/auth-store.ts`)

```typescript
useAuthStore() // Access from any component

// Available methods:
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  login(),           // Login function
  signup(),          // Signup function
  logout(),          // Logout function
  updateProfile()    // Update user data
} = useAuthStore();
```

**User Object Structure:**
```typescript
{
  id: "usr-001",
  name: "Alex Davis",
  email: "alex.davis@sentinelgrc.com",
  role: "Compliance Manager",
  department: "Security & Compliance",
  createdAt: Date
}
```

**Storage:** Persists to `localStorage` under key `sentinel-auth-storage`

---

## 🎨 UI Components Added

### Dropdown Menu
The avatar now opens a dropdown menu with:
- User name & email display
- Profile link
- Settings link
- Sign out button (red)

**Component:** `components/ui/dropdown-menu.tsx`

### Profile Tabs
Three-tab interface for managing account:
- General settings (editable)
- Security settings (placeholders)
- Preferences (notification settings)

---

## 🚀 Routes Added

| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/signup` | Signup page |
| `/profile` | User profile & settings |

**Middleware:** `middleware.ts` handles auth redirects (currently allows all for demo)

---

## 🧪 Testing the Features

### Test Login Flow:
1. Go to `/login`
2. Enter any email/password
3. Click "Sign In"
4. Redirects to `/dashboard`
5. See your name in top-right avatar

### Test Profile:
1. Click avatar in top-right
2. Click "Profile"
3. Click "Edit Profile"
4. Change your name to "Jane Smith"
5. Click "Save Changes"
6. Refresh page → name persists!
7. Check avatar → now shows "JS"

### Test Logout:
1. Click avatar
2. Click "Sign Out"
3. Redirects to `/login`
4. Try logging back in

### Test Simulate Audit (IMPROVED):
1. Go to `/risk-register`
2. Click "Load Demo Data" (if not loaded)
3. Return to `/dashboard`
4. Click "Simulate Audit" in topbar
5. Wait 2.5 seconds
6. See **REAL** audit results based on your data!

---

## 💡 Pro Tips

### Customizing Default User
Edit `store/auth-store.ts`:

```typescript
const mockUser: User = {
  id: 'usr-001',
  name: 'YOUR NAME HERE', // Change this
  email: 'your@email.com', // Change this
  role: 'CISO', // Change this
  department: 'Security', // Change this
  createdAt: new Date(),
};
```

### Adding Real Password Validation
In production, add password strength rules:

```typescript
// In signup page
const validatePassword = (pwd: string) => {
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*]/.test(pwd);
  
  return hasUpper && hasLower && hasNumber && hasSpecial;
};
```

### Avatar with Actual Photos
Add image upload and update Avatar component:

```typescript
<Avatar>
  {user.avatar ? (
    <AvatarImage src={user.avatar} />
  ) : (
    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
  )}
</Avatar>
```

---

## 🔒 Security Best Practices (For Production)

### 1. Store Tokens, Not Passwords
```typescript
// Bad: storing password
localStorage.setItem('password', password);

// Good: storing JWT token
localStorage.setItem('auth_token', jwtToken);
```

### 2. Use HTTP-only Cookies
```typescript
// Set cookie on server-side
response.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

### 3. Implement Token Refresh
```typescript
// Check token expiry
if (isTokenExpired(token)) {
  const newToken = await refreshToken();
  updateAuthToken(newToken);
}
```

### 4. Add Password Reset Flow
- Email verification
- Secure token generation
- Time-limited reset links

---

## 🎯 What This Adds to Your Demo

### Before:
- ❌ Just an avatar icon
- ❌ No user context
- ❌ Generic audit button

### After:
- ✅ Full login/signup flow
- ✅ User profile with real data
- ✅ Editable user settings
- ✅ Logout functionality
- ✅ Smart audit that reads your actual data
- ✅ Professional dropdown menu
- ✅ Avatar with initials
- ✅ Persistent authentication

---

## 📝 Summary

You now have a **complete authentication system** with:
- Login & Signup pages
- Profile management
- User dropdown menu
- Persistent state
- Improved audit functionality that actually reads your data

**Try it now:**
```bash
npm run dev
```

1. Visit http://localhost:3000
2. You'll see you're logged in as "Alex Davis"
3. Click the avatar → see dropdown
4. Go to Profile → edit your info
5. Click "Simulate Audit" → see REAL results based on your risks/controls!

---

**Everything is functional and ready to impress! 🚀**


