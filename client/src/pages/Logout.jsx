// src/pages/Logout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const brand = { blue: "#18457A", red: "#dc2626" };

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    // Use proper logout from AuthContext
    await logout();
    // Navigate to home page after logout
    navigate("/");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (!showConfirmation) {
    return (
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: brand.blue }}>
            Account Settings
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage your account and security settings</p>
        </div>

        {/* Account Actions Card */}
        <div className="bg-white border rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Logout Account</h2>
            <p className="text-sm text-slate-600">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-6 py-3 rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-full border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Additional Account Options */}
        <div className="mt-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Other Account Actions</h3>
          <div className="space-y-4">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Change Password</h4>
                    <p className="text-sm text-slate-600">Update your account password</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
                  Change
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Deactivate Account</h4>
                    <p className="text-sm text-slate-600">Temporarily disable your account</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
                  Deactivate
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Delete Account</h4>
                    <p className="text-sm text-slate-600">Permanently delete your account and data</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Confirmation Modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Logout</h3>
          <p className="text-sm text-slate-600">
            Are you sure you want to logout? Any unsaved changes will be lost.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 rounded-full text-white font-semibold transition-colors"
            style={{ backgroundColor: brand.red }}
          >
            Yes, Logout
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
