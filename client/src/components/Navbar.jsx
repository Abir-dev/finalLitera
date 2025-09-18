import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Bell, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import Logo from "../assets/kinglogo.png";
import axios from "axios";
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
      } catch (e) {}
    };
    fetchRecent();

    const socket = io(backendURL, {
      withCredentials: true,
      path: "/socket.io",
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    if (user?.id || user?._id) {
      socket.emit("register_user", user.id || user._id);
    }

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

    return () => socket.disconnect();
  }, [user]);

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

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "navbar-scrolled mt-2 max-w-6xl mx-auto px-4"
            : "navbar-scrolled mt-4 max-w-7xl mx-auto px-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="Logo" className="h-15 w-15" />
              <span className="hidden md:inline text-lg font-bold text-white">
                Litera
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  className={`nav-link relative group ${
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
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* 🔔 Notifications */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="relative p-2 text-slate-200 hover:text-white"
                      onClick={() => setNotifOpen((v) => !v)}
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400"></span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 card-premium z-50">
                        <div className="p-3 border-b border-[color:var(--border)] flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-sm text-gray-400">
                              No recent notifications
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className="p-3 hover:bg-white/5 cursor-default border-b border-[color:var(--border)] last:border-b-0"
                              >
                                <div className="text-sm font-medium truncate">
                                  {n.title}
                                </div>
                                <div className="text-xs text-gray-400 truncate mt-0.5">
                                  {n.message}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                  {n.time}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setNotifOpen(false);
                              navigate("/dashboard/notifications");
                            }}
                            className="w-full text-center text-sm font-semibold btn-outline-premium rounded-full py-2"
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
                      className="w-10 h-10 rounded-full border cursor-pointer"
                      onClick={handleProfileClick}
                    />
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <p className="px-4 py-2 text-gray-700 font-medium">
                        {user.firstName || user.email?.split("@")[0]}
                      </p>
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
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-sm text-sm font-semibold text-white bg-blue-500 border border-blue-400 backdrop-blur-md shadow-lg hover:bg-blue-500/30 transition-all cursor-pointer"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  className="p-2 text-slate-200 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full nav-link ${
                  location.pathname === item.href ? "text-white" : ""
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
                className="w-full py-3 text-lg rounded-full text-white bg-blue-500/20 border border-blue-400/40 backdrop-blur-md shadow-lg hover:bg-blue-500/30 transition-all"
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
