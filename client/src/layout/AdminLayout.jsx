import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { BarChart3, Users, BookOpen, FileText, Settings, Crown, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, adminLogout, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    if (!loading) {
      if (!admin) {
        navigate("/admin/login");
        return;
      }
    }
  }, [admin, loading, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Exams", href: "/admin/exams", icon: FileText },
    // { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[color:var(--text-secondary)]">
        <div className="text-center card-premium px-8 py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--brand)' }}></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Standard Admin Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="card-premium h-full flex flex-col">
          {/* Standard Admin Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Crown size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-white/80">Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>

          {/* Standard Admin User Info */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20">
                  {admin.firstName.charAt(0)}
                </div>
                {/* Admin Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown size={8} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{admin.firstName} {admin.lastName}</p>
                <p className="text-xs capitalize text-gray-300">{admin.role}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-br from-blue-500 to-purple-600" 
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <IconComponent size={16} className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Standard Logout Button */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Standard Main Content */}
      <div className="lg:pl-64">
        {/* Standard Top Bar */}
        <div className="sticky top-0 z-40 nav-translucent">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">
                Welcome back, <span className="font-semibold text-white">{admin.firstName} {admin.lastName}</span>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20">
                {admin.firstName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Standard Page Content */}
        <main className="p-4 container-premium">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
