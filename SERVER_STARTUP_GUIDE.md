# 🚀 Server Startup Guide

## **Current Issue**: Server Not Running

You're seeing `ERR_CONNECTION_REFUSED` errors because the backend server is not running.

## **Quick Fix - Start the Server:**

### **Method 1: Use Batch File (Windows)**

1. Double-click `start-server.bat` in your project root
2. Wait for the server to start
3. Look for "✅ MongoDB Connected" message

### **Method 2: Manual Start**

1. Open a new terminal/command prompt
2. Navigate to server directory:
   ```bash
   cd server
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Wait for these messages:
   ```
   ✅ MongoDB Connected: localhost
   ✅ Admin account already exists: rahul12@gmail.com
   🚀 Server running on port 5001
   ```

### **Method 3: Use Node Script**

```bash
node start-server.js
```

## **What to Expect When Server Starts:**

### **Successful Startup Messages:**

```
✅ MongoDB Connected: localhost
✅ Admin account already exists: rahul12@gmail.com
🚀 Server running on port 5001
📊 LMS-kinG API is running
```

### **Server Health Check:**

Once started, test the server:

```bash
curl https://finallitera.onrender.com/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "LMS-kinG API is running 🚀",
  "timestamp": "2024-01-XX..."
}
```

## **After Server Starts:**

1. **Refresh your browser** or click the "Retry" button in the dashboard
2. **Login as admin**: `http://localhost:5173/admin/login`
3. **Access dashboard**: `http://localhost:5173/admin/dashboard`
4. **Should see real-time data** without connection errors

## **Troubleshooting:**

### **If MongoDB Connection Fails:**

- Make sure MongoDB is running
- Check your `.env` file for correct `MONGODB_URI`
- Default: `mongodb://localhost:27017/lms-king`

### **If Port 5001 is Busy:**

- Check if another process is using port 5001
- Kill the process or change the port in `.env`

### **If Admin Account Issues:**

- Check `.env` file for `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Default email: `rahul12@gmail.com`

### **If Dependencies Missing:**

```bash
cd server
npm install
```

## **Environment Variables (.env file):**

Make sure your `.env` file in the server directory has:

```env
MONGODB_URI=mongodb://localhost:27017/lms-king
ADMIN_EMAIL=rahul12@gmail.com
ADMIN_PASSWORD=your_password_here
PORT=5001
```

## **Default Admin Credentials:**

- **Email**: `rahul12@gmail.com`
- **Password**: Check your `.env` file for `ADMIN_PASSWORD`

## **API Endpoints Available After Server Start:**

- `GET /api/health` - Server health check
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/amin/activities` - Recent activities
- `GET /api/admin/dashboard/courses` - Top courses
- `GET /api/admin/students` - Student management

Once the server is running, your real-time dashboard will work perfectly with live data from the database!
