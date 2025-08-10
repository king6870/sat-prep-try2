# 🔧 Google OAuth Port Fix

## 🚨 **Issue:** 
Your app is running on port 3001 but Google OAuth is configured for port 3000, causing the redirect URL mismatch.

## ✅ **Quick Fix:**

### **Option 1: Update Google OAuth Settings (Recommended)**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Navigate to "APIs & Services" > "Credentials"

2. **Find your OAuth 2.0 Client:**
   - Look for client ID: `50307876793-tpmb4m8iopq9gu8clgfa9n4egnmgtibj.apps.googleusercontent.com`

3. **Update Authorized Redirect URIs:**
   - **Add:** `http://localhost:3001/api/auth/callback/google`
   - **Keep existing:** `http://localhost:3000/api/auth/callback/google` (for backup)

4. **Save changes**

### **Option 2: Force Port 3000 (Alternative)**

Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev -p 3000"
  }
}
```

## 🎯 **Test the Fix:**

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Try signing in again** - should work without redirect errors

3. **Use the demo** - works without authentication:
   ```
   http://localhost:3001/demo
   ```

## 🎮 **Demo Test Fixes Applied:**

- ✅ **No duplicate questions** - Fixed randomization algorithm
- ✅ **Better shuffling** - Uses Fisher-Yates algorithm
- ✅ **Unique question detection** - Prevents repeats in same test
- ✅ **Improved question selection** - Better distribution

## 🚀 **Ready to Test:**

- **Demo (No login):** http://localhost:3001/demo
- **Full app (With login):** http://localhost:3001/

**The demo test now guarantees unique questions in each test session! 🎯**
