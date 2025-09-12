import React, { useMemo, useState, useEffect } from "react";
import {
  listCourses,
  createCourse as apiCreateCourse,
  updateCourse as apiUpdateCourse,
  deleteCourse as apiDeleteCourse,
  mapAdminFormToBackend,
} from "../services/courseServices";

const makePreview = (file) => (file ? URL.createObjectURL(file) : null);

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const emptyModule = () => ({
    id: crypto.randomUUID(),
    title: "",
    type: "video",
    description: "",
    file: null,
    filePreview: null,
    thumbnail: null,
    thumbnailPreview: null,
  });

  const initialForm = {
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    price: "",
    status: "draft",
    target: "course",
    rating: 0,
    students: 0,
    createdAt: new Date().toISOString(),
    modules: [emptyModule()],
    thumbnail: null,
    thumbnailPreview: null,
  };

  const [form, setForm] = useState(initialForm);

  const availableCategories = useMemo(
    () => ["all", ...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses]
  );
  const statuses = ["all", "published", "draft", "archived"];

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !q ||
        course.title?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        course.instructor?.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (isPublished) => {
    const status = isPublished ? "published" : "draft";
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      archived: { bg: "bg-gray-100", text: "text-gray-800", label: "Archived" },
    };
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>{config.label}</span>
    );
  };

  const getLevelBadge = (level) => {
    const levelConfig = {
      Beginner: { bg: "bg-blue-100", text: "text-blue-800" },
      Intermediate: { bg: "bg-yellow-100", text: "text-yellow-800" },
      Advanced: { bg: "bg-red-100", text: "text-red-800" },
    };
    const config = levelConfig[level] || levelConfig.beginner;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>{level}</span>
    );
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setForm({ ...initialForm });
    setErrorMsg("");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    const normalizedModules = (course.modules || []).map((m) => ({
      id: crypto.randomUUID(),
      title: m.title || "",
      type: m.videoFile ? "video" : "image",
      description: m.description || "",
      file: null,
      filePreview: m.filePreview || null,
      thumbnail: null,
      thumbnailPreview: null,
    }));

    setEditingCourse(course);
    setForm({
      title: course.title || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "beginner",
      duration: course.duration || "",
      price: course.price || "",
      originalPrice: course.originalPrice || "",
      currency: course.currency || "INR",
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false,
      tags: course.tags || [],
      requirements: course.requirements || [],
      learningOutcomes: course.learningOutcomes || [],
      modules: normalizedModules.length ? normalizedModules : [emptyModule()],
      thumbnail: null,
      thumbnailPreview: course.thumbnail || null,
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const closeModal = () => {
    form.modules.forEach((m) => {
      if (m.filePreview) URL.revokeObjectURL(m.filePreview);
      if (m.thumbnailPreview) URL.revokeObjectURL(m.thumbnailPreview);
    });
    if (form.thumbnailPreview) URL.revokeObjectURL(form.thumbnailPreview);
    
    setShowModal(false);
    setSubmitting(false);
    setForm(initialForm);
    setEditingCourse(null);
  };

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateModule = (id, patch) =>
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));

  const addModule = () =>
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, emptyModule()],
    }));

  const removeModule = (id) =>
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.length > 1 ? prev.modules.filter((m) => m.id !== id) : prev.modules,
    }));

  const onChangeModuleFile = (id, file) => {
    const preview = makePreview(file);
    updateModule(id, { file, filePreview: preview });
  };

  const onChangeModuleThumb = (id, file) => {
    const preview = makePreview(file);
    updateModule(id, { thumbnail: file, thumbnailPreview: preview });
  };

  const onChangeThumbnail = (file) => {
    const preview = makePreview(file);
    setForm(prev => ({ ...prev, thumbnail: file, thumbnailPreview: preview }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.shortDescription.trim()) return "Short description is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.duration.trim()) return "Duration is required";
    if (form.price === "" || Number.isNaN(Number(form.price))) return "Valid price is required";
    if (!form.thumbnail && !editingCourse) return "Course thumbnail is required";
    
    for (const m of form.modules) {
      if (!m.title.trim()) return "Each module must have a title";
      if (!["video", "image"].includes(m.type)) return "Module type must be video or image";
      if (!editingCourse && !m.file) return "Each module must include a video or image file";
    }
    return null;
  };

  // Helper: map BE course to FE card shape
  const mapFromBackend = (c) => ({
    id: c._id,
    title: c.title,
    description: c.shortDescription || c.description,
    instructor: `${c.instructor?.firstName ?? ""} ${c.instructor?.lastName ?? ""}`.trim(),
    category: c.category,
    level:
      (c.level === "beginner" && "Beginner") ||
      (c.level === "intermediate" && "Intermediate") ||
      (c.level === "advanced" && "Advanced") ||
      "Beginner",
    duration: `${c.duration}h`,
    price: c.price,
    thumbnail: c.thumbnail || null,
    students: c.enrollmentCount ?? 0,
    rating: c.rating?.average ?? 0,
    status: c.isPublished ? "published" : "draft",
    createdAt: c.createdAt,
    modules: (c.modules || []).map((m) => ({
      title: m.title,
      type: "video",
      description: m.description,
      // fixed: correct optional chaining for first lesson videoUrl
      filePreview: m.lessons?.videoUrl || null,
      thumbnailPreview: null,
    })),
  });

  const reloadCourses = async () => {
    const resp = await listCourses({ page: 1, limit: 50 });
    const mapped = (resp?.data?.courses || []).map(mapFromBackend);
    setCourses(mapped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) return setErrorMsg(err);

    setSubmitting(true);
    try {
      const payload = mapAdminFormToBackend(form);
      if (editingCourse) {
        await apiUpdateCourse(editingCourse.id, payload);
      } else {
        await apiCreateCourse(payload);
      }
      await reloadCourses();
      setShowModal(false);
      setEditingCourse(null);
      setForm(initialForm);
    } catch (e) {
      setErrorMsg(e.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await apiDeleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErrorMsg(e.message || "Delete failed");
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      const payload = mapAdminFormToBackend({
        ...course,
        level: course.level,
        duration: course.duration,
        status: newStatus,
        modules: course.modules || [],
        price: course.price,
        title: course.title,
        description: course.description,
        category: course.category,
      });
      await apiUpdateCourse(id, payload);
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    } catch (e) {
      setErrorMsg(e.message || "Status update failed");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await reloadCourses();
      } catch (e) {
        console.error(e);
        setErrorMsg(e.message || "Failed to load courses");
      }
    })();
    // no deps: load once on mount
  }, []);




