// src/pages/LaunchPad.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // Icons
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

  return (
    <div className="bg-gray-50 font-inter">
      {/* Header Section */}
      <section className="relative min-h-[420px] flex flex-col justify-center items-center text-center overflow-hidden bg-white pt-16 pb-12">
        <div className="text-7xl md:text-7xl mb-6 animate-bounce">🤖</div>

        <h1 className="flex flex-wrap justify-center font-extrabold mb-6 text-6xl md:text-7xl">
          <span className="text-black">LAUNCHPAD MASTER </span>
          <span
            className="bg-gradient-to-r from-[#2337fc] via-[#e545fc] to-[#2cc1ff]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PROGRAM
          </span>
        </h1>

        <p
          className="text-2xl font-semibold max-w-3xl mx-auto mb-4 tracking-wide"
          style={{
            background:
              "linear-gradient(90deg, #2337fc 15%, #e545fc 45%, #2cc1ff 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Empowering Learners Worldwide
        </p>

        <p
          className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 opacity-0 animate-fadeIn leading-relaxed"
          style={{
            animationFillMode: "forwards",
            animationDuration: "2s",
            animationDelay: "0.5s",
          }}
        >
          Your 90-Day Career Acceleration Journey starts. Triple Certifications &
          Real-world Experience.
          <br />
          These three key modules are designed to equip you with essential
          expertise, credential, and project exposure.
        </p>

        {/* Decorative Circles */}
        <span className="absolute left-8 top-14 w-36 h-36 bg-gradient-to-r from-[#79b4ff59] to-[#eca0fc32] rounded-full"></span>
        <span className="absolute right-12 top-7 w-28 h-28 bg-gradient-to-r from-[#79b4ff6a] to-[#eca0fc32] rounded-full"></span>
        <span className="absolute right-24 bottom-16 w-28 h-28 bg-gradient-to-br from-[#fdb7b7a8] to-[#cbb9ff66] rounded-full"></span>

        <style>
          {`
            @keyframes fadeIn {
              to { opacity: 1; }
            }
            .animate-fadeIn {
              animation-name: fadeIn;
            }
          `}
        </style>
      </section>

      {/* Three Modules */}
      <section className="flex flex-wrap justify-center gap-6 px-6 mb-12">
        {[
          { title: "Week 1: Corporate Ready Training", desc: "Speaker Session • Storytelling • Workplace Readiness" },
          { title: "Week 2: Technical Mastery Upskilling", desc: "Top Data Competencies • Advanced Analytics Tools • King Technologies Master Course" },
          { title: "Week 3: Placement Support", desc: "Interview Preparation • Resume Review • Job Fair Connect" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-8 w-[300px] text-center hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-[#2C357E] mb-4">{item.title}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Career Accelerator */}
      <section className="relative bg-white py-20 px-6 max-w-6xl mx-auto rounded-3xl overflow-hidden">
        <h2
          className="text-center text-5xl font-extrabold mb-6"
          style={{
            background: "linear-gradient(90deg, #2337fc 15%, #e545fc 45%, #2cc1ff 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Accelerate Your Data Analytics Career
        </h2>

        <p className="text-center max-w-3xl mx-auto text-xl text-gray-700 mb-12 leading-relaxed">
          Our intensive programme is structured to provide comprehensive training and placement support over three months.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 justify-center">
          {phases.map((item, idx) => (
            <Link
              key={idx}
              to="/launchpad/details"
              state={{ bg: item.bg, title: item.phase, desc: item.detail }}
            >
              <div
                className="relative rounded-2xl shadow-lg overflow-hidden w-[380px] h-[280px] flex flex-col justify-end text-center text-white mx-auto hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: `url(${item.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative z-10 p-6">
                  <p className="font-bold text-2xl">{item.phase}</p>
                  <p className="text-base mt-2">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LaunchPad Courses Section */}
      {console.log('Rendering LaunchPad section. Courses count:', launchPadCourses.length, 'Loading:', loading, 'Error:', error)}
      {launchPadCourses.length > 0 && (
        <section className="relative bg-white py-20 px-6 max-w-6xl mx-auto rounded-3xl overflow-hidden mt-16">
          <h2
            className="text-center text-5xl font-extrabold mb-6"
            style={{
              background: "linear-gradient(90deg, #2337fc 15%, #e545fc 45%, #2cc1ff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LaunchPad Courses
          </h2>

          <p className="text-center max-w-3xl mx-auto text-xl text-gray-700 mb-12 leading-relaxed">
            Discover our specially curated courses designed to accelerate your learning journey.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
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
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-video bg-gray-100">
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
                        className="w-full h-full flex items-center justify-center text-gray-400"
                        style={{ display: course.thumbnail ? 'none' : 'flex' }}
                      >
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                          LaunchPad
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.shortDescription || course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="capitalize">{course.level}</span>
                        <span>{course.duration}h</span>
                        <span className="font-semibold text-green-600">
                          ₹{course.price?.toLocaleString() || '0'}
                        </span>
                      </div>
                      
                      {/* Video Count */}
                      {course.videos && course.videos.length > 0 && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-4 inline-block">
                          {course.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {course.videos.length} video{course.videos.length > 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>By {course.instructor?.firstName || 'Unknown'} {course.instructor?.lastName || 'Instructor'}</span>
                        </div>
                        <div className="flex items-center text-sm text-yellow-600">
                          <span>★ {course.rating?.average?.toFixed(1) || '0.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Debug Section - Show when no LaunchPad courses */}
      {!loading && !error && launchPadCourses.length === 0 && (
        <section className="relative bg-white py-20 px-6 max-w-6xl mx-auto rounded-3xl overflow-hidden mt-16">
          <h2
            className="text-center text-3xl font-extrabold mb-6 text-gray-600"
          >
            No LaunchPad Courses Found
          </h2>
          <p className="text-center text-gray-500 mb-6">
            No courses have been marked for LaunchPad yet. Admin needs to create courses and mark them as LaunchPad courses.
          </p>
          <div className="text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </section>
      )}

      {/* Credentials */}
      <section className="relative bg-white py-5 px-6 max-w-6xl mx-auto rounded-3xl overflow-hidden mt-16">
        <h2
          className="text-center text-5xl font-extrabold mb-12"
          style={{
            background: "linear-gradient(90deg, #2337fc 15%, #e545fc 45%, #2cc1ff 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Path to Recognised Credentials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side: Credentials List */}
          <div className="bg-gray-50 p-8 rounded-2xl transition shadow-md hover:shadow-lg">
            <ul className="text-gray-700 text-lg space-y-5 leading-relaxed">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0 mt-1" />
                <span><span className="font-bold">Global Certifications:</span> Google, Microsoft Azure, Meta - Data Analyst</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-blue-600 w-6 h-6 flex-shrink-0 mt-1" />
                <span><span className="font-bold">Programme & Tool-Specific:</span> King Technologies Mastery Course, 12 Tool-Specific</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-purple-600 w-6 h-6 flex-shrink-0 mt-1" />
                <span><span className="font-bold">Practical Experience:</span> Internship Certificate, Live Project Certificate</span>
              </li>
            </ul>
          </div>

          {/* Right Side: Image */}
          <div className="flex justify-center">
            <img
              src={pic6}
              alt="Student"
              className="w-90 h-90 object-cover rounded-full transform hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaunchPad;
