import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createExam as apiCreateExam, updateExam as apiUpdateExam, deleteExam as apiDeleteExam, updateExamStatus as apiUpdateExamStatus, fetchExams as apiFetchExams } from "../services/examService.js";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const examTypes = ["all", "Quiz", "Exam", "Final Exam", "Project"];
  const examStatuses = ["all", "active", "draft", "archived"];

  // Form state
  const initialForm = {
    title: "",
    description: "",
    course: "",
    type: "Quiz",
    duration: 30,
    totalQuestions: 10,
    passingScore: 60,
    status: "draft",
    attempts: 0,
    avgScore: 0,
    createdAt: new Date().toISOString(),
    scheduledDate: new Date().toISOString(),
    examUrl: "",
  };
  const [form, setForm] = useState(initialForm);

  // Load exams from API
  useEffect(() => {
    (async () => {
      try {
        const list = await apiFetchExams();
        setExams(list.map((e) => ({ ...e, id: e._id || e.id })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesSearch =
        !q ||
        exam.title?.toLowerCase().includes(q) ||
        exam.course?.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || exam.type === typeFilter;
      const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [exams, searchTerm, typeFilter, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      Quiz: { bg: "bg-blue-100", text: "text-blue-800" },
      Exam: { bg: "bg-purple-100", text: "text-purple-800" },
      "Final Exam": { bg: "bg-red-100", text: "text-red-800" },
      Project: { bg: "bg-indigo-100", text: "text-indigo-800" },
    };
    const config = typeConfig[type] || typeConfig.Quiz;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
        {type}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Modal controls
  const openAddModal = () => {
    setEditingExam(null);
    setForm({
      ...initialForm,
      createdAt: new Date().toISOString(),
      scheduledDate: new Date().toISOString(),
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setForm({
      title: exam.title || "",
      description: exam.description || "",
      course: exam.course || "",
      type: exam.type || "Quiz",
      duration: exam.duration ?? 30,
      totalQuestions: exam.totalQuestions ?? 10,
      passingScore: exam.passingScore ?? 60,
      status: exam.status || "draft",
      attempts: exam.attempts ?? 0,
      avgScore: exam.avgScore ?? 0,
      createdAt: exam.createdAt || new Date().toISOString(),
      scheduledDate: exam.scheduledDate || new Date().toISOString(),
      examUrl: exam.examUrl || "",
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setForm(initialForm);
    setEditingExam(null);
  };

  // CRUD via API
  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await apiDeleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete exam");
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const updated = await apiUpdateExamStatus(id, newStatus);
      setExams((prev) => prev.map((e) => (e.id === id ? { ...e, status: updated?.status || newStatus } : e)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Form helpers
  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validateForm = () => {
    if (!form.title.trim()) return "Exam name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.course.trim()) return "Course name is required";
    if (!["Quiz", "Exam", "Final Exam", "Project"].includes(form.type))
      return "Type must be Quiz, Exam, Final Exam, or Project";
    if (Number.isNaN(Number(form.duration)) || Number(form.duration) <= 0)
      return "Duration must be a positive number of minutes";
    if (
      Number.isNaN(Number(form.totalQuestions)) ||
      Number(form.totalQuestions) <= 0
    )
      return "Total questions must be a positive number";
    if (
      Number.isNaN(Number(form.passingScore)) ||
      Number(form.passingScore) < 0 ||
      Number(form.passingScore) > 100
    )
      return "Passing score must be between 0 and 100";
    if (!form.scheduledDate) return "Scheduled date is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      course: form.course,
      type: form.type,
      duration: Number(form.duration),
      totalQuestions: Number(form.totalQuestions),
      passingScore: Number(form.passingScore),
      status: form.status,
      attempts: Number(form.attempts || 0),
      avgScore: Number(form.avgScore || 0),
      scheduledDate: form.scheduledDate,
      examUrl: form.examUrl || "",
    };

    try {
      if (editingExam) {
        const updated = await apiUpdateExam(editingExam.id, payload);
        const normalized = { ...updated, id: updated._id || editingExam.id };
        setExams((prev) => prev.map((e) => (e.id === editingExam.id ? normalized : e)));
      } else {
        const created = await apiCreateExam(payload);
        const normalized = { ...created, id: created._id };
        setExams((prev) => [normalized, ...prev]);
      }
      setSubmitting(false);
      closeModal();
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      setErrorMsg("Failed to save exam");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Create and manage exams, quizzes, and assessments</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300"
        >
          📝 Create New Exam
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search exams by title or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
          >
            {["all", "active", "draft", "archived"].map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Exam Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                {getTypeBadge(exam.type)}
                {getStatusBadge(exam.status)}
              </div>
              <h3 className="text-lg font-bold line-clamp-2">{exam.title}</h3>
              <p className="text-purple-100 text-sm">{exam.course}</p>
            </div>

            {/* Exam Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{exam.duration}</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{exam.totalQuestions}</div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="font-semibold text-gray-900">{exam.passingScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Attempts:</span>
                  <span className="font-semibold text-gray-900">{exam.attempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Score:</span>
                  <span className={`font-semibold ${getScoreColor(exam.avgScore)}`}>
                    {exam.avgScore > 0 ? `${exam.avgScore}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <div>Created: {new Date(exam.createdAt).toLocaleDateString()}</div>
                <div>Scheduled: {new Date(exam.scheduledDate).toLocaleDateString()}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(exam)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() =>
                    handleStatusToggle(exam.id, exam.status === "active" ? "draft" : "active")
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    exam.status === "active"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {exam.status === "active" ? "⏸️ Pause" : "▶️ Activate"}
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.filter((e) => e.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">
                {exams.reduce((acc, e) => acc + (e.attempts || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(() => {
                  const activeExams = exams.filter((e) => e.status === "active" && (e.avgScore || 0) > 0);
                  if (activeExams.length === 0) return "N/A";
                  const avg = activeExams.reduce((acc, e) => acc + (e.avgScore || 0), 0) / activeExams.length;
                  return `${avg.toFixed(1)}%`;
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingExam ? "Edit Exam" : "Create New Exam"}
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>✖</button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-4 space-y-6">
              {errorMsg ? (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">{errorMsg}</div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., JavaScript Basics Assessment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <input
                    type="text"
                    value={form.course}
                    onChange={(e) => updateField("course", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., JavaScript Fundamentals"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option>Quiz</option>
                    <option>Exam</option>
                    <option>Final Exam</option>
                    <option>Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Questions</label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalQuestions}
                    onChange={(e) => updateField("totalQuestions", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.passingScore}
                    onChange={(e) => updateField("passingScore", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <input
                    type="date"
                    value={form.scheduledDate ? new Date(form.scheduledDate).toISOString().slice(0, 10) : ""}
                    onChange={(e) => updateField("scheduledDate", new Date(e.target.value).toISOString())}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam URL</label>
                  <input
                    type="url"
                    value={form.examUrl}
                    onChange={(e) => updateField("examUrl", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/exam/unique-id"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Brief description of the exam"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg ${
                    editingExam ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingExam ? "Save Changes" : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
