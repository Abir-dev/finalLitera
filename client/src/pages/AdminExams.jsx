import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createExam as apiCreateExam, updateExam as apiUpdateExam, deleteExam as apiDeleteExam, updateExamStatus as apiUpdateExamStatus, fetchExams as apiFetchExams } from "../services/examService.js";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  BarChart3,
  X,
  Save,
  Calendar,
  BookOpen,
  Target,
  AlertCircle
} from "lucide-react";

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
      active: { 
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20", 
        text: "text-green-400", 
        border: "border-green-500/30",
        label: "Active" 
      },
      draft: { 
        bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20", 
        text: "text-yellow-400", 
        border: "border-yellow-500/30",
        label: "Draft" 
      },
      archived: { 
        bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20", 
        text: "text-gray-400", 
        border: "border-gray-500/30",
        label: "Archived" 
      },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} ${config.border} border text-xs rounded-full font-medium`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      Quiz: { 
        bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20", 
        text: "text-blue-400", 
        border: "border-blue-500/30"
      },
      Exam: { 
        bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20", 
        text: "text-purple-400", 
        border: "border-purple-500/30"
      },
      "Final Exam": { 
        bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20", 
        text: "text-red-400", 
        border: "border-red-500/30"
      },
      Project: { 
        bg: "bg-gradient-to-r from-indigo-500/20 to-violet-500/20", 
        text: "text-indigo-400", 
        border: "border-indigo-500/30"
      },
    };
    const config = typeConfig[type] || typeConfig.Quiz;
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} ${config.border} border text-xs rounded-full font-medium`}>
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
          <h1 className="text-3xl font-bold text-white">Exam Management</h1>
          <p className="text-gray-300 mt-1">Create and manage exams, quizzes, and assessments</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-premium px-6 py-3 text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Create New Exam
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card-premium p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by title or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium w-full pl-10"
              />
            </div>
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-premium w-full pl-10"
            >
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <CheckCircle size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium w-full pl-10"
            >
              {["all", "active", "draft", "archived"].map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="card-premium overflow-hidden group hover-lift"
          >
            {/* Exam Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                {getTypeBadge(exam.type)}
                {getStatusBadge(exam.status)}
              </div>
              <h3 className="text-lg font-bold line-clamp-2 mb-2">{exam.title}</h3>
              <div className="flex items-center gap-2 text-purple-100 text-sm">
                <BookOpen size={14} />
                <span>{exam.course}</span>
              </div>
            </div>

            {/* Exam Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-xs text-gray-400">Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{exam.duration}</div>
                  <div className="text-xs text-gray-400">Minutes</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target size={16} className="text-purple-400" />
                    <span className="text-xs text-gray-400">Questions</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{exam.totalQuestions}</div>
                  <div className="text-xs text-gray-400">Total</div>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Passing Score:</span>
                  <span className="font-semibold text-white">{exam.passingScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Attempts:</span>
                  <span className="font-semibold text-white">{exam.attempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Score:</span>
                  <span className={`font-semibold ${
                    exam.avgScore >= 80 ? 'text-green-400' :
                    exam.avgScore >= 70 ? 'text-blue-400' :
                    exam.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {exam.avgScore > 0 ? `${exam.avgScore}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-6 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>Scheduled: {new Date(exam.scheduledDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(exam)}
                  className="flex-1 btn-premium py-2 px-3 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleStatusToggle(exam.id, exam.status === "active" ? "draft" : "active")
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 ${
                    exam.status === "active"
                      ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                  }`}
                >
                  {exam.status === "active" ? (
                    <>
                      <Clock size={14} />
                      Pause
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', 
              border: '1px solid var(--brand)30' 
            }}>
              <FileText size={24} style={{ color: 'var(--brand)' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Exams</p>
              <p className="text-2xl font-bold text-white">{exams.length}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', 
              border: '1px solid var(--accent-gold)30' 
            }}>
              <CheckCircle size={24} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Exams</p>
              <p className="text-2xl font-bold text-white">
                {exams.filter((e) => e.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', 
              border: '1px solid var(--accent-rose)30' 
            }}>
              <Users size={24} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Attempts</p>
              <p className="text-2xl font-bold text-white">
                {exams.reduce((acc, e) => acc + (e.attempts || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', 
              border: '1px solid var(--brand-strong)30' 
            }}>
              <BarChart3 size={24} style={{ color: 'var(--brand-strong)' }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Avg Score</p>
              <p className="text-2xl font-bold text-white">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl card-premium overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingExam ? "Edit Exam" : "Create New Exam"}
              </h2>
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200" 
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-4 space-y-6">
              {errorMsg ? (
                <div className="p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {errorMsg}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Exam Name</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., JavaScript Basics Assessment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Course</label>
                  <input
                    type="text"
                    value={form.course}
                    onChange={(e) => updateField("course", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., JavaScript Fundamentals"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    className="input-premium w-full"
                  >
                    <option>Quiz</option>
                    <option>Exam</option>
                    <option>Final Exam</option>
                    <option>Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="input-premium w-full"
                    placeholder="30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Total Questions</label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalQuestions}
                    onChange={(e) => updateField("totalQuestions", e.target.value)}
                    className="input-premium w-full"
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.passingScore}
                    onChange={(e) => updateField("passingScore", e.target.value)}
                    className="input-premium w-full"
                    placeholder="70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="input-premium w-full"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={form.scheduledDate ? new Date(form.scheduledDate).toISOString().slice(0, 10) : ""}
                    onChange={(e) => updateField("scheduledDate", new Date(e.target.value).toISOString())}
                    className="input-premium w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Exam URL</label>
                  <input
                    type="url"
                    value={form.examUrl}
                    onChange={(e) => updateField("examUrl", e.target.value)}
                    className="input-premium w-full"
                    placeholder="https://example.com/exam/unique-id"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="input-premium w-full"
                    rows={3}
                    placeholder="Brief description of the exam"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline-premium px-6 py-2 text-sm font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn-premium px-6 py-2 text-sm font-medium flex items-center gap-2 ${
                    editingExam ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gradient-to-r from-green-600 to-green-700"
                  }`}
                  disabled={submitting}
                >
                  <Save size={16} />
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
