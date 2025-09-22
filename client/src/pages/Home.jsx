// src/pages/Home.jsx
import StatCard from "../components/StatCard.jsx";
import CourseCard from "../components/CourseCard.jsx";
import { useEffect, useState } from "react";
import TestimonialCard from "../components/TestimonialCard.jsx";
import RevealOnScroll from "../components/RevealOnScroll.jsx";
import { Link } from "react-router-dom";
import pic5 from "../assets/pic5.png";
import pic6 from "../assets/pic6.png";
import pic10 from "../assets/pic10.png";
import { BiSolidCheckCircle } from "react-icons/bi";

// Import course images
import courses1 from "../assets/courses1.jpg";
import courses2 from "../assets/courses2.jpg";
import courses3 from "../assets/courses3.jpg";
import courses4 from "../assets/courses4.jpg";
import javascriptPic from "../assets/javascript-pic.jpg";
import reactPic from "../assets/react-pic.jpg";
import nodePic from "../assets/Node-pic.jpg";
import fullstackPic from "../assets/FullStack-pic.jpg";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return; // Prevent multiple API calls

    (async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_URL ||
          "https://finallitera.onrender.com/api";
        console.log("Fetching courses from:", `${API_BASE}/courses?limit=4`);

        const res = await fetch(`${API_BASE}/courses?limit=4`);
        console.log("API response status:", res.status);

        if (!res.ok) {
          console.log("API call failed with status:", res.status);
          setFeaturedCourses([]);
          return;
        }

        const json = await res.json();
        console.log("API response data:", json);

        const list = json.data?.courses || json.courses || [];
        console.log("Courses found:", list.length, list);
        if (list.length > 0) {
          console.log("First course structure:", list[0]);
          console.log("Rating type:", typeof list[0].rating, list[0].rating);
        }

        // Only set courses if we have real data from the API
        if (list.length > 0) {
          setFeaturedCourses(list.slice(0, 4));
        } else {
          console.log("No courses found in API response");
          setFeaturedCourses([]);
        }
      } catch (e) {
        console.error("Error fetching courses:", e);
        setFeaturedCourses([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    })();
  }, [hasFetched]);
  return (
    <div>
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        {/* <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-float animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse-float animation-delay-1000"></div>
        </div> */}

        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center py-12 md:py-16 lg:py-20">
            {/* Left Content */}
            <RevealOnScroll direction="left" delay={200}>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-5 mt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white">
                  Premium Learning Platform
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-white">
                Transform Your Future with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
                  LITERA
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 mb-8 md:mb-10 max-w-2xl">
                Welcome to the{" "}
                <span className="text-blue-400 font-semibold">
                  premium platform
                </span>{" "}
                designed to elevate your learning journey. Discover our curated
                collection of{" "}
                <span className="text-yellow-400 font-semibold">
                  expert-led courses
                </span>{" "}
                tailored to your professional goals. Begin your transformation
                toward{" "}
                <span className="text-pink-400 font-semibold">
                  mastery and success
                </span>{" "}
                today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12">
                <Link
                  to="/courses"
                  className="btn-premium btn-lg group text-center"
                >
                  <span>Explore Courses</span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                </Link>
                <Link
                  to="/launchpad"
                  className="btn-outline-premium btn-lg text-center"
                >
                  View LaunchPad
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8 text-xs md:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span className="hidden sm:inline">10,000+ Students</span>
                  <span className="sm:hidden">10K+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-xs">★</span>
                  </div>
                  <span className="hidden sm:inline">4.9/5 Rating</span>
                  <span className="sm:hidden">4.9★</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-xs">🏆</span>
                  </div>
                  <span className="hidden sm:inline">50+ Courses</span>
                  <span className="sm:hidden">50+</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Right Content - Hero Image */}
            <RevealOnScroll direction="right" delay={400}>
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-2xl animate-float animation-delay-1000"></div>

              {/* Main Image Container */}
              <div className="relative">
                <div className="p-2 md:p-4 group hover-lift">
                  {/* Premium Image Frame with Gradient Border */}
                  <div
                    className="relative rounded-xl md:rounded-2xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand)20, var(--accent-rose)20, var(--accent-gold)20)",
                      padding: "3px",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg md:rounded-xl">
                      <img
                        src={pic10}
                        alt="Student Learning"
                        className="w-full h-auto group-hover:scale-105 transition-all duration-700 responsive-img"
                      />

                      {/* Premium Overlay Effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Floating Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg md:rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                    </div>
                  </div>

                  {/* Premium Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-lg animate-pulse opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-pink-500/30 to-yellow-500/30 rounded-full blur-md animate-pulse opacity-60 animation-delay-1000"></div>
                  <div className="absolute top-1/2 -left-3 w-8 h-8 bg-gradient-to-br from-green-400/40 to-blue-400/40 rounded-full blur-sm animate-float opacity-70"></div>

                  {/* Floating Stats Cards */}
                  {/* <div className="absolute -top-4 -left-4 card-glass p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">95%</div>
                        <div className="text-xs text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -right-4 card-glass p-4 animate-float animation-delay-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📚</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">24/7</div>
                        <div className="text-xs text-gray-400">Support</div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <StatCard />

      {/* Explore Courses section */}
      <section className="pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
              Explore Our Courses
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              From beginner to expert level, across all industries, we curate
              the perfect learning path for your professional growth and
              success.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-12">
            {["Beginner", "Intermediate", "Advanced", "Expert"].map((t) => (
              <button
                key={t}
                className="btn-outline-premium px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-semibold rounded-full hover:scale-105 transition-all duration-300"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {isLoading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-premium animate-pulse">
                    <div className="h-40 bg-gray-700 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-5 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded mb-3"></div>
                      <div className="h-8 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((c) => (
                <CourseCard
                  key={c._id}
                  imgSrc={c.thumbnail}
                  title={c.title}
                  level={
                    c.level?.charAt(0).toUpperCase() + c.level?.slice(1) ||
                    "Beginner"
                  }
                  desc={
                    c.shortDescription || c.description?.slice(0, 120) || ""
                  }
                  id={c._id}
                  price={typeof c.price === "number" ? c.price : 0}
                  duration={typeof c.duration === "number" ? c.duration : null}
                  students={
                    typeof c.enrolledStudents === "number"
                      ? c.enrolledStudents
                      : typeof c.students === "number"
                      ? c.students
                      : 0
                  }
                  rating={
                    typeof c.rating === "object"
                      ? c.rating?.average || 4.8
                      : c.rating || 4.8
                  }
                  instructor={c.instructor || "Expert Instructor"}
                  videos={c.videos || []}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No courses available at the moment
                </div>
                <p className="text-gray-500">
                  Please check back later or contact support if this issue
                  persists.
                </p>
              </div>
            )}
          </div>

          {/* View All Courses Button */}
          <div className="mt-8 md:mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center btn-premium font-semibold px-6 py-3 md:px-8 md:py-5 shadow-lg"
            >
              <span className="mr-2"></span>
              View All Courses
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Coaching Section */}
      <section className="pt-8 md:pt-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative reveal">
            <div
              className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full opacity-15 blur-3xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--accent-rose))",
              }}
            />
            <div className="p-2 md:p-4">
              <img
                src={pic6}
                alt="Expert Mentor"
                className="w-full h-auto rounded-lg md:rounded-xl responsive-img"
              />
            </div>
          </div>
          <div className="reveal">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
              Expert Coaching by Industry Leaders
            </h3>
            <p
              className="text-base sm:text-lg leading-relaxed mb-6 md:mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              From beginner to expert level, across all industries, we provide
              the perfect learning path tailored to your professional goals and
              career aspirations.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              <div className="card-premium p-4 md:p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
                    border: "1px solid var(--brand)30",
                  }}
                >
                  <BiSolidCheckCircle
                    size={24}
                    style={{ color: "var(--brand)" }}
                  />
                </div>
                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Personalized Learning
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Tailored learning experiences through AI and machine learning
                  to cater to individual students' unique needs and learning
                  styles.
                </p>
              </div>

              <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                    border: "1px solid var(--accent-rose)30",
                  }}
                >
                  <BiSolidCheckCircle
                    size={24}
                    style={{ color: "var(--accent-rose)" }}
                  />
                </div>
                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Innovative Technology
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cutting-edge technology including augmented reality and
                  virtual reality to create immersive and engaging learning
                  experiences.
                </p>
              </div>

              <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
                    border: "1px solid var(--accent-gold)30",
                  }}
                >
                  <BiSolidCheckCircle
                    size={24}
                    style={{ color: "var(--accent-gold)" }}
                  />
                </div>
                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Analytics & Insights
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Comprehensive progress tracking and analytics to help students
                  and instructors monitor performance and make data-driven
                  decisions.
                </p>
              </div>

              <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
                    border: "1px solid var(--brand-strong)30",
                  }}
                >
                  <BiSolidCheckCircle
                    size={24}
                    style={{ color: "var(--brand-strong)" }}
                  />
                </div>
                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Industry Partnerships
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Strategic collaborations with leading companies and
                  institutions to offer accredited courses and certifications
                  that add credibility to your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white">
              Success Stories
            </h3>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Hear from our students who have transformed their careers and
              achieved their professional goals with LITERA.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote="Exceptional courses at competitive prices. The value for money is outstanding, and the platform is completely trustworthy."
              name="Keshav Mishra"
              role="Software Developer"
            />
            <TestimonialCard
              quote="I had an amazing experience during the consultation sessions. The mentors are incredibly knowledgeable and supportive."
              name="Uditi Jana"
              role="Sales Manager"
            />
            <TestimonialCard
              quote="Premium courses at the best prices. The quality of education here is unmatched in the industry."
              name="Abir Lal Banerjee"
              role="Full Stack Developer"
            />
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 50%, rgba(79,140,255,0.1), transparent 60%)",
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="card-premium p-6 md:p-12 lg:p-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
              Ready to Transform Your Career?
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Join thousands of professionals who have already started their
              journey to success with our premium courses and expert mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link
                to="/courses"
                className="btn-premium px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold"
              >
                Start Learning Today
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 ml-2"
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
              </Link>
              <Link
                to="/launchpad"
                className="btn-outline-premium px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold"
              >
                Explore LaunchPad
              </Link>
            </div>
            <div
              className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 text-xs md:text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                ></div>
                <span className="hidden sm:inline">10,000+ Students</span>
                <span className="sm:hidden">10K+</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--accent-gold)" }}
                ></div>
                <span className="hidden sm:inline">95% Success Rate</span>
                <span className="sm:hidden">95%</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--accent-rose)" }}
                ></div>
                <span className="hidden sm:inline">24/7 Support</span>
                <span className="sm:hidden">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
