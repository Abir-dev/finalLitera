# LMS-kinG Backend API

A comprehensive Learning Management System backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Student, Instructor, Admin)
  - Password hashing with bcrypt
  - Email verification support

- **Course Management**
  - Create, read, update, delete courses
  - Course enrollment system
  - Progress tracking
  - Reviews and ratings
  - Course categories and search

- **User Management**
  - User profiles and preferences
  - Enrollment tracking
  - Learning progress analytics
  - Dashboard for different user roles

- **Security Features**
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers
  - Password strength requirements

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lms-king
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your system
   - Atlas: Use your MongoDB Atlas connection string

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/:id/courses` - Get user's enrolled courses

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/reviews` - Add course review

### Dashboard
- `GET /api/dashboard` - Get user dashboard
- `GET /api/dashboard/courses/:id/progress` - Get course progress
- `PUT /api/dashboard/courses/:id/progress` - Update course progress
- `GET /api/dashboard/admin` - Admin dashboard
- `GET /api/dashboard/instructor` - Instructor dashboard

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **Student**: Can enroll in courses, track progress, leave reviews
- **Instructor**: Can create and manage courses, view analytics
- **Admin**: Full system access, user management, analytics

## 🗄️ Database Models

### User Model
- Personal information (name, email, password)
- Role-based permissions
- Course enrollments and progress
- Profile and preferences

### Course Model
- Course details (title, description, price)
- Modules and lessons structure
- Reviews and ratings
- Enrollment tracking

## 🧪 Testing

Run the seed script to populate the database with test data:

```bash
npm run seed
```

**Test Accounts:**
- Admin: `admin@lms-king.com` / `admin123`
- Instructor: `michael.johnson@example.com` / `password123`
- Student: `john.doe@example.com` / `password123`

## 📊 Sample Data

The seed script creates:
- 5 users (1 admin, 2 instructors, 2 students)
- 4 sample courses with modules and lessons
- Course enrollments and reviews
- Realistic test data for development

## 🔧 Development

### Project Structure
```
server/
├── config/          # Database configuration
├── middleware/      # Authentication and validation middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── scripts/         # Database seeding scripts
├── utils/           # Utility functions
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update MongoDB URI for production database
3. Set secure JWT secret
4. Configure CORS for your frontend domain
5. Use a process manager like PM2 for production

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/lms-king` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
