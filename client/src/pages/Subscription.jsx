// src/pages/Subscription.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService.js";
import {
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  Star,
  Award,
  Target,
} from "lucide-react";

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function CourseCard({ course, enrollment }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/selected-course/${course._id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 50) return "bg-blue-500";
    if (progress > 0) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const getProgressValue = (enrollment) => {
    // Handle different progress structures
    if (typeof enrollment.progress === "number") {
      return enrollment.progress;
    }
    if (enrollment.progress && typeof enrollment.progress === "object") {
      // User model structure: progress.completedVideos / progress.totalVideos
      if (
        enrollment.progress.completedVideos &&
        enrollment.progress.totalVideos
      ) {
        return Math.round(
          (enrollment.progress.completedVideos /
            enrollment.progress.totalVideos) *
            100
        );
      }
    }
    return 0;
  };

  return (
    <div
      className="card-premium overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="relative h-48 bg-gradient-to-br from-bg-secondary to-bg-primary overflow-hidden">
        <img
          src={course.thumbnail || "/src/assets/courses1.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
            style={{
              background: "var(--brand)",
              color: "white",
            }}
          >
            {course.level || "Beginner"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Play size={16} style={{ color: "var(--brand)" }} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-brand transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "var(--brand)20",
              color: "var(--brand)",
            }}
          >
            {course.level || "Beginner"}
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "var(--accent-rose)20",
              color: "var(--accent-rose)",
            }}
          >
            {course.category || "General"}
          </span>
        </div>

        <div
          className="flex items-center gap-2 mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          <User size={14} />
          <span className="text-sm">
            By {course.instructor?.firstName} {course.instructor?.lastName}
          </span>
        </div>

        <div className="space-y-2 mb-4" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2 text-xs">
            <Calendar size={12} />
            <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock size={12} />
            <span>Last accessed: {formatDate(enrollment.lastAccessed)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Progress
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--brand)" }}
            >
              {getProgressValue(enrollment)}%
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${getProgressValue(enrollment)}%`,
                background:
                  getProgressValue(enrollment) === 100
                    ? "var(--accent-gold)"
                    : getProgressValue(enrollment) > 50
                    ? "var(--brand)"
                    : "var(--accent-rose)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Subscription() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    level: "all",
    progress: "all",
    sort: "last-accessed-desc",
  });

  // Debounced search for better performance
  const debouncedSearch = useDebounce(filters.search, 300);

  // Available filter options
  const categories = useMemo(() => {
    const cats = [
      ...new Set(
        enrolledCourses.map((course) => course.course?.category).filter(Boolean)
      ),
    ];
    return ["all", ...cats];
  }, [enrolledCourses]);

  const levels = useMemo(() => {
    const levs = [
      ...new Set(
        enrolledCourses.map((course) => course.course?.level).filter(Boolean)
      ),
    ];
    return ["all", ...levs];
  }, [enrolledCourses]);

  const sortOptions = [
    { value: "last-accessed-desc", label: "Last Accessed (Newest)" },
    { value: "last-accessed-asc", label: "Last Accessed (Oldest)" },
    { value: "enrolled-date-desc", label: "Enrolled Date (Newest)" },
    { value: "enrolled-date-asc", label: "Enrolled Date (Oldest)" },
    { value: "progress-desc", label: "Progress (Highest)" },
    { value: "progress-asc", label: "Progress (Lowest)" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
  ];

  // Load enrolled courses
  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getEnrolledCourses();
      setEnrolledCourses(response.enrolledCourses || []);
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
      setError("Failed to load enrolled courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const syncEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the sync endpoint
      const response = await fetch("/api/users/sync-enrollments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log("Enrollments synced:", result.data);
        // Reload the courses after sync
        await loadEnrolledCourses();
      } else {
        throw new Error(result.message || "Failed to sync enrollments");
      }
    } catch (error) {
      console.error("Error syncing enrollments:", error);
      setError("Failed to sync enrollments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and get filtered courses
  const filteredCourses = useMemo(() => {
    let filtered = [...enrolledCourses];

    // Search filter - search in title, instructor name, and description (using debounced search)
    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.course?.title?.toLowerCase().includes(searchTerm) ||
          course.course?.instructor?.firstName
            ?.toLowerCase()
            .includes(searchTerm) ||
          course.course?.instructor?.lastName
            ?.toLowerCase()
            .includes(searchTerm) ||
          course.course?.shortDescription?.toLowerCase().includes(searchTerm) ||
          course.course?.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (course) => course.course?.category === filters.category
      );
    }

    // Level filter
    if (filters.level !== "all") {
      filtered = filtered.filter(
        (course) => course.course?.level === filters.level
      );
    }

    // Progress filter
    if (filters.progress !== "all") {
      switch (filters.progress) {
        case "not-started":
          filtered = filtered.filter(
            (course) => getProgressValue(course) === 0
          );
          break;
        case "in-progress":
          filtered = filtered.filter(
            (course) =>
              getProgressValue(course) > 0 && getProgressValue(course) < 100
          );
          break;
        case "completed":
          filtered = filtered.filter(
            (course) => getProgressValue(course) === 100
          );
          break;
      }
    }

    // Sort
    switch (filters.sort) {
      case "title-asc":
        filtered.sort((a, b) =>
          (a.course?.title || "").localeCompare(b.course?.title || "")
        );
        break;
      case "title-desc":
        filtered.sort((a, b) =>
          (b.course?.title || "").localeCompare(a.course?.title || "")
        );
        break;
      case "progress-asc":
        filtered.sort((a, b) => getProgressValue(a) - getProgressValue(b));
        break;
      case "progress-desc":
        filtered.sort((a, b) => getProgressValue(b) - getProgressValue(a));
        break;
      case "enrolled-date-asc":
        filtered.sort(
          (a, b) => new Date(a.enrolledAt || 0) - new Date(b.enrolledAt || 0)
        );
        break;
      case "enrolled-date-desc":
        filtered.sort(
          (a, b) => new Date(b.enrolledAt || 0) - new Date(a.enrolledAt || 0)
        );
        break;
      case "last-accessed-asc":
        filtered.sort(
          (a, b) =>
            new Date(a.lastAccessed || 0) - new Date(b.lastAccessed || 0)
        );
        break;
      case "last-accessed-desc":
        filtered.sort(
          (a, b) =>
            new Date(b.lastAccessed || 0) - new Date(a.lastAccessed || 0)
        );
        break;
    }

    return filtered;
  }, [enrolledCourses, filters, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      level: "all",
      progress: "all",
      sort: "last-accessed-desc",
    });
  };

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4B7A]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadEnrolledCourses}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1
            className="heading-1 text-3xl md:text-4xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Your Enrolled Courses
          </h1>
          <p
            className="text-lg mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {filteredCourses.length} of {enrolledCourses.length} courses
          </p>
          {enrolledCourses.length === 0 && (
            <button
              onClick={syncEnrollments}
              disabled={loading}
              className="btn-premium px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Syncing..." : "Sync Enrollments"}
            </button>
          )}
        </div>

        {/* Premium Search */}
        <div className="relative w-full lg:w-80">
          <input
            className="w-full input-premium pl-12 pr-4 py-3 rounded-full"
            placeholder="Search courses or instructors..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-4 top-3.5"
            style={{ color: "var(--text-muted)" }}
          />
          {filters.search && filters.search !== debouncedSearch && (
            <div className="absolute right-4 top-3.5">
              <div
                className="animate-spin rounded-full h-4 w-4 border-b-2"
                style={{ borderColor: "var(--brand)" }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Active Filters Summary */}
      {(filters.search ||
        filters.category !== "all" ||
        filters.level !== "all" ||
        filters.progress !== "all") && (
        <div className="card-premium p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: "var(--brand)" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Active filters:
              </span>
            </div>
            {filters.search && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "var(--brand)20",
                  color: "var(--brand)",
                }}
              >
                Search: "{filters.search}"
              </span>
            )}
            {filters.category !== "all" && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "var(--accent-rose)20",
                  color: "var(--accent-rose)",
                }}
              >
                Category: {filters.category}
              </span>
            )}
            {filters.level !== "all" && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "var(--accent-gold)20",
                  color: "var(--accent-gold)",
                }}
              >
                Level: {filters.level}
              </span>
            )}
            {filters.progress !== "all" && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "var(--brand-strong)20",
                  color: "var(--brand-strong)",
                }}
              >
                Progress: {filters.progress.replace("-", " ")}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--brand)" }}
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Premium Filters */}
      <div className="card-premium p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Filter size={20} style={{ color: "var(--brand)" }} />
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Filter & Sort
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Category Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full input-premium"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
              className="w-full input-premium"
            >
              <option value="all">All Levels</option>
              {levels.slice(1).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Progress
            </label>
            <select
              value={filters.progress}
              onChange={(e) => handleFilterChange("progress", e.target.value)}
              className="w-full input-premium"
            >
              <option value="all">All Progress</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="w-full input-premium"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full btn-outline-premium py-3"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Premium Results */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="card-premium p-12 max-w-md mx-auto">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                border: "1px solid var(--accent-rose)30",
              }}
            >
              <BookOpen size={40} style={{ color: "var(--accent-rose)" }} />
            </div>
            <h3
              className="heading-3 text-2xl mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              No courses found
            </h3>
            <p
              className="text-lg mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {enrolledCourses.length === 0
                ? "You haven't enrolled in any courses yet."
                : "Try adjusting your filters to see more results."}
            </p>
            {enrolledCourses.length === 0 && (
              <button
                onClick={() => (window.location.href = "/courses")}
                className="btn-premium px-8 py-4"
              >
                Browse Courses
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((enrollment) =>
            enrollment?.course ? (
              <CourseCard
                key={enrollment._id || enrollment.course?._id}
                course={enrollment.course}
                enrollment={enrollment}
              />
            ) : null
          )}
        </div>
      )}
    </section>
  );
}