return (
  <div className="space-y-6">
    {/* Page Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-600 mt-1">Manage all courses and their content</p>
      </div>
      <button
        onClick={openAddModal}
        className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300"
      >
        📚 Add New Course
      </button>
    </div>

    {/* Filters and Search */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search courses by title, description, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
        >
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Courses Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
          {/* Course Image / Cover */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* If any module has a thumbnailPreview or image type, show a visual hint */}
              {(() => {
                const explicitThumb = course.thumbnail || null;
                const firstThumb = course.modules?.find(m => m.thumbnailPreview)?.thumbnailPreview;
                const firstImage = course.modules?.find(m => m.type === "image" && m.filePreview)?.filePreview;
                const cover = explicitThumb || firstThumb || firstImage;
                if (cover) {
                  return <img src={cover} alt="cover" className="w-full h-full object-cover" />;
                }
                return <span className="text-6xl">📚</span>;
              })()}
            </div>
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              {getStatusBadge(course.status)}
            </div>
            {/* Level Badge */}
            <div className="absolute top-3 right-3">
              {getLevelBadge(course.level)}
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {course.category}
              </span>
              <span className="text-sm text-gray-500">{course.duration}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {course.instructor?.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{course.instructor}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-semibold text-gray-700">{course.rating ?? 0}</span>
                </div>
                <span className="text-xs text-gray-500">{(course.students ?? 0).toLocaleString()} students</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">₹{Number(course.price ?? 0).toLocaleString()}</span>
              <span className="text-sm text-gray-500">Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(course)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleStatusToggle(course.id, course.status === "published" ? "draft" : "published")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${course.status === "published"
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {course.status === "published" ? "⏸️ Unpublish" : "▶️ Publish"}
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                🗑️
              </button>
            </div>

            {/* Optional: quick module previews list */}
            {course.modules?.length ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Modules:</p>
                <ul className="space-y-1">
                  {course.modules.map((m, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span className="font-medium">{m.title}</span>
                      <span className="text-gray-400">({m.type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>

    {/* Stats Summary */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">📚</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">✅</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Published</p>
            <p className="text-2xl font-bold text-gray-900">
              {courses.filter(c => c.status === "published").length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">👥</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">
              {(courses.reduce((acc, c) => acc + (c.students || 0), 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">💰</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(courses.reduce((acc, c) => acc + ((c.price || 0) * (c.students || 0)), 0) / 100000).toFixed(1)}L
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
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>✖</button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-4 space-y-6">
            {errorMsg ? (
              <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">{errorMsg}</div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., React for Web Development"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professor</label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) => updateField("instructor", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Dr. John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Frontend Development"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => updateField("level", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 7999"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target</label>
                <select
                  value={form.target}
                  onChange={(e) => updateField("target", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="course">Course</option>
                  <option value="launchpad">Launchpad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="What will students learn?"
                />
              </div>
            </div>

            {/* Modules */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Modules</h3>
                <button
                  type="button"
                  onClick={addModule}
                  className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
                >
                  ➕ Add Module
                </button>
              </div>

              <div className="mt-3 space-y-4">
                {form.modules.map((m, idx) => (
                  <div key={m.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Module {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeModule(m.id)}
                        className="text-red-600 text-sm hover:underline"
                        disabled={form.modules.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => updateModule(m.id, { title: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Module title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          value={m.type}
                          onChange={(e) => updateModule(m.id, { type: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="video">Video</option>
                          <option value="image">Image</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={m.description}
                          onChange={(e) => updateModule(m.id, { description: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                          rows={2}
                          placeholder="Module summary or notes"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {m.type === "video" ? "Video File" : "Image File"}
                        </label>
                        <input
                          type="file"
                          accept={m.type === "video" ? "video/*" : "image/*"}
                          onChange={(e) => onChangeModuleFile(m.id, e.target.files?.[0] || null)}
                          className="mt-1 w-full text-sm"
                        />
                        {m.filePreview ? (
                          m.type === "image" ? (
                            <img src={m.filePreview} alt="module" className="mt-2 h-24 w-24 object-cover rounded" />
                          ) : (
                            <video src={m.filePreview} controls className="mt-2 h-24 rounded" />
                          )
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Thumbnail (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChangeModuleThumb(m.id, e.target.files?.[0] || null)}
                          className="mt-1 w-full text-sm"
                        />
                        {m.thumbnailPreview ? (
                          <img src={m.thumbnailPreview} alt="thumb" className="mt-2 h-16 w-16 object-cover rounded" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
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
                className={`px-4 py-2 text-white rounded-lg ${editingCourse ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
                disabled={submitting}
              >
                {submitting ? "Saving..." : editingCourse ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}