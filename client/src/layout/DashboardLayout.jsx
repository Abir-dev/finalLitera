// src/layout/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Top navbar */}
      <Navbar />

      {/* Body: right‑rounded sidebar + scrollable content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          className="w-64 text-white flex flex-col rounded-r-3xl shadow-xl"
          style={{ background: BRAND.blue }}
        >
          {/* Profile section */}
          <div className="px-6 pt-8 pb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mx-auto shadow">
              <img className="w-full h-full object-cover" src="https://i.pravatar.cc/200?img=8" alt="profile" />
            </div>
            <p className="text-center mt-4 font-medium">
              {user ? user.firstName || user.email?.split('@')[0] || 'User' : 'Loading...'}
            </p>
          </div>

          {/* Menu (scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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

          {/* Bottom action (refresh) */}
          <div className="p-4">
            <button className="ml-auto w-12 h-12 rounded-full bg-white/10 border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  d="M16 8a4 4 0 10-8 0v1H6l3 3 3-3h-2V8a2 2 0 114 0v2a6 6 0 11-6 6"/>
              </svg>
            </button>
          </div>
        </aside>

        {/* Main content area (scrolls) */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 md:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
