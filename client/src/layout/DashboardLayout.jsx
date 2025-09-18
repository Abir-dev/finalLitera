// src/layout/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import profileService from "../services/profileService.js";

const BRAND = {
  blue: "#163D74",
  blueText: "#163D74",
};

const menu = [
  { to: "/dashboard/subscription", label: "Subscription" },
  { to: "/dashboard/live", label: "Live Classes" },
  { to: "/dashboard/recordings", label: "Recording Classes" },
  { to: "/dashboard/algobridge", label: "AlgoBridge" },
  { to: "/dashboard/notifications", label: "Notification Preferences" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/billing", label: "Billing" },
  { to: "/dashboard/logout", label: "LogOut Account" },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const response = await profileService.getUserStats();
        setUserStats(response.stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full overflow-hidden text-white">
      {/* Body: premium sidebar + scrollable content */}
      <div className="flex min-h-screen">
        {/* Static Sidebar */}
        <aside className="hidden md:flex w-64 text-white flex-col relative flex-shrink-0">
          <div className="card-premium h-full flex flex-col">
            {/* Standard Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">Litera</h1>
                  <p className="text-xs text-gray-400">Learning Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.location.reload()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-200"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                </button>
              </div>
            </div>
            {/* Standard Profile Section */}
            <div className="px-4 pt-6 pb-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.avatar || "/icons/profile.svg"}
                    alt="profile"
                  />
                </div>
                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-base font-bold text-white">
                  {user ? user.firstName || user.email?.split('@')[0] || 'User' : 'Loading...'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.email}
                </p>
                {userStats && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                      <div className="text-sm font-bold text-white">{userStats.enrolledCourses || 0}</div>
                      <div className="text-xs text-gray-400">Courses</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                      <div className="text-sm font-bold text-white">{userStats.completedCourses || 0}</div>
                      <div className="text-xs text-gray-400">Completed</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Standard Menu */}
            <div className="flex-1 overflow-y-auto px-3">
              <nav className="space-y-1">
                {menu.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      ].join(" ")
                    }
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      location.pathname === item.to ? 'bg-blue-400' : 'bg-white/30 group-hover:bg-white/60'
                    }`}></div>
                    <span className="text-sm font-medium">{item.label}</span>
                    {location.pathname === item.to && (
                      <div className="ml-auto w-1 h-4 bg-blue-400 rounded-full"></div>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <NavLink
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white/80">Home</span>
                </NavLink>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Navigation Bar */}
          <div className="md:hidden sticky top-0 z-40 nav-translucent">
            <div className="flex items-center justify-between h-14 px-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm">📚</span>
                </div>
                <h1 className="text-base font-bold text-white">Litera</h1>
              </div>

              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20">
                {user ? (user.firstName?.charAt(0) || user.email?.charAt(0) || 'U') : 'U'}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
