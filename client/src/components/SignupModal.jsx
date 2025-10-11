// src/components/SignupModal.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Auth context
import axios from "axios"; // for backend requests
import { toast } from "react-hot-toast";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth(); // setUser from AuthContext
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [referralValidation, setReferralValidation] = useState({ 
    isValidating: false, 
    isValid: null, 
    referrerInfo: null,
    message: ""
  });

  // Capture ?ref= from querystring when modal opens
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(location.search);
      const ref = params.get("ref");
      if (ref) {
        setFormData(prev => ({ ...prev, referralCode: ref }));
        validateReferralCode(ref);
      }
    }
  }, [isOpen, location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
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
      const response = await axios.post(`${apiEnv}/auth/validate-referral`, 
        { referralCode: code },
        { timeout: 10000 }
      );
      
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
      setReferralValidation({
        isValidating: false,
        isValid: false,
        referrerInfo: null,
        message: "Invalid referral code"
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://finallitera.onrender.com/api/auth/signup", // backend signup endpoint
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode || undefined,
        }
      );

      const data = response.data;

      // Save token in localStorage
      localStorage.setItem("authToken", data.token);

      // Set user in AuthContext
      setUser(data.user);

      // Show success message if referral was linked
      if (data.referralLinked && data.referrerInfo) {
        toast.success(`🎉 Welcome! You've been referred by ${data.referrerInfo.name}. You'll get 10% off your first course purchase!`);
      } else {
        toast.success("Account created successfully! 🎉");
      }

      onClose(); // Close modal
      navigate("/dashboard"); // redirect to dashboard
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSwitchToLogin = () => {
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 blur-2xl"></div>
      </div>

      {/* Main modal container */}
      <div className="relative w-full max-w-sm">
        <div className="card-premium p-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
                <span className="text-lg">✨</span>
              </div>
              <div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Join Us
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

          {/* Referral Benefits Banner */}
          {formData.referralCode && (
            <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600">🎉</span>
                <span className="text-sm font-medium text-green-800">
                  You're getting 10% off your first course!
                </span>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                  className="w-full input-premium"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                  className="w-full input-premium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full input-premium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                required
                className="w-full input-premium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
                className="w-full input-premium"
              />
            </div>

            {/* Referral Code Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold">Referral Code</label>
                <span className="text-xs text-green-600 font-medium">Get 10% off!</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  placeholder="Enter referral code (optional)"
                  className={`w-full input-premium ${
                    referralValidation.isValid === true 
                      ? 'border-green-400 focus:ring-green-500 focus:border-green-400' 
                      : referralValidation.isValid === false 
                      ? 'border-red-400 focus:ring-red-500 focus:border-red-400'
                      : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {referralValidation.isValidating ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-purple-600"></div>
                  ) : referralValidation.isValid === true ? (
                    <span className="text-green-500 text-sm">✓</span>
                  ) : referralValidation.isValid === false ? (
                    <span className="text-red-500 text-sm">✗</span>
                  ) : (
                    <span className="text-gray-400 text-sm">🎟️</span>
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-sm">👋</span>
                    <span className="text-xs text-green-700">
                      Referred by <strong>{referralValidation.referrerInfo.name}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start text-xs">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-[color:var(--border)] text-[color:var(--brand)] shadow-sm focus:border-[color:var(--brand)] focus:ring focus:ring-[color:var(--brand-soft)] focus:ring-opacity-50"
                required
              />
              <label className="ml-2 text-[color:var(--text-secondary)]">
                I agree to the{" "}
                <Link to="/terms" className="font-medium hover:underline text-[color:var(--text-primary)]">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-medium hover:underline text-[color:var(--text-primary)]">
                  Privacy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-3 px-4 rounded-lg"
            >
              {loading ? "Creating Account..." : "🚀 Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-1 divider-premium"></div>
            <span className="px-3 text-sm text-[color:var(--text-secondary)]">or</span>
            <div className="flex-1 divider-premium"></div>
          </div>

          {/* Social signup */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 btn-outline-premium font-semibold py-2.5 px-3 rounded-lg hover:scale-[1.01]">
              <img src="/icons/google.svg" alt="Google Logo" className="w-5 h-4 mb-0.5  items-center justify-center" />
              Google
            </button>
          </div>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-[color:var(--text-secondary)]">
            Already have an account?{" "}
            <button
              onClick={handleSwitchToLogin}
              className="font-semibold hover:underline transition-colors duration-300 text-[color:var(--text-primary)]"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
