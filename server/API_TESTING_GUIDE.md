# LMS-kinG API Testing Guide

## 🚀 Getting Started

### Prerequisites
1. MongoDB running on `mongodb://localhost:27017/lms-king`
2. Node.js and npm installed
3. Backend server running on `http://localhost:5000`

### Setup
```bash
# Install dependencies
npm install

# Seed the database with test data
npm run seed

# Start the server
npm run dev
```

## 📊 Test Data Overview

After running the seed script, you'll have:
- **5 Users**: 1 admin, 1 instructor, 3 students
- **5 Categories**: Web Development, Data Science, Mobile Development, Programming, Design
- **5 Courses**: All published with modules and lessons
- **Random Enrollments**: Students enrolled in various courses
- **Reviews**: 2-4 reviews per course
- **Notifications**: 3-5 notifications per user

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Instructor | jane@example.com | password123 |
| Student | john@example.com | password123 |
| Student | alice@example.com | password123 |
| Student | bob@example.com | password123 |

## 🧪 API Endpoints Testing

### 1. Authentication Endpoints

#### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get current user
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Course Endpoints

#### Get all courses (Public)
```bash
curl -X GET "http://localhost:5000/api/courses?page=1&limit=10&category=web-development"
```

#### Get featured courses
```bash
curl -X GET http://localhost:5000/api/courses/featured
```

#### Get course by ID
```bash
curl -X GET http://localhost:5000/api/courses/COURSE_ID
```

#### Create new course (Instructor/Admin only)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Course",
    "description": "Course description",
    "shortDescription": "Short description",
    "category": "web-development",
    "level": "beginner",
    "duration": 20,
    "price": 49.99,
    "thumbnail": "https://example.com/image.jpg",
    "tags": ["javascript", "react"],
    "requirements": ["Basic HTML knowledge"],
    "learningOutcomes": ["Learn React basics"]
  }'
```

#### Enroll in course (Student only)
```bash
curl -X POST http://localhost:5000/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Add course review (Student only)
```bash
curl -X POST http://localhost:5000/api/courses/COURSE_ID/reviews \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Great Course!",
    "comment": "This course was amazing and very helpful."
  }'
```

### 3. User Endpoints

#### Get user profile
```bash
curl -X GET http://localhost:5000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update user profile
```bash
curl -X PUT http://localhost:5000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "profile": {
      "bio": "Updated bio"
    }
  }'
```

#### Get all users (Admin only)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Dashboard Endpoints

#### Get user dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Get course progress
```bash
curl -X GET http://localhost:5000/api/dashboard/courses/COURSE_ID/progress \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

#### Update course progress
```bash
curl -X PUT http://localhost:5000/api/dashboard/courses/COURSE_ID/progress \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 75,
    "lessonId": "LESSON_ID"
  }'
```

#### Get admin dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/admin \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Get instructor dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/instructor \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN"
```

## 🔍 Testing Scenarios

### Scenario 1: Complete Student Journey
1. Register as a new student
2. Login and get JWT token
3. Browse available courses
4. Enroll in a course
5. Check dashboard for enrolled courses
6. Update course progress
7. Add a review for the course

### Scenario 2: Instructor Course Management
1. Login as instructor
2. Create a new course
3. Update course details
4. Check instructor dashboard
5. View course enrollments

### Scenario 3: Admin Management
1. Login as admin
2. View all users
3. Check admin dashboard statistics
4. Update user roles
5. View system-wide analytics

## 📝 Sample Test Data

### Sample Course Creation
```json
{
  "title": "Advanced JavaScript Concepts",
  "description": "Deep dive into advanced JavaScript concepts including closures, prototypes, async programming, and modern ES6+ features.",
  "shortDescription": "Master advanced JavaScript concepts and modern development practices",
  "category": "web-development",
  "level": "intermediate",
  "duration": 30,
  "price": 89.99,
  "originalPrice": 149.99,
  "thumbnail": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500",
  "tags": ["javascript", "es6", "async", "closures", "prototypes"],
  "requirements": [
    "Basic JavaScript knowledge",
    "Understanding of functions and objects",
    "Familiarity with HTML/CSS"
  ],
  "learningOutcomes": [
    "Understand closures and scope",
    "Master prototype-based inheritance",
    "Handle asynchronous operations",
    "Use modern ES6+ features effectively",
    "Debug complex JavaScript applications"
  ],
  "modules": [
    {
      "title": "Advanced Functions",
      "description": "Deep dive into function concepts",
      "order": 1,
      "isPublished": true,
      "lessons": [
        {
          "title": "Closures and Scope",
          "description": "Understanding JavaScript closures",
          "content": "Closures are a fundamental concept in JavaScript...",
          "duration": 45,
          "order": 1,
          "isFree": true
        }
      ]
    }
  ]
}
```

### Sample User Profile Update
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "profile": {
    "bio": "Passionate full-stack developer with 3 years of experience",
    "skills": ["JavaScript", "React", "Node.js", "Python"],
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "website": "https://johndoe.dev"
    }
  },
  "preferences": {
    "notifications": {
      "email": true,
      "push": true,
      "courseUpdates": true,
      "marketing": false
    }
  }
}
```

