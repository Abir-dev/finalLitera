// src/pages/Profile.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import profileService from "../services/profileService.js";
import {
  User,
  BookOpen,
  CheckCircle,
  Award,
  TrendingUp,
  Link,
  Settings,
  Lock,
  Mail,
  Globe,
  Github,
  Twitter,
} from "lucide-react";

const brand = { blue: "#18457A" };

// Personal Info Card Component
const PersonalInfoCard = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
          border: "1px solid var(--brand)30",
        }}
      >
        <User size={20} style={{ color: "var(--brand)" }} />
      </div>
      <h3
        className="text-xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Personal Information
      </h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          className="input-premium"
          placeholder="Enter your first name"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          className="input-premium"
          placeholder="Enter your last name"
        />
      </div>
    </div>

    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={onChange}
        className="input-premium"
        placeholder="Enter your email address"
      />
    </div>

    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Bio
      </label>
      <textarea
        name="profile.bio"
        value={form.profile.bio}
        onChange={onChange}
        rows={4}
        className="input-premium"
        placeholder="Tell us about yourself..."
      />
    </div>
  </div>
);

// Social Links Card Component
const SocialLinksCard = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
          border: "1px solid var(--accent-rose)30",
        }}
      >
        <Link size={20} style={{ color: "var(--accent-rose)" }} />
      </div>
      <h3
        className="text-xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Social Links
      </h3>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div>
        <label
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Globe size={16} />
          Website
        </label>
        <input
          type="url"
          name="profile.socialLinks.website"
          value={form.profile.socialLinks.website}
          onChange={onChange}
          className="input-premium"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <label
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          <User size={16} />
          LinkedIn
        </label>
        <input
          type="url"
          name="profile.socialLinks.linkedin"
          value={form.profile.socialLinks.linkedin}
          onChange={onChange}
          className="input-premium"
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <div>
        <label
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Github size={16} />
          GitHub
        </label>
        <input
          type="url"
          name="profile.socialLinks.github"
          value={form.profile.socialLinks.github}
          onChange={onChange}
          className="input-premium"
          placeholder="https://github.com/yourusername"
        />
      </div>

      <div>
        <label
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Twitter size={16} />
          Twitter
        </label>
        <input
          type="url"
          name="profile.socialLinks.twitter"
          value={form.profile.socialLinks.twitter}
          onChange={onChange}
          className="input-premium"
          placeholder="https://twitter.com/yourusername"
        />
      </div>
    </div>
  </div>
);

