import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Use proper authentication from AuthContext
      await login(email, password);
      
      // Show success message briefly
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
        
        // Show redirecting message and then navigate
        setTimeout(() => {
          setIsRedirecting(true);
          setTimeout(() => {
            // Always redirect to dashboard after login
            navigate("/dashboard", { replace: true });
          }, 1000);
        }, 1000);
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
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
                  className="w-full rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || showSuccess || isRedirecting}
              className={`w-full font-bold py-4 px-6 rounded-xl transform transition-all duration-300 shadow-lg ${
                isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 cursor-not-allowed'
                  : showSuccess
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-not-allowed'
                  : isRedirecting
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : showSuccess ? (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">✅</span>
                  <span>Login Successful!</span>
                </div>
              ) : isRedirecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Redirecting to Dashboard...</span>
                </div>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
              <span className="text-xl">🔍</span>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#166FE5] transition-all duration-300">
              <span className="text-xl">📘</span>
              Continue with Facebook
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-300"
            >
              Create one now
            </Link>
          </p>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-60 animate-pulse-float"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse-float animation-delay-1000"></div>
      </div>
    </div>
  );
}
