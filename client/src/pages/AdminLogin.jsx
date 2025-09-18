import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { toast } from "react-hot-toast";
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Crown, 
  Settings, 
  Users, 
  BarChart3, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
  Star,
  Award,
  Zap,
  Globe,
  Database,
  Server,
  Key,
  Fingerprint
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsCardVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the dedicated admin authentication system
      const response = await adminLogin(formData.email, formData.password);
      
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Professional Premium Luxury Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Luxury Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800"></div>
        
        {/* Premium Luxury Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-rose-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/15 via-transparent to-indigo-900/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-900/8 via-transparent to-cyan-900/8"></div>
        
        {/* Luxury Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          {/* Subtle Diamond Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Premium Luxury Accent Elements */}
        <div className="absolute inset-0">
          {/* Top Left Luxury Accent */}
          <div className="absolute top-0 left-0 w-96 h-96 opacity-8 blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' 
          }}></div>
          
          {/* Top Right Premium Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-6 blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)' 
          }}></div>
          
          {/* Bottom Left Elegant Accent */}
          <div className="absolute bottom-0 left-0 w-72 h-72 opacity-5 blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' 
          }}></div>
          
          {/* Bottom Right Sophisticated Accent */}
          <div className="absolute bottom-0 right-0 w-88 h-88 opacity-7 blur-3xl" style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
          }}></div>
        </div>
        
        {/* Luxury Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px'
        }}></div>
        
        {/* Premium Border Accents */}
        <div className="absolute inset-0">
          {/* Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          
          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          {/* Left Border Accent */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
          
          {/* Right Border Accent */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"></div>
        </div>
        
        {/* Luxury Corner Accents */}
        <div className="absolute inset-0">
          {/* Top Left Corner */}
          <div className="absolute top-8 left-8 w-32 h-32 opacity-10" style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, transparent 50%)',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)'
          }}></div>
          
          {/* Top Right Corner */}
          <div className="absolute top-8 right-8 w-32 h-32 opacity-8" style={{
            background: 'linear-gradient(225deg, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
            clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
          }}></div>
          
          {/* Bottom Left Corner */}
          <div className="absolute bottom-8 left-8 w-32 h-32 opacity-6" style={{
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
            clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
          }}></div>
          
          {/* Bottom Right Corner */}
          <div className="absolute bottom-8 right-8 w-32 h-32 opacity-8" style={{
            background: 'linear-gradient(315deg, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
            clipPath: 'polygon(100% 100%, 0 100%, 100% 0)'
          }}></div>
        </div>
        
        {/* Premium Luxury Center Focus */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 opacity-5 blur-3xl" style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
          }}></div>
        </div>
      </div>

      {/* Main Login Container */}
      <div className={`relative w-full max-w-md mx-auto transition-all duration-1000 ${isCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Modern Glassmorphism Card */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
          
          {/* Professional Header with Branding */}
          <div className="relative text-center mb-8">
            {/* Professional Logo Section */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                <Shield size={32} className="text-white" />
              </div>
              {/* Security Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white shadow-lg">
                <Check size={16} className="text-white" />
              </div>
            </div>
            
            {/* Professional Title Section */}
            <div className="mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                Admin Portal
              </h1>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <Shield size={14} className="text-green-400" />
                  <span className="text-xs font-medium text-green-400">Secure Access</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <Award size={14} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">Enterprise Grade</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Access administrative controls and manage your platform with enterprise-level security
            </p>
            
            {/* Professional Admin Features Preview */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300 border border-blue-500/20">
                  <Users size={18} className="text-blue-400" />
                </div>
                <span className="text-xs text-gray-300 font-medium text-center">User Management</span>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-400">Advanced</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300 border border-green-500/20">
                  <BarChart3 size={18} className="text-green-400" />
                </div>
                <span className="text-xs text-gray-300 font-medium text-center">Analytics</span>
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-green-400" />
                  <span className="text-xs text-gray-400">Real-time</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300 border border-purple-500/20">
                  <Settings size={18} className="text-purple-400" />
                </div>
                <span className="text-xs text-gray-300 font-medium text-center">System Config</span>
                <div className="flex items-center gap-1">
                  <Server size={10} className="text-purple-400" />
                  <span className="text-xs text-gray-400">Enterprise</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {/* Professional Email Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-white">
                  Administrator Email
                </label>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Globe size={12} />
                  <span>Enterprise Access</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={handleInputBlur}
                  className={`w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base ${
                    errors.email 
                      ? 'border-red-500/50 focus:border-red-400' 
                      : focusedField === 'email' 
                        ? 'border-blue-500/50 focus:border-blue-400' 
                        : 'border-white/20 focus:border-white/40'
                  }`}
                  placeholder="admin@company.com"
                  required
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle size={18} className="text-green-400" />
                  </div>
                )}
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <AlertCircle size={18} className="text-red-400" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Professional Password Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-white">
                  Secure Password
                </label>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Key size={12} />
                  <span>Encrypted</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={handleInputBlur}
                  className={`w-full pl-12 pr-12 py-3 sm:py-4 rounded-xl border-2 transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-500/50 focus:border-red-400' 
                      : focusedField === 'password' 
                        ? 'border-blue-500/50 focus:border-blue-400' 
                        : 'border-white/20 focus:border-white/40'
                  }`}
                  placeholder="Enter secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                    <AlertCircle size={18} className="text-red-400" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Professional Login Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base border border-white/10"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Secure Admin Access
                  </>
                )}
              </button>
              
              {/* Security Features */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Fingerprint size={12} />
                  <span>2FA Ready</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database size={12} />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} />
                  <span>Audit Logged</span>
                </div>
              </div>
            </div>
          </form>

          {/* Professional Footer Section */}
          <div className="mt-8 space-y-4">
            {/* Back to Main Site */}
            <div className="text-center">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <ArrowLeft size={16} />
                Back to Main Site
              </a>
            </div>
            
            {/* Professional Footer Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>© 2024 LITERA Platform</span>
                <span>•</span>
                <span>Enterprise Admin Portal</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>System Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full opacity-30 animate-float bg-gradient-to-r from-blue-500 to-purple-600 blur-sm"></div>
        <div className="absolute -bottom-6 -right-6 w-8 h-8 rounded-full opacity-25 animate-float animation-delay-1000 bg-gradient-to-r from-pink-500 to-orange-500 blur-sm"></div>
        <div className="absolute top-1/2 -right-8 w-6 h-6 rounded-full opacity-20 animate-float animation-delay-2000 bg-gradient-to-r from-green-500 to-blue-500 blur-sm"></div>
      </div>
      
    </div>
  );
}
