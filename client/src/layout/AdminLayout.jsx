import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
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

  const handleNavigation = () => {
    // Close mobile sidebar when navigating
    setSidebarOpen(false);
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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Premium Admin Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform transition-all duration-500 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="h-full flex flex-col" style={{ 
          background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-secondary) 100%)',
          borderRight: '1px solid var(--border)',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Premium Admin Header */}
          <div className="relative h-16 sm:h-20 px-3 sm:px-6 flex items-center justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl border border-white/20">
                  <Crown size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown size={6} className="sm:w-2 sm:h-2 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-white/80">Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Premium Admin User Info */}
          <div className="px-3 sm:px-6 py-4 sm:py-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 border border-white/30 ring-2 ring-white/10 text-sm sm:text-base">
                  {admin.firstName.charAt(0)}
                </div>
                {/* Premium Admin Badge */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                  <Crown size={10} className="sm:w-3 sm:h-3 text-white" />
                </div>
                {/* Online Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white/20">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-xs sm:text-sm capitalize font-medium truncate" style={{ color: 'var(--accent-gold)' }}>
                  {admin.role} Administrator
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-400">Online & Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Navigation */}
          <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavigation}
                  className={`group relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${
                    isActive
                      ? "text-white shadow-2xl"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, var(--brand)60, var(--brand-strong)80)',
                    border: '1px solid var(--brand)30',
                    boxShadow: 'var(--shadow-glow), var(--shadow-lg)'
                  } : {
                    color: 'var(--text-secondary)'
                  }}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-30"></div>
                  )}
                  <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? "bg-white/20 shadow-lg" 
                      : "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
                  }`}>
                    <IconComponent size={16} className={`sm:w-[18px] sm:h-[18px] ${isActive ? "text-white" : "group-hover:text-white transition-colors duration-300"}`} />
                  </div>
                  <span className="flex-1 relative hidden sm:block">{item.name}</span>
                  <span className="flex-1 relative sm:hidden text-xs truncate">{item.name.split(' ')[0]}</span>
                  {isActive && (
                    <div className="relative flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Premium Logout Button */}
          <div className="p-3 sm:p-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleLogout}
              className="w-full relative flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-xs sm:text-sm group hover:scale-[1.02] shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))',
                border: '1px solid var(--accent-rose)30',
                boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
              }}
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px] text-white relative group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-white relative">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Main Content */}
      <div className="lg:pl-72">
        {/* Premium Top Bar */}
        <div className="sticky top-0 z-40 nav-translucent">
          <div className="flex items-center justify-between h-12 sm:h-16 px-3 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 group"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Menu size={18} className="sm:w-5 sm:h-5 group-hover:text-white transition-colors duration-300" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm hidden md:block" style={{ color: 'var(--text-secondary)' }}>
                Welcome back, <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{admin.firstName} {admin.lastName}</span>
              </div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 ring-2 ring-white/10">
                  {admin.firstName.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white/20">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Page Content */}
        <main className="p-3 sm:p-6 container-premium min-h-screen transition-all duration-300 ease-in-out" style={{ background: 'var(--bg-primary)' }}>
          <div className="animate-slide-in-up">
            <Outlet />
          </div>
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
