const fetch = require('node-fetch');

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    // Try to login with admin credentials
    const loginResponse = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    console.log(`Login status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful!');
      console.log('Token preview:', loginData.token ? loginData.token.substring(0, 20) + '...' : 'No token');
      
      // Test available courses endpoint with valid token
      console.log('\n📚 Testing available courses with valid token...');
      const coursesResponse = await fetch(`${API_BASE}/admin/courses/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      console.log(`Courses status: ${coursesResponse.status}`);
      
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('✅ Available courses endpoint working!');
        console.log(`Found ${coursesData.data.courses.length} courses:`);
        coursesData.data.courses.forEach(course => {
          console.log(`   - ${course.title} (${course.level}) - ₹${course.price}`);
        });
      } else {
        const errorData = await coursesResponse.json();
        console.log('❌ Available courses failed:', errorData);
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Admin login failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminLogin();
