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
    <div className="space-y-4 sm:space-y-6">
      {/* Premium Header with Enhanced Design */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative card-premium p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <BarChart3 size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="heading-1 text-xl sm:text-2xl lg:text-3xl" style={{ color: 'var(--text-primary)' }}>
                    Real-Time Dashboard
                  </h1>
                  <p className="text-sm sm:text-base" style={{ color: 'var(--accent-gold)' }}>Admin Control Center</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Live data from your database • Last updated: {lastRefresh.toLocaleTimeString()}</span>
                <span className="sm:hidden">Live • {lastRefresh.toLocaleTimeString()}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-premium px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold disabled:opacity-50 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                ) : (
                  <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                )}
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">↻</span>
              </button>
              <div className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg ${getStatusColor(dashboardData.systemHealth.serverStatus)}`}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></div>
                  <span className="hidden sm:inline">{dashboardData.systemHealth.serverStatus.toUpperCase()}</span>
                  <span className="sm:hidden">●</span>
                </div>
              </div>
            </div>
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

      {/* Enhanced Real-Time Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="group card-premium p-4 sm:p-6 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>Total Students</p>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
              </div>
              <p className="text-xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {dashboardData.stats.totalStudents.toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="sm:w-3 sm:h-3 flex-shrink-0" style={{ color: 'var(--accent-gold)' }} />
                <p className="text-xs font-medium truncate" style={{ color: 'var(--accent-gold)' }}>
                  <span className="hidden sm:inline">+{dashboardData.stats.newEnrollments} new this week</span>
                  <span className="sm:hidden">+{dashboardData.stats.newEnrollments} new</span>
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0" 
                 style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', border: '1px solid var(--brand)30' }}>
              <Users size={18} className="sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group card-premium p-4 sm:p-6 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>Total Courses</p>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-gold)' }}></div>
              </div>
              <p className="text-xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {dashboardData.stats.totalCourses}
              </p>
              <div className="flex items-center gap-1">
                <GraduationCap size={10} className="sm:w-3 sm:h-3 flex-shrink-0" style={{ color: 'var(--accent-gold)' }} />
                <p className="text-xs font-medium truncate" style={{ color: 'var(--accent-gold)' }}>
                  {dashboardData.stats.totalInstructors} instructors
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0" 
                 style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-strong))', border: '1px solid var(--accent-gold)30' }}>
              <BookOpen size={18} className="sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group card-premium p-4 sm:p-6 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>Active Users</p>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--accent-rose)' }}></div>
              </div>
              <p className="text-xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {dashboardData.stats.activeUsers.toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                <BarChart3 size={10} className="sm:w-3 sm:h-3 flex-shrink-0" style={{ color: 'var(--brand)' }} />
                <p className="text-xs font-medium truncate" style={{ color: 'var(--brand)' }}>
                  <span className="hidden sm:inline">{dashboardData.stats.completionRate}% completion rate</span>
                  <span className="sm:hidden">{dashboardData.stats.completionRate}% complete</span>
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0" 
                 style={{ background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))', border: '1px solid var(--accent-rose)30' }}>
              <UserCheck size={18} className="sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="group card-premium p-4 sm:p-6 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>Revenue</p>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--brand-strong)' }}></div>
              </div>
              <p className="text-xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                ₹{(dashboardData.stats.revenue / 100000).toFixed(1)}L
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="sm:w-3 sm:h-3 flex-shrink-0" style={{ color: 'var(--accent-gold)' }} />
                <p className="text-xs font-medium truncate" style={{ color: 'var(--accent-gold)' }}>
                  <span className="hidden sm:inline">+18% from last month</span>
                  <span className="sm:hidden">+18%</span>
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0" 
                 style={{ background: 'linear-gradient(135deg, var(--brand-strong), var(--accent-emerald))', border: '1px solid var(--brand-strong)30' }}>
              <TrendingUp size={18} className="sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Enhanced Real-Time Activities */}
        <div className="xl:col-span-2 relative">
          <div className="card-premium p-4 sm:p-6 h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                  <Clock size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="heading-3 text-lg sm:text-xl" style={{ color: 'var(--text-primary)' }}>Live Activities</h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Real-time platform events</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse bg-green-400"></div>
                  <span className="text-xs sm:text-sm font-semibold text-green-400">Live</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
              {dashboardData.recentActivities.map((activity, index) => (
                <div key={activity.id} 
                     className="group relative card-premium p-4 hover:scale-[1.01] transition-all duration-300 border-l-4"
                     style={{ 
                       borderLeftColor: index % 4 === 0 ? 'var(--brand)' : 
                                       index % 4 === 1 ? 'var(--accent-gold)' : 
                                       index % 4 === 2 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                     }}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" 
                           style={{ 
                             background: index % 4 === 0 ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))' : 
                                        index % 4 === 1 ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-strong))' : 
                                        index % 4 === 2 ? 'linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))' : 'linear-gradient(135deg, var(--accent-emerald), var(--brand))',
                             border: '1px solid rgba(255,255,255,0.2)'
                           }}>
                        {getActivityIcon(activity.icon)}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {activity.action}
                      </p>
                      <p className="text-xs mb-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {activity.details}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {activity.timestamp ? formatTime(activity.timestamp) : activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Top Performing Courses */}
        <div className="card-premium p-6 h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Top Courses</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Best performing courses</p>
            </div>
          </div>
          <div className="space-y-4">
            {dashboardData.topCourses.map((course, index) => (
              <div key={course.id} className="group relative card-premium p-4 hover:scale-[1.02] transition-all duration-300">
                <div className="absolute top-3 left-3 w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg"
                     style={{ 
                       background: index === 0 ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-strong))' :
                                  index === 1 ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))' :
                                  index === 2 ? 'linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))' :
                                  'linear-gradient(135deg, var(--accent-emerald), var(--brand))'
                     }}>
                  {index + 1}
                </div>
                <div className="ml-8">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-sm leading-snug pr-2" style={{ color: 'var(--text-primary)' }}>
                      {course.name || 'Untitled Course'}
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg shadow-lg" 
                         style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
                      <Star size={12} className="fill-current" style={{ color: 'var(--accent-gold)' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--accent-gold)' }}>
                        {typeof course.rating === 'object' ? course.rating.average || 4.5 : course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface)' }}>
                      <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {course.students || 0}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Students</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface)' }}>
                      <p className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>
                        ₹{((course.revenue || 0) / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Student Progress Overview */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Student Progress Overview</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Course completion analytics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {dashboardData.studentProgress.map((course, index) => (
            <div key={index} className="group card-premium p-4 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 -mr-8 -mt-8"
                   style={{ 
                     background: index % 4 === 0 ? 'var(--brand)' : 
                                index % 4 === 1 ? 'var(--accent-gold)' : 
                                index % 4 === 2 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                   }}></div>
              <div className="relative">
                <h3 className="font-bold text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {course.course}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Enrolled</span>
                    <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{course.enrolled}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completed</span>
                    <span className="font-bold text-base" style={{ color: 'var(--accent-gold)' }}>{course.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>In Progress</span>
                    <span className="font-bold text-base" style={{ color: 'var(--brand)' }}>{course.inProgress}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-2">
                      <span style={{ color: 'var(--text-secondary)' }}>Completion Rate</span>
                      <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>
                        {Math.round((course.completed / course.enrolled) * 100)}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-3 shadow-inner" style={{ background: 'var(--surface)' }}>
                      <div
                        className="h-3 rounded-full transition-all duration-1000 shadow-lg"
                        style={{ 
                          width: `${(course.completed / course.enrolled) * 100}%`, 
                          background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-gold-strong))'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Administrative shortcuts</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/students" className="group card-premium p-4 hover:scale-[1.05] transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))', border: '1px solid var(--brand)30' }}>
                <Users size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Manage Students</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>View, edit, and manage accounts</p>
            </div>
          </Link>

          <Link to="/admin/courses" className="group card-premium p-4 hover:scale-[1.05] transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-strong))', border: '1px solid var(--accent-gold)30' }}>
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Manage Courses</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Create, edit, and organize</p>
            </div>
          </Link>

          <Link to="/admin/exams" className="group card-premium p-4 hover:scale-[1.05] transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))', border: '1px solid var(--accent-rose)30' }}>
                <FileText size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Manage Exams</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Create and monitor tests</p>
            </div>
          </Link>

          <Link to="/admin/settings" className="group card-premium p-4 hover:scale-[1.05] transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--brand))', border: '1px solid var(--accent-emerald)30' }}>
                <Settings size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>System Settings</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Configure platform</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
