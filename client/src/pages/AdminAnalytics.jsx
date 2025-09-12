import React, { useState } from "react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const analyticsData = {
    revenue: {
      title: "Revenue Analytics",
      current: 1250000,
      previous: 980000,
      change: "+27.6%",
      trend: "up",
      data: [
        { month: "Jan", value: 85000 },
        { month: "Feb", value: 92000 },
        { month: "Mar", value: 88000 },
        { month: "Apr", value: 95000 },
        { month: "May", value: 102000 },
        { month: "Jun", value: 125000 }
      ]
    },
    students: {
      title: "Student Growth",
      current: 1247,
      previous: 892,
      change: "+39.8%",
      trend: "up",
      data: [
        { month: "Jan", value: 650 },
        { month: "Feb", value: 720 },
        { month: "Mar", value: 780 },
        { month: "Apr", value: 850 },
        { month: "May", value: 920 },
        { month: "Jun", value: 1247 }
      ]
    },
    courses: {
      title: "Course Performance",
      current: 24,
      previous: 18,
      change: "+33.3%",
      trend: "up",
      data: [
        { month: "Jan", value: 15 },
        { month: "Feb", value: 16 },
        { month: "Mar", value: 17 },
        { month: "Apr", value: 19 },
        { month: "May", value: 21 },
        { month: "Jun", value: 24 }
      ]
    },
    completion: {
      title: "Completion Rates",
      current: 78.5,
      previous: 72.3,
      change: "+8.6%",
      trend: "up",
      data: [
        { month: "Jan", value: 68 },
        { month: "Feb", value: 70 },
        { month: "Mar", value: 72 },
        { month: "Apr", value: 74 },
        { month: "May", value: 76 },
        { month: "Jun", value: 78.5 }
      ]
    }
  };

  const topPerformingCourses = [
    { name: "React for Web Development", students: 234, revenue: 187200, rating: 4.8, completion: 85 },
    { name: "JavaScript Fundamentals", students: 198, revenue: 158400, rating: 4.7, completion: 78 },
    { name: "Node.js & APIs", students: 156, revenue: 124800, rating: 4.9, completion: 82 },
    { name: "Machine Learning Basics", students: 142, revenue: 113600, rating: 4.6, completion: 75 },
    { name: "Full Stack Development", students: 89, revenue: 142400, rating: 4.9, completion: 88 }
  ];

  const studentDemographics = [
    { age: "18-25", count: 456, percentage: 36.6 },
    { age: "26-35", count: 523, percentage: 41.9 },
    { age: "36-45", count: 189, percentage: 15.2 },
    { age: "46+", count: 79, percentage: 6.3 }
  ];

  const deviceUsage = [
    { device: "Desktop", count: 748, percentage: 60.0 },
    { device: "Mobile", count: 374, percentage: 30.0 },
    { device: "Tablet", count: 125, percentage: 10.0 }
  ];

  const getTrendIcon = (trend) => {
    return trend === "up" ? "📈" : "📉";
  };

  const getChangeColor = (change) => {
    return change.startsWith("+") ? "text-green-600" : "text-red-600";
  };

  const renderSimpleChart = (data) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="flex items-end justify-between h-32">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-8 bg-gradient-to-t from-red-500 to-orange-500 rounded-t-lg transition-all duration-300 hover:scale-110"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-600 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300">
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(analyticsData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedMetric === key
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{getTrendIcon(data.trend)}</div>
              <h3 className="text-sm font-medium text-gray-600">{data.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {key === "revenue" ? `₹${(data.current / 100000).toFixed(1)}L` : 
                 key === "completion" ? `${data.current}%` : data.current.toLocaleString()}
              </p>
              <p className={`text-sm font-medium mt-1 ${getChangeColor(data.change)}`}>
                {data.change} from last period
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{analyticsData[selectedMetric].title}</h2>
          <div className="text-sm text-gray-500">Time period: {timeRange}</div>
        </div>
        <div className="h-80 flex items-center justify-center">
          {renderSimpleChart(analyticsData[selectedMetric].data)}
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Courses</h2>
          <div className="space-y-4">
            {topPerformingCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{course.name}</h3>
                    <p className="text-xs text-gray-500">{course.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">₹{(course.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500">⭐ {course.rating} | {course.completion}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Demographics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Demographics</h2>
          <div className="space-y-4">
            {studentDemographics.map((demo, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{demo.age}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${demo.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">{demo.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Device Usage</h3>
          <div className="space-y-3">
            {deviceUsage.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{device.device}</span>
                <span className="text-sm font-semibold text-gray-900">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Frontend</span>
              <span className="text-sm font-semibold text-gray-900">8 courses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Backend</span>
              <span className="text-sm font-semibold text-gray-900">6 courses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data Science</span>
              <span className="text-sm font-semibold text-gray-900">4 courses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Full Stack</span>
              <span className="text-sm font-semibold text-gray-900">6 courses</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">New student registered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700">Course completed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-gray-700">Payment received</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-700">Exam scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Growth Opportunity</h3>
            <p className="text-sm text-gray-600">Mobile usage is 30% - consider optimizing mobile experience to increase engagement.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-gray-900 mb-2">📈 Best Performing</h3>
            <p className="text-sm text-gray-600">React course has highest completion rate (85%) - use as template for other courses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
