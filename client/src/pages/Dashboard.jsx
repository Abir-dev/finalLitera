import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import profileService from "../services/profileService.js";
import { BookOpen, CheckCircle, Award, TrendingUp, Clock, Users, Star, Play, Target, Brain, Zap, Briefcase } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load user stats
        const statsResponse = await profileService.getUserStats();
        setStats(statsResponse.stats);
        
        // Load recent activity
        const activityResponse = await profileService.getRecentActivity();
        setRecentActivity(activityResponse.activities || []);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to mock data if API fails
        setStats({
          enrolledCourses: 1,
          completedCourses: 0,
          certificates: 0,
          averageProgress: 0
        });
        setRecentActivity([
          {
            id: 1,
            type: 'course_completed',
            title: 'Completed JavaScript Fundamentals',
            description: 'Finished the complete JavaScript course',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: 'book',
            color: 'var(--brand)'
          },
          {
            id: 2,
            type: 'quiz_completed',
            title: 'Quiz: React Basics - 85%',
            description: 'Scored 85% on React fundamentals quiz',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            icon: 'check',
            color: 'var(--accent-gold)'
          },
          {
            id: 3,
            type: 'course_started',
            title: 'Started Node.js Course',
            description: 'Began learning Node.js backend development',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            icon: 'target',
            color: 'var(--accent-rose)'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'book': return BookOpen;
      case 'check': return CheckCircle;
      case 'target': return Target;
      case 'award': return Award;
      case 'trending': return TrendingUp;
      default: return BookOpen;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="container-premium">
      {/* Premium Welcome Section */}
      <div className="card-premium p-8 mb-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse-float"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse-float animation-delay-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '2px solid var(--brand)30'
              }}>
                <img 
                  src={user?.avatar || "/icons/profile.svg"} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl border-2 border-white/20" 
                />
                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="text-xs font-semibold text-green-400">Active</span>
                </div>
              </div>
              <p className="text-lg mb-2 text-blue-400 font-medium">
                {user?.email}
              </p>
              <p className="text-base text-gray-300">
                Here's what's happening with your learning journey today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-premium p-6 group hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2 text-gray-400">Active Courses</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-600/50 rounded animate-pulse"></div>
                  ) : (
                    stats?.enrolledCourses || 0
                  )}
                </p>
                <p className="text-xs text-green-400 mt-1">+2 this month</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '1px solid var(--brand)30'
              }}>
                <BookOpen size={28} style={{ color: 'var(--brand)' }} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2 text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-600/50 rounded animate-pulse"></div>
                  ) : (
                    stats?.completedCourses || 0
                  )}
                </p>
                <p className="text-xs text-yellow-400 mt-1">Great progress!</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
                border: '1px solid var(--accent-gold)30'
              }}>
                <CheckCircle size={28} style={{ color: 'var(--accent-gold)' }} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2 text-gray-400">Certificates</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-600/50 rounded animate-pulse"></div>
                  ) : (
                    stats?.certificates || 0
                  )}
                </p>
                <p className="text-xs text-pink-400 mt-1">Keep earning!</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
                border: '1px solid var(--accent-rose)30'
              }}>
                <Award size={28} style={{ color: 'var(--accent-rose)' }} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2 text-gray-400">Avg Progress</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-600/50 rounded animate-pulse"></div>
                  ) : (
                    `${stats?.averageProgress || 0}%`
                  )}
                </p>
                <p className="text-xs text-purple-400 mt-1">On track!</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)',
                border: '1px solid var(--brand-strong)30'
              }}>
                <TrendingUp size={28} style={{ color: 'var(--brand-strong)' }} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Recent Activity */}
      <div className="card-premium p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
            border: '1px solid var(--brand)30'
          }}>
            <Clock size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const IconComponent = getActivityIcon(activity.icon);
            return (
              <div key={activity.id} className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
                    background: `linear-gradient(135deg, ${activity.color}20, ${activity.color}10)`,
                    border: `1px solid ${activity.color}30`
                  }}>
                    <IconComponent size={24} style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                      {activity.title}
                    </p>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {activity.description}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internships - Coming Soon */}
      <div className="card-premium p-8 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '1px solid var(--brand)30'
              }}>
                <Briefcase size={20} style={{ color: 'var(--brand)' }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Internships</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
                border: '1px solid var(--accent-gold)30',
                color: 'var(--accent-gold)'
              }}
            >
              Coming soon
            </span>
          </div>

          <div className="card-premium p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)',
              border: '1px solid var(--brand-strong)30'
            }}>
              <Briefcase size={28} style={{ color: 'var(--brand-strong)' }} />
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Exciting opportunities on the way
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              We’re building curated internship listings and application tracking right here.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Stay tuned for updates.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
