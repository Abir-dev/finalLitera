// src/pages/LaunchPad.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { CheckCircle2, Rocket, Award, Users, Clock, Star, Play, Download, Share2, Target, Brain, Zap } from "lucide-react";
import pic6 from "../assets/pic6.png";
import Aipic from "../assets/Ai-pic.jpg";
import Microsoft1 from "../assets/Microsoft1.jpg";
import Google1 from "../assets/Google1.jpg";
import Meta1 from "../assets/Meta1.jpg";
import { courseService } from "../services/courseService";


const LaunchPad = () => {
  const [launchPadCourses, setLaunchPadCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch LaunchPad courses from backend
  useEffect(() => {
    const fetchLaunchPadCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching LaunchPad courses...');
        const response = await courseService.getLaunchPadCourses();
        console.log('LaunchPad courses response:', response);
        const courses = response.data.courses || [];
        console.log('LaunchPad courses:', courses);
        setLaunchPadCourses(courses);
      } catch (error) {
        console.error('Error fetching LaunchPad courses:', error);
        setError('Failed to load LaunchPad courses');
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchPadCourses();
  }, []);

  const phases = [
    {
      bg: Aipic,
      phase: "Phase 1",
      desc: "Live Weekly Sessions (6 Classes/Weeks)",
      detail: [
        "Power Bi",
        "Tableau",
        "Excel(Advance)",
        "MS Office(Advance)",
        "Professional Branding & LinkedIn Optimisation",
        "Data Science Essentials",
        "SQL",
        "Python",
        "PowerPoint",
        "Ai Acceleration",
        "Ai Supply Chain & Management",
        "No Code Ai Website Building"
      ],
    },
    {
      bg: Microsoft1,
      phase: "Phase 2",
      desc: "Microsoft Data Analyst Training (4 Month)",
      detail: [
        "Key Modules (1 Month Video Recorded)",
        "Preparing Data for Analysis with Microsoft Excel",
        "Harnessing the Power of Data with Power BI",
        "Extract, Transform & Load (ETL) in Power BI",
        "Data Modelling & Visualization Techniques",
        "Creative Dashboard Design Principles",
        "Capstone Project Application",
        "Microsoft PL-300 Exam Preparation",
      ],
    },
    {
      bg: Google1,
      phase: "Phase 3",
      desc: "Google Data Analyst Training (4 Month)",
      detail: [
        "Key Modules (1 Month Video Recorded)",
        "Data Foundations & Decision Making",
        "Data Cleaning & Preparation Strategies",
        "Data Exploration & Analytics Techniques",
        "Effective Data Visualization",
        "Data Analysis with R Programming",
        "Google Data Analytics Capstone Project",
        "Accelerate Job Search with AI Tools",
      ],
    },
    {
      bg: Meta1,
      phase: "Phase 4",
      desc: "Meta Data Analyst Training (4 Month)",
      detail: [
        "Key Modules (1 Month Video Recorded)",
        "Data Analytics with Spreadsheets & SQL",
        "Python Data Analytics Applications",
        "Statistics Foundation for Data Science",
        "Data Management Basics",
      ],
    },
  ];

  const requestLoginThenNavigate = (to, state) => {
    const onSuccess = () => navigate(to, { state });
    window.dispatchEvent(new CustomEvent('openLogin', { detail: { onSuccess } }));
  };

  return (
    <div>
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(1200px 800px at 50% 20%, rgba(79,140,255,0.15), transparent 60%)' }}></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="reveal">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
              border: '1px solid var(--brand)30'
            }}>
              <Rocket size={48} style={{ color: 'var(--brand)' }} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              LaunchPad Master
              <span style={{ color: 'var(--brand)' }}> Program</span>
            </h1>

            <p className="text-xl md:text-2xl font-semibold mb-6" style={{ color: 'var(--brand)' }}>
              Empowering Learners Worldwide
            </p>

            <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              Your 90-Day Career Acceleration Journey starts here. Triple Certifications & Real-world Experience.
              <br />
              These comprehensive modules are designed to equip you with essential expertise, credentials, and project exposure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/launchpad/details"
                onClick={(e) => {
                  if (user) return;
                  e.preventDefault();
                  requestLoginThenNavigate('/launchpad/details');
                }}
                className="btn-premium px-8 py-4 text-lg font-semibold"
              >
                <span className="mr-2">🚀</span>
                Start Your Journey
                <span className="ml-2">→</span>
              </Link>
              <Link
                to="/courses"
                className="btn-outline-premium px-8 py-4 text-lg font-semibold"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Program Modules */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Program Modules</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Three comprehensive phases designed for career acceleration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Week 1: Corporate Ready Training", 
                desc: "Speaker Session • Storytelling • Workplace Readiness",
                icon: Target,
                color: "var(--brand)"
              },
              { 
                title: "Week 2: Technical Mastery Upskilling", 
                desc: "Top Data Competencies • Advanced Analytics Tools • King Technologies Master Course",
                icon: Brain,
                color: "var(--accent-rose)"
              },
              { 
                title: "Week 3: Placement Support", 
                desc: "Interview Preparation • Resume Review • Job Fair Connect",
                icon: Zap,
                color: "var(--accent-gold)"
              },
            ].map((item, idx) => (
              <div key={idx} className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ 
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                  border: `1px solid ${item.color}30`
                }}>
                  <item.icon size={32} style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Career Accelerator */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Accelerate Your Data Analytics Career
            </h2>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Our intensive programme is structured to provide comprehensive training and placement support over three months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {phases.map((item, idx) => (
              <Link
                key={idx}
                to="/launchpad/details"
                state={{ bg: item.bg, title: item.phase, desc: item.detail }}
                onClick={(e) => {
                  if (user) return;
                  e.preventDefault();
                  requestLoginThenNavigate('/launchpad/details', { bg: item.bg, title: item.phase, desc: item.detail });
                }}
                className="group"
              >
                <div className="card-premium overflow-hidden group-hover:scale-105 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.bg}
                      alt={item.phase}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{item.phase}</h3>
                      <p className="text-sm opacity-90">{item.desc}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--brand)' }}>
                        {item.detail.length} Modules
                      </span>
                      <div className="flex items-center gap-2">
                        <Play size={16} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Learn More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium LaunchPad Courses Section */}
      {launchPadCourses.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                LaunchPad Courses
              </h2>
              <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Discover our specially curated courses designed to accelerate your learning journey.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: 'var(--accent-rose)' }}>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {launchPadCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/launchpad/details`}
                    state={{ 
                      course: course,
                      bg: course.thumbnail || Aipic,
                      title: course.title,
                      desc: course.shortDescription || course.description
                    }}
                    onClick={(e) => {
                      if (user) return;
                      e.preventDefault();
                      requestLoginThenNavigate('/launchpad/details', { 
                        course: course,
                        bg: course.thumbnail || Aipic,
                        title: course.title,
                        desc: course.shortDescription || course.description
                      });
                    }}
                    className="group"
                  >
                    <div className="card-premium overflow-hidden group-hover:scale-105 transition-all duration-300">
                      <div className="aspect-video bg-gradient-to-br from-bg-secondary to-bg-primary">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.log('Image failed to load:', course.thumbnail);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            display: course.thumbnail ? 'none' : 'flex',
                            color: 'var(--text-muted)'
                          }}
                        >
                          <Play size={48} />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-brand transition-colors" style={{ color: 'var(--text-primary)' }}>
                            {course.title}
                          </h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ 
                            background: 'var(--brand)20', 
                            color: 'var(--brand)' 
                          }}>
                            LaunchPad
                          </span>
                        </div>
                        
                        <p className="mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                          {course.shortDescription || course.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                          <span className="capitalize">{course.level}</span>
                          <span>{course.duration}h</span>
                          <span className="font-semibold" style={{ color: 'var(--accent-gold)' }}>
                            ₹{course.price?.toLocaleString() || '0'}
                          </span>
                        </div>
                        
                        {/* Video Count */}
                        {course.videos && course.videos.length > 0 && (
                          <div className="text-xs px-2 py-1 rounded-full mb-4 inline-block" style={{ 
                            background: 'var(--brand)20', 
                            color: 'var(--brand)' 
                          }}>
                            {course.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {course.videos.length} video{course.videos.length > 1 ? 's' : ''}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            <span>By {course.instructor?.firstName || 'Unknown'} {course.instructor?.lastName || 'Instructor'}</span>
                          </div>
                          <div className="flex items-center text-sm" style={{ color: 'var(--accent-gold)' }}>
                            <Star size={16} className="mr-1" />
                            <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Premium No Courses Section */}
      {!loading && !error && launchPadCourses.length === 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="card-premium p-12 md:p-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
                border: '1px solid var(--accent-rose)30'
              }}>
                <Award size={40} style={{ color: 'var(--accent-rose)' }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                No LaunchPad Courses Found
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                No courses have been marked for LaunchPad yet. Admin needs to create courses and mark them as LaunchPad courses.
              </p>
              <Link
                to="/courses"
                className="btn-premium px-8 py-4 text-lg font-semibold"
              >
                View All Courses
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Premium Credentials Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Your Path to Recognised Credentials
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Earn industry-recognized certifications from leading tech companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Credentials List */}
            <div className="card-premium p-8">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ 
                    background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
                    border: '1px solid var(--accent-gold)30'
                  }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Global Certifications:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>Google, Microsoft Azure, Meta - Data Analyst</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ 
                    background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                    border: '1px solid var(--brand)30'
                  }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--brand)' }} />
                  </div>
                  <div>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Programme & Tool-Specific:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>King Technologies Mastery Course, 12 Tool-Specific</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ 
                    background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)',
                    border: '1px solid var(--accent-rose)30'
                  }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--accent-rose)' }} />
                  </div>
                  <div>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Practical Experience:</span>
                    <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>Internship Certificate, Live Project Certificate</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Side: Image */}
            <div className="flex justify-center">
              <div className="card-premium p-4">
                <img
                  src={pic6}
                  alt="Student"
                  className="w-80 h-80 object-cover rounded-2xl transform hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaunchPad;
