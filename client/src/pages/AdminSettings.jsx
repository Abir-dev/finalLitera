import React, { useState } from "react";
import axios from "axios";
import { 
  Bell, 
  Shield, 
  Palette, 
  Settings as SettingsIcon, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  FileText,
  Mail,
  Smartphone,
  MessageSquare,
  Lock,
  Clock,
  Globe,
  Database,
  AlertTriangle,
  Trash2,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    appearance: {
      theme: "light",
      language: "en",
      timezone: "Asia/Kolkata"
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
      debugMode: false
    }
  });

  const [activeTab, setActiveTab] = useState("notifications");
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "system", name: "System", icon: SettingsIcon }
  ];

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
            border: '1px solid var(--brand)30'
          }}>
            <Mail size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">Email Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.notifications.email 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.notifications.email && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Receive email notifications for important events</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Includes: new student registrations, course completions, payment confirmations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
            border: '1px solid var(--accent-rose)30'
          }}>
            <Bell size={20} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">Push Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.notifications.push 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.notifications.push && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Enable push notifications in browser</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Real-time updates for admin activities and system alerts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
            border: '1px solid var(--accent-gold)30'
          }}>
            <MessageSquare size={20} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">SMS Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.notifications.sms 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.notifications.sms && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Receive SMS notifications for critical alerts</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Emergency system notifications and security alerts only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
            border: '1px solid var(--brand)30'
          }}>
            <Shield size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">Two-Factor Authentication</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) => handleSettingChange("security", "twoFactor", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.security.twoFactor 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.security.twoFactor && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Require 2FA for admin login</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Adds an extra layer of security to your admin account
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
            border: '1px solid var(--accent-rose)30'
          }}>
            <Clock size={20} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-white">Session Management</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Session Timeout (minutes)
                </label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
                  className="input-premium w-full"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Automatically log out after inactivity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
            border: '1px solid var(--accent-gold)30'
          }}>
            <Lock size={20} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-white">Password Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Password Expiry (days)
                </label>
                <select
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleSettingChange("security", "passwordExpiry", parseInt(e.target.value))}
                  className="input-premium w-full"
                >
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                </select>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Force password change after specified period
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
            border: '1px solid var(--brand)30'
          }}>
            <Palette size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-white">Theme Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Admin Panel Theme
                </label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
                  className="input-premium w-full"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
            border: '1px solid var(--accent-rose)30'
          }}>
            <Globe size={20} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-white">Language & Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Language
                </label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
                  className="input-premium w-full"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Timezone
                </label>
                <select
                  value={settings.appearance.timezone}
                  onChange={(e) => handleSettingChange("appearance", "timezone", e.target.value)}
                  className="input-premium w-full"
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Singapore">Singapore (SGT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      {/* Backup & Maintenance */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
            border: '1px solid var(--brand)30'
          }}>
            <Database size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">Backup & Maintenance</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.system.autoBackup}
                    onChange={(e) => handleSettingChange("system", "autoBackup", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.system.autoBackup 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.system.autoBackup && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Enable automatic daily backups</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Automatically backup database and files daily at 2:00 AM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Mode */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
            border: '1px solid var(--accent-rose)30'
          }}>
            <SettingsIcon size={20} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">System Mode</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSettingChange("system", "maintenanceMode", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.system.maintenanceMode 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.system.maintenanceMode && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Enable maintenance mode</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Temporarily disable student access for system maintenance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Maintenance Quick Action */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
            border: '1px solid var(--accent-gold)30'
          }}>
            <AlertTriangle size={20} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-white">Server Maintenance</h3>
            <MaintenanceNotice />
          </div>
        </div>
      </div>

      {/* Debug & Development */}
      <div className="card-premium p-6 group hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)',
            border: '1px solid var(--brand-strong)30'
          }}>
            <FileText size={20} style={{ color: 'var(--brand-strong)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-white">Debug & Development</h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.system.debugMode}
                    onChange={(e) => handleSettingChange("system", "debugMode", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                    settings.system.debugMode 
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-600 border-transparent' 
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {settings.system.debugMode && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-white">Enable debug mode</span>
              </label>
              <div className="ml-9 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Show detailed error messages and system logs (development only)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-premium p-6 group hover-lift border-2 border-red-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-4 text-red-400">⚠️ Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button className="btn-premium bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 text-sm">
                  <Trash2 size={16} className="mr-2" />
                  Clear All Data
                </button>
                <button className="btn-premium bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-4 py-2 text-sm">
                  <RefreshCw size={16} className="mr-2" />
                  Reset to Defaults
                </button>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                These actions cannot be undone. Use with extreme caution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "appearance":
        return renderAppearanceTab();
      case "system":
        return renderSystemTab();
      default:
        return renderNotificationsTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-gray-300 mt-1">Configure your admin panel preferences and system settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="btn-premium px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="card-premium">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-premium p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 group">
            <Download size={24} className="mb-2 group-hover:scale-110 transition-transform duration-300 text-blue-400" />
            <span className="text-sm font-medium text-white group-hover:text-blue-400">Export Settings</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-green-400 hover:bg-green-500/10 transition-all duration-300 group">
            <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform duration-300 text-green-400" />
            <span className="text-sm font-medium text-white group-hover:text-green-400">Import Settings</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 group">
            <RotateCcw size={24} className="mb-2 group-hover:scale-110 transition-transform duration-300 text-yellow-400" />
            <span className="text-sm font-medium text-white group-hover:text-yellow-400">Reset All</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 group">
            <FileText size={24} className="mb-2 group-hover:scale-110 transition-transform duration-300 text-purple-400" />
            <span className="text-sm font-medium text-white group-hover:text-purple-400">View Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MaintenanceNotice() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
  const normalizedApi = apiEnv.endsWith("/api") ? apiEnv : `${apiEnv.replace(/\/$/, "")}/api`;
  const backendURL = normalizedApi.replace(/\/api$/, "");

  const sendNotice = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${backendURL}/api/admin/notifications/maintenance`,
        { hours, minutes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Maintenance notice sent to all students');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to send maintenance notice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Hours</label>
          <input
            type="number"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => setHours(Math.max(0, Math.min(24, parseInt(e.target.value || '0'))))}
            className="input-premium w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value || '0'))))}
            className="input-premium w-full"
          />
        </div>
      </div>
      <button
        onClick={sendNotice}
        disabled={submitting}
        className="btn-premium px-6 py-2 text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
      >
        <AlertTriangle size={16} />
        {submitting ? 'Sending...' : 'Send Maintenance Notice'}
      </button>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Sends an urgent notification to all students indicating maintenance duration and expected resume time.
      </p>
    </div>
  );
}
