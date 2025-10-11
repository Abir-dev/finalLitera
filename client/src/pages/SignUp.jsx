// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", referralCode: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [referralValidation, setReferralValidation] = useState({ 
    isValidating: false, 
    isValid: null, 
    referrerInfo: null,
    message: ""
  });

  // Initialize page
  useEffect(() => {
    console.log("Signup component mounted");
    setPageLoading(false);
  }, []);

  // Capture ?ref= from querystring
  useEffect(() => {
    console.log("Signup page loaded, location.search:", location.search);
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    console.log("Extracted referral code from URL:", ref);
    
    if (ref) {
      setForm((f) => ({ ...f, referralCode: ref }));
      // Auto-validate if referral code is in URL
      console.log("Auto-validating referral code:", ref);
      validateReferralCode(ref);
    }
  }, [location.search]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Validate referral code in real-time
    if (name === "referralCode") {
      if (value.trim()) {
        validateReferralCode(value);
      } else {
        setReferralValidation({ isValidating: false, isValid: null, referrerInfo: null, message: "" });
      }
    }
  };

  const validateReferralCode = async (code) => {
    if (!code.trim()) return;
    
    setReferralValidation({ isValidating: true, isValid: null, referrerInfo: null, message: "" });
    
    try {
      const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      console.log("Validating referral code:", code, "API:", apiEnv);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await axios.post(`${apiEnv}/auth/validate-referral`, 
        { referralCode: code },
        { 
          signal: controller.signal,
          timeout: 10000 // 10 second timeout
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.data.valid) {
        setReferralValidation({
          isValidating: false,
          isValid: true,
          referrerInfo: response.data.referrer,
          message: `Valid! You'll get 10% off your first course!`
        });
      } else {
        setReferralValidation({
          isValidating: false,
          isValid: false,
          referrerInfo: null,
          message: response.data.message || "Invalid referral code"
        });
      }
    } catch (error) {
      console.error("Referral validation error:", error);
      
      let errorMessage = "Invalid referral code";
      if (error.name === 'AbortError') {
        errorMessage = "Validation timeout - please try again";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout - please check your internet";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setReferralValidation({
        isValidating: false,
        isValid: false,
        referrerInfo: null,
        message: errorMessage
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    try {
      const [firstName, ...rest] = String(form.name || "").trim().split(" ");
      const payload = {
        firstName: firstName || form.name,
        lastName: rest.join(" ") || "",
        email: form.email,
        password: form.password,
        referralCode: form.referralCode || undefined,
      };
      const result = await signup(payload);
      
      // Show success message if referral was linked
      if (result.referralLinked && result.referrerInfo) {
        alert(`🎉 Welcome! You've been referred by ${result.referrerInfo.name}. You'll get 10% off your first course purchase!`);
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while page initializes
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signup page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Main signup container */}
      <div className="relative w-full max-w-md">
        {/* Floating signup card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join Us Today
            </h1>
            <p className="text-gray-600 mt-2">Create your account and start learning</p>
            
            {/* Referral Benefits Banner */}
            {form.referralCode && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600">🎉</span>
                  <span className="text-sm font-medium text-green-800">
                    You're getting 10% off your first course!
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Signup form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  placeholder="Enter your full name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
            </div>

            {/* Referral Code Section - Enhanced */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Referral Code
                </label>
                <span className="text-xs text-green-600 font-medium">Get 10% off!</span>
              </div>
              <div className="relative">
                <input
                  className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    referralValidation.isValid === true 
                      ? 'border-green-400 focus:ring-green-500 focus:border-green-400' 
                      : referralValidation.isValid === false 
                      ? 'border-red-400 focus:ring-red-500 focus:border-red-400'
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-400'
                  }`}
                  placeholder="Enter referral code to get 10% off"
                  type="text"
                  name="referralCode"
                  value={form.referralCode}
                  onChange={onChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {referralValidation.isValidating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-purple-600"></div>
                  ) : referralValidation.isValid === true ? (
                    <span className="text-green-500">✓</span>
                  ) : referralValidation.isValid === false ? (
                    <span className="text-red-500">✗</span>
                  ) : (
                    <span className="text-gray-400">🎟️</span>
                  )}
                </div>
              </div>
              
              {/* Validation feedback */}
              {referralValidation.message && (
                <div className={`text-xs px-2 py-1 rounded-lg ${
                  referralValidation.isValid === true 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : referralValidation.isValid === false 
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  {referralValidation.message}
                </div>
              )}
              
              {/* Referrer info display */}
              {referralValidation.isValid && referralValidation.referrerInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">👋</span>
                    <span className="text-sm text-green-700">
                      Referred by <strong>{referralValidation.referrerInfo.name}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                  placeholder="Create a strong password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  minLength={8}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                className="mt-1 rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" 
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Signup button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "🔄 Creating Account..." : "🚀 Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social signup options */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
              <span className="text-xl">🔍</span>
              Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#166FE5] transition-all duration-300">
              <span className="text-xl">📘</span>
              Sign up with Facebook
            </button>
          </div>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
          
          {/* Referral Info Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🎁 Referral Program</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Get 10% off your first course with a referral code</p>
                <p>• Earn 50 coins when your referrals make their first purchase</p>
                <p>• Share your referral link to invite friends</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse-float"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full opacity-60 animate-pulse-float animation-delay-1000"></div>
      </div>
    </div>
  );
}
