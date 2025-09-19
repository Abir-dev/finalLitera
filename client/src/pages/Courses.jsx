import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useEffect, useMemo } from 'react';
import { courseService } from '../services/courseService';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AiPic from "../assets/Ai-pic.jpg";
import ReactPic from "../assets/react-pic.jpg";
import courses1 from "../assets/courses1.jpg";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("default");

  const categories = [
    "All Courses",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity"
  ];

  const levels = [
    "All Levels",
    "Beginner",
    "Intermediate", 
    "Advanced"
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "rating-desc", label: "Rating (High to Low)" },
    { value: "students-desc", label: "Most Popular" }
  ];

  // Load courses from backend
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading courses from backend...');
      const response = await courseService.getCourses({ 
        limit: 50,
        isPublished: true 
      });
      
      const coursesData = response.data.courses || [];
      setCourses(coursesData);
      
      console.log('Courses loaded successfully:', coursesData.length, 'courses');
      console.log('Sample course:', coursesData[0]);
      
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses. Please try again.');
      
      // Fallback to dynamic courses if API fails
      console.log('Falling back to dynamic courses...');
      setCourses(generateDynamicCourses());
    } finally {
      setLoading(false);
    }
  };

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
        category: "Machine Learning"
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
        category: "Web Development"
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
        category: "Data Science"
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
        category: "Cloud Computing"
      }
    ];

    return courseTemplates.map((course, index) => ({
      id: `dynamic-${index + 1}`,
      ...course,
      // Add dynamic elements
      enrollmentCount: course.students + Math.floor(Math.random() * 500),
      rating: { average: course.rating + (Math.random() - 0.5) * 0.2 },
      videos: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, i) => `video-${i + 1}.mp4`),
      thumbnail: course.img,
      shortDescription: course.sub,
      instructor: {
        firstName: course.author.split(' ')[1] || 'Expert',
        lastName: course.author.split(' ')[2] || 'Instructor'
      }
    }));
  };

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(search) ||
        course.shortDescription?.toLowerCase().includes(search) ||
        course.description?.toLowerCase().includes(search) ||
        course.instructor?.firstName?.toLowerCase().includes(search) ||
        course.instructor?.lastName?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (selectedCategory !== "All Courses") {
      filtered = filtered.filter(course => {
        const courseCategory = course.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other';
        return courseCategory === selectedCategory;
      });
    }

    // Level filter
    if (selectedLevel !== "All Levels") {
      filtered = filtered.filter(course => {
        const courseLevel = course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner';
        return courseLevel === selectedLevel;
      });
    }

    // Sort courses
    if (sortBy !== "default") {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title-asc":
            return (a.title || "").localeCompare(b.title || "");
          case "title-desc":
            return (b.title || "").localeCompare(a.title || "");
          case "price-asc":
            return (a.price || 0) - (b.price || 0);
          case "price-desc":
            return (b.price || 0) - (a.price || 0);
          case "rating-desc":
            return (b.rating?.average || b.rating || 0) - (a.rating?.average || a.rating || 0);
          case "students-desc":
            return (b.enrollmentCount || b.students || 0) - (a.enrollmentCount || a.students || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  // Format course data for display
  const formatCourseData = (course) => {
    if (course._id) {
      // Backend course format
      return {
        id: course._id,
        title: course.title,
        sub: course.shortDescription || course.description,
        author: `By ${course.instructor?.firstName || 'Unknown'} ${course.instructor?.lastName || 'Instructor'}`,
        price: `₹${course.price?.toLocaleString() || '0'}`,
        img: course.thumbnail || courses1,
        level: course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner',
        duration: `${course.duration || 0} hours`,
        students: course.enrollmentCount || 0,
        rating: typeof course.rating === 'object' ? (course.rating?.average || 0) : (course.rating || 0),
        category: course.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other',
        videos: course.videos || []
      };
    }
    return course; // Static course format
  };

  // Dynamic promo slides based on course categories
  const generatePromoSlides = () => {
    const baseSlides = [
      {
        id: 1,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "🤖",
        title: "AI & Machine Learning",
        subtitle: "Master the future of technology with neural networks and deep learning algorithms",
        category: "Machine Learning"
      },
      {
        id: 2,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "📊",
        title: "Data Science",
        subtitle: "Transform raw data into powerful insights and predictive analytics",
        category: "Data Science"
      },
      {
        id: 3,
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: "💻",
        title: "Web Development",
        subtitle: "Build modern, responsive web applications with cutting-edge technologies",
        category: "Web Development"
      },
      {
        id: 4,
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        icon: "☁️",
        title: "Cloud Computing",
        subtitle: "Deploy and scale applications using AWS, Docker, and Kubernetes",
        category: "Cloud Computing"
      }
    ];

    // Add dynamic course counts and stats
    return baseSlides.map(slide => {
      const categoryCourses = courses.filter(course => 
        course.category?.toLowerCase().includes(slide.category.toLowerCase())
      );
      
      return {
        ...slide,
        courseCount: categoryCourses.length || Math.floor(Math.random() * 15) + 5,
        studentCount: categoryCourses.reduce((acc, course) => 
          acc + (course.enrollmentCount || course.students || 0), 0
        ) || Math.floor(Math.random() * 5000) + 1000,
        avgRating: categoryCourses.length > 0 
          ? (categoryCourses.reduce((acc, course) => 
              acc + (course.rating?.average || course.rating || 0), 0) / categoryCourses.length
            ).toFixed(1)
          : (4.5 + Math.random() * 0.5).toFixed(1)
      };
    });
  };

  const promoSlides = generatePromoSlides();


  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Page Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="reveal">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
              Explore Our Courses
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4" style={{ color: 'var(--text-secondary)' }}>
              From beginner to expert level, discover premium courses designed to accelerate your career in technology and beyond.
            </p>
            {courses.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--brand)' }}></div>
                <span>Showing {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-premium p-4 sm:p-6 md:p-8 mb-8 sm:mb-12" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-white">Search Courses</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search by title, instructor, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full input-premium pl-10 sm:pl-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-3 sm:top-3.5 text-blue-400 group-focus-within:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-white">Level</label>
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full input-premium text-sm sm:text-base focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  {levels.map(level => (
                    <option key={level} value={level} style={{ background: '#1a1a1a', color: 'white' }}>
                      {level}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute right-3 top-3 sm:top-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-white">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full input-premium text-sm sm:text-base focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} style={{ background: '#1a1a1a', color: 'white' }}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute right-3 top-3 sm:top-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== "All Courses" || selectedLevel !== "All Levels" || sortBy !== "default") && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Active filters applied</span>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Courses");
                    setSelectedLevel("All Levels");
                    setSortBy("default");
                  }}
                  className="text-xs sm:text-sm font-semibold hover:underline transition-all duration-300 flex items-center gap-1" 
                  style={{ color: 'var(--brand)' }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              </div>
            </div>
          )}
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
            style={{ height: '240px' }}
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

        {/* Course Statistics */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="card-premium p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>{filteredCourses.length}</div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Courses</div>
            </div>
            <div className="card-premium p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--accent-rose)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>{categories.length - 1}+</div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Categories</div>
            </div>
            <div className="card-premium p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>
                {courses.reduce((acc, course) => acc + (course.enrollmentCount || course.students || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Students</div>
            </div>
            <div className="card-premium p-4 sm:p-6 md:p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--brand-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: 'var(--text-primary)' }}>
                {courses.length > 0 
                  ? (courses.reduce((acc, course) => acc + (course.rating?.average || course.rating || 0), 0) / courses.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Average Rating</div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-transparent mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Loading Courses</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fetching the latest courses for you...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-premium p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3 text-white">Failed to Load Courses</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
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
          {filteredCourses.length === 0 && !loading ? (
            <div className="card-premium p-12 sm:p-16 text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">No Courses Found</h3>
              <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                {courses.length === 0 
                  ? "We're working on adding amazing courses for you. Check back soon!" 
                  : "Try adjusting your search or filters to discover more courses."
                }
              </p>
              {(searchTerm || selectedCategory !== "All Courses" || selectedLevel !== "All Levels") && (
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
              {filteredCourses.map((course) => {
              const formattedCourse = formatCourseData(course);
              return (
                <div key={formattedCourse.id} className="card-premium overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-2xl" style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={formattedCourse.img} 
                      alt={formattedCourse.title} 
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Level Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
                        formattedCourse.level === 'Beginner' ? 'bg-green-500/90' :
                        formattedCourse.level === 'Intermediate' ? 'bg-yellow-500/90' :
                        'bg-red-500/90'
                      }`}>
                        {formattedCourse.level}
                      </span>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span className="px-2 sm:px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold shadow-lg" style={{ color: 'var(--accent-gold)' }}>
                        {formattedCourse.price}
                      </span>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4 sm:p-6">
                    <div className="text-xs sm:text-sm font-semibold mb-2 px-2 py-1 rounded-full inline-block" style={{ 
                      backgroundColor: 'var(--brand)20', 
                      color: 'var(--brand)',
                      border: '1px solid var(--brand)30'
                    }}>
                      {formattedCourse.category}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-brand transition-colors duration-300 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {formattedCourse.title}
                    </h3>
                    <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{formattedCourse.sub}</p>
                    
                    {/* Course Meta */}
                    <div className="flex items-center justify-between text-xs mb-3 sm:mb-4" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span className="truncate">{formattedCourse.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                        </svg>
                        <span>{formattedCourse.duration}</span>
                      </div>
                    </div>
                    
                    {/* Video Count */}
                    {formattedCourse.videos && formattedCourse.videos.length > 0 && (
                      <div className="text-xs px-3 py-1 rounded-full mb-3 sm:mb-4 inline-block" style={{ 
                        backgroundColor: 'var(--brand)20', 
                        color: 'var(--brand)',
                        border: '1px solid var(--brand)30'
                      }}>
                        <span className="mr-1">{formattedCourse.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'}</span>
                        {formattedCourse.videos.length} video{formattedCourse.videos.length > 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {/* Rating and Students */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {typeof formattedCourse.rating === 'number' ? formattedCourse.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 12.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.54c.8 0 1.54.37 2.01.99L27 12.5V22h-7z"/>
                        </svg>
                        <span className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>{formattedCourse.students}</span>
                      </div>
                    </div>

                    {/* View Course Button */}
                    <Link to={`/courses/${formattedCourse.id}`} className="block">
                      <button className="w-full btn-premium py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold group-hover:shadow-lg transition-all duration-300">
                        <span className="flex items-center justify-center gap-2">
                          View Course
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-16 sm:mt-20 text-center">
          <div className="card-premium p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(800px 400px at 50% 50%, rgba(79,140,255,0.1), transparent 60%)' }}></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-4" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of students who are already advancing their careers with our premium courses and expert mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="btn-premium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started Today
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
