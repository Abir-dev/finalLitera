import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService.js";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Ticket,
} from "lucide-react";

export default function AdminCoupons() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Form states
  const [form, setForm] = useState({
    code: "",
    percentOff: "",
    courseId: "",
    expiresAt: "",
    usageLimit: "",
  });

  // Load data on component mount
  useEffect(() => {
    loadCoupons();
    loadCourses();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCoupons();
      setCoupons(response.data?.coupons || []);
    } catch (error) {
      console.error("Error loading coupons:", error);
      setMessage("Failed to load coupons");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const response = await courseService.createCoupon(form);
      setMessage("Coupon created successfully");
      setMessageType("success");
      setShowCreateModal(false);
      setForm({ code: "", percentOff: "", courseId: "", expiresAt: "", usageLimit: "" });
      loadCoupons();
    } catch (error) {
      setMessage(error.message || "Failed to create coupon");
      setMessageType("error");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await courseService.updateCoupon(editingCoupon._id, form);
      setMessage("Coupon updated successfully");
      setMessageType("success");
      setShowEditModal(false);
      setEditingCoupon(null);
      setForm({ code: "", percentOff: "", courseId: "", expiresAt: "", usageLimit: "" });
      loadCoupons();
    } catch (error) {
      setMessage(error.message || "Failed to update coupon");
      setMessageType("error");
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      setMessage("");
      await courseService.deleteCoupon(couponId);
      setMessage("Coupon deleted successfully");
      setMessageType("success");
      loadCoupons();
    } catch (error) {
      setMessage(error.message || "Failed to delete coupon");
      setMessageType("error");
    }
  };

  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      setMessage("");
      await courseService.toggleCouponStatus(couponId, !currentStatus);
      setMessage(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setMessageType("success");
      loadCoupons();
    } catch (error) {
      setMessage(error.message || "Failed to update coupon status");
      setMessageType("error");
    }
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      percentOff: coupon.percentOff,
      courseId: coupon.course?._id || coupon.course || "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
      usageLimit: coupon.usageLimit || "",
    });
    setShowEditModal(true);
  };

  const getStatusInfo = (coupon) => {
    const now = new Date();
    const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
    
    if (!coupon.isActive) {
      return { status: "inactive", color: "text-gray-500", bgColor: "bg-gray-100", icon: XCircle };
    }
    
    if (expiresAt && expiresAt < now) {
      return { status: "expired", color: "text-red-500", bgColor: "bg-red-100", icon: AlertCircle };
    }
    
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { status: "exhausted", color: "text-orange-500", bgColor: "bg-orange-100", icon: AlertCircle };
    }
    
    return { status: "active", color: "text-green-500", bgColor: "bg-green-100", icon: CheckCircle };
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (coupon.course?.title || "All Courses").toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusInfo = getStatusInfo(coupon);
    const matchesFilter = filterStatus === "all" || statusInfo.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getCourseName = (courseId) => {
    if (!courseId || courseId === "ALL") return "All Courses";
    const course = courses.find(c => c._id === courseId);
    return course?.title || "Unknown Course";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "var(--brand)" }}></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Coupon Management
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Create and manage discount coupons for courses
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn-secondary px-4 py-2 font-semibold text-sm"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-premium px-4 py-2 font-semibold text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {messageType === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {message}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="exhausted">Exhausted</option>
            </select>
            <button
              onClick={loadCoupons}
              className="px-4 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden border"
          style={{
            background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))",
            borderColor: "var(--border)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead 
                className="bg-gradient-to-r"
                style={{
                  background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-elevated))",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Coupon</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filteredCoupons.map((coupon) => {
                  const statusInfo = getStatusInfo(coupon);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={coupon._id} className="hover:opacity-80 transition-all duration-200" style={{ background: "var(--bg-primary)" }}>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <Percent size={22} className="text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{coupon.code}</div>
                            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                              Created {new Date(coupon.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{getCourseName(coupon.course)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold" style={{ color: "var(--brand)" }}>{coupon.percentOff}% off</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm" style={{ color: "var(--text-primary)" }}>
                          <span className="font-medium">{coupon.usageCount || 0}</span>
                          <span style={{ color: "var(--text-secondary)" }}> / </span>
                          <span style={{ color: "var(--text-secondary)" }}>{coupon.usageLimit || "∞"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm" style={{ color: "var(--text-primary)" }}>{formatDate(coupon.expiresAt)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <StatusIcon size={12} className="mr-1.5" />
                          {statusInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                            style={{
                              color: "var(--brand)",
                              background: "var(--bg-secondary)",
                            }}
                            title="Edit coupon"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                            style={{
                              color: coupon.isActive ? "var(--accent-orange)" : "var(--accent-emerald)",
                              background: "var(--bg-secondary)",
                            }}
                            title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                          >
                            {coupon.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                            style={{
                              color: "var(--accent-rose)",
                              background: "var(--bg-secondary)",
                            }}
                            title="Delete coupon"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredCoupons.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6" style={{ color: "var(--text-secondary)" }}>
                <Ticket size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>No coupons found</h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria to find the coupons you're looking for."
                  : "Start building your discount strategy by creating your first coupon code."
                }
              </p>
              {(!searchTerm && filterStatus === "all") && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-premium px-6 py-3 font-semibold text-sm flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  Create First Coupon
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Coupon Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
            <div 
              className="relative w-full max-w-md rounded-xl shadow-2xl border"
              style={{
                background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))",
                borderColor: "var(--border)",
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Plus size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Create New Coupon</h3>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Coupon Code</label>
                    <input
                      name="code"
                      value={form.code}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="ENTER50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Discount Percentage</label>
                    <input
                      name="percentOff"
                      type="number"
                      min="1"
                      max="100"
                      value={form.percentOff}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Course</label>
                    <select
                      name="courseId"
                      value={form.courseId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      required
                    >
                      <option value="">Select a course</option>
                      <option value="ALL">All courses</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Usage Limit (optional)</label>
                    <input
                      name="usageLimit"
                      type="number"
                      min="1"
                      value={form.usageLimit}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Expiry Date (optional)</label>
                    <input
                      name="expiresAt"
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 btn-premium"
                    >
                      Create Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Coupon Modal */}
        {showEditModal && editingCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
            <div 
              className="relative w-full max-w-md rounded-xl shadow-2xl border"
              style={{
                background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))",
                borderColor: "var(--border)",
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Edit size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Coupon</h3>
                </div>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Coupon Code</label>
                    <input
                      name="code"
                      value={form.code}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Discount Percentage</label>
                    <input
                      name="percentOff"
                      type="number"
                      min="1"
                      max="100"
                      value={form.percentOff}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Course</label>
                    <select
                      name="courseId"
                      value={form.courseId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      required
                    >
                      <option value="">Select a course</option>
                      <option value="ALL">All courses</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Usage Limit (optional)</label>
                    <input
                      name="usageLimit"
                      type="number"
                      min="1"
                      value={form.usageLimit}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Expiry Date (optional)</label>
                    <input
                      name="expiresAt"
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 btn-premium"
                    >
                      Update Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
