# 🔧 Admin Setup Guide - Fix 401 Unauthorized Error

## **Issue**: 401 Unauthorized Error when loading students

This error occurs because either:
1. The server is not running
2. No admin user exists in the system
3. The admin token is invalid/expired

## **Solution Steps:**

### **Step 1: Start the Server**
```bash
# Navigate to server directory
cd server

# Start the server
npm start
```

### **Step 2: Create an Admin User**
If you don't have an admin user yet, create one:

```bash
# Navigate to server directory
cd server

# Create an admin user
node add-admin.js admin@example.com password123 "Admin" "User"
```

**Replace the credentials with your own:**
- `admin@example.com` - Your admin email
- `password123` - Your admin password
- `"Admin"` - First name
- `"User"` - Last name

### **Step 3: Login as Admin**
1. Go to `http://localhost:5173/admin/login`
2. Use the credentials you created in Step 2
3. Login successfully

### **Step 4: Access Students Page**
1. After successful login, go to `http://localhost:5173/admin/students`
2. The students should now load without the 401 error

## **Troubleshooting:**

### **If you still get 401 errors:**

1. **Check if server is running:**
   - Server should be running on `http://localhost:5001`
   - Check console for any server errors

2. **Check admin token:**
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Check if `adminToken` exists in localStorage
   - If not, login again

3. **Verify admin user exists:**
   ```bash
   # List existing admins
   node list-admins.js
   ```

4. **Check server logs:**
   - Look for any authentication errors in server console
   - Check if admin routes are properly configured

### **Common Issues:**

- **MongoDB not running**: Make sure MongoDB is running
- **Wrong API URL**: Check if `VITE_API_URL` is set correctly
- **Token expired**: Login again to get a fresh token
- **Server not started**: Make sure to run `npm start` in server directory

## **Default Admin Credentials (if using default setup):**
- Email: `admin@example.com`
- Password: `password123`

## **API Endpoints:**
- Admin Login: `POST /api/admin/login`
- Get Students: `GET /api/admin/students`
- Student Progress: `GET /api/admin/students/:id/progress`

## **Need Help?**
If you're still having issues:
1. Check the browser console for detailed error messages
2. Check the server console for backend errors
3. Verify all environment variables are set correctly
4. Make sure all dependencies are installed (`npm install` in both client and server)
