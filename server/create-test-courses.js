import mongoose from 'mongoose';
import Course from './models/Course.js';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-king');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestCourses = async () => {
  try {
    // Find an admin to use as instructor
    const admin = await Admin.findOne();
    if (!admin) {
      console.log('No admin found. Please create an admin first.');
      return;
    }

    console.log(`Using admin ${admin.firstName} ${admin.lastName} as instructor`);

    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log(`Found ${existingCourses} existing courses. Skipping creation.`);
      return;
    }

    // Create test courses
    const testCourses = [
      {
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
        shortDescription: "Web development basics",
        instructor: admin._id,
        category: "programming",
        level: "beginner",
        language: "English",
        duration: "10:30:00",
        price: 999,
        originalPrice: 1999,
        currency: "INR",
        thumbnail: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Web+Development",
        videos: ["https://example.com/video1.mp4"],
        tags: ["html", "css", "javascript", "web"],
        requirements: ["Basic computer knowledge", "Internet connection"],
        learningOutcomes: ["Build responsive websites", "Understand web technologies", "Create interactive pages"],
        isPublished: true,
        isFeatured: true,
        isLaunchPad: false,
        schedule: {
          isSelfPaced: true,
          liveSessions: []
        }
      },
      {
        title: "Advanced React Development",
        description: "Master React.js with hooks, context, and advanced patterns for building scalable applications.",
        shortDescription: "Advanced React concepts",
        instructor: admin._id,
        category: "programming",
        level: "intermediate",
        language: "English",
        duration: "15:45:00",
        price: 1499,
        originalPrice: 2999,
        currency: "INR",
        thumbnail: "https://via.placeholder.com/300x200/059669/FFFFFF?text=React+Advanced",
        videos: ["https://example.com/react1.mp4", "https://example.com/react2.mp4"],
        tags: ["react", "javascript", "hooks", "context"],
        requirements: ["Basic JavaScript knowledge", "HTML/CSS experience"],
        learningOutcomes: ["Build complex React apps", "Use advanced patterns", "Optimize performance"],
        isPublished: true,
        isFeatured: false,
        isLaunchPad: false,
        schedule: {
          isSelfPaced: true,
          liveSessions: []
        }
      },
      {
        title: "Python for Data Science",
        description: "Learn Python programming for data analysis, visualization, and machine learning.",
        shortDescription: "Python data science course",
        instructor: admin._id,
        category: "data-science",
        level: "beginner",
        language: "English",
        duration: "20:00:00",
        price: 1999,
        originalPrice: 3999,
        currency: "INR",
        thumbnail: "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Python+Data+Science",
        videos: ["https://example.com/python1.mp4", "https://example.com/python2.mp4", "https://example.com/python3.mp4"],
        tags: ["python", "data-science", "pandas", "numpy", "matplotlib"],
        requirements: ["Basic programming knowledge", "Mathematics background"],
        learningOutcomes: ["Analyze data with Python", "Create visualizations", "Build ML models"],
        isPublished: true,
        isFeatured: true,
        isLaunchPad: false,
        schedule: {
          isSelfPaced: true,
          liveSessions: []
        }
      }
    ];

    const createdCourses = await Course.insertMany(testCourses);
    console.log(`✅ Created ${createdCourses.length} test courses:`);
    
    createdCourses.forEach(course => {
      console.log(`   - ${course.title} (${course.level}) - ₹${course.price}`);
    });

    console.log('\n🎉 Test courses created successfully!');
    console.log('You can now test the course assignment functionality.');

  } catch (error) {
    console.error('Error creating test courses:', error);
  }
};

const main = async () => {
  await connectDB();
  await createTestCourses();
  await mongoose.connection.close();
  console.log('Database connection closed.');
};

main().catch(console.error);
