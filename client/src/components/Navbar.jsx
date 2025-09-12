import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Bell } from "lucide-react";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import Logo from "../assets/kinglogo.png"

const navLink = "uppercase text-lg font-bold text-slate-700 hover:text-[#1B4A8B] px-4 py-2";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-12 w-15 invert" />
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-6">
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
                  <button className="relative p-2 text-slate-700">
                    <Bell size={22} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                  </button>

                  <div className="relative group">
                    <img
                      src={user.avatar || "https://i.pravatar.cc/200?img=8"}
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
                    className="rounded-full bg-[#1B4A8B] text-white text-sm font-semibold px-5 py-2.5 shadow"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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
