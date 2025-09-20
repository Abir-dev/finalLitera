import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";
import { courseService } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import KPICard from "../components/KPICard";
import useDebounce from "../hooks/useDebounce";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AiPic from "../assets/Ai-pic.jpg";
import ReactPic from "../assets/react-pic.jpg";
import courses1 from "../assets/courses1.jpg";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("default");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const categories = [
    "All Courses",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
  ];

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "rating-desc", label: "Rating (High to Low)" },
    { value: "students-desc", label: "Most Popular" },
  ];

  // Load courses from backend with filters
  const loadCourses = useCallback(
    async (resetPagination = true) => {
      try {
        if (resetPagination) {
          setLoading(true);
        } else {
          setSearchLoading(true);
        }
        setError(null);

        // Build query parameters
        const params = {
          page: resetPagination ? 1 : pagination.currentPage,
          limit: 12,
        };

        // Add search query if present
        if (debouncedSearchTerm.trim()) {
          params.q = debouncedSearchTerm.trim();
        }

        // Add category filter
        if (selectedCategory !== "All Courses") {
          // Map frontend categories to backend categories
          const categoryMap = {
            "Web Development": "web-development",
            "Data Science": "data-science",
            "Machine Learning": "machine-learning",
            "Mobile Development": "mobile-development",
            "Cloud Computing": "cloud-computing",
            DevOps: "devops",
            Cybersecurity: "cybersecurity",
          };
          params.category =
            categoryMap[selectedCategory] ||
            selectedCategory.toLowerCase().replace(" ", "-");
        }

        // Add level filter
        if (selectedLevel !== "All Levels") {
          params.level = selectedLevel.toLowerCase();
        }

        // Add sorting
        if (sortBy !== "default") {
          const sortMap = {
            "title-asc": "title",
            "title-desc": "-title",
            "price-asc": "price",
            "price-desc": "-price",
            "rating-desc": "-rating.average",
            "students-desc": "-enrollmentCount",
          };
          params.sort = sortMap[sortBy] || "-createdAt";
        }

        console.log("Loading courses with params:", params);

        // Try to fetch from backend first
        const result = await courseService.getCourses(params);

        if (result && result.data && Array.isArray(result.data.courses)) {
          const formattedCourses = result.data.courses.map((course) =>
            courseService.formatCourseForDisplay
              ? courseService.formatCourseForDisplay(course)
              : course
          );

          console.log("Backend courses loaded:", formattedCourses.length);
          setCourses(formattedCourses);

          // Update pagination
          if (result.data.pagination) {
            setPagination(result.data.pagination);
          }
        } else {
          console.log("No courses from backend, using fallback data");
          const fallbackCourses = generateDynamicCourses();
          setCourses(fallbackCourses);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalCourses: fallbackCourses.length,
            hasNext: false,
            hasPrev: false,
          });
        }
      } catch (error) {
        console.warn(
          "Backend unavailable, using fallback courses:",
          error.message
        );
        const fallbackCourses = generateDynamicCourses();
        setCourses(fallbackCourses);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCourses: fallbackCourses.length,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [
      debouncedSearchTerm,
      selectedCategory,
      selectedLevel,
      sortBy,
      pagination.currentPage,
    ]
  );

  // Load courses on component mount and when filters change
  useEffect(() => {
    loadCourses(true);
  }, [
    loadCourses,
    debouncedSearchTerm,
    selectedCategory,
    selectedLevel,
    sortBy,
  ]);

  // Load courses when pagination changes
  useEffect(() => {
    if (pagination.currentPage > 1) {
      loadCourses(false);
    }
  }, [loadCourses, pagination.currentPage]);

  // Dynamic course generation based on categories
  const generateDynamicCourses = () => {
    const courseTemplates = [
      {
        title: "Advanced Machine Learning & AI",
        sub: "Master cutting-edge AI algorithms and neural networks with hands-on projects",
        author: "By Dr. Sarah Chen",
        price: "₹12,999",
        img: AiPic,
        level: "Advanced",
        duration: "12 weeks",
        students: 2847,
        rating: 4.9,
        category: "Machine Learning",
      },
      {
        title: "Full-Stack React Development",
        sub: "Build modern web applications with React, Node.js, and MongoDB",
        author: "By Alex Rodriguez",
        price: "₹9,999",
        img: ReactPic,
        level: "Intermediate",
        duration: "10 weeks",
        students: 3456,
        rating: 4.8,
        category: "Web Development",
      },
      {
        title: "Data Science with Python",
        sub: "Comprehensive data analysis and visualization using Python and ML libraries",
        author: "By Dr. Michael Kim",
        price: "₹11,499",
        img: courses1,
        level: "Intermediate",
        duration: "14 weeks",
        students: 1923,
        rating: 4.7,
        category: "Data Science",
      },
      {
        title: "Cloud Computing & DevOps",
        sub: "Deploy and scale applications using AWS, Docker, and Kubernetes",
        author: "By Emma Thompson",
        price: "₹13,999",
        img: courses1,
        level: "Advanced",
        duration: "16 weeks",
        students: 1567,
        rating: 4.9,
        category: "Cloud Computing",
      },
    ];

    return courseTemplates.map((course, index) => ({
      id: `dynamic-${index + 1}`,
      ...course,
      // Add dynamic elements
      enrollmentCount: course.students + Math.floor(Math.random() * 500),
      rating: { average: course.rating + (Math.random() - 0.5) * 0.2 },
      videos: Array.from(
        { length: Math.floor(Math.random() * 20) + 10 },
        (_, i) => `video-${i + 1}.mp4`
      ),
      thumbnail: course.img,
      shortDescription: course.sub,
      instructor: {
        firstName: course.author.split(" ")[1] || "Expert",
        lastName: course.author.split(" ")[2] || "Instructor",
      },
    }));
  };

  // No need for client-side filtering since we're filtering on the backend

  // Dynamic promo slides based on course categories
  const generatePromoSlides = () => {
    const baseSlides = [
      {
        id: 1,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "🤖",
        title: "AI & Machine Learning",
        subtitle:
          "Master the future of technology with neural networks and deep learning algorithms",
        category: "Machine Learning",
      },
      {
        id: 2,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "📊",
        title: "Data Science",
        subtitle:
          "Transform raw data into powerful insights and predictive analytics",
        category: "Data Science",
      },
      {
        id: 3,
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "💻",
        title: "Web Development",
        subtitle:
          "Build modern, responsive web applications with cutting-edge technologies",
        category: "Web Development",
      },
      {
        id: 4,
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        icon: "☁️",
        title: "Cloud Computing",
        subtitle:
          "Deploy and scale applications using AWS, Docker, and Kubernetes",
        category: "Cloud Computing",
      },
    ];

    // Add dynamic course counts and stats
    return baseSlides.map((slide) => {
      const categoryCourses = courses.filter((course) =>
        course.category?.toLowerCase().includes(slide.category.toLowerCase())
      );

      return {
        ...slide,
        courseCount:
          categoryCourses.length || Math.floor(Math.random() * 15) + 5,
        studentCount:
          categoryCourses.reduce(
            (acc, course) =>
              acc + (course.enrollmentCount || course.students || 0),
            0
          ) || Math.floor(Math.random() * 5000) + 1000,
        avgRating:
          categoryCourses.length > 0
            ? (
                categoryCourses.reduce(
                  (acc, course) =>
                    acc + (course.rating?.average || course.rating || 0),
                  0
                ) / categoryCourses.length
              ).toFixed(1)
            : (4.5 + Math.random() * 0.5).toFixed(1),
      };
    });
  };

  const promoSlides = generatePromoSlides();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Page Header - UPDATED DESIGN */}
        <div className="text-center mb-8 mt-7 sm:mb-10">
          <div className="reveal">
            <div className="inline-block px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-medium text-blue-300">
              ✨ Updated Compact UI Design
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
              Explore Our Courses
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
              style={{ color: "var(--text-secondary)" }}
            >
              From beginner to expert level, discover premium courses designed
              to accelerate your career in technology and beyond.
            </p>
            {courses.length > 0 && (
              <div
                className="flex items-center justify-center gap-2 text-xs sm:text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                ></div>
                <span>
                  Showing {courses.length} of {pagination.totalCourses} course
                  {pagination.totalCourses !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Promo Banner with Swiper */}
        <section className="rounded-2xl sm:rounded-3xl overflow-hidden relative bg-gray-100 mb-8 sm:mb-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            loop={true}
            style={{ height: "240px" }}
            className="sm:h-80"
          >
            {promoSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="relative w-full h-full flex items-center"
                  style={{ background: slide.gradient }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-12 h-12 sm:w-20 sm:h-20 border-2 border-white rounded-full"></div>
                    <div className="absolute top-6 right-4 sm:top-12 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-4 left-6 sm:bottom-8 sm:left-12 w-10 h-10 sm:w-16 sm:h-16 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-8 right-2 sm:bottom-16 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 w-full px-4 sm:px-8 md:px-12">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                      {/* Icon */}
                      <div className="text-4xl sm:text-6xl md:text-8xl">
                        {slide.icon}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 text-white text-center sm:text-left">
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
                          {slide.title}
                        </h2>
                        <p className="text-sm sm:text-lg md:text-xl opacity-90 max-w-2xl">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        {/* Search and Filters - UPDATED UI */}
        <div
          className="py-4 rounded-4xl p-4 mb-6"
          style={{
            background:
              "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Compact Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses, instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <svg
                  className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Loading indicator when searching */}
                {searchLoading &&
                  searchTerm &&
                  searchTerm !== debouncedSearchTerm && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    </div>
                  )}

                {/* Clear search button */}
                {searchTerm && !searchLoading && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Level Filter */}
              <div className="flex-1 sm:w-32">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  {levels.map((level) => (
                    <option
                      key={level}
                      value={level}
                      style={{ background: "#1a1a1a", color: "white" }}
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex-1 sm:w-40">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ background: "#1a1a1a", color: "white" }}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm ||
                selectedCategory !== "All Courses" ||
                selectedLevel !== "All Levels" ||
                sortBy !== "default") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Courses");
                    setSelectedLevel("All Levels");
                    setSortBy("default");
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Course Categories Filter */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  category === selectedCategory
                    ? "btn-premium shadow-lg"
                    : "btn-outline-premium hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Course Statistics - UPDATED UI */}
        <section className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              }
              value={courses.length}
              label="Total Courses"
              iconColor="var(--brand)"
              iconBackground="linear-gradient(135deg, var(--brand)20, var(--brand)10)"
              iconBorder="1px solid var(--brand)30"
            />

            <KPICard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              }
              value={`${categories.length - 1}+`}
              label="Categories"
              iconColor="var(--accent-rose)"
              iconBackground="linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)"
              iconBorder="1px solid var(--accent-rose)30"
            />

            <KPICard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              }
              value={courses
                .reduce(
                  (acc, course) =>
                    acc + (course.enrollmentCount || course.students || 0),
                  0
                )
                .toLocaleString()}
              label="Students"
              iconColor="var(--accent-gold)"
              iconBackground="linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)"
              iconBorder="1px solid var(--accent-gold)30"
            />

            <KPICard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              }
              value={
                courses.length > 0
                  ? (
                      courses.reduce(
                        (acc, course) =>
                          acc + (course.rating?.average || course.rating || 0),
                        0
                      ) / courses.length
                    ).toFixed(1)
                  : "0.0"
              }
              label="Average Rating"
              iconColor="var(--brand-strong)"
              iconBackground="linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)"
              iconBorder="1px solid var(--brand-strong)30"
            />
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-transparent mx-auto mb-6"></div>
                <div
                  className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 animate-spin mx-auto"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Loading Courses
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Fetching the latest courses for you...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-premium p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Failed to Load Courses
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {error}
            </p>
            <button
              onClick={loadCourses}
              className="btn-premium px-6 py-3 text-sm font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Courses Grid */}
        <section>
          {courses.length === 0 && !loading ? (
            <div className="card-premium p-12 sm:p-16 text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                No Courses Found
              </h3>
              <p
                className="text-base sm:text-lg mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {courses.length === 0
                  ? "We're working on adding amazing courses for you. Check back soon!"
                  : "Try adjusting your search or filters to discover more courses."}
              </p>
              {(searchTerm ||
                selectedCategory !== "All Courses" ||
                selectedLevel !== "All Levels") && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Courses");
                      setSelectedLevel("All Levels");
                      setSortBy("default");
                    }}
                    className="btn-premium px-6 py-3 text-sm font-semibold"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    to="/courses"
                    className="btn-outline-premium px-6 py-3 text-sm font-semibold"
                  >
                    View All Courses
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course._id || course.id}
                  imgSrc={course.thumbnail || course.img}
                  title={course.title}
                  level={
                    course.level?.charAt(0).toUpperCase() +
                      course.level?.slice(1) || "Beginner"
                  }
                  desc={
                    course.shortDescription ||
                    course.description?.slice(0, 120) ||
                    ""
                  }
                  id={course._id || course.id}
                  price={typeof course.price === "number" ? course.price : 0}
                  duration={
                    typeof course.duration === "number" ? course.duration : null
                  }
                  students={
                    typeof course.enrolledStudents === "number"
                      ? course.enrolledStudents
                      : typeof course.students === "number"
                      ? course.students
                      : 0
                  }
                  rating={
                    typeof course.rating === "object"
                      ? course.rating?.average || 4.8
                      : course.rating || 4.8
                  }
                  instructor={
                    course.instructor?.firstName && course.instructor?.lastName
                      ? `${course.instructor.firstName} ${course.instructor.lastName}`
                      : course.instructor || "Expert Instructor"
                  }
                  videos={course.videos || []}
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              {/* Previous Page Button */}
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={!pagination.hasPrev || loading}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = Math.max(
                      1,
                      Math.min(
                        pagination.currentPage - 2 + i,
                        pagination.totalPages - 4 + i
                      )
                    );

                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: pageNum,
                          }))
                        }
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          pageNum === pagination.currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Next Page Button */}
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={!pagination.hasNext || loading}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-16 sm:mt-20 text-center">
          <div
            className="card-premium p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent"
              style={{
                background:
                  "radial-gradient(800px 400px at 50% 50%, rgba(79,140,255,0.1), transparent 60%)",
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Start Learning?
              </h2>
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Join thousands of students who are already advancing their
                careers with our premium courses and expert mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="btn-premium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started Today
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/courses"
                  className="btn-outline-premium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto hover:bg-white/5 transition-all duration-300"
                >
                  Browse All Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
