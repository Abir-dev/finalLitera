// src/pages/Notifications.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Bell,
  Mail,
  BookOpen,
  CreditCard,
  Settings2,
  Megaphone,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { notificationService } from "../services/notificationService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

const brand = { blue: "#18457A", green: "#16a34a", red: "#dc2626" };

function NotificationCard({
  id,
  title,
  message,
  time,
  type,
  isRead,
  onMarkAsRead,
  onDelete,
  actionUrl,
  actionText,
}) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "course":
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <BookOpen size={18} style={{ color: "var(--brand)" }} />
          </div>
        );
      case "payment":
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
              border: "1px solid var(--accent-gold)30",
            }}
          >
            <CreditCard size={18} style={{ color: "var(--accent-gold)" }} />
          </div>
        );
      case "system":
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
              border: "1px solid var(--accent-rose)30",
            }}
          >
            <Settings2 size={18} style={{ color: "var(--accent-rose)" }} />
          </div>
        );
      default:
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
              border: "1px solid var(--brand-strong)30",
            }}
          >
            <Bell size={18} style={{ color: "var(--brand-strong)" }} />
          </div>
        );
    }
  };

  const handleMarkAsRead = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "course":
        return "from-blue-50 to-cyan-50 border-blue-200";
      case "payment":
        return "from-green-50 to-emerald-50 border-green-200";
      case "system":
        return "from-purple-50 to-pink-50 border-purple-200";
      default:
        return "from-gray-50 to-slate-50 border-gray-200";
    }
  };

  return (
    <div
      className={`card-premium p-6 hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getTypeIcon(type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-lg font-bold`}
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full shadow-sm"
              style={{
                color: "var(--text-muted)",
                background: "var(--surface)",
              }}
            >
              {time}
            </span>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {message}
          </p>
          <div className="mt-4 flex items-center justify-between">
            {!isRead && (
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--brand)" }}
                ></div>
                <button
                  onClick={handleMarkAsRead}
                  className="text-sm font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
                  style={{
                    color: "var(--brand)",
                    background: "var(--surface)",
                  }}
                >
                  Mark as read
                </button>
              </div>
            )}
            <div className="flex gap-2">
              {actionUrl && actionText && (
                <a
                  href={actionUrl}
                  className="text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
                  style={{
                    color: "var(--brand)",
                    background: "var(--surface)",
                  }}
                >
                  {actionText}
                </a>
              )}
              <button
                onClick={handleDelete}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                title="Delete notification"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationPreference({
  title,
  description,
  enabled,
  onToggle,
  icon,
}) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              enabled
                ? "bg-gradient-to-r from-green-100 to-emerald-100"
                : "bg-gradient-to-r from-gray-100 to-slate-100"
            }`}
          >
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
            enabled
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-gray-300 to-slate-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
              enabled ? "translate-x-8" : "translate-x-1"
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
    email: true,
    push: false,
    courseUpdates: true,
    marketing: false,
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    unreadCount: 0,
  });
  const [error, setError] = useState(null);
  const { toasts, success, error: showError, removeToast } = useToast();

  // Fetch notifications and preferences
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch notifications and preferences in parallel
        const [notificationsRes, preferencesRes] = await Promise.allSettled([
          notificationService.getNotifications({
            page: pagination.current,
            limit: 20,
          }),
          notificationService.getPreferences(),
        ]);

        // Handle notifications response
        if (notificationsRes.status === "fulfilled") {
          const items = (notificationsRes.value?.data?.notifications || []).map(
            (n) => ({
              id: n._id,
              title: n.title,
              message: n.message,
              time: new Date(n.createdAt).toLocaleString(),
              type: n.type?.includes("payment")
                ? "payment"
                : n.type?.includes("system")
                ? "system"
                : "course",
              isRead: n.isRead,
              actionUrl: n.actionUrl,
              actionText: n.actionText,
            })
          );

          setNotifications(items);
          setPagination(notificationsRes.value?.data?.pagination || pagination);
        } else {
          console.error(
            "Failed to fetch notifications:",
            notificationsRes.reason
          );
          setError("Failed to load notifications");
        }

        // Handle preferences response
        if (preferencesRes.status === "fulfilled") {
          setPreferences(
            preferencesRes.value?.data?.preferences || preferences
          );
        } else {
          console.warn("Failed to fetch preferences:", preferencesRes.reason);
          // Keep default preferences if fetch fails
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load notifications");
        showError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.current]);

  // Socket connection for real-time notifications
  useEffect(() => {
    const apiEnv =
      import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
    const normalizedApi = apiEnv.endsWith("/api")
      ? apiEnv
      : `${apiEnv.replace(/\/$/, "")}/api`;
    const backendURL = normalizedApi.replace(/\/api$/, "");

    const socket = io(backendURL, {
      withCredentials: true,
      path: "/socket.io",
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("new_notification", (payload) => {
      setNotifications((prev) => [
        {
          id: payload.id,
          title: payload.title,
          message: payload.message,
          time: new Date(payload.timestamp || Date.now()).toLocaleString(),
          type: payload.type?.includes("payment")
            ? "payment"
            : payload.type?.includes("system")
            ? "system"
            : "course",
          isRead: false,
          actionUrl: payload.actionUrl,
          actionText: payload.actionText,
        },
        ...prev,
      ]);
      setPagination((prev) => ({ ...prev, unreadCount: prev.unreadCount + 1 }));
    });

    return () => socket.disconnect();
  }, []);

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [notificationId]: true }));
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setPagination((prev) => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));

      // Refresh navbar notification count
      if (window.refreshNotificationCount) {
        window.refreshNotificationCount();
      }

      success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read");
      showError("Failed to mark notification as read");
    } finally {
      setActionLoading((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading((prev) => ({ ...prev, markAll: true }));
      await notificationService.markAllAsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setPagination((prev) => ({ ...prev, unreadCount: 0 }));

      // Refresh navbar notification count
      if (window.refreshNotificationCount) {
        window.refreshNotificationCount();
      }

      success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Failed to mark all notifications as read");
      showError("Failed to mark all notifications as read");
    } finally {
      setActionLoading((prev) => ({ ...prev, markAll: false }));
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [notificationId]: true }));
      await notificationService.deleteNotification(notificationId);

      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Update unread count if the deleted notification was unread
      if (notification && !notification.isRead) {
        setPagination((prev) => ({
          ...prev,
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }));
      }

      // Refresh navbar notification count
      if (window.refreshNotificationCount) {
        window.refreshNotificationCount();
      }

      success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification");
      showError("Failed to delete notification");
    } finally {
      setActionLoading((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  // Handle preference toggle
  const togglePreference = async (key) => {
    try {
      setPreferencesLoading(true);
      const newPreferences = { ...preferences, [key]: !preferences[key] };

      // Optimistically update the UI
      setPreferences(newPreferences);

      try {
        await notificationService.updatePreferences(newPreferences);
        success("Notification preferences updated");
      } catch (error) {
        // Revert the optimistic update on error
        setPreferences(preferences);
        console.error("Error updating preferences:", error);
        showError("Failed to update notification preferences");
      }
    } finally {
      setPreferencesLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current: newPage }));
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {/* Header */}
        <div className="card-premium p-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell size={24} style={{ color: "var(--brand)" }} />
              <h1
                className="heading-2 text-2xl md:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                Notifications
              </h1>
            </div>
            <p
              className="text-[12px] mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage your notification preferences and view recent updates
            </p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading.markAll || pagination.unreadCount === 0}
            className="btn-premium px-6 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {actionLoading.markAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Marking...
              </>
            ) : (
              `Mark All as Read (${pagination.unreadCount})`
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="card-premium p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "all" ? "btn-premium" : "btn-outline-premium"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Notifications
            </button>
            <button
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "course" ? "btn-premium" : "btn-outline-premium"
              }`}
              onClick={() => setActiveTab("course")}
            >
              Course Updates
            </button>
            <button
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "payment" ? "btn-premium" : "btn-outline-premium"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              Payment Alerts
            </button>
            <button
              className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "system" ? "btn-premium" : "btn-outline-premium"
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
                <Bell size={20} style={{ color: "var(--brand)" }} />
                <h2
                  className="heading-3 text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  Recent Notifications
                </h2>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2
                    size={32}
                    className="animate-spin"
                    style={{ color: "var(--brand)" }}
                  />
                  <span
                    className="ml-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Loading notifications...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-premium px-4 py-2 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell
                    size={48}
                    className="mx-auto mb-4 opacity-50"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {activeTab === "all"
                      ? "No notifications yet"
                      : `No ${activeTab} notifications`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        {...notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={pagination.current === 1}
                        className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Previous
                      </button>
                      <span
                        className="px-3 py-1 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Page {pagination.current} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={pagination.current === pagination.pages}
                        className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preferences Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 size={20} style={{ color: "var(--brand)" }} />
                <h2
                  className="heading-3 text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  Notification Preferences
                </h2>
              </div>
              {preferencesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={24}
                    className="animate-spin"
                    style={{ color: "var(--brand)" }}
                  />
                  <span
                    className="ml-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Updating preferences...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <NotificationPreference
                    title="Email Notifications"
                    description="Receive notifications via email"
                    enabled={preferences.email}
                    onToggle={() => togglePreference("email")}
                    icon={<Mail size={18} style={{ color: "var(--brand)" }} />}
                  />
                  <NotificationPreference
                    title="Push Notifications"
                    description="Receive push notifications in browser"
                    enabled={preferences.push}
                    onToggle={() => togglePreference("push")}
                    icon={<Bell size={18} style={{ color: "var(--brand)" }} />}
                  />
                  <NotificationPreference
                    title="Course Updates"
                    description="Get notified about new courses and updates"
                    enabled={preferences.courseUpdates}
                    onToggle={() => togglePreference("courseUpdates")}
                    icon={
                      <BookOpen size={18} style={{ color: "var(--brand)" }} />
                    }
                  />
                  <NotificationPreference
                    title="Marketing Emails"
                    description="Receive promotional and marketing emails"
                    enabled={preferences.marketing}
                    onToggle={() => togglePreference("marketing")}
                    icon={
                      <Megaphone size={18} style={{ color: "var(--brand)" }} />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
