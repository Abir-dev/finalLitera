import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentProgressReport from "../components/StudentProgressReport.jsx";
import EditStudentModal from "../components/EditStudentModal.jsx";
import CourseAssignmentModal from "../components/CourseAssignmentModal.jsx";
import StudentViewModal from "../components/StudentViewModal.jsx";
import {
  adminAssignCoins,
  adminRevokeCoins,
  adminGetStudentWallet,
} from "../services/walletService.js";
import { listCoinSettings } from "../services/walletService.js";
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  BarChart3,
} from "lucide-react";

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCourseAssignment, setShowCourseAssignment] = useState(false);
  const [assignmentStudent, setAssignmentStudent] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showStudentView, setShowStudentView] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletTarget, setWalletTarget] = useState(null);
  const [coinForm, setCoinForm] = useState({
    amount: "",
    reason: "",
    notes: "",
    coinId: "",
  });
  const [coinBusy, setCoinBusy] = useState(false);
  const [coinOptions, setCoinOptions] = useState([]);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const transformUser = (u) => {
      const fullName =
        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
        u.name ||
        "Unknown";

      return {
        id: u._id,
        name: fullName,
        email: u.email,
        phone: u.profile?.phone || "",
        enrolledCourses: u.enrolledCourses || [],
        courseCount: (u.enrolledCourses && u.enrolledCourses.length) || 0,
        course:
          u.enrolledCourses && u.enrolledCourses.length > 0
            ? `${u.enrolledCourses.length} course${
                u.enrolledCourses.length > 1 ? "s" : ""
              }`
            : "-",
        status: u.isActive ? "active" : "inactive",
        joinDate: u.createdAt,
        progress: 0,
        lastActive: "",
      };
    };

    (async () => {
      try {
        setLoading(true);
        setError("");
        const API_BASE =
          import.meta.env.VITE_API_URL ||
          "https://finallitera.onrender.com/api";
        const token = localStorage.getItem("adminToken");

        // Debug logging
        console.log("API_BASE:", API_BASE);
        console.log("Token exists:", !!token);
        console.log(
          "Token preview:",
          token ? token.substring(0, 20) + "..." : "No token"
        );

        if (!token) {
          setError("No admin token found. Redirecting to login...");
          setLoading(false);
          setTimeout(() => navigate("/admin/login"), 2000);
          return;
        }

        const res = await fetch(`${API_BASE}/admin/students?limit=200`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);

          if (res.status === 401) {
            setError("Authentication failed. Please login again.");
            localStorage.removeItem("adminToken");
            setTimeout(() => navigate("/admin/login"), 2000);
            return;
          }

          throw new Error(
            `Failed to load students: ${res.status} ${res.statusText}`
          );
        }

        const json = await res.json();
        console.log("Response data:", json);
        const users = json.data?.users || [];
        setStudents(users.map(transformUser));
      } catch (e) {
        console.error("Error loading students:", e);
        setError(e.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const enrolledStudentsOnly = filteredStudents.filter(
    (s) => s.course && s.course !== "-"
  );

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const handleStatusToggle = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "active" ? "inactive" : "active",
            }
          : student
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (submitError) setSubmitError("");
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    // Client-side validation
    if (
      !newStudent.firstName.trim() ||
      !newStudent.lastName.trim() ||
      !newStudent.email.trim() ||
      !newStudent.password.trim()
    ) {
      setSubmitError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (newStudent.password.length < 6) {
      setSubmitError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      setSubmitError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/admin/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(newStudent),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors with detailed messages
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(", "));
        }
        throw new Error(data.message || "Failed to create student");
      }

      // Add the new student to the list
      const transformedStudent = {
        id: data.data.student.id,
        name: `${data.data.student.firstName} ${data.data.student.lastName}`,
        email: data.data.student.email,
        phone: "",
        course: "-",
        status: data.data.student.isActive ? "active" : "inactive",
        joinDate: data.data.student.createdAt,
        progress: 0,
        lastActive: "",
      };

      setStudents((prev) => [transformedStudent, ...prev]);
      setSubmitSuccess("Student created successfully!");

      // Reset form
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      // Close modal after a short delay
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error creating student:", error);
      setSubmitError(error.message || "Failed to create student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewStudent({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleViewProgressReport = (student) => {
    setSelectedStudent(student);
    setShowProgressReport(true);
  };

  const handleCloseProgressReport = () => {
    setShowProgressReport(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleStudentUpdate = (updatedStudent) => {
    // Update the student in the local state
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id
          ? {
              ...student,
              name: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
              email: updatedStudent.email,
              phone: updatedStudent.profile?.phone || "",
              status: updatedStudent.isActive ? "active" : "inactive",
            }
          : student
      )
    );
  };

  const handleAssignCourse = (student) => {
    setAssignmentStudent(student);
    setShowCourseAssignment(true);
  };

  const handleCloseCourseAssignment = () => {
    setShowCourseAssignment(false);
    setAssignmentStudent(null);
  };

  const handleCourseAssigned = (assignmentData) => {
    // Update the student's course information in the local state
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === assignmentData.student.id) {
          if (assignmentData.removed) {
            // Course was removed
            const newCount = Math.max(0, student.courseCount - 1);
            return {
              ...student,
              courseCount: newCount,
              course:
                newCount > 0
                  ? `${newCount} course${newCount > 1 ? "s" : ""}`
                  : "-",
            };
          } else {
            // Course was added
            const newCount = student.courseCount + 1;
            return {
              ...student,
              courseCount: newCount,
              course: `${newCount} course${newCount > 1 ? "s" : ""}`,
            };
          }
        }
        return student;
      })
    );
  };

  const handleStudentClick = (student) => {
    setExpandedStudent(expandedStudent?.id === student.id ? null : student);
  };

  const handleViewStudent = (student) => {
    setViewingStudent(student);
    setShowStudentView(true);
  };

  const handleCloseStudentView = () => {
    setShowStudentView(false);
    setViewingStudent(null);
  };

  const openWalletModal = (student) => {
    setWalletTarget(student);
    setCoinForm({ amount: "", reason: "", notes: "", coinId: "" });
    setShowWalletModal(true);
  };

  const closeWalletModal = () => {
    setShowWalletModal(false);
    setWalletTarget(null);
  };

  const handleAssignCoins = async () => {
    if (!walletTarget?.id) return;
    const amountNum = Number(coinForm.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Enter a valid positive amount");
      return;
    }
    try {
      setCoinBusy(true);
      await adminAssignCoins(walletTarget.id, {
        amount: amountNum,
        reason: coinForm.reason,
        notes: coinForm.notes,
        coinId: coinForm.coinId || undefined,
      });
      alert("Coins assigned successfully");
      closeWalletModal();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to assign coins");
    } finally {
      setCoinBusy(false);
    }
  };

  const handleRevokeCoins = async () => {
    if (!walletTarget?.id) return;
    const amountNum = Number(coinForm.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Enter a valid positive amount");
      return;
    }
    try {
      setCoinBusy(true);
      await adminRevokeCoins(walletTarget.id, {
        amount: amountNum,
        reason: coinForm.reason,
        notes: coinForm.notes,
      });
      alert("Coins revoked successfully");
      closeWalletModal();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to revoke coins");
    } finally {
      setCoinBusy(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Premium Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="heading-1 text-2xl sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            Student Management
          </h1>
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage all registered students and their progress
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-premium px-4 py-2 sm:px-6 sm:py-3 font-semibold flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add New Student</span>
          <span className="sm:hidden">Add Student</span>
        </button>
      </div>

      {loading ? (
        <div
          className="card-premium p-4"
          style={{
            background:
              "linear-gradient(135deg, var(--brand)10, var(--brand)5)",
            border: "1px solid var(--brand)30",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span style={{ color: "var(--text-primary)" }}>
              Loading students...
            </span>
          </div>
        </div>
      ) : null}
      {error ? (
        <div
          className="card-premium p-4"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-rose)10, var(--accent-rose)5)",
            border: "1px solid var(--accent-rose)30",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: "var(--accent-rose)" }}
            ></div>
            <span style={{ color: "var(--text-primary)" }}>{error}</span>
          </div>
        </div>
      ) : null}

      {/* Premium Search and Filter */}
      <div className="card-premium p-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 input-with-icon">
            <Search
              size={18}
              className="icon-left"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search students by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pr-4 py-3 text-sm w-full"
            />
          </div>
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium px-4 py-3 text-sm w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Unified Students List */}
      <div className="card-premium overflow-hidden">
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--brand-strong))",
              }}
            >
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h2
                className="heading-3 text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                All Students
              </h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Click on any student to view details and manage
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-lg text-sm font-semibold"
            style={{
              background: "var(--surface)",
              color: "var(--text-primary)",
            }}
          >
            {filteredStudents.length} students
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center">
              <Users
                size={40}
                className="mx-auto mb-3"
                style={{ color: "var(--text-muted)" }}
              />
              <p
                className="text-base font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                No students found
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {filteredStudents.map((student) => (
                <div key={student.id}>
                  {/* Student Card */}
                  <div
                    onClick={() => handleStudentClick(student)}
                    className="card-premium p-3 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--brand), var(--brand-strong))",
                            }}
                          >
                            {student.name.charAt(0)}
                          </div>
                          {student.status === "active" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white">
                              <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="font-bold text-sm"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {student.name}
                            </h3>
                            {getStatusBadge(student.status)}
                          </div>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {student.email}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                background: "var(--surface)",
                                color: "var(--text-muted)",
                              }}
                            >
                              {student.course}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {new Date(student.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {student.progress > 0 && (
                          <div className="flex items-center gap-1">
                            <div
                              className="w-12 rounded-full h-1.5"
                              style={{ background: "var(--surface)" }}
                            >
                              <div
                                className="h-1.5 rounded-full transition-all duration-1000"
                                style={{
                                  width: `${student.progress}%`,
                                  background: getProgressColor(
                                    student.progress
                                  ),
                                }}
                              ></div>
                            </div>
                            <span
                              className="text-xs font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {student.progress}%
                            </span>
                          </div>
                        )}
                        <div
                          className={`transition-transform duration-300 ${
                            expandedStudent?.id === student.id
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6,9 12,15 18,9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedStudent?.id === student.id && (
                    <div className="ml-3 mr-3 mb-1">
                      <div
                        className="card-premium p-4 border-l-4"
                        style={{ borderLeftColor: "var(--brand)" }}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Student Information */}
                          <div>
                            <h4
                              className="font-bold text-base mb-3"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Student Information
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Full Name:
                                </span>
                                <span
                                  className="font-medium text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {student.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className="text-xs"
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
                              <div className="flex justify-between">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Phone:
                                </span>
                                <span
                                  className="font-medium text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {student.phone || "Not provided"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Current Course:
                                </span>
                                <span
                                  className="font-medium text-sm"
                                  style={{ color: "var(--accent-gold)" }}
                                >
                                  {student.course}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Progress:
                                </span>
                                <span
                                  className="font-medium text-sm"
                                  style={{
                                    color: getProgressColor(student.progress),
                                  }}
                                >
                                  {student.progress}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Status:
                                </span>
                                {getStatusBadge(student.status)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div>
                            <h4
                              className="font-bold text-base mb-3"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Quick Actions
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudent(student);
                                }}
                                className="btn-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                <Eye size={14} />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProgressReport(student);
                                }}
                                className="btn-outline-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                <BarChart3 size={14} />
                                Progress
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStudent(student);
                                }}
                                className="btn-outline-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openWalletModal(student);
                                }}
                                className="btn-outline-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                💰 Coins
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student.id);
                                }}
                                className="px-3 py-2 flex items-center gap-2 justify-center text-xs rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>

                            {/* Status Toggle */}
                            <div className="mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusToggle(student.id);
                                }}
                                className={`w-full px-3 py-2 flex items-center gap-2 justify-center text-xs rounded-lg transition-all duration-300 ${
                                  student.status === "active"
                                    ? "bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200"
                                    : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                }`}
                              >
                                {student.status === "active" ? (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Activate
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Premium Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-premium p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Students
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {students.length}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--brand-strong))",
              }}
            >
              <Users size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Active Students
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {students.filter((s) => s.status === "active").length}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-emerald), var(--brand))",
              }}
            >
              <UserCheck size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Enrolled Courses
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {
                  new Set(
                    students
                      .filter((s) => s.course !== "-")
                      .map((s) => s.course)
                  ).size
                }
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-rose), var(--accent-rose-strong))",
              }}
            >
              <GraduationCap size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card-premium p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Avg Progress
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {students.length > 0
                  ? Math.round(
                      students.reduce((acc, s) => acc + s.progress, 0) /
                        students.length
                    )
                  : 0}
                %
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold), var(--accent-gold-strong))",
              }}
            >
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))",
              border: "1px solid var(--border)",
            }}
          >
            {/* Modal Header */}
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand), var(--brand-strong))",
                    }}
                  >
                    <Plus size={20} className="text-white" />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Add New Student
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Create a new student account
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: "var(--text-muted)" }}
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
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmitStudent} className="space-y-5">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newStudent.firstName}
                    onChange={handleInputChange}
                    required
                    className="input-premium w-full px-4 py-3 text-sm"
                    placeholder="Enter first name"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newStudent.lastName}
                    onChange={handleInputChange}
                    required
                    className="input-premium w-full px-4 py-3 text-sm"
                    placeholder="Enter last name"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    required
                    className="input-premium w-full px-4 py-3 text-sm"
                    placeholder="Enter email address"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newStudent.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="input-premium w-full px-4 py-3 text-sm"
                    placeholder="Enter password (min 6 characters)"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div
                    className="p-4 rounded-lg border flex items-center gap-3"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-rose)10, var(--accent-rose)5)",
                      borderColor: "var(--accent-rose)30",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent-rose)" }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {submitError}
                    </span>
                  </div>
                )}

                {/* Success Message */}
                {submitSuccess && (
                  <div
                    className="p-4 rounded-lg border flex items-center gap-3"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-emerald)10, var(--accent-emerald)5)",
                      borderColor: "var(--accent-emerald)30",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent-emerald)" }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {submitSuccess}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 rounded-lg border font-semibold text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: "var(--bg-primary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-premium flex-1 px-4 py-3 font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus size={16} />
                        Create Student
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Progress Report Modal */}
      <StudentProgressReport
        student={selectedStudent}
        isOpen={showProgressReport}
        onClose={handleCloseProgressReport}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onUpdate={handleStudentUpdate}
      />

      {/* Course Assignment Modal */}
      <CourseAssignmentModal
        student={assignmentStudent}
        isOpen={showCourseAssignment}
        onClose={handleCloseCourseAssignment}
        onCourseAssigned={handleCourseAssigned}
      />

      {/* Student View Modal */}
      <StudentViewModal
        student={viewingStudent}
        isOpen={showStudentView}
        onClose={handleCloseStudentView}
        onCourseAssigned={handleCourseAssigned}
      />

      {/* Assign/Revoke Coins Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeWalletModal}
          ></div>
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--bg-elevated), var(--bg-secondary))",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="p-5 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Manage Coins
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {walletTarget?.name} • {walletTarget?.email}
              </p>
            </div>
            <div className="p-5 space-y-4">
              <CoinSelect
                coinOptions={coinOptions}
                value={coinForm.coinId}
                onChange={(v) => setCoinForm({ ...coinForm, coinId: v })}
                onOpen={async () => {
                  try {
                    const list = await listCoinSettings();
                    setCoinOptions(Array.isArray(list) ? list : []);
                  } catch (e) {
                    console.error(e);
                    setCoinOptions([]);
                  }
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span
                    className="block text-xs mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Current Balance
                  </span>
                  <StudentWalletBalance userId={walletTarget?.id} />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={coinForm.amount}
                  onChange={(e) =>
                    setCoinForm({ ...coinForm, amount: e.target.value })
                  }
                  className="w-full rounded-md px-3 py-2 border"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="e.g. 100"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Reason (optional)
                </label>
                <input
                  value={coinForm.reason}
                  onChange={(e) =>
                    setCoinForm({ ...coinForm, reason: e.target.value })
                  }
                  className="w-full rounded-md px-3 py-2 border"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Scholarship, reward, etc."
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Notes (optional)
                </label>
                <textarea
                  value={coinForm.notes}
                  onChange={(e) =>
                    setCoinForm({ ...coinForm, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full rounded-md px-3 py-2 border"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Any additional context"
                />
              </div>
            </div>
            <div
              className="p-5 pt-0 flex items-center justify-end gap-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={closeWalletModal}
                className="px-4 py-2 rounded-md border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                disabled={coinBusy}
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeCoins}
                className="px-4 py-2 rounded-md border"
                style={{
                  background: "#2b1a1a",
                  borderColor: "var(--border)",
                  color: "#fca5a5",
                }}
                disabled={coinBusy}
              >
                Revoke
              </button>
              <button
                onClick={handleAssignCoins}
                className="px-4 py-2 rounded-md border"
                style={{
                  background: "var(--brand)",
                  borderColor: "var(--brand)",
                  color: "white",
                }}
                disabled={coinBusy}
              >
                {coinBusy ? "Processing..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoinSelect({ coinOptions, value, onChange, onOpen }) {
  return (
    <div>
      <label
        className="block text-sm mb-1"
        style={{ color: "var(--text-secondary)" }}
      >
        Select Coin
      </label>
      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onOpen}
          className="flex-1 rounded-md px-3 py-2 border"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">Default (active coin)</option>
          {coinOptions.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.symbol})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onOpen}
          className="px-3 py-2 rounded-md border"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          Refresh
        </button>
      </div>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        If left empty, the assignment is recorded without an explicit coin
        reference.
      </p>
    </div>
  );
}
function StudentWalletBalance({ userId }) {
  const [value, setValue] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let ignore = false;
    async function load() {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await adminGetStudentWallet(userId);
        if (!ignore) setValue(data?.wallet?.balance ?? 0);
      } catch (e) {
        if (!ignore) setValue(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [userId]);
  return (
    <div
      className="rounded-md px-3 py-2 border"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
    >
      {loading ? "Loading..." : value ?? "-"}
    </div>
  );
}
