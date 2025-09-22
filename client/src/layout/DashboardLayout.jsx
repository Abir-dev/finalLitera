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
  // { to: "/dashboard/billing", label: "Billing" },
  { to: "/dashboard/logout", label: "LogOut Account" },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Fixed Sidebar */}
        <aside className="hidden md:flex w-64 text-white flex-col fixed left-0 top-0 h-screen z-30">
          <div className="card-premium dashboard-sidebar flex flex-col m-4">
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
            {/* Enhanced Profile Section */}
            <div className="px-4 pt-3 pb-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg relative">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.avatar || "/icons/profile.svg"}
                    alt="profile"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                </div>
                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-bold text-white mb-1">
                  {user ? user.firstName || user.email?.split('@')[0] || 'User' : 'Loading...'}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  {user?.email}
                </p>
                {userStats && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-xl p-2 border border-blue-500/20">
                      <div className="text-lg font-bold text-white">{userStats.enrolledCourses || 0}</div>
                      <div className="text-xs text-blue-400 font-medium">Courses</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-xl p-2 border border-green-500/20">
                      <div className="text-lg font-bold text-white">{userStats.completedCourses || 0}</div>
                      <div className="text-xs text-green-400 font-medium">Completed</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Menu */}
            <div className="sidebar-menu px-3 py-2">
              <nav className="space-y-2">
                {menu.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                        "hover:scale-105 hover:shadow-lg",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg"
                          : "text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20"
                      ].join(" ")
                    }
                  >
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      location.pathname === item.to ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-white/30 group-hover:bg-white/60'
                    }`}></div>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {location.pathname === item.to && (
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full shadow-lg"></div>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Enhanced Bottom Actions */}
            <div className="p-4 border-t border-white/10">
              <NavLink
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:scale-105"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">Home</span>
              </NavLink>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto md:ml-64">
          {/* Mobile Navigation Bar */}
          <div className="md:hidden sticky top-0 z-40 nav-translucent">
            <div className="flex items-center justify-between h-14 px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
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

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <h1 className="text-base font-bold text-white">Litera</h1>
                        <p className="text-xs text-gray-400">Learning Platform</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Mobile Profile Section */}
                  <div className="mb-6">
                    <div className="relative mx-auto w-16 h-16 mb-3">
                      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                        <img
                          className="w-full h-full object-cover"
                          src={user?.avatar || "/icons/profile.svg"}
                          alt="profile"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-bold text-white">
                        {user ? user.firstName || user.email?.split('@')[0] || 'User' : 'Loading...'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <nav className="space-y-2">
                    {menu.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          ].join(" ")
                        }
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          location.pathname === item.to ? 'bg-blue-400' : 'bg-white/30'
                        }`}></div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
