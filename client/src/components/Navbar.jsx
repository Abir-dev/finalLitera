import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Bell, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import Logo from "../assets/kinglogo.png";
import { notificationService } from "../services/notificationService";
import { io } from "socket.io-client";

const navItems = [
  // { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "LaunchPad", href: "/launchpad" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loginSuccessCallbackRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);

  const apiEnv =
    import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
  const normalizedApi = apiEnv.endsWith("/api")
    ? apiEnv
    : `${apiEnv.replace(/\/$/, "")}/api`;
  const backendURL = normalizedApi.replace(/\/api$/, "");

  // ✅ Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Notifications + socket
  useEffect(() => {
    if (!user) return;

    const fetchRecent = async () => {
      try {
        const res = await notificationService.getNotifications({ limit: 5 });
        const list = (res?.data?.notifications || []).map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          type: n.type,
          isRead: n.isRead,
        }));
        setNotifications(list);
        setUnreadCount(res?.data?.pagination?.unreadCount || 0);
      } catch (error) {
        console.warn("Failed to fetch notifications:", error.message);
      }
    };
    fetchRecent();

    let socket;
    try {
      socket = io(backendURL, {
        withCredentials: true,
        path: "/socket.io",
        transports: ["websocket", "polling"], // Add polling fallback
        reconnectionAttempts: 3, // Reduce attempts
        reconnectionDelay: 2000,
        timeout: 10000,
        forceNew: true,
      });

      socket.on("connect", () => {
        console.log("Navbar socket connected");
        if (user?.id || user?._id) {
          socket.emit("register_user", user.id || user._id);
        }
      });

      socket.on("connect_error", (error) => {
        console.warn("Navbar socket connection error:", error.message);
      });

      socket.on("new_notification", (payload) => {
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
    } catch (error) {
      console.warn("Failed to initialize navbar socket:", error.message);
    }

    return () => {
      try {
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect();
        }
      } catch (error) {
        console.warn("Error disconnecting navbar socket:", error.message);
      }
    };
  }, [user, backendURL]);

  // ✅ Close notif dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (
        notifOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  // ✅ Listen for global login requests (from anywhere in the app)
  useEffect(() => {
    const onOpenLogin = (e) => {
      const detail = e?.detail || {};
      loginSuccessCallbackRef.current = typeof detail.onSuccess === 'function' ? detail.onSuccess : null;
      setIsLoginModalOpen(true);
    };
    window.addEventListener('openLogin', onOpenLogin);
    return () => window.removeEventListener('openLogin', onOpenLogin);
  }, []);

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Function to refresh notification count (can be called from other components)
  const refreshNotificationCount = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getNotificationCount();
      setUnreadCount(res?.data?.unreadCount || 0);
    } catch (error) {
      console.warn("Failed to refresh notification count:", error.message);
    }
  };

  // Expose refresh function globally for other components to use
  useEffect(() => {
    window.refreshNotificationCount = refreshNotificationCount;
    return () => {
      delete window.refreshNotificationCount;
    };
  }, [user]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "navbar-scrolled mt-2 max-w-6xl mx-auto px-4 "
            : "navbar-scrolled mt-4 max-w-7xl mx-auto px-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 md:h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={Logo}
                alt="Logo"
                className="h-10 w-10 md:h-12 md:w-12"
              />
              <span className="hidden sm:inline text-base md:text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ">
                Litera
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  className={`nav-link relative group text-1xs md:text-sm font-medium xl:text-base ${
                    location.pathname === item.href ? "text-white" : ""
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5a43dd] to-[#FF08B9]"
                    />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <>
                  {/* 🔔 Notifications */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="relative p-1.5 md:p-2 text-slate-200 hover:text-white transition-colors"
                      onClick={() => setNotifOpen((v) => !v)}
                    >
                      <Bell size={18} className="md:w-5 md:h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400"></span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute mt-2 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-[min(92vw,22rem)] sm:w-80 md:w-96 bg-gray-900/95 backdrop-blur-md z-50 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center">
                              <div className="text-gray-400 text-sm mb-2">🔔</div>
                              <div className="text-sm text-gray-400">
                                No recent notifications
                              </div>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className="p-4 hover:bg-gray-800/50 cursor-pointer border-b border-gray-700/30 last:border-b-0 transition-colors"
                              >
                                <div className="text-sm font-semibold text-white mb-1">
                                  {n.title}
                                </div>
                                <div className="text-xs text-gray-300 mb-2 leading-relaxed">
                                  {n.message}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {n.time}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-3 border-t border-gray-700/50">
                          <button
                            onClick={() => {
                              setNotifOpen(false);
                              navigate("/dashboard/notifications");
                            }}
                            className="w-full text-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors py-2"
                          >
                            View all
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 👤 Profile */}
                  <div className="relative group">
                    <img
                      src={user.avatar || "/icons/profile.svg"}
                      alt="Profile"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border cursor-pointer transition-transform hover:scale-105"
                      onClick={handleProfileClick}
                    />
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 profile-dropdown">
                      <p className="px-3 py-2 text-gray-700 font-medium text-sm">
                        {user.firstName || user.email?.split("@")[0]}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-slate-100 rounded transition-colors text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-sm text-xs md:text-sm font-semibold text-white bg-blue-500 border border-blue-400 backdrop-blur-md shadow-lg hover:bg-blue-500/30 transition-all cursor-pointer"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  className="p-1.5 md:p-2 text-slate-200 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X size={18} className="md:w-5 md:h-5" />
                  ) : (
                    <Menu size={18} className="md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-3 md:py-4 space-y-3 md:space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full nav-link text-sm md:text-base py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? "text-white bg-white/10"
                    : "hover:bg-white/5"
                }`}
              >
                {item.name}
              </NavLink>
            ))}
            {!user && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="cursor-pointer  w-full py-2.5 md:py-3 text-sm md:text-base rounded-lg text-white bg-blue-500/20 border border-blue-400/40 backdrop-blur-md shadow-lg hover:bg-blue-500/30 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
      </motion.header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        onSuccess={() => {
          // Run pending callback if provided (e.g., navigate to intended course)
          const cb = loginSuccessCallbackRef.current;
          loginSuccessCallbackRef.current = null;
          if (typeof cb === 'function') {
            cb();
          } else {
            navigate('/dashboard/subscription');
          }
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
