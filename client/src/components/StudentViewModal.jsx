/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Users,
  Edit,
  BookOpen,
  BarChart3,
  Trash2,
  UserCheck,
  UserX,
  X,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
} from "lucide-react";

export default function StudentViewModal({
  student,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onCourseAssigned,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit Student State
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isActive: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Course Assignment State
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Progress Report State
  const [progressData, setProgressData] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // Initialize form data when student changes
  useEffect(() => {
    if (student) {
      const nameParts = student.name ? student.name.split(" ") : ["", ""];
      setEditFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: student.email || "",
        phone: student.phone || "",
        isActive: student.status === "active",
      });
    }
  }, [student]);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && student) {
      if (activeTab === "assign") {
        fetchAvailableCourses();
      } else if (activeTab === "progress") {
        fetchStudentProgress();
      }
    }
  }, [isOpen, student, activeTab]);

  const fetchAvailableCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/admin/courses/available`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data.data.courses || []);
    } catch (err) {
      setError(`Failed to load available courses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgress = async () => {
    setProgressLoading(true);
    setError("");

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE}/admin/students/${student.id}/progress`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student progress");
      }

      const data = await response.json();
      let progressData = data.data.progress;

      // Use mock data if no real data available
      if (
        !progressData ||
        !progressData.courses ||
        progressData.courses.length === 0
      ) {
        progressData = {
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            joinDate: student.joinDate,
            lastActive: new Date().toISOString(),
            status: student.status,
          },
          courses: [
            {
              id: "course-1",
              title:
                student.course !== "-" ? student.course : "No Course Assigned",
              instructor: "Instructor Name",
              enrolledDate: student.joinDate,
              progress: Math.floor(Math.random() * 100),
              totalVideos: 24,
              completedVideos: Math.floor(Math.random() * 24),
              totalDuration: "12:30:00",
              watchedDuration: "9:22:30",
            },
          ],
          analytics: {
            totalLearningTime: "9:22:30",
            averageSessionTime: "45 minutes",
            learningStreak: 7,
            completionRate: Math.floor(Math.random() * 100),
            lastActivity: "2 hours ago",
          },
        };
      }

      setProgressData(progressData);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
      setError("Failed to fetch progress data");
    } finally {
      setProgressLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");
    setSuccess("");

    if (
      !editFormData.firstName.trim() ||
      !editFormData.lastName.trim() ||
      !editFormData.email.trim()
    ) {
      setError("First name, last name, and email are required");
      setIsUpdating(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      setError("Please enter a valid email address");
      setIsUpdating(false);
      return;
    }

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/admin/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update student");
      }

      setSuccess("Student updated successfully!");

      if (onUpdate) {
        onUpdate(data.data.student);
      }

      setTimeout(() => {
        setSuccess("");
        setActiveTab("overview");
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to update student");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCourseAssignment = async () => {
    if (!selectedCourseId) {
      setError("Please select a course to assign");
      return;
    }

    setIsAssigning(true);
    setError("");
    setSuccess("");

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE}/admin/students/${student.id}/assign-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ courseId: selectedCourseId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          data.message === "Student is already enrolled in this course"
        ) {
          throw new Error(
            "This student is already enrolled in the selected course. Please choose a different course."
          );
        }
        throw new Error(data.message || "Failed to assign course");
      }

      setSuccess("Course assigned successfully!");

      if (onCourseAssigned) {
        onCourseAssigned(data.data);
      }

      setTimeout(() => {
        setSuccess("");
        setSelectedCourseId("");
        setActiveTab("overview");
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to assign course");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = student.status === "active" ? "inactive" : "active";

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/admin/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus === "active" }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onUpdate) {
          onUpdate(data.data.student);
        }
        setSuccess(
          `Student ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully!`
        );
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (error) {
      console.error("Failed to activate/deactivate student:", error);
      setError(
        `Failed to ${
          newStatus === "active" ? "activate" : "deactivate"
        } student`
      );
    }
  };

  const handleDeleteStudent = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${student.name}? This action cannot be undone.`
      )
    ) {
      if (onDelete) {
        onDelete(student.id);
      }
      onClose();
    }
  };

  const handleClose = () => {
    setActiveTab("overview");
    setError("");
    setSuccess("");
    setSelectedCourseId("");
    setProgressData(null);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span
        className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
        style={{
          background: "var(--accent-gold)10",
          color: "var(--accent-gold)",
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--accent-gold)" }}
        ></div>
        Active
      </span>
    ) : (
      <span
        className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
        style={{
          background: "var(--text-muted)10",
          color: "var(--text-muted)",
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--text-muted)" }}
        ></div>
        Inactive
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "var(--accent-gold)";
    if (progress >= 60) return "var(--brand)";
    if (progress >= 40) return "var(--accent-rose)";
    return "var(--brand-strong)";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "edit", label: "Edit", icon: Edit },
    { id: "assign", label: "Assign Course", icon: BookOpen },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand), var(--brand-strong))",
                }}
              >
                {student.name.charAt(0)}
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {student.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {student.email}
                  </p>
                  {getStatusBadge(student.status)}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id ? "btn-premium" : "btn-outline-premium"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Success/Error Messages */}
          {error && (
            <div
              className="mb-4 p-3 rounded-md"
              style={{
                color: "#ff6b7a",
                background: "rgba(255,107,122,0.08)",
                border: "1px solid rgba(255,107,122,0.25)",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-3 rounded-md"
              style={{
                color: "#7ed957",
                background: "rgba(126,217,87,0.08)",
                border: "1px solid rgba(126,217,87,0.25)",
              }}
            >
              {success}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="card-premium p-4">
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Student Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Full Name:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {student.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Email:
                    </span>
                    <span
                      className="font-medium text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {student.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Phone:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {student.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Join Date:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {new Date(student.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Current Course:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      {student.course}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Status:
                    </span>
                    {getStatusBadge(student.status)}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-premium p-4">
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="btn-outline-premium px-4 py-3 flex items-center gap-2 justify-center text-sm"
                  >
                    <Edit size={16} />
                    Edit Student
                  </button>
                  <button
                    onClick={() => setActiveTab("assign")}
                    className="btn-outline-premium px-4 py-3 flex items-center gap-2 justify-center text-sm"
                  >
                    <BookOpen size={16} />
                    Assign Course
                  </button>
                  <button
                    onClick={() => setActiveTab("progress")}
                    className="btn-outline-premium px-4 py-3 flex items-center gap-2 justify-center text-sm"
                  >
                    <BarChart3 size={16} />
                    View Progress
                  </button>
                  <button
                    onClick={handleStatusToggle}
                    className={`px-4 py-3 flex items-center gap-2 justify-center text-sm rounded-lg transition-all ${
                      student.status === "active"
                        ? "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                    }`}
                  >
                    {student.status === "active" ? (
                      <UserX size={16} />
                    ) : (
                      <UserCheck size={16} />
                    )}
                    {student.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>

                {/* Danger Zone */}
                <div
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h4 className="text-lg font-bold mb-3 text-red-600">
                    Danger Zone
                  </h4>
                  <button
                    onClick={handleDeleteStudent}
                    className="px-4 py-2 flex items-center gap-2 justify-center text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <Trash2 size={16} />
                    Delete Student
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="card-premium p-4">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Edit Student Information
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full input-premium"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full input-premium"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full input-premium"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full input-premium"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editFormData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[color:var(--brand)] focus:ring-[color:var(--brand)] border-[color:var(--border)] rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm">
                    Active Student
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="flex-1 px-4 py-2 btn-outline-premium rounded-lg"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 btn-premium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Updating...
                      </span>
                    ) : (
                      "Update Student"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "assign" && (
            <div className="card-premium p-4">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Assign Course
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "var(--brand)" }}
                  ></div>
                  <span className="ml-3 text-[color:var(--text-secondary)]">
                    Loading courses...
                  </span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="courseSelect"
                      className="block text-sm font-medium mb-2"
                    >
                      Select Course to Assign *
                    </label>
                    <select
                      id="courseSelect"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full input-premium"
                    >
                      <option value="">Choose a course...</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title} - {course.level} ({course.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Course Preview */}
                  {selectedCourseId && (
                    <div className="rounded-lg p-4 btn-outline-premium">
                      <h4 className="text-lg font-semibold mb-3">
                        Selected Course
                      </h4>
                      {(() => {
                        const selectedCourse = courses.find(
                          (course) => course._id === selectedCourseId
                        );
                        return selectedCourse ? (
                          <div className="flex items-start space-x-4">
                            {selectedCourse.thumbnail && (
                              <img
                                src={selectedCourse.thumbnail}
                                alt={selectedCourse.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium">
                                {selectedCourse.title}
                              </h5>
                              <p className="text-sm text-[color:var(--text-secondary)] mt-1 line-clamp-2">
                                {selectedCourse.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-[color:var(--text-muted)]">
                                <span>📚 {selectedCourse.level}</span>
                                <span>🏷️ {selectedCourse.category}</span>
                                <span>⏱️ {selectedCourse.duration}</span>
                                <span style={{ color: "var(--accent-gold)" }}>
                                  💰 ₹{selectedCourse.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="flex-1 px-4 py-2 btn-outline-premium rounded-lg"
                      disabled={isAssigning}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCourseAssignment}
                      disabled={!selectedCourseId || isAssigning}
                      className="flex-1 px-4 py-2 btn-premium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAssigning ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Assigning...
                        </span>
                      ) : (
                        "Assign Course"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-6">
              {progressLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "var(--brand)" }}
                  ></div>
                  <span className="ml-3 text-[color:var(--text-secondary)]">
                    Loading progress data...
                  </span>
                </div>
              ) : progressData ? (
                <>
                  {/* Overview Stats */}
                  <div className="card-premium p-4">
                    <h3
                      className="text-lg font-bold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Progress Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="text-center p-4 rounded-lg"
                        style={{ background: "var(--surface)" }}
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "var(--brand)" }}
                        >
                          {progressData.analytics.completionRate}%
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Overall Progress
                        </div>
                      </div>
                      <div
                        className="text-center p-4 rounded-lg"
                        style={{ background: "var(--surface)" }}
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {progressData.analytics.learningStreak}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Learning Streak
                        </div>
                      </div>
                      <div
                        className="text-center p-4 rounded-lg"
                        style={{ background: "var(--surface)" }}
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "var(--accent-rose)" }}
                        >
                          {progressData.analytics.totalLearningTime}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Total Time
                        </div>
                      </div>
                      <div
                        className="text-center p-4 rounded-lg"
                        style={{ background: "var(--surface)" }}
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "var(--brand-strong)" }}
                        >
                          {progressData.analytics.averageSessionTime}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Avg Session
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Progress */}
                  {progressData.courses.map((course, index) => (
                    <div key={index} className="card-premium p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4
                            className="text-lg font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {course.title}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Instructor: {course.instructor}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: getProgressColor(course.progress) }}
                          >
                            {course.progress}%
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Complete
                          </div>
                        </div>
                      </div>

                      <div
                        className="w-full rounded-full h-3 mb-4"
                        style={{ background: "var(--surface)" }}
                      >
                        <div
                          className="h-3 rounded-full transition-all duration-1000"
                          style={{
                            width: `${course.progress}%`,
                            background: getProgressColor(course.progress),
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>
                            Videos:
                          </span>
                          <span
                            className="ml-2 font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {course.completedVideos}/{course.totalVideos}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>
                            Duration:
                          </span>
                          <span
                            className="ml-2 font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {course.watchedDuration}/{course.totalDuration}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-secondary)" }}>
                            Enrolled:
                          </span>
                          <span
                            className="ml-2 font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {new Date(course.enrolledDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="card-premium p-6 text-center">
                  <BarChart3
                    size={48}
                    className="mx-auto mb-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No Progress Data Available
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    This student hasn't started any courses yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
