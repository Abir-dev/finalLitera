import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentProgressReport from "../components/StudentProgressReport.jsx";
import EditStudentModal from "../components/EditStudentModal.jsx";
import CourseAssignmentModal from "../components/CourseAssignmentModal.jsx";
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
      const firstEnrollment =
        (u.enrolledCourses && u.enrolledCourses[0]) || null;
      return {
        id: u._id,
        name: fullName,
        email: u.email,
        phone: u.profile?.phone || "",
        course: firstEnrollment?.course?.title || "-",
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
      prevStudents.map((student) =>
        student.id === assignmentData.student.id
          ? {
              ...student,
              course: assignmentData.course.title,
              // You could also update other fields if needed
            }
          : student
      )
    );
  };

  const handleStudentClick = (student) => {
    setExpandedStudent(expandedStudent?.id === student.id ? null : student);
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
                                  handleViewProgressReport(student);
                                }}
                                className="btn-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                <BarChart3 size={14} />
                                Progress
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignCourse(student);
                                }}
                                className="btn-outline-premium px-3 py-2 flex items-center gap-2 justify-center text-xs"
                              >
                                <BookOpen size={14} />
                                Assign
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
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Student
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

              <form onSubmit={handleSubmitStudent} className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                    {submitSuccess}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
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
                        Creating...
                      </span>
                    ) : (
                      "Create Student"
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
    </div>
  );
}
