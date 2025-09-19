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
        rating: course.rating?.average || 0,
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
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Explore Our Courses
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              From beginner to expert level, discover premium courses designed to accelerate your career in technology and beyond.
            </p>
            {courses.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--brand)' }}></div>
                <span>Showing {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-premium p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-3">Search Courses</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, instructor, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full input-premium pl-12"
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                </svg>
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full input-premium"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full input-premium"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== "All Courses" || selectedLevel !== "All Levels" || sortBy !== "default") && (
            <div className="mt-6 pt-6 divider-premium">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Courses");
                  setSelectedLevel("All Levels");
                  setSortBy("default");
                }}
                className="text-sm font-medium hover:underline" style={{ color: 'var(--brand)' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Promo Banner with Swiper */}
        <section className="rounded-3xl overflow-hidden relative bg-gray-100 mb-12">
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
            style={{ height: '320px' }}
          >
            {promoSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div 
                  className="relative w-full h-full flex items-center"
                  style={{ background: slide.gradient }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
                    <div className="absolute top-12 right-8 w-12 h-12 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-8 left-12 w-16 h-16 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-16 right-4 w-8 h-8 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 w-full px-8 md:px-12">
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div className="text-6xl md:text-8xl">
                        {slide.icon}
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 text-white">
                        <h2 className="text-3xl md:text-4xl font-black mb-3">
                          {slide.title}
                        </h2>
                        <p className="text-lg md:text-xl opacity-90 max-w-2xl">
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
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                  category === selectedCategory
                    ? "btn-premium"
                    : "btn-outline-premium"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Course Statistics */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{filteredCourses.length}</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Courses</div>
            </div>
            <div className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--accent-rose)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{categories.length - 1}+</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Categories</div>
            </div>
            <div className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {courses.reduce((acc, course) => acc + (course.enrollmentCount || course.students || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Students</div>
            </div>
            <div className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)', border: '1px solid var(--brand-strong)30' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--brand-strong)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {courses.length > 0 
                  ? (courses.reduce((acc, course) => acc + (course.rating?.average || course.rating || 0), 0) / courses.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Average Rating</div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadCourses}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Courses Grid */}
        <section>
          {filteredCourses.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {courses.length === 0 
                  ? "No courses are available at the moment." 
                  : "Try adjusting your search or filters to see more results."
                }
              </p>
              {(searchTerm || selectedCategory !== "All Courses" || selectedLevel !== "All Levels") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Courses");
                    setSelectedLevel("All Levels");
                    setSortBy("default");
                  }}
                  className="px-6 py-2 bg-[#1B4A8B] text-white rounded-lg hover:bg-[#153a6f] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.map((course) => {
              const formattedCourse = formatCourseData(course);
              return (
                <div key={formattedCourse.id} className="card-premium overflow-hidden group hover:scale-105 transition-all duration-300">
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={formattedCourse.img} 
                      alt={formattedCourse.title} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                        formattedCourse.level === 'Beginner' ? 'bg-green-500' :
                        formattedCourse.level === 'Intermediate' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {formattedCourse.level}
                      </span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold shadow-sm" style={{ color: 'var(--accent-gold)' }}>
                        {formattedCourse.price}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--brand)' }}>{formattedCourse.category}</div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-brand transition-colors duration-300 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {formattedCourse.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{formattedCourse.sub}</p>
                    
                    {/* Course Meta */}
                    <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      <span>👨‍🏫 {formattedCourse.author}</span>
                      <span>⏱️ {formattedCourse.duration}</span>
                    </div>
                    
                    {/* Video Count */}
                    {formattedCourse.videos && formattedCourse.videos.length > 0 && (
                      <div className="text-xs bg-blue-50 px-2 py-1 rounded-full mb-4 inline-block" style={{ color: 'var(--brand)' }}>
                        {formattedCourse.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {formattedCourse.videos.length} video{formattedCourse.videos.length > 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {/* Rating and Students */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{formattedCourse.rating}</span>
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{formattedCourse.students} students</span>
                    </div>

                    {/* View Course Button */}
                    <Link to={`/courses/${formattedCourse.id}`} className="block">
                      <button className="w-full btn-premium py-3 px-4">
                        View Course
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
        <section className="mt-20 text-center">
          <div className="card-premium p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(800px 400px at 50% 50%, rgba(79,140,255,0.1), transparent 60%)' }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of students who are already advancing their careers with our premium courses and expert mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="btn-premium px-8 py-4 text-lg font-semibold"
                >
                  <span className="mr-2"></span>
                  Get Started Today
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  to="/courses"
                  className="btn-outline-premium px-8 py-4 text-lg font-semibold"
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
