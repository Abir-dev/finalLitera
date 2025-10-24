# Production API Configuration Fix

## Problem Identified
The production build was hitting `localhost:5001` instead of the production API URL (`https://finallitera.onrender.com`) because of a hardcoded configuration in `vite.config.js`.

## Root Cause
In `client/vite.config.js`, there was a `define` section that was **hardcoding** the `VITE_API_URL` environment variable:

```javascript
define: {
  'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5001/api')
}
```

This meant that even when you set `VITE_API_URL` in your production environment (Render), Vite was replacing it with localhost during the build process.

## Solution Applied
Removed the problematic `define` section from `vite.config.js`. Now the application will properly use:
1. The `VITE_API_URL` environment variable if set
2. Fall back to `https://finallitera.onrender.com/api` if not set (as defined in each service file)

## What You Need to Do

### 1. For Local Development
Create a `.env` file in the `client` directory (optional, since proxy will work):
```env
VITE_API_URL=http://localhost:5001/api
```

### 2. For Production (Render)
Make sure you have set the environment variable in your Render dashboard:
- Variable Name: `VITE_API_URL`
- Variable Value: `https://finallitera.onrender.com/api`

**Important:** After this fix, you MUST rebuild and redeploy your application for the changes to take effect.

### 3. Rebuild Your Production App
On Render, trigger a new deployment. The build will now properly use your production API URL.

## How It Works Now

### Local Development
- The Vite dev server proxy (still configured) will forward `/api` requests to `http://localhost:5001`
- If you set `VITE_API_URL`, it will use that instead

### Production Build
- Vite will use the `VITE_API_URL` environment variable you set in Render
- If not set, services will fall back to `https://finallitera.onrender.com/api`
- No more hardcoded localhost!

## Verification
After redeploying, check your browser's Network tab to confirm API requests are going to:
- ✅ `https://finallitera.onrender.com/api/*`
- ❌ NOT `http://localhost:5001/api/*`

## Files Modified
1. `client/vite.config.js` - Removed hardcoded `define` section
2. `client/.env.example` - Created for documentation

## Notes
- All your service files (`walletService.js`, `courseService.js`, etc.) are already properly configured with fallbacks
- The proxy configuration in `vite.config.js` only affects local development, not production builds
- Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code

