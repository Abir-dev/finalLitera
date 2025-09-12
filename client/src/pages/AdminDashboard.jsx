import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 1247,
    totalCourses: 24,
    totalExams: 156,
    activeUsers: 892,
    revenue: 1250000,
    completionRate: 78.5
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "student",
      action: "New student registered",
      details: "John Doe joined React Fundamentals course",
      time: "2 minutes ago",
      icon: "👤"
    },
    {
      id: 2,
      type: "course",
      action: "Course published",
      details: "Advanced Machine Learning course is now live",
      time: "1 hour ago",
      icon: "📚"
    },
    {
      id: 3,
      type: "exam",
      action: "Exam completed",
      details: "Sarah Wilson completed JavaScript Basics exam",
      time: "3 hours ago",
      icon: "📝"
    },
    {
      id: 4,
      type: "payment",
      action: "Payment received",
      details: "₹2,999 for Full Stack Development course",
      time: "5 hours ago",
      icon: "💰"
    }
  ]);

  const [topCourses, setTopCourses] = useState([
    { id: 1, name: "React for Web Development", students: 234, rating: 4.8, revenue: 187200 },
    { id: 2, name: "JavaScript Fundamentals", students: 198, rating: 4.7, revenue: 158400 },
    { id: 3, name: "Node.js & APIs", students: 156, rating: 4.9, revenue: 124800 },
    { id: 4, name: "Machine Learning Basics", students: 142, rating: 4.6, revenue: 113600 }
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your administrative control center</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300">
            📊 Generate Report
          </button>
          <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
            ⚡ Quick Actions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-sm text-green-600 mt-1">+3 new this month</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
              <p className="text-sm text-blue-600 mt-1">+8 completed today</p>
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
              <p className="text-3xl font-bold text-gray-900">₹{(stats.revenue / 100000).toFixed(1)}L</p>
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
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <Link to="/admin/activities" className="text-red-600 hover:text-red-700 font-medium text-sm">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Courses</h2>
          <div className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{course.name}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    ⭐ {course.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{course.students} students</span>
                  <span>₹{(course.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/students/add" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">👤</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Add Student</span>
          </Link>
          
          <Link to="/admin/courses/add" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📚</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Add Course</span>
          </Link>
          
          <Link to="/admin/exams/add" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📝</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Create Exam</span>
          </Link>
          
          <Link to="/admin/analytics" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
