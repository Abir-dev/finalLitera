import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { toast } from "react-hot-toast";
import {
  Shield,
  Mail,
  Lock,
  ArrowLeft,
  Award,
  Users,
  BarChart3,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Database,
  Server,
  Fingerprint,
  Star,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCardVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800" />

      {/* Single card container with left + right sections */}
      <div
        className={`relative w-full max-w-6xl mx-auto flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${
          isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center bg-white/5 backdrop-blur-xl border-r border-white/10 p-8 w-1/2">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Admin Portal</h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
              Access administrative controls and manage your platform with
              enterprise-level security
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Users size={20} className="text-blue-400" />
              <span className="text-xs text-gray-300">User Management</span>
              <Star size={12} className="text-yellow-400 fill-current" />
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <BarChart3 size={20} className="text-green-400" />
              <span className="text-xs text-gray-300">Analytics</span>
              <Zap size={12} className="text-green-400" />
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Server size={20} className="text-purple-400" />
              <span className="text-xs text-gray-300">System Config</span>
              <Award size={12} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 backdrop-blur-xl bg-white/10 p-8 flex flex-col justify-center">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className={`absolute left-3 top-3 ${
                    focusedField === "email" ? "text-blue-400" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@company.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 text-white border-2 focus:outline-none ${
                    errors.email
                      ? "border-red-500/50 focus:border-red-400"
                      : focusedField === "email"
                      ? "border-blue-500/50 focus:border-blue-400"
                      : "border-white/20 focus:border-white/40"
                  }`}
                />
                {formData.email && !errors.email && (
                  <CheckCircle
                    size={18}
                    className="absolute right-3 top-3 text-green-400"
                  />
                )}
                {errors.email && (
                  <AlertCircle
                    size={18}
                    className="absolute right-3 top-3 text-red-400"
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className={`absolute left-3 top-3 ${
                    focusedField === "password"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter secure password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 text-white border-2 focus:outline-none ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-400"
                      : focusedField === "password"
                      ? "border-blue-500/50 focus:border-blue-400"
                      : "border-white/20 focus:border-white/40"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={20} /> Secure Admin Access
                </>
              )}
            </button>

            {/* Security Tags */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Fingerprint size={12} /> 2FA Ready
              </span>
              <span className="flex items-center gap-1">
                <Database size={12} /> SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Shield size={12} /> Audit Logged
              </span>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition"
            >
              <ArrowLeft size={16} /> Back to Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
