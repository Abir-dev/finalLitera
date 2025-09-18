// src/components/LoginModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Logged in successfully!");
      onClose();
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSwitchToSignup = () => {
    onSwitchToSignup();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="card-premium p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Welcome Back
                </h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-white/5 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full input-premium"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full input-premium"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[color:var(--border)] text-[color:var(--brand)] shadow-sm focus:border-[color:var(--brand)] focus:ring focus:ring-[color:var(--brand-soft)] focus:ring-opacity-50" />
                <span className="ml-2 text-[color:var(--text-secondary)]">Remember me</span>
              </label>
              <span className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] font-medium hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-3 px-4 rounded-lg"
            >
              {loading ? "Signing in..." : "🚀 Sign In"}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 divider-premium"></div>
            <span className="px-3 text-sm text-[color:var(--text-secondary)]">or</span>
            <div className="flex-1 divider-premium"></div>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 btn-outline-premium font-semibold py-2.5 px-3 rounded-lg hover:scale-[1.01] cursor-pointer">
              <img src="/icons/google.svg" alt="Google Logo" className="w-5 h-4 mb-0.5 invert items-center justify-center" />
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-[color:var(--text-secondary)]">
            Don't have an account?{" "}
            <button 
              onClick={handleSwitchToSignup}
              className="font-semibold hover:underline transition-colors duration-300 text-[color:var(--text-primary)]"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
