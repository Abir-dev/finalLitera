const fetch = require('node-fetch');

const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth but should not give 500 error
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.log(`   ✅ ${description} - Accessible (401 Unauthorized is expected without valid token)`);
    } else if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ ${description} - Working!`);
      if (data.data) {
        console.log(`   📊 Data:`, JSON.stringify(data.data, null, 2));
      }
    } else {
      console.log(`   ⚠️ ${description} - Returned: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if (error.message.includes('500')) {
      console.log(`   ❌ ${description} - Server Error (500): ${error.message}`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(`   ❌ ${description} - Connection Refused: Server not running`);
    } else {
      console.log(`   ❌ ${description} - Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Server Endpoint Tests...\n');
  
  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testEndpoint('/health', 'Health Check');
  await testEndpoint('/admin/courses/test', 'Courses Test Endpoint');
  await testEndpoint('/admin/courses/available', 'Available Courses Endpoint');
  
  console.log('\n✅ Tests completed!');
  console.log('\n📋 Expected Results:');
  console.log('   - Health Check: Should work (200 or 401)');
  console.log('   - Courses Test: Should work (200 or 401) - shows if Course model works');
  console.log('   - Available Courses: Should work (200 or 401) - shows if the fix worked');
  console.log('\n❌ If any endpoint returns 500, there\'s still an issue to fix.');
}

runTests().catch(console.error);
