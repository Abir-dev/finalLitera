import React, { useState } from "react";

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
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "appearance", name: "Appearance", icon: "🎨" },
    { id: "system", name: "System", icon: "⚙️" }
  ];

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Receive email notifications for important events</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Includes: new student registrations, course completions, payment confirmations
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Enable push notifications in browser</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Real-time updates for admin activities and system alerts
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Receive SMS notifications for critical alerts</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Emergency system notifications and security alerts only
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactor}
              onChange={(e) => handleSettingChange("security", "twoFactor", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Require 2FA for admin login</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Adds an extra layer of security to your admin account
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Session Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Automatically log out after inactivity
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Password Policy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <select
              value={settings.security.passwordExpiry}
              onChange={(e) => handleSettingChange("security", "passwordExpiry", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Force password change after specified period
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Theme Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Panel Theme
            </label>
            <select
              value={settings.appearance.theme}
              onChange={(e) => handleSettingChange("appearance", "theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Language & Region</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.appearance.language}
              onChange={(e) => handleSettingChange("appearance", "language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.appearance.timezone}
              onChange={(e) => handleSettingChange("appearance", "timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
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
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Backup & Maintenance</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.system.autoBackup}
              onChange={(e) => handleSettingChange("system", "autoBackup", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Enable automatic daily backups</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Automatically backup database and files daily at 2:00 AM
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Mode</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleSettingChange("system", "maintenanceMode", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Enable maintenance mode</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Temporarily disable student access for system maintenance
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Debug & Development</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.system.debugMode}
              onChange={(e) => handleSettingChange("system", "debugMode", e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-3 text-gray-700">Enable debug mode</span>
          </label>
          <div className="ml-6 text-sm text-gray-500">
            Show detailed error messages and system logs (development only)
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Danger Zone</h3>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200">
            🗑️ Clear All Data
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200 ml-3">
            🔄 Reset to Defaults
          </button>
          <p className="text-sm text-gray-600 mt-2">
            These actions cannot be undone. Use with extreme caution.
          </p>
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-1">Configure your admin panel preferences and system settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "💾 Saving..." : "💾 Save Settings"}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">Export Settings</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📥</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Import Settings</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔄</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Reset All</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📋</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">View Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
