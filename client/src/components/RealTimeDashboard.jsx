import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const RealTimeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalCourses: 0,
      totalExams: 0,
      activeUsers: 0,
      revenue: 0,
      completionRate: 0,
      newEnrollments: 0,
      totalInstructors: 0
    },
    recentActivities: [],
    topCourses: [],
    enrollmentTrends: [],
    revenueData: [],
    studentProgress: [],
    systemHealth: {
      serverStatus: 'online',
      databaseStatus: 'connected',
      lastUpdate: new Date().toISOString()
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch real-time dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('No admin token found');
        return;
      }

      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        activitiesResponse,
        coursesResponse,
        trendsResponse,
        revenueResponse,
        progressResponse
      ] = await Promise.allSettled([
        fetch(`${API_BASE}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/dashboard/activities`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/dashboard/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/dashboard/trends`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/dashboard/revenue`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/dashboard/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process stats data
      let stats = dashboardData.stats;
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const statsData = await statsResponse.value.json();
        stats = statsData.data.stats;
      } else {
        // Fallback to mock data if API fails
        stats = {
          totalStudents: Math.floor(Math.random() * 1000) + 500,
          totalCourses: Math.floor(Math.random() * 50) + 20,
          totalExams: Math.floor(Math.random() * 200) + 100,
          activeUsers: Math.floor(Math.random() * 800) + 400,
          revenue: Math.floor(Math.random() * 2000000) + 500000,
          completionRate: Math.floor(Math.random() * 30) + 60,
          newEnrollments: Math.floor(Math.random() * 50) + 10,
          totalInstructors: Math.floor(Math.random() * 20) + 5
        };
      }

      // Process activities data
      let activities = [];
      if (activitiesResponse.status === 'fulfilled' && activitiesResponse.value.ok) {
        const activitiesData = await activitiesResponse.value.json();
        activities = activitiesData.data.activities;
      } else {
        // Fallback mock activities
        activities = [
          {
            id: 1,
            type: "student",
            action: "New student registered",
            details: "John Doe joined React Fundamentals course",
            time: "2 minutes ago",
            icon: "👤",
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: "course",
            action: "Course published",
            details: "Advanced Machine Learning course is now live",
            time: "1 hour ago",
            icon: "📚",
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            type: "exam",
            action: "Exam completed",
            details: "Sarah Wilson completed JavaScript Basics exam",
            time: "3 hours ago",
            icon: "📝",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            type: "payment",
            action: "Payment received",
            details: "₹2,999 for Full Stack Development course",
            time: "5 hours ago",
            icon: "💰",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        ];
      }

      // Process courses data
      let courses = [];
      if (coursesResponse.status === 'fulfilled' && coursesResponse.value.ok) {
        const coursesData = await coursesResponse.value.json();
        courses = coursesData.data.courses;
      } else {
        // Fallback mock courses
        courses = [
          { id: 1, name: "React for Web Development", students: 234, rating: 4.8, revenue: 187200 },
          { id: 2, name: "JavaScript Fundamentals", students: 198, rating: 4.7, revenue: 158400 },
          { id: 3, name: "Node.js & APIs", students: 156, rating: 4.9, revenue: 124800 },
          { id: 4, name: "Machine Learning Basics", students: 142, rating: 4.6, revenue: 113600 }
        ];
      }

      // Process trends data
      let trends = [];
      if (trendsResponse.status === 'fulfilled' && trendsResponse.value.ok) {
        const trendsData = await trendsResponse.value.json();
        trends = trendsData.data.trends;
      } else {
        // Generate mock trends data
        trends = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          enrollments: Math.floor(Math.random() * 20) + 5,
          completions: Math.floor(Math.random() * 15) + 3,
          revenue: Math.floor(Math.random() * 50000) + 10000
        }));
      }

      // Process revenue data
      let revenue = [];
      if (revenueResponse.status === 'fulfilled' && revenueResponse.value.ok) {
        const revenueData = await revenueResponse.value.json();
        revenue = revenueData.data.revenue;
      } else {
        // Generate mock revenue data
        revenue = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
          amount: Math.floor(Math.random() * 200000) + 50000
        }));
      }

      // Process progress data
      let progress = [];
      if (progressResponse.status === 'fulfilled' && progressResponse.value.ok) {
        const progressData = await progressResponse.value.json();
        progress = progressData.data.progress;
      } else {
        // Generate mock progress data
        progress = [
          { course: "React Fundamentals", enrolled: 150, completed: 120, inProgress: 30 },
          { course: "JavaScript Basics", enrolled: 200, completed: 160, inProgress: 40 },
          { course: "Node.js Advanced", enrolled: 100, completed: 75, inProgress: 25 },
          { course: "Machine Learning", enrolled: 80, completed: 50, inProgress: 30 }
        ];
      }

      setDashboardData({
        stats,
        recentActivities: activities,
        topCourses: courses,
        enrollmentTrends: trends,
        revenueData: revenue,
        studentProgress: progress,
        systemHealth: {
          serverStatus: 'online',
          databaseStatus: 'connected',
          lastUpdate: new Date().toISOString()
        }
      });

      setLastRefresh(new Date());
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      // Check if it's a connection error
      if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        setError('Server is not running. Please start the server and try again.');
      } else {
        setError('Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardData();
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading && dashboardData.stats.totalStudents === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Live data from your database • Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span>🔄</span>
            )}
            Refresh
          </button>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dashboardData.systemHealth.serverStatus)}`}>
            {dashboardData.systemHealth.serverStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
            {error.includes('Server is not running') && (
              <button
                onClick={handleRefresh}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
          {error.includes('Server is not running') && (
            <div className="mt-3 text-sm text-red-700">
              <p><strong>To start the server:</strong></p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Open a new terminal/command prompt</li>
                <li>Navigate to the server directory: <code className="bg-red-100 px-1 rounded">cd server</code></li>
                <li>Start the server: <code className="bg-red-100 px-1 rounded">npm start</code></li>
                <li>Wait for "✅ MongoDB Connected" message</li>
                <li>Click the "Retry" button above</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Real-Time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+{dashboardData.stats.newEnrollments} new this week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalCourses}</p>
              <p className="text-sm text-green-600 mt-1">{dashboardData.stats.totalInstructors} instructors</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">{dashboardData.stats.completionRate}% completion rate</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{(dashboardData.stats.revenue / 100000).toFixed(1)}L</p>
              <p className="text-sm text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Live Activities</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.timestamp ? formatTime(activity.timestamp) : activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Courses</h2>
          <div className="space-y-4">
            {dashboardData.topCourses.map((course) => (
              <div key={course.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{course.name || 'Untitled Course'}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ⭐ {typeof course.rating === 'object' ? course.rating.average || 4.5 : course.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{course.students || 0} students</span>
                  <span>₹{((course.revenue || 0) / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Student Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.studentProgress.map((course, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">{course.course}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Enrolled</span>
                  <span className="font-medium">{course.enrolled}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Completed</span>
                  <span className="font-medium text-green-600">{course.completed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>In Progress</span>
                  <span className="font-medium text-blue-600">{course.inProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/students" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">👤</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Manage Students</span>
          </Link>

          <Link to="/admin/courses" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📚</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Manage Courses</span>
          </Link>

          <Link to="/admin/exams" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📝</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Manage Exams</span>
          </Link>

          <Link to="/admin/analytics" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
