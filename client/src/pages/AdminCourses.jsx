import React, { useMemo, useState, useEffect } from "react";
import {
  listCourses,
  createCourse as apiCreateCourse,
  updateCourse as apiUpdateCourse,
  deleteCourse as apiDeleteCourse,
  mapAdminFormToBackend,
} from "../services/courseServices";
import {
  BookOpen,
  CheckCircle,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  Play,
  Award,
  Target,
  Zap,
  Crown,
  Calendar,
  BarChart3,
  Settings,
  Link,
  EyeOff,
  Eye as EyeIcon,
  X,
} from "lucide-react";

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
  const [previewCourse, setPreviewCourse] = useState(null);

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
    const keywords = q.split(/\s+/).filter(Boolean); // Split into individual keywords

    return courses
      .filter((course) => {
        if (!q) return true;

        const title = course.title?.toLowerCase() || "";
        const shortDesc = course.shortDescription?.toLowerCase() || "";
        const fullDesc = course.description?.toLowerCase() || "";
        const instructor = course.instructor?.toLowerCase() || "";

        // Enhanced keyword-based search
        const matchesSearch =
          // 1. Exact phrase in title (highest priority)
          title.includes(q) ||
          // 2. All keywords present in title (second priority)
          (keywords.length > 1 &&
            keywords.every((keyword) => title.includes(keyword))) ||
          // 3. Any keyword present in title (third priority)
          keywords.some((keyword) => title.includes(keyword)) ||
          // 4. Fallback to other fields
          shortDesc.includes(q) ||
          fullDesc.includes(q) ||
          instructor.includes(q);

        const matchesCategory =
          categoryFilter === "all" || course.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || course.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        // Enhanced relevance sorting when searching
        if (q) {
          const aTitle = a.title?.toLowerCase() || "";
          const bTitle = b.title?.toLowerCase() || "";

          // Calculate relevance scores
          let aScore = 0;
          let bScore = 0;

          // Exact phrase match in title gets highest score
          if (aTitle.includes(q)) aScore += 100;
          if (bTitle.includes(q)) bScore += 100;

          // All keywords in title gets high score
          if (keywords.length > 1) {
            if (keywords.every((keyword) => aTitle.includes(keyword)))
              aScore += 80;
            if (keywords.every((keyword) => bTitle.includes(keyword)))
              bScore += 80;
          }

          // Individual keyword matches get medium score
          const aKeywordMatches = keywords.filter((keyword) =>
            aTitle.includes(keyword)
          ).length;
          const bKeywordMatches = keywords.filter((keyword) =>
            bTitle.includes(keyword)
          ).length;
          aScore += aKeywordMatches * 10;
          bScore += bKeywordMatches * 10;

          // Sort by score (higher score first)
          if (aScore !== bScore) return bScore - aScore;

          // If same score, sort alphabetically
          return aTitle.localeCompare(bTitle);
        }
        return 0; // No search term, maintain original order
      });
  }, [courses, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (isPublished) => {
    const status = isPublished ? "published" : "draft";
    const statusConfig = {
      published: {
        bg: "bg-gradient-to-r from-green-500/90 to-emerald-500/90",
        text: "text-white",
        border: "border-green-400/50",
        label: "Published",
        icon: "●",
      },
      draft: {
        bg: "bg-gradient-to-r from-yellow-500/90 to-orange-500/90",
        text: "text-white",
        border: "border-yellow-400/50",
        label: "Draft",
        icon: "●",
      },
      archived: {
        bg: "bg-gradient-to-r from-gray-500/90 to-slate-500/90",
        text: "text-white",
        border: "border-gray-400/50",
        label: "Archived",
        icon: "●",
      },
    };
    const config = statusConfig[status];
    return (
      <div
        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </div>
    );
  };

  const getLevelBadge = (level) => {
    const levelConfig = {
      Beginner: {
        bg: "bg-gradient-to-r from-blue-500/90 to-cyan-500/90",
        text: "text-white",
        border: "border-blue-400/50",
      },
      Intermediate: {
        bg: "bg-gradient-to-r from-purple-500/90 to-pink-500/90",
        text: "text-white",
        border: "border-purple-400/50",
      },
      Advanced: {
        bg: "bg-gradient-to-r from-red-500/90 to-rose-500/90",
        text: "text-white",
        border: "border-red-400/50",
      },
    };
    const config = levelConfig[level] || levelConfig.Beginner;
    return (
      <div
        className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border ${config.bg} ${config.text} ${config.border}`}
      >
        {level}
      </div>
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

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
      modules:
        prev.modules.length > 1
          ? prev.modules.filter((m) => m.id !== id)
          : prev.modules,
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
    setForm((prev) => ({
      ...prev,
      thumbnail: file,
      thumbnailPreview: preview,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Course title is required";
    if (!form.shortDescription.trim()) return "Short description is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.duration.trim()) return "Duration is required";
    if (form.price === "" || Number.isNaN(Number(form.price)))
      return "Valid price is required";
    if (!form.thumbnail && !editingCourse)
      return "Course thumbnail is required";

    for (const m of form.modules) {
      if (!m.title.trim()) return "Each module must have a title";
      if (!["video", "image"].includes(m.type))
        return "Module type must be video or image";
      if (!editingCourse && !m.file)
        return "Each module must include a video or image file";
    }
    return null;
  };

  // Helper: map BE course to FE card shape
  const mapFromBackend = (c) => ({
    id: c._id,
    title: c.title,
    description: c.shortDescription || c.description,
    instructor: `${c.instructor?.firstName ?? ""} ${
      c.instructor?.lastName ?? ""
    }`.trim(),
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
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
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
      {/* Enhanced Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Course Management
          </h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">
            Manage your courses and content
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button className="btn-outline-premium px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 justify-center">
            <Link size={16} />
            <span className="hidden sm:inline">Manage Live Links</span>
            <span className="sm:hidden">Live Links</span>
          </button>
          <button
            onClick={openAddModal}
            className="btn-premium px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 justify-center"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add New Course</span>
            <span className="sm:hidden">Add Course</span>
          </button>
        </div>
      </div>

      {/* Premium Filters and Search */}
      <div className="card-premium p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search courses by title keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium w-full pl-10 text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-premium w-full pl-10 text-sm sm:text-base"
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <CheckCircle
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-premium w-full pl-10 text-sm sm:text-base"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Count Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          All Courses ({filteredCourses.length})
        </h2>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <span>
            Showing {filteredCourses.length} of {courses.length} courses
          </span>
        </div>
      </div>

      {/* Enhanced Courses Grid with Consistent Heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="card-premium overflow-hidden group hover-lift relative flex flex-col h-full"
          >
            {/* Enhanced Course Image / Cover */}
            <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
              {(() => {
                const explicitThumb = course.thumbnail || null;
                const firstThumb = course.modules?.find(
                  (m) => m.thumbnailPreview
                )?.thumbnailPreview;
                const firstImage = course.modules?.find(
                  (m) => m.type === "image" && m.filePreview
                )?.filePreview;
                const cover = explicitThumb || firstThumb || firstImage;

                if (cover) {
                  return (
                    <>
                      <img
                        src={cover}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </>
                  );
                }

                // Enhanced placeholder for courses without thumbnails
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute top-6 left-6 w-12 h-12 rounded-full animate-pulse"
                        style={{ background: "var(--brand)" }}
                      ></div>
                      <div
                        className="absolute top-12 right-12 w-8 h-8 rounded-full animate-pulse delay-100"
                        style={{ background: "var(--accent-gold)" }}
                      ></div>
                      <div
                        className="absolute bottom-8 left-12 w-6 h-6 rounded-full animate-pulse delay-200"
                        style={{ background: "var(--accent-rose)" }}
                      ></div>
                      <div
                        className="absolute bottom-6 right-6 w-16 h-16 rounded-full animate-pulse delay-300"
                        style={{ background: "var(--brand-strong)" }}
                      ></div>
                    </div>

                    {/* Main icon with enhanced styling */}
                    <div className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <BookOpen size={36} className="text-white" />
                    </div>

                    {/* Course info overlay */}
                    <div className="relative z-10 text-center px-6">
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {course.title}
                      </h3>
                      <p className="text-sm text-white/90 drop-shadow-md">
                        {course.category}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Enhanced Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {getStatusBadge(course.status)}
                {course.isFeatured && (
                  <div className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border border-yellow-400/50">
                    <Star size={12} />
                    Featured
                  </div>
                )}
              </div>

              {/* Enhanced Level Badge */}
              <div className="absolute top-4 right-4">
                {getLevelBadge(course.level)}
              </div>

              {/* Enhanced Live Class Badge */}
              <div className="absolute bottom-4 left-4">
                <div className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border border-green-400/50">
                  <Play size={12} />
                  Live Class
                </div>
              </div>

              {/* Enhanced Price Badge */}
              <div className="absolute bottom-4 right-4">
                <div className="px-3 py-1.5 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border border-yellow-400/50">
                  ₹{Number(course.price ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Enhanced Course Content with Consistent Height */}
            <div className="p-4 sm:p-6 flex flex-col flex-1">
              {/* Course Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-4">
                  {course.description}
                </p>
              </div>

              {/* Enhanced Course Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <BookOpen
                      size={14}
                      className="sm:w-4 sm:h-4 text-blue-400"
                    />
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {course.modules?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Modules</div>
                </div>
                <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Users size={14} className="sm:w-4 sm:h-4 text-green-400" />
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {course.students || 0}
                  </div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
                <div className="text-center p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400" />
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {course.rating || 0}
                  </div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setPreviewCourse(course)}
                    className="btn-outline-premium px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300"
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Preview</span>
                    <span className="sm:hidden">View</span>
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="btn-premium px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleStatusToggle(
                        course.id,
                        course.status === "published" ? "draft" : "published"
                      )
                    }
                    className={`px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 ${
                      course.status === "published"
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                    }`}
                  >
                    {course.status === "published" ? (
                      <>
                        <EyeOff size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Unpublish</span>
                        <span className="sm:hidden">Hide</span>
                      </>
                    ) : (
                      <>
                        <EyeIcon size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Publish</span>
                        <span className="sm:hidden">Show</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="px-2 sm:px-3 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
                border: "1px solid var(--brand)30",
              }}
            >
              <BookOpen size={24} style={{ color: "var(--brand)" }} />
            </div>
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Courses
              </p>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
                border: "1px solid var(--accent-gold)30",
              }}
            >
              <CheckCircle size={24} style={{ color: "var(--accent-gold)" }} />
            </div>
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Published
              </p>
              <p className="text-2xl font-bold text-white">
                {courses.filter((c) => c.status === "published").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                border: "1px solid var(--accent-rose)30",
              }}
            >
              <Users size={24} style={{ color: "var(--accent-rose)" }} />
            </div>
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Students
              </p>
              <p className="text-2xl font-bold text-white">
                {courses
                  .reduce((acc, c) => acc + (c.students || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium p-6 group hover-lift">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
                border: "1px solid var(--brand-strong)30",
              }}
            >
              <TrendingUp size={24} style={{ color: "var(--brand-strong)" }} />
            </div>
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-white">
                ₹
                {(
                  courses.reduce(
                    (acc, c) => acc + (c.price || 0) * (c.students || 0),
                    0
                  ) / 100000
                ).toFixed(1)}
                L
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
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] overflow-y-auto px-6 py-4 space-y-6"
            >
              {errorMsg ? (
                <div className="p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {errorMsg}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., React for Web Development"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Professor
                  </label>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={(e) => updateField("instructor", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., Dr. John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., Frontend Development"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => updateField("level", e.target.value)}
                    className="input-premium w-full"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="input-premium w-full"
                    placeholder="e.g., 7999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Target
                  </label>
                  <select
                    value={form.target}
                    onChange={(e) => updateField("target", e.target.value)}
                    className="input-premium w-full"
                  >
                    <option value="course">Course</option>
                    <option value="launchpad">Launchpad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="input-premium w-full"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="input-premium w-full"
                    rows={3}
                    placeholder="What will students learn?"
                  />
                </div>
              </div>

              {/* Modules */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Modules</h3>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn-premium px-4 py-2 text-sm font-medium flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Module
                  </button>
                </div>

                <div className="mt-3 space-y-4">
                  {form.modules.map((m, idx) => (
                    <div
                      key={m.id}
                      className="border border-white/10 rounded-lg p-4 space-y-3 bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Module {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeModule(m.id)}
                          className="text-red-400 text-sm hover:text-red-300 hover:underline transition-colors duration-200"
                          disabled={form.modules.length === 1}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) =>
                              updateModule(m.id, { title: e.target.value })
                            }
                            className="input-premium w-full"
                            placeholder="Module title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Type
                          </label>
                          <select
                            value={m.type}
                            onChange={(e) =>
                              updateModule(m.id, { type: e.target.value })
                            }
                            className="input-premium w-full"
                          >
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-white mb-2">
                            Description
                          </label>
                          <textarea
                            value={m.description}
                            onChange={(e) =>
                              updateModule(m.id, {
                                description: e.target.value,
                              })
                            }
                            className="input-premium w-full"
                            rows={2}
                            placeholder="Module summary or notes"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            {m.type === "video" ? "Video File" : "Image File"}
                          </label>
                          <input
                            type="file"
                            accept={m.type === "video" ? "video/*" : "image/*"}
                            onChange={(e) =>
                              onChangeModuleFile(
                                m.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className="input-premium w-full text-sm"
                          />
                          {m.filePreview ? (
                            m.type === "image" ? (
                              <img
                                src={m.filePreview}
                                alt="module"
                                className="mt-2 h-24 w-24 object-cover rounded"
                              />
                            ) : (
                              <video
                                src={m.filePreview}
                                controls
                                className="mt-2 h-24 rounded"
                              />
                            )
                          ) : null}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Thumbnail (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              onChangeModuleThumb(
                                m.id,
                                e.target.files?.[0] || null
                              )
                            }
                            className="input-premium w-full text-sm"
                          />
                          {m.thumbnailPreview ? (
                            <img
                              src={m.thumbnailPreview}
                              alt="thumb"
                              className="mt-2 h-16 w-16 object-cover rounded"
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
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
                    editingCourse
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : "bg-gradient-to-r from-green-600 to-green-700"
                  }`}
                  disabled={submitting}
                >
                  <Save size={16} />
                  {submitting
                    ? "Saving..."
                    : editingCourse
                    ? "Save Changes"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Course Preview Modal */}
      {previewCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-premium max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Course Preview</h2>
              <button
                onClick={() => setPreviewCourse(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Course Header */}
            <div className="mb-6">
              <div className="relative h-64 bg-gradient-to-br from-bg-secondary to-bg-primary rounded-xl overflow-hidden mb-4">
                {(() => {
                  const explicitThumb = previewCourse.thumbnail || null;
                  const firstThumb = previewCourse.modules?.find(
                    (m) => m.thumbnailPreview
                  )?.thumbnailPreview;
                  const firstImage = previewCourse.modules?.find(
                    (m) => m.type === "image" && m.filePreview
                  )?.filePreview;
                  const cover = explicitThumb || firstThumb || firstImage;

                  if (cover) {
                    return (
                      <>
                        <img
                          src={cover}
                          alt={previewCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </>
                    );
                  }

                  return (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand)10, var(--brand)5)",
                      }}
                    >
                      <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand), var(--brand-strong))",
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <BookOpen size={40} className="text-white" />
                      </div>
                      <h3
                        className="text-xl font-bold text-white mb-2"
                        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                      >
                        {previewCourse.title}
                      </h3>
                      <p
                        className="text-white/80"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                      >
                        {previewCourse.category}
                      </p>
                    </div>
                  );
                })()}

                {/* Status Badges */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(previewCourse.status)}
                </div>
                <div className="absolute top-4 right-4">
                  {getLevelBadge(previewCourse.level)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {previewCourse.title}
                  </h1>
                  <p className="text-lg mb-4 text-gray-300">
                    {previewCourse.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      ₹{Number(previewCourse.price ?? 0).toLocaleString()}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: "var(--brand)10",
                        color: "var(--brand)",
                      }}
                    >
                      {previewCourse.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={16} style={{ color: "var(--brand)" }} />
                        <span className="font-semibold text-white">
                          Modules
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {previewCourse.modules?.length || 0}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Users
                          size={16}
                          style={{ color: "var(--accent-gold)" }}
                        />
                        <span className="font-semibold text-white">
                          Students
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {previewCourse.students || 0}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock
                          size={16}
                          style={{ color: "var(--accent-rose)" }}
                        />
                        <span className="font-semibold text-white">
                          Duration
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {previewCourse.duration}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Star
                          size={16}
                          style={{ color: "var(--accent-rose)" }}
                        />
                        <span className="font-semibold text-white">Rating</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {previewCourse.rating || 0}/5
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Modules */}
            {previewCourse.modules?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Course Modules ({previewCourse.modules.length})
                </h3>
                <div className="space-y-3">
                  {previewCourse.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="p-4 rounded-lg border border-white/10 bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--brand), var(--brand-strong))",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {module.title || `Module ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-300">
                            {module.description || "No description available"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                background: "var(--brand)10",
                                color: "var(--brand)",
                              }}
                            >
                              {module.type}
                            </span>
                            {module.filePreview && (
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  background: "var(--accent-gold)10",
                                  color: "var(--accent-gold)",
                                }}
                              >
                                Has Content
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => setPreviewCourse(null)}
                className="btn-outline-premium px-6 py-2 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPreviewCourse(null);
                  openEditModal(previewCourse);
                }}
                className="btn-premium px-6 py-2 text-sm font-medium"
              >
                Edit Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
