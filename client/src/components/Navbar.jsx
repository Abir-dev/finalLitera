import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Bell, Menu, X } from "lucide-react";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import Logo from "../assets/kinglogo.png"
import axios from "axios";
import { io } from "socket.io-client";

const navLink = "nav-link-premium text-sm tracking-wider px-3 py-2 rounded-full transition-colors";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
  const normalizedApi = apiEnv.endsWith("/api")
    ? apiEnv
    : `${apiEnv.replace(/\/$/, "")}/api`;
  const backendURL = normalizedApi.replace(/\/api$/, "");

  // Fetch recent notifications and subscribe to realtime
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/notifications?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const list = (res.data?.data?.notifications || []).map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          type: n.type,
          isRead: n.isRead,
        }));
        setNotifications(list);
        setUnreadCount(res.data?.data?.pagination?.unreadCount || 0);
      } catch (e) {
        // ignore
      }
    };
    fetchRecent();

    const socket = io(backendURL, { withCredentials: true, path: '/socket.io', transports: ['websocket'], reconnectionAttempts: 5 });
    // Register room if available
    if (user?.id || user?._id) {
      socket.emit('register_user', user.id || user._id);
    }
    socket.on('new_notification', (payload) => {
      setNotifications((prev) => [
        {
          id: payload.id,
          title: payload.title,
          message: payload.message,
          time: new Date(payload.timestamp || Date.now()).toLocaleString(),
          type: payload.type,
          isRead: false,
        },
        ...prev.slice(0, 4),
      ]);
      setUnreadCount((c) => c + 1);
    });

    return () => socket.disconnect();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (notifOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [notifOpen]);

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <>
      <header className="sticky top-0 z-50 nav-translucent rounded-b-2xl shadow-md mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo (hidden on mobile) */}
            <Link to="/" className="hidden md:block">
              <img src={Logo} alt="Logo" className="h-10 w-10" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-2">
              <NavLink to="/" end className={navLink}>Home</NavLink>
              <NavLink to="/courses" className={navLink}>Courses</NavLink>
              <NavLink to="/launchpad" className={navLink}>LaunchPad</NavLink>
              <NavLink to="/about" className={navLink}>About</NavLink>
              <NavLink to="/faq" className={navLink}>FAQ</NavLink>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="relative p-2 text-slate-200 hover:text-white"
                      onClick={() => setNotifOpen((v) => !v)}
                      aria-label="Open notifications"
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2" style={{ background: 'conic-gradient(from 45deg, #ff6b7a, #ffb86b, #ffd166, #ff6b7a)' }}></span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 card-premium z-50">
                        <div className="p-3 border-b border-[color:var(--border)] flex items-center justify-between">
                          <span className="text-sm font-semibold">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,140,255,0.18)', color: 'var(--text-primary)' }}>{unreadCount} new</span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-[color:var(--text-muted)]">No recent notifications</div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-3 hover:bg-white/5 cursor-default border-b border-[color:var(--border)] last:border-b-0">
                                <div className="text-sm font-medium truncate">{n.title}</div>
                                <div className="text-xs text-[color:var(--text-secondary)] truncate mt-0.5">{n.message}</div>
                                <div className="text-[11px] text-[color:var(--text-muted)] mt-1">{n.time}</div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { setNotifOpen(false); navigate('/dashboard/notifications'); }}
                            className="w-full text-center text-sm font-semibold btn-outline-premium rounded-full py-2"
                          >
                            View all notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <img
                      src={user.avatar || "/icons/profile.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border cursor-pointer"
                      onClick={handleProfileClick}
                    />
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <p className="px-4 py-2 text-gray-700 font-medium">{user.firstName || user.email?.split('@')[0]}</p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* <Link
                    to="/admin/login"
                    className="rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold px-4 py-2.5 shadow"
                  >
                    👑 Admin
                  </Link> */}
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="btn-premium text-sm px-5 py-2.5 cursor-pointer hidden md:inline-flex"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-72 card-premium transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-[color:var(--border)]">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
            <span className="font-semibold">Litera</span>
          </Link>
          <button
            className="p-2 rounded-md text-slate-200 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="px-4 py-4 flex flex-col gap-2">
          <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} className={`${navLink} block w-full`}>Home</NavLink>
          <NavLink to="/courses" onClick={() => setIsMobileMenuOpen(false)} className={`${navLink} block w-full`}>Courses</NavLink>
          <NavLink to="/launchpad" onClick={() => setIsMobileMenuOpen(false)} className={`${navLink} block w-full`}>LaunchPad</NavLink>
          <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`${navLink} block w-full`}>About</NavLink>
          <NavLink to="/faq" onClick={() => setIsMobileMenuOpen(false)} className={`${navLink} block w-full`}>FAQ</NavLink>
        </nav>

        {/* Auth actions intentionally not shown in mobile sidebar; handled in right-side navbar on desktop */}
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}
