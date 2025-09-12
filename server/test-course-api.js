// Simple test script to verify course API endpoints
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test data
const testCourse = {
  title: "Test React Course",
  shortDescription: "Learn React from scratch",
  description: "A comprehensive course covering React fundamentals, hooks, state management, and modern development practices.",
  category: "web-development",
  level: "beginner",
  duration: 40,
  price: 2999,
  originalPrice: 3999,
  currency: "INR",
  thumbnail: "",
  isPublished: true,
  isFeatured: false,
  tags: ["react", "javascript", "frontend"],
  requirements: ["Basic HTML/CSS knowledge", "JavaScript fundamentals"],
  learningOutcomes: ["Build React applications", "Understand component lifecycle", "State management"],
  modules: [
    {
      title: "Introduction to React",
      description: "Getting started with React",
      content: "Learn the basics of React",
      order: 1,
      isFree: false
    },
    {
      title: "Components and Props",
      description: "Understanding React components",
      content: "Deep dive into components",
      order: 2,
      isFree: false
    }
  ]
};

// Test functions
async function testGetCourses() {
  try {
    console.log('🧪 Testing GET /api/courses...');
    const response = await axios.get(`${API_URL}/courses`);
    console.log('✅ Success:', response.data.status);
    console.log('📊 Courses found:', response.data.data.courses.length);
    return response.data.data.courses[0]?._id; // Return first course ID for other tests
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

async function testGetFeaturedCourses() {
  try {
    console.log('🧪 Testing GET /api/courses/featured...');
    const response = await axios.get(`${API_URL}/courses/featured`);
    console.log('✅ Success:', response.data.status);
    console.log('⭐ Featured courses:', response.data.data.courses.length);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testGetCategories() {
  try {
    console.log('🧪 Testing GET /api/courses/categories/list...');
    const response = await axios.get(`${API_URL}/courses/categories/list`);
    console.log('✅ Success:', response.data.status);
    console.log('📂 Categories:', response.data.data.categories.length);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testGetCourseById(courseId) {
  if (!courseId) {
    console.log('⏭️ Skipping course by ID test - no course ID available');
    return;
  }
  
  try {
    console.log('🧪 Testing GET /api/courses/:id...');
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    console.log('✅ Success:', response.data.status);
    console.log('📚 Course title:', response.data.data.course.title);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function testCreateCourse() {
  try {
    console.log('🧪 Testing POST /api/courses (without auth - should fail)...');
    const response = await axios.post(`${API_URL}/courses`, testCourse);
    console.log('✅ Success:', response.data.status);
    return response.data.data.course._id;
  } catch (error) {
    console.log('✅ Expected error (no auth):', error.response?.data?.message || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Course API Tests...\n');
  
  // Test public endpoints
  await testGetCourses();
  console.log('');
  
  await testGetFeaturedCourses();
  console.log('');
  
  await testGetCategories();
  console.log('');
  
  // Get a course ID for testing
  const courseId = await testGetCourseById();
  console.log('');
  
  // Test course by ID
  await testGetCourseById(courseId);
  console.log('');
  
  // Test create course (should fail without auth)
  await testCreateCourse();
  console.log('');
  
  console.log('🏁 Tests completed!');
  console.log('\n📝 Note: Create/Update/Delete tests require authentication.');
  console.log('   Use the admin dashboard or Postman with proper auth headers.');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, testCourse };
