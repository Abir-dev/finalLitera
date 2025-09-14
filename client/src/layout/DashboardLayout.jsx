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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Body: right‑rounded sidebar + scrollable content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 text-white flex flex-col rounded-r-3xl shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:relative lg:inset-auto`}
          style={{ background: BRAND.blue }}
        >
          {/* Sidebar Header with Close Button */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h1 className="text-lg font-bold">Litera</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                title="Refresh"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                title="Close Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* Profile section */}
          <div className="px-6 pt-8 pb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mx-auto shadow">
              <img
                className="w-full h-full object-cover"
                src={user?.avatar || "/icons/profile.svg"}
                alt="profile"
              />
            </div>
            <p className="text-center mt-4 font-medium">
              {user ? user.firstName || user.email?.split('@')[0] || 'User' : 'Loading...'}
            </p>
            <div className="text-center mt-2 text-sm text-white/80">
              {userStats && (
                <div className="space-y-1">
                  <div>{userStats.enrolledCourses || 0} Courses</div>
                  <div>{userStats.completedCourses || 0} Completed</div>
                </div>
              )}
            </div>
          </div>

          {/* Menu (scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block px-5 py-3 rounded-l-full transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                      isActive
                        ? "bg-white text-[color:var(--brand-blueText)] font-semibold shadow-sm"
                        : "text-white/90 hover:bg-white/10"
                    ].join(" ")
                  }
                  style={{ "--brand-blueText": BRAND.blueText }}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom action (home) */}
          <div className="p-4">
            <NavLink
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="ml-auto w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <img src="/icons/home.svg" alt="Home" className="invert" />
            </NavLink>
            {/* <button onClick={() => window.location.reload()} className="ml-auto w-12 h-12 rounded-full flex items-center justify-center cursor-pointer">
            <img src="/icons/refresh.svg" alt="Refresh" className="w-6 h-6 rounded-full" />
          </button> */}
          </div>
        </aside>

        {/* Main content area (scrolls) */}
        <main className="flex-1 overflow-y-auto lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <h1 className="text-lg font-bold text-gray-900">Litera</h1>
              </div>

              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user ? (user.firstName?.charAt(0) || user.email?.charAt(0) || 'U') : 'U'}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
