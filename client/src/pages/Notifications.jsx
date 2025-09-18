// src/pages/Notifications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Bell, Mail, BookOpen, CreditCard, Settings2, Megaphone } from "lucide-react";

const brand = { blue: "#18457A", green: "#16a34a", red: "#dc2626" };

function NotificationCard({ title, message, time, type, isRead }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "course":
        return (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
            <BookOpen size={18} style={{ color: 'var(--brand)' }} />
          </div>
        );
      case "payment":
        return (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
            <CreditCard size={18} style={{ color: 'var(--accent-gold)' }} />
          </div>
        );
      case "system":
        return (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
            <Settings2 size={18} style={{ color: 'var(--accent-rose)' }} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
            <Bell size={18} style={{ color: 'var(--brand-strong)' }} />
          </div>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "course": return "from-blue-50 to-cyan-50 border-blue-200";
      case "payment": return "from-green-50 to-emerald-50 border-green-200";
      case "system": return "from-purple-50 to-pink-50 border-purple-200";
      default: return "from-gray-50 to-slate-50 border-gray-200";
    }
  };

  return (
    <div className={`card-premium p-6 hover:scale-105 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {getTypeIcon(type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-bold`} style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full shadow-sm" style={{ color: 'var(--text-muted)', background: 'var(--surface)' }}>
              {time}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{message}</p>
          {!isRead && (
            <div className="mt-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand)' }}></div>
              <button className="text-sm font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-300 hover:shadow-md" style={{ color: 'var(--brand)', background: 'var(--surface)' }}>
                Mark as read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationPreference({ title, description, enabled, onToggle, icon }) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${enabled ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-gradient-to-r from-gray-100 to-slate-100'}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
            enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
              enabled ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    paymentReminders: true,
    marketingEmails: false,
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const apiEnv = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
    const normalizedApi = apiEnv.endsWith("/api") ? apiEnv : `${apiEnv.replace(/\/$/, "")}/api`;
    const backendURL = normalizedApi.replace(/\/api$/, "");
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const items = (res.data?.data?.notifications || []).map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          type: n.type?.includes("payment") ? "payment" : n.type?.includes("system") ? "system" : "course",
          isRead: n.isRead,
        }));
        setNotifications(items);
      } catch (e) {
        // ignore
      }
    };

    fetchNotifications();

    const socket = io(backendURL, { withCredentials: true, path: '/socket.io', transports: ['websocket'], reconnectionAttempts: 5 });
    socket.on("new_notification", (payload) => {
      setNotifications((prev) => [
        {
          id: payload.id,
          title: payload.title,
          message: payload.message,
          time: new Date(payload.timestamp || Date.now()).toLocaleString(),
          type: payload.type?.includes("payment") ? "payment" : payload.type?.includes("system") ? "system" : "course",
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, []);

  const filteredNotifications = activeTab === "all"
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
      {/* Header */}
      <div className="card-premium p-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell size={24} style={{ color: 'var(--brand)' }} />
            <h1 className="heading-2 text-2xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h1>
          </div>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your notification preferences and view recent updates</p>
        </div>
        <button className="btn-premium px-6 py-2 text-sm font-semibold">Mark All as Read</button>
      </div>

      {/* Tabs */}
      <div className="card-premium p-2 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "all" 
                ? "btn-premium" 
                : "btn-outline-premium"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Notifications
          </button>
          <button
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "course" 
                ? "btn-premium" 
                : "btn-outline-premium"
            }`}
            onClick={() => setActiveTab("course")}
          >
            Course Updates
          </button>
          <button
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "payment" 
                ? "btn-premium" 
                : "btn-outline-premium"
            }`}
            onClick={() => setActiveTab("payment")}
          >
            Payment Alerts
          </button>
          <button
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "system" 
                ? "btn-premium" 
                : "btn-outline-premium"
            }`}
            onClick={() => setActiveTab("system")}
          >
            System Notifications
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications List */}
        <div className="lg:col-span-2">
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} style={{ color: 'var(--brand)' }} />
              <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Recent Notifications</h2>
            </div>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard key={notification.id} {...notification} />
              ))}
            </div>
          </div>
        </div>

        {/* Preferences Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings2 size={20} style={{ color: 'var(--brand)' }} />
              <h2 className="heading-3 text-xl" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              <NotificationPreference
                title="Email Notifications"
                description="Receive notifications via email"
                enabled={preferences.emailNotifications}
                onToggle={() => togglePreference('emailNotifications')}
                icon={<Mail size={18} style={{ color: 'var(--brand)' }} />}
              />
              <NotificationPreference
                title="Push Notifications"
                description="Receive push notifications in browser"
                enabled={preferences.pushNotifications}
                onToggle={() => togglePreference('pushNotifications')}
                icon={<Bell size={18} style={{ color: 'var(--brand)' }} />}
              />
              <NotificationPreference
                title="Course Updates"
                description="Get notified about new courses and updates"
                enabled={preferences.courseUpdates}
                onToggle={() => togglePreference('courseUpdates')}
                icon={<BookOpen size={18} style={{ color: 'var(--brand)' }} />}
              />
              <NotificationPreference
                title="Payment Reminders"
                description="Receive payment due reminders"
                enabled={preferences.paymentReminders}
                onToggle={() => togglePreference('paymentReminders')}
                icon={<CreditCard size={18} style={{ color: 'var(--brand)' }} />}
              />
              <NotificationPreference
                title="Marketing Emails"
                description="Receive promotional and marketing emails"
                enabled={preferences.marketingEmails}
                onToggle={() => togglePreference('marketingEmails')}
                icon={<Megaphone size={18} style={{ color: 'var(--brand)' }} />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
