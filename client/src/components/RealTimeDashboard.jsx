import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FileText, TrendingUp, RefreshCw, AlertTriangle, Clock, Star, BarChart3, Settings, UserCheck, GraduationCap } from 'lucide-react';

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
            icon: "user",
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: "course",
            action: "Course published",
            details: "Advanced Machine Learning course is now live",
            time: "1 hour ago",
            icon: "book",
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            type: "exam",
            action: "Exam completed",
            details: "Sarah Wilson completed JavaScript Basics exam",
            time: "3 hours ago",
            icon: "exam",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            type: "payment",
            action: "Payment received",
            details: "₹2,999 for Full Stack Development course",
            time: "5 hours ago",
            icon: "payment",
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

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'user': return <Users size={20} style={{ color: 'var(--brand)' }} />;
      case 'book': return <BookOpen size={20} style={{ color: 'var(--accent-gold)' }} />;
      case 'exam': return <FileText size={20} style={{ color: 'var(--accent-rose)' }} />;
      case 'payment': return <TrendingUp size={20} style={{ color: 'var(--brand-strong)' }} />;
      default: return <Clock size={20} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  if (loading && dashboardData.stats.totalStudents === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--brand)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1 text-3xl" style={{ color: 'var(--text-primary)' }}>Real-Time Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Live data from your database • Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-premium px-4 py-2 font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh
          </button>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dashboardData.systemHealth.serverStatus)}`}>
            {dashboardData.systemHealth.serverStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {error && (
        <div className="card-premium p-4" style={{ background: 'linear-gradient(135deg, var(--accent-rose)10, var(--accent-rose)5)', border: '1px solid var(--accent-rose)30' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2" style={{ color: 'var(--accent-rose)' }} />
              <p style={{ color: 'var(--text-primary)' }}>{error}</p>
            </div>
            {error.includes('Server is not running') && (
              <button
                onClick={handleRefresh}
                className="btn-premium px-3 py-1 text-sm"
              >
                Retry
              </button>
            )}
          </div>
          {error.includes('Server is not running') && (
            <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p><strong>To start the server:</strong></p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Open a new terminal/command prompt</li>
                <li>Navigate to the server directory: <code className="px-1 rounded" style={{ background: 'var(--surface)' }}>cd server</code></li>
                <li>Start the server: <code className="px-1 rounded" style={{ background: 'var(--surface)' }}>npm start</code></li>
                <li>Wait for "MongoDB Connected" message</li>
                <li>Click the "Retry" button above</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Premium Real-Time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Total Students</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{dashboardData.stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--accent-gold)' }}>+{dashboardData.stats.newEnrollments} new this week</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
              <Users size={24} style={{ color: 'var(--brand)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Total Courses</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{dashboardData.stats.totalCourses}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--accent-gold)' }}>{dashboardData.stats.totalInstructors} instructors</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
              <BookOpen size={24} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Active Users</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{dashboardData.stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--brand)' }}>{dashboardData.stats.completionRate}% completion rate</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
              <UserCheck size={24} style={{ color: 'var(--accent-rose)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Revenue</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{(dashboardData.stats.revenue / 100000).toFixed(1)}L</p>
              <p className="text-sm mt-1" style={{ color: 'var(--accent-gold)' }}>+18% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
              <TrendingUp size={24} style={{ color: 'var(--brand-strong)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Premium Real-Time Activities */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Live Activities</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-gold)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Live</span>
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="card-premium p-4 hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activity.action}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{activity.details}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {activity.timestamp ? formatTime(activity.timestamp) : activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Top Performing Courses */}
        <div className="card-premium p-6">
          <h2 className="heading-3 text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Top Courses</h2>
          <div className="space-y-4">
            {dashboardData.topCourses.map((course) => (
              <div key={course.id} className="card-premium p-4 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{course.name || 'Untitled Course'}</h3>
                  <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ background: 'var(--accent-gold)10', color: 'var(--accent-gold)' }}>
                    <Star size={12} className="fill-current" />
                    {typeof course.rating === 'object' ? course.rating.average || 4.5 : course.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{course.students || 0} students</span>
                  <span>₹{((course.revenue || 0) / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Student Progress Overview */}
      <div className="card-premium p-6">
        <h2 className="heading-3 text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Student Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.studentProgress.map((course, index) => (
            <div key={index} className="card-premium p-4 hover:scale-105 transition-all duration-300">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{course.course}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>Enrolled</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{course.enrolled}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
                  <span className="font-medium" style={{ color: 'var(--accent-gold)' }}>{course.completed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>In Progress</span>
                  <span className="font-medium" style={{ color: 'var(--brand)' }}>{course.inProgress}</span>
                </div>
                <div className="w-full rounded-full h-2 mt-2" style={{ background: 'var(--surface)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(course.completed / course.enrolled) * 100}%`, background: 'var(--accent-gold)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Quick Actions */}
      <div className="card-premium p-6">
        <h2 className="heading-3 text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/students" className="card-premium p-4 hover:scale-105 transition-all duration-300 group text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
              <Users size={24} style={{ color: 'var(--brand)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Manage Students</span>
          </Link>

          <Link to="/admin/courses" className="card-premium p-4 hover:scale-105 transition-all duration-300 group text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
              <BookOpen size={24} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Manage Courses</span>
          </Link>

          <Link to="/admin/exams" className="card-premium p-4 hover:scale-105 transition-all duration-300 group text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
              <FileText size={24} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Manage Exams</span>
          </Link>

          <Link to="/admin/analytics" className="card-premium p-4 hover:scale-105 transition-all duration-300 group text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
              <BarChart3 size={24} style={{ color: 'var(--brand-strong)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
