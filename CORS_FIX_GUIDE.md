# 🔧 CORS Fix Guide

## 🚨 **Issue**: CORS Policy Errors
You're seeing CORS (Cross-Origin Resource Sharing) errors because the backend server needs to be configured to allow requests from your frontend.

## ✅ **What I've Fixed**

### **1. Enhanced CORS Configuration**
- Updated `server/server.js` with robust CORS handling
- Added multiple allowed origins (localhost:5173, localhost:3000, https://litera.in, https://www.litera.in, etc.)
- Enhanced preflight request handling
- Added CORS headers middleware for all responses

### **2. Server Configuration**
The server now properly handles:
- ✅ Preflight OPTIONS requests
- ✅ Credentials (cookies, authorization headers)
- ✅ Multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ✅ Required headers (Content-Type, Authorization, etc.)

## 🚀 **Steps to Fix**

### **Step 1: Create Environment File**
Create a `.env` file in the `server` directory with this content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lms-king

# Server Configuration
PORT=5001
NODE_ENV=development

# Client Configuration
CLIENT_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=rahul12@gmail.com
ADMIN_PASSWORD=admin123

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### **Step 2: Restart the Server**
The server needs to be restarted to apply the CORS changes:

**Option A - Use the batch file:**
```bash
# Stop the current server (Ctrl+C)
# Then run:
start-server.bat
```

**Option B - Manual restart:**
```bash
cd server
npm start
```

### **Step 3: Verify the Fix**
After restarting, you should see:
```
✅ MongoDB Connected: localhost
✅ Admin account already exists: rahul12@gmail.com
🚀 Server running on port 5001
📚 LMS-kinG Backend API ready!
🌍 Environment: development
```

## 🔍 **Testing the Fix**

### **1. Test CORS with Browser DevTools**
1. Open your browser's Developer Tools (F12)
2. Go to the Network tab
3. Refresh the admin dashboard page
4. Look for the API calls - they should now succeed (status 200)

### **2. Test API Endpoints Directly**
You can test the API endpoints directly:

```bash
# Test health endpoint
curl https://finallitera.onrender.com/api/health

# Test admin dashboard stats (with proper headers)
curl -H "Origin: http://localhost:5173" \
     -H "Content-Type: application/json" \
     https://finallitera.onrender.com/api/admin/dashboard/stats
```

## 🛠️ **Troubleshooting**

### **If CORS errors persist:**

1. **Check if server is running:**
   ```bash
   curl https://finallitera.onrender.com/api/health
   ```

2. **Clear browser cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

3. **Check server logs:**
   - Look for CORS-related messages in the server console
   - Check for any error messages

4. **Verify environment variables:**
   - Make sure `.env` file exists in `server` directory
   - Check that `CLIENT_URL=http://localhost:5173`

### **Common Issues:**

- **Server not running**: Start the server with `npm start` in the server directory
- **Wrong port**: Make sure frontend is on port 5173 and backend on port 5001
- **Environment file missing**: Create the `.env` file as shown above
- **Browser cache**: Clear cache and hard refresh

## 🎯 **Expected Result**

After applying this fix:
- ✅ No more CORS errors in browser console
- ✅ Admin dashboard loads with real-time data
- ✅ All API endpoints work properly
- ✅ Edit student functionality works
- ✅ Progress reports load correctly

## 📝 **Technical Details**

The CORS configuration now includes:
- **Dynamic origin checking**: Allows multiple localhost variations
- **Preflight handling**: Properly handles OPTIONS requests
- **Credential support**: Allows cookies and authorization headers
- **Comprehensive headers**: Includes all necessary headers for API calls
- **Error logging**: Logs blocked origins for debugging

The server will now properly handle cross-origin requests from your React frontend!
