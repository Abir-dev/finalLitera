// src/pages/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    try {
      // TODO: replace with API call to create user
      // Example:
      // await api.post("/signup", form)
      console.log("Sign up payload:", form);
      // On success, navigate to login or dashboard
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };

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
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse-float"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full opacity-60 animate-pulse-float animation-delay-1000"></div>
      </div>
    </div>
  );
}