## 🚨 Error Testing

### Test Invalid Authentication
```bash
# Try to access protected route without token
curl -X GET http://localhost:5000/api/dashboard

# Try with invalid token
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer invalid_token"
```

### Test Validation Errors
```bash
# Try to create course with missing required fields
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Course"
  }'
```

### Test Authorization Errors
```bash
# Try to create course as student
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Unauthorized Course"}'
```

## 📈 Performance Testing

### Test Pagination
```bash
# Test with different page sizes
curl -X GET "http://localhost:5000/api/courses?page=1&limit=5"
curl -X GET "http://localhost:5000/api/courses?page=2&limit=10"
```

### Test Filtering and Search
```bash
# Filter by category
curl -X GET "http://localhost:5000/api/courses?category=web-development"

# Search courses
curl -X GET "http://localhost:5000/api/courses?q=javascript"

# Filter by price range
curl -X GET "http://localhost:5000/api/courses?minPrice=50&maxPrice=100"
```

## 🔧 Database Queries for Testing

### MongoDB Queries to Verify Data

```javascript
// Check users
db.users.find().pretty()

// Check courses
db.courses.find().pretty()

// Check enrollments
db.users.find({}, {enrolledCourses: 1}).pretty()

// Check reviews
db.reviews.find().pretty()

// Check notifications
db.notifications.find().pretty()
```

## 📱 Frontend Integration Testing

### Test with Frontend
1. Start the frontend application
2. Use the seeded credentials to login
3. Test the complete user flow:
   - Browse courses
   - Enroll in courses
   - View dashboard
   - Update progress
   - Add reviews

### Test API Integration
1. Verify that frontend API calls match the backend endpoints
2. Test error handling in the frontend
3. Verify authentication flow
4. Test real-time updates (if implemented)

## 🐛 Common Issues and Solutions

### Issue: "User not found" error
**Solution**: Make sure you're using the correct email from the seeded data

### Issue: "Course not found" error
**Solution**: Get the correct course ID from the database or API response

### Issue: "Not authorized" error
**Solution**: Ensure you're using the correct JWT token for the user's role

### Issue: Database connection error
**Solution**: Make sure MongoDB is running and the connection string is correct

## 📋 Testing Checklist

- [ ] Authentication (register, login, logout)
- [ ] Course CRUD operations
- [ ] User profile management
- [ ] Course enrollment
- [ ] Progress tracking
- [ ] Review system
- [ ] Dashboard functionality
- [ ] Admin features
- [ ] Instructor features
- [ ] Error handling
- [ ] Validation
- [ ] Authorization
- [ ] Pagination
- [ ] Search and filtering

## 🎯 Next Steps

1. Run the seed script to populate your database
2. Test all endpoints using the provided curl commands
3. Verify the frontend integration
4. Test error scenarios
5. Check performance with larger datasets
6. Implement additional features as needed

Happy Testing! 🚀
