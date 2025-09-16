// src/pages/Subscription.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService.js";

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
    if (!course?._id) return;
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
      className="bg-white border rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="w-full h-36 bg-slate-200 rounded-lg mb-3 overflow-hidden">
        <img
          src={course?.thumbnail || "/src/assets/courses1.jpg"}
          alt={course?.title || "Course thumbnail"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {course?.title || "Untitled course"}
        </h3>

        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {course?.level || "Beginner"}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            {course?.category || "General"}
          </span>
        </div>

        <p className="text-xs text-indigo-600">
          By {course?.instructor?.firstName || ""}{" "}
          {course?.instructor?.lastName || ""}
        </p>

        <div className="text-xs text-slate-500">
          <p>Enrolled: {formatDate(enrollment?.enrolledAt)}</p>
          <p>Last accessed: {formatDate(enrollment?.lastAccessed)}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-700">Progress</span>
          <span className="text-xs text-slate-600">
            {getProgressValue(enrollment)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(
              getProgressValue(enrollment)
            )}`}
            style={{ width: `${getProgressValue(enrollment)}%` }}
          />
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F4B7A]">
            Your Enrolled Courses
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredCourses.length} of {enrolledCourses.length} courses
          </p>
          {enrolledCourses.length === 0 && (
            <button
              onClick={syncEnrollments}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Syncing..." : "Sync Enrollments"}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <input
            className="w-full rounded-full border border-[#1F4B7A] pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F4B7A]"
            placeholder="Search courses or instructors..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-[#1F4B7A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
            />
          </svg>
          {filters.search && filters.search !== debouncedSearch && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1F4B7A]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.search ||
        filters.category !== "all" ||
        filters.level !== "all" ||
        filters.progress !== "all") && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              Active filters:
            </span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Category: {filters.category}
              </span>
            )}
            {filters.level !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Level: {filters.level}
              </span>
            )}
            {filters.progress !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Progress: {filters.progress.replace("-", " ")}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4B7A] focus:border-[#1F4B7A]"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4B7A] focus:border-[#1F4B7A]"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress
            </label>
            <select
              value={filters.progress}
              onChange={(e) => handleFilterChange("progress", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4B7A] focus:border-[#1F4B7A]"
            >
              <option value="all">All Progress</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4B7A] focus:border-[#1F4B7A]"
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
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 mb-4">
            {enrolledCourses.length === 0
              ? "You haven't enrolled in any courses yet."
              : "Try adjusting your filters to see more results."}
          </p>
          {enrolledCourses.length === 0 && (
            <button
              onClick={() => (window.location.href = "/courses")}
              className="px-6 py-2 bg-[#1F4B7A] text-white rounded-lg hover:bg-[#1a3f6b] transition-colors"
            >
              Browse Courses
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((enrollment) => (
            <CourseCard
              key={enrollment._id || enrollment.course?._id}
              course={enrollment.course}
              enrollment={enrollment}
            />
          ))}
        </div>
      )}
    </section>
  );
}