// Preferences Card Component
const PreferencesCard = ({ form, onChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
          border: "1px solid var(--accent-gold)30",
        }}
      >
        <Settings size={20} style={{ color: "var(--accent-gold)" }} />
      </div>
      <h3
        className="text-xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Notification Preferences
      </h3>
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div
        className="card-premium p-4 sm:p-6"
        style={{ minHeight: "auto", maxHeight: "none" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Mail size={16} />
              Email Notifications
            </label>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Receive notifications via email
            </p>
          </div>
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              name="preferences.notifications.email"
              checked={form.preferences.notifications.email}
              onChange={onChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div
        className="card-premium p-4 sm:p-6"
        style={{ minHeight: "auto", maxHeight: "none" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Settings size={16} />
              Push Notifications
            </label>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Receive push notifications in browser
            </p>
          </div>
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              name="preferences.notifications.push"
              checked={form.preferences.notifications.push}
              onChange={onChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div
        className="card-premium p-4 sm:p-6"
        style={{ minHeight: "auto", maxHeight: "none" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <BookOpen size={16} />
              Course Updates
            </label>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Get notified about course updates
            </p>
          </div>
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              name="preferences.notifications.courseUpdates"
              checked={form.preferences.notifications.courseUpdates}
              onChange={onChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div
        className="card-premium p-4 sm:p-6"
        style={{ minHeight: "auto", maxHeight: "none" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Mail size={16} />
              Marketing Emails
            </label>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Receive promotional content and offers
            </p>
          </div>
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              name="preferences.notifications.marketing"
              checked={form.preferences.notifications.marketing}
              onChange={onChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Security Card Component
const SecurityCard = ({ user, setShowPasswordModal }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-emerald)20, var(--accent-emerald)10)",
          border: "1px solid var(--accent-emerald)30",
        }}
      >
        <Lock size={20} style={{ color: "var(--accent-emerald)" }} />
      </div>
      <h3
        className="text-xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Security Settings
      </h3>
    </div>

    <div className="space-y-4">
      <div
        className="card-premium p-6"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-gold)10, var(--accent-gold)5)",
          border: "1px solid var(--accent-gold)30",
          minHeight: "auto",
          maxHeight: "none",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold)30, var(--accent-gold)20)",
              }}
            >
              <Lock size={24} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
          <div className="flex-1">
            <h4
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Password Security
            </h4>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Keep your account secure by regularly updating your password. Use
              a strong password with at least 8 characters.
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-premium px-4 py-2 text-sm font-medium"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div
        className="card-premium p-6"
        style={{
          background: "linear-gradient(135deg, var(--brand)10, var(--brand)5)",
          border: "1px solid var(--brand)30",
          minHeight: "auto",
          maxHeight: "none",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand)30, var(--brand)20)",
              }}
            >
              <User size={24} style={{ color: "var(--brand)" }} />
            </div>
          </div>
          <div className="flex-1">
            <h4
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Account Information
            </h4>
            <div
              className="space-y-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <div className="flex justify-between">
                <span>Account created:</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(user?.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Account status:</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [stats, setStats] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile: {
      bio: "",
      socialLinks: {
        website: "",
        linkedin: "",
        github: "",
        twitter: "",
      },
      skills: [],
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        courseUpdates: true,
        marketing: false,
      },
      language: "en",
      timezone: "UTC",
    },
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getUserStats();
        const userData = response.user;

        // Update form with real user data
        setForm({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          profile: {
            bio: userData.profile?.bio || "",
            socialLinks: {
              website: userData.profile?.socialLinks?.website || "",
              linkedin: userData.profile?.socialLinks?.linkedin || "",
              github: userData.profile?.socialLinks?.github || "",
              twitter: userData.profile?.socialLinks?.twitter || "",
            },
            skills: userData.profile?.skills || [],
          },
          preferences: {
            notifications: {
              email: userData.preferences?.notifications?.email ?? true,
              push: userData.preferences?.notifications?.push ?? true,
              courseUpdates:
                userData.preferences?.notifications?.courseUpdates ?? true,
              marketing:
                userData.preferences?.notifications?.marketing ?? false,
            },
            language: userData.preferences?.language || "en",
            timezone: userData.preferences?.timezone || "UTC",
          },
        });

        setStats(response.stats);
        setUser(userData); // Update auth context with latest data
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [setUser]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child, subChild] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild
            ? {
                ...prev[parent][child],
                [subChild]: type === "checkbox" ? checked : value,
              }
            : type === "checkbox"
            ? checked
            : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await profileService.updateProfile(form);
      setUser(response.data.user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);
      await profileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert(
        error.response?.data?.message ||
          "Error changing password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          "Please upload a valid file type (PDF, DOC, DOCX, TXT, or Image)"
        );
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setUploadedFile({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      });

      // Update form with file name
      setForm((prev) => ({ ...prev, resume: file.name }));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
      setForm((prev) => ({ ...prev, resume: "" }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("text")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    return "📎";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Profile Card */}
      <div
        className="card-premium p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-strong), var(--brand))",
          color: "white",
          minHeight: "auto",
          maxHeight: "none",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center relative"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <img
                src={user?.avatar || "/icons/profile.svg"}
                alt="Profile"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
                {form.firstName} {form.lastName}
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-1">
                {form.email}
              </p>
              <p className="text-white/60 text-sm">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
              {form.profile.bio && (
                <p className="text-white/70 text-sm mt-2 max-w-md">
                  {form.profile.bio}
                </p>
              )}
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {stats?.enrolledCourses || 0}
            </div>
            <div className="text-white/60 text-sm">Enrolled Courses</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300"
          style={{ minHeight: "auto", maxHeight: "none" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs sm:text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Active Courses
              </p>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats?.enrolledCourses || 0}
              </p>
            </div>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
                border: "1px solid var(--brand)30",
              }}
            >
              <BookOpen size={20} style={{ color: "var(--brand)" }} />
            </div>
          </div>
        </div>

        <div
          className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300"
          style={{ minHeight: "auto", maxHeight: "none" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs sm:text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Completed
              </p>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats?.completedCourses || 0}
              </p>
            </div>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
                border: "1px solid var(--accent-gold)30",
              }}
            >
              <CheckCircle size={20} style={{ color: "var(--accent-gold)" }} />
            </div>
          </div>
        </div>

        <div
          className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300"
          style={{ minHeight: "auto", maxHeight: "none" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs sm:text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Certificates
              </p>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats?.certificates || 0}
              </p>
            </div>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                border: "1px solid var(--accent-rose)30",
              }}
            >
              <Award size={20} style={{ color: "var(--accent-rose)" }} />
            </div>
          </div>
        </div>

        <div
          className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300"
          style={{ minHeight: "auto", maxHeight: "none" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs sm:text-sm font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Avg Progress
              </p>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stats?.averageProgress || 0}%
              </p>
            </div>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
                border: "1px solid var(--brand-strong)30",
              }}
            >
              <TrendingUp size={20} style={{ color: "var(--brand-strong)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Card */}
      <div
        className="card-premium p-0 overflow-hidden"
        style={{ minHeight: "auto", maxHeight: "none" }}
      >
        <div className="border-b" style={{ borderColor: "var(--border)" }}>
          <nav className="flex overflow-x-auto px-6">
            {[
              {
                id: "personal",
                label: "Personal Info",
                icon: <User size={18} style={{ color: "var(--brand)" }} />,
              },
              {
                id: "social",
                label: "Social Links",
                icon: <Link size={18} style={{ color: "var(--brand)" }} />,
              },
              {
                id: "preferences",
                label: "Preferences",
                icon: <Settings size={18} style={{ color: "var(--brand)" }} />,
              },
              {
                id: "security",
                label: "Security",
                icon: <Lock size={18} style={{ color: "var(--brand)" }} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 border-b-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-brand text-brand"
                    : "border-transparent hover:text-brand hover:border-brand/30"
                }`}
                style={{
                  borderBottomColor:
                    activeTab === tab.id ? "var(--brand)" : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--brand)"
                      : "var(--text-secondary)",
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content Card */}
        <div className="xl:col-span-2 order-2 xl:order-1">
          <div
            className="card-premium p-4 sm:p-6 lg:p-8"
            style={{ minHeight: "auto", maxHeight: "none" }}
          >
            {activeTab === "personal" && (
              <PersonalInfoCard form={form} onChange={onChange} />
            )}

            {activeTab === "social" && (
              <SocialLinksCard form={form} onChange={onChange} />
            )}

            {activeTab === "preferences" && (
              <PreferencesCard form={form} onChange={onChange} />
            )}

            {activeTab === "security" && (
              <SecurityCard
                user={user}
                setShowPasswordModal={setShowPasswordModal}
              />
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
          {/* Account Summary Card */}
          <div
            className="card-premium p-4 sm:p-6"
            style={{ minHeight: "auto", maxHeight: "none" }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Account Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Status
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Plan
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Premium
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Joined
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div
            className="card-premium p-4 sm:p-6"
            style={{ minHeight: "auto", maxHeight: "none" }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Quick Actions
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full btn-outline-premium text-left flex items-center gap-2 text-sm"
              >
                <Lock size={16} />
                Change Password
              </button>
              <button className="w-full btn-outline-premium text-left flex items-center gap-2 text-sm">
                <Mail size={16} />
                Update Email
              </button>
              <button className="w-full btn-outline-premium text-left flex items-center gap-2 text-sm">
                <Settings size={16} />
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Social Links Preview Card */}
          {(form.profile.socialLinks.website ||
            form.profile.socialLinks.linkedin ||
            form.profile.socialLinks.github ||
            form.profile.socialLinks.twitter) && (
            <div
              className="card-premium p-4 sm:p-6"
              style={{ minHeight: "auto", maxHeight: "none" }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Social Links
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {form.profile.socialLinks.website && (
                  <a
                    href={form.profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-brand transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
                {form.profile.socialLinks.linkedin && (
                  <a
                    href={form.profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-brand transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <User size={16} />
                    LinkedIn
                  </a>
                )}
                {form.profile.socialLinks.github && (
                  <a
                    href={form.profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-brand transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                )}
                {form.profile.socialLinks.twitter && (
                  <a
                    href={form.profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-brand transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Twitter size={16} />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn-premium px-8 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl transition-all">
              <div
                className="card-premium p-0 text-left shadow-xl"
                style={{
                  minHeight: "auto",
                  maxHeight: "none",
                  background:
                    "linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
                  border: "1px solid var(--border-hover)",
                }}
              >
                {/* Modal Header */}
                <div
                  className="relative px-6 py-4 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-gold)30, var(--accent-gold)20)",
                      }}
                    >
                      <Lock size={20} style={{ color: "var(--accent-gold)" }} />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Change Password
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Update your account password for better security
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-6">
                  <div className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <label
                        className="text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Lock size={16} />
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        className="text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Lock size={16} />
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                      />
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        className="text-sm font-medium mb-2 flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <CheckCircle size={16} />
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                      />
                      {passwordForm.newPassword &&
                        passwordForm.confirmPassword &&
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--error)" }}
                          >
                            Passwords do not match
                          </p>
                        )}
                    </div>

                    {/* Security Tips */}
                    <div
                      className="card-premium p-4"
                      style={{
                        minHeight: "auto",
                        maxHeight: "none",
                        background:
                          "linear-gradient(135deg, var(--accent-emerald)10, var(--accent-emerald)5)",
                        border: "1px solid var(--accent-emerald)30",
                      }}
                    >
                      <h4
                        className="text-sm font-semibold mb-2 flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Security Tips
                      </h4>
                      <ul
                        className="text-xs space-y-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <li>
                          • Use a mix of uppercase, lowercase, numbers and
                          symbols
                        </li>
                        <li>
                          • Avoid using personal information in your password
                        </li>
                        <li>
                          • Make it at least 8 characters long for better
                          security
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  className="px-6 py-4 border-t flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-end sm:space-x-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full sm:w-auto btn-outline-premium px-6 py-2.5 text-sm font-medium order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      saving ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      passwordForm.newPassword !==
                        passwordForm.confirmPassword ||
                      passwordForm.newPassword.length < 6
                    }
                    className="w-full sm:w-auto btn-premium px-6 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Changing...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
