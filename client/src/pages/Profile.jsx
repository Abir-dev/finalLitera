// src/pages/Profile.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import profileService from "../services/profileService.js";
import { User, BookOpen, CheckCircle, Award, TrendingUp, Link, Settings, Lock, Mail, Globe, Github, Twitter } from "lucide-react";

const brand = { blue: "#18457A" };

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [stats, setStats] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
        twitter: ""
      },
      skills: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        courseUpdates: true,
        marketing: false
      },
      language: 'en',
      timezone: 'UTC'
    }
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
              twitter: userData.profile?.socialLinks?.twitter || ""
            },
            skills: userData.profile?.skills || []
          },
          preferences: {
            notifications: {
              email: userData.preferences?.notifications?.email ?? true,
              push: userData.preferences?.notifications?.push ?? true,
              courseUpdates: userData.preferences?.notifications?.courseUpdates ?? true,
              marketing: userData.preferences?.notifications?.marketing ?? false
            },
            language: userData.preferences?.language || 'en',
            timezone: userData.preferences?.timezone || 'UTC'
          }
        });
        
        setStats(response.stats);
        setUser(userData); // Update auth context with latest data
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [setUser]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild ? {
            ...prev[parent][child],
            [subChild]: type === 'checkbox' ? checked : value
          } : (type === 'checkbox' ? checked : value)
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await profileService.updateProfile(form);
      setUser(response.data.user);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      await profileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Error changing password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid file type (PDF, DOC, DOCX, TXT, or Image)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      });
      
      // Update form with file name
      setForm(prev => ({ ...prev, resume: file.name }));
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
      setForm(prev => ({ ...prev, resume: "" }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('text')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header with Real-time Stats */}
      <div className="card-premium p-4 sm:p-8 mb-6 sm:mb-8" style={{ background: 'linear-gradient(135deg, var(--brand-strong), var(--brand))', color: 'white' }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <img 
                src={user?.avatar || "/icons/profile.svg"} 
                alt="Profile" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                {form.firstName} {form.lastName}
              </h1>
              <p className="text-white/80 text-base sm:text-lg">{form.email}</p>
              <p className="text-white/60 text-xs sm:text-sm">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-white">{stats?.enrolledCourses || 0}</div>
            <div className="text-white/60 text-xs sm:text-sm">Enrolled Courses</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Courses</p>
              <p className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats?.enrolledCourses || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
              <BookOpen size={16} className="sm:w-5 sm:h-5" style={{ color: 'var(--brand)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Completed</p>
              <p className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats?.completedCourses || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
              <CheckCircle size={16} className="sm:w-5 sm:h-5" style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Certificates</p>
              <p className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats?.certificates || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
              <Award size={16} className="sm:w-5 sm:h-5" style={{ color: 'var(--accent-rose)' }} />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 sm:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Progress</p>
              <p className="text-lg sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats?.averageProgress || 0}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
              <TrendingUp size={16} className="sm:w-5 sm:h-5" style={{ color: 'var(--brand-strong)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card-premium mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'personal', label: 'Personal Info', icon: <User size={16} style={{ color: 'var(--brand)' }} /> },
              { id: 'social', label: 'Social Links', icon: <Link size={16} style={{ color: 'var(--brand)' }} /> },
              { id: 'preferences', label: 'Preferences', icon: <Settings size={16} style={{ color: 'var(--brand)' }} /> },
              { id: 'security', label: 'Security', icon: <Lock size={16} style={{ color: 'var(--brand)' }} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent hover:text-brand hover:border-brand/30'
                }`}
                style={{ 
                  borderBottomColor: activeTab === tab.id ? 'var(--brand)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-secondary)'
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="card-premium p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className="input-premium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className="input-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="input-premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Social Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email Notifications</label>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  name="preferences.notifications.email"
                  checked={form.preferences.notifications.email}
                  onChange={onChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Push Notifications</label>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Receive push notifications in browser</p>
                </div>
                <input
                  type="checkbox"
                  name="preferences.notifications.push"
                  checked={form.preferences.notifications.push}
                  onChange={onChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course Updates</label>
                  <p className="text-sm text-gray-500">Get notified about course updates</p>
                </div>
                <input
                  type="checkbox"
                  name="preferences.notifications.courseUpdates"
                  checked={form.preferences.notifications.courseUpdates}
                  onChange={onChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Marketing Emails</label>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Receive promotional content and offers</p>
                </div>
                <input
                  type="checkbox"
                  name="preferences.notifications.marketing"
                  checked={form.preferences.notifications.marketing}
                  onChange={onChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Security Settings</h3>
            
            <div className="card-premium p-4" style={{ background: 'linear-gradient(135deg, var(--accent-gold)10, var(--accent-gold)5)', border: '1px solid var(--accent-gold)30' }}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock size={20} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Password Security
                  </h3>
                  <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>Keep your account secure by regularly updating your password.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="btn-premium px-4 py-2 text-sm font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-4" style={{ background: 'linear-gradient(135deg, var(--brand)10, var(--brand)5)', border: '1px solid var(--brand)30' }}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <User size={20} style={{ color: 'var(--brand)' }} />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Account Information
                  </h3>
                  <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>Account created: {new Date(user?.createdAt).toLocaleDateString()}</p>
                    <p>Last updated: {new Date(user?.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="btn-premium px-6 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md card-premium">
            <div className="mt-3">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="input-premium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input-premium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-premium"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-outline-premium px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="btn-premium px-4 py-2 disabled:opacity-50"
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
