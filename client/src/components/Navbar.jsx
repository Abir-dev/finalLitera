import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Bell, Menu, X } from "lucide-react";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import Logo from "../assets/kinglogo.png"

const navLink = "uppercase text-lg font-bold text-slate-700 hover:text-[#1B4A8B] px-4 py-2";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-sm bg-opacity-50 rounded-b-lg shadow-md border-b border-white/20 mb-4 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo (hidden on mobile) */}
            <Link to="/" className="hidden md:block">
              <img src={Logo} alt="Logo" className="h-15 w-15 invert" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-[#1B4A8B] focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

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
                    className="rounded-full bg-[#1B4A8B] hover:bg-[#1B4A8B]/90 text-white text-sm font-semibold px-5 py-2.5 shadow cursor-pointer hidden md:inline-flex"
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
      <div className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8 invert" />
            <span className="font-semibold text-slate-800">Litera</span>
          </Link>
          <button
            className="p-2 rounded-md text-slate-700 hover:text-[#1B4A8B]"
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
