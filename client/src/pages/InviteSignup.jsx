// src/pages/InviteSignup.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SignupModal from "../components/SignupModal.jsx";
import LoginModal from "../components/LoginModal.jsx";

export default function InviteSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Extract referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref);
      // Auto-open signup modal if user is not logged in
      if (!user) {
        setIsSignupModalOpen(true);
      } else {
        // If user is already logged in, redirect to dashboard
        navigate("/dashboard");
      }
    } else {
      // If no referral code, redirect to home
      navigate("/");
    }
  }, [location.search, user, navigate]);

  // If user is logged in, redirect to dashboard
  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md text-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome!
            </h1>
            <p className="text-gray-600 mt-2">You've been invited to join Litera</p>
            
            {/* Referral Benefits Banner */}
            {referralCode && (
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

          {/* Call to action */}
          <div className="space-y-4">
            <p className="text-gray-600">
              {referralCode 
                ? `Your friend has invited you to join Litera with referral code: ${referralCode}`
                : "Join Litera and start your learning journey!"
              }
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 Create Account
              </button>
              
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">🎁 What you get:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• 10% off your first course purchase</p>
              <p>• Access to premium courses</p>
              <p>• Earn coins for referrals</p>
              <p>• Join our learning community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
