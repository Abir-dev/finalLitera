import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { courseService } from "../services/courseService";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal.jsx";
import SignupModal from "../components/SignupModal.jsx";

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-5 h-5"
      fill="currentColor"
      aria-hidden="true"
      style={{ color: filled ? "var(--accent-gold)" : "var(--text-muted)" }}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.967 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.5 13.347a1 1 0 00-1.175 0l-2.935 2.136c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.75 8.72c-.783-.57-.379-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  );
}

export default function CourseDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    const existing = location.state?.course;
    if (existing) {
      setCourse(existing);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await courseService.getCourseById(id);
        const c = resp?.data?.course || resp?.data;
        if (!c) throw new Error("Course not found");
        setCourse(c);
      } catch (e) {
        setError(e.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, location.state]);

  // Load similar courses once the main course is available
  useEffect(() => {
    (async () => {
      if (!course?._id && !course?.id) return;
      try {
        const resp = await courseService.getCourses({
          limit: 6,
          category: course.category,
        });
        const items = resp?.data?.courses || [];
        const currentId = String(course._id || course.id);
        const filtered = items
          .filter((c) => String(c._id) !== currentId)
          .slice(0, 3);
        setSimilarCourses(filtered);
      } catch (error) {
        console.error("Error loading similar courses:", error);
        setSimilarCourses([]);
      }
    })();
  }, [course]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: "var(--brand)" }}
            ></div>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="text-center">
          <div
            className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
              border: "1px solid var(--accent-rose)30",
            }}
          >
            <div className="text-4xl">😕</div>
          </div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Course Not Found
          </h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            {error ||
              "The course you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover-lift"
            style={{
              background: "var(--brand)",
              color: "var(--text-accent)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const display = {
    id: course._id || course.id,
    title: course.title,
    description: course.description || course.shortDescription,
    thumbnail: course.thumbnail || "",
    price: `₹${Number(course.price ?? 0).toLocaleString("en-IN")}`,
    level: course.level
      ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
      : "Beginner",
    duration: `${course.duration || 0} hours`,
    students: course.enrollmentCount || 0,
    rating: course.rating?.average || 0,
    category:
      course.category
        ?.replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "Other",
    instructor:
      `${course.instructor?.firstName || ""} ${
        course.instructor?.lastName || ""
      }`.trim() || "Instructor",
    requirements: course.requirements || [],
    learningOutcomes: course.learningOutcomes || [],
    modules: course.modules || [],
  };

  // Render description as paragraphs and bullet lists based on admin formatting
  const renderDescription = (text) => {
    if (!text) return null;
    const blocks = String(text).split(/\n\n+/);
    return blocks.map((block, idx) => {
      const lines = block
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const bulletLines = lines.filter((l) => /^(\-|\*|•)\s+/.test(l));
      if (bulletLines.length === lines.length && lines.length > 0) {
        return (
          <ul
            key={idx}
            className="list-disc ml-6 space-y-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {bulletLines.map((l, i) => (
              <li key={i}>{l.replace(/^(\-|\*|•)\s+/, "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={idx}
          className="mt-4 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {block}
        </p>
      );
    });
  };

  // Enroll/Register handlers
  const handleEnrollClick = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    // Debug: Test authentication first
    try {
      console.log("Testing authentication...");
      const authTest = await courseService.testAuth();
      console.log("Auth test result:", authTest);
    } catch (authError) {
      console.error("Auth test failed:", authError);
      alert("Authentication failed. Please login again.");
      return;
    }

    try {
      console.log("Creating order for course:", display.id);
      const result = await courseService.createOrder(display.id);
      setOrderInfo(result.data);
      setShowCheckout(true);
    } catch (e) {
      console.error("Order creation error:", e);
      alert(e.message || "Failed to initiate payment");
    }
  };

  const launchRazorpay = () => {
    console.log("launchRazorpay called");
    console.log("orderInfo:", orderInfo);
    console.log("window.Razorpay:", window.Razorpay);
    console.log("VITE_RAZORPAY_KEY_ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    if (!orderInfo?.order) {
      console.error("No order info available");
      alert("Order information not available");
      return;
    }

    if (!termsAccepted || !refundAccepted || !privacyAccepted) {
      alert(
        "Please accept all Terms & Conditions, Refund Policy, and Privacy Policy to continue with payment."
      );
      return;
    }

    if (!window.Razorpay) {
      console.error("Razorpay script not loaded");
      alert("Payment system not loaded. Please refresh the page.");
      return;
    }

    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      console.error("Razorpay key not configured");
      alert("Payment configuration error. Please contact support.");
      return;
    }

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderInfo.order.amount,
        currency: orderInfo.order.currency,
        name: display.title,
        description: "Course Enrollment",
        order_id: orderInfo.order.id,
        notes: orderInfo.order.notes,
        handler: function (response) {
          // After payment success, close modal and redirect
          setShowCheckout(false);
          setOrderInfo(null);
          navigate("/dashboard/subscription");
        },
        modal: {
          ondismiss: function () {
            // When user closes the modal, reset state
            setShowCheckout(false);
            setOrderInfo(null);
          },
        },
        prefill: {},
        theme: { color: "#1B4A8B" },
        // Add error handling for CORS issues
        retry: {
          enabled: true,
          max_count: 3,
          retry_delay: 2000,
        },
      };

      console.log("Razorpay options:", options);
      const rzp = new window.Razorpay(options);
      console.log("Razorpay instance created:", rzp);
      rzp.open();
      console.log("Razorpay opened");
    } catch (error) {
      console.error("Error launching Razorpay:", error);
      // Suppress CORS-related errors that are harmless
      if (error.message && error.message.includes("x-rtb-fingerprint-id")) {
        console.warn(
          "CORS warning suppressed - this is a known Razorpay issue and doesn't affect functionality"
        );
        return;
      }
      alert("Error in opening checkout: " + error.message);
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <div className="container-premium pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-8 sm:pb-12 md:pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8">
          <ol
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto"
            style={{ color: "var(--text-muted)" }}
          >
            <li className="whitespace-nowrap">
              <Link
                to="/"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--brand)" }}
              >
                Home
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="whitespace-nowrap">
              <Link
                to="/courses"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--brand)" }}
              >
                Courses
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li
              className="font-medium truncate max-w-[200px] sm:max-w-none"
              style={{ color: "var(--text-primary)" }}
              title={display.title}
            >
              {display.title}
            </li>
          </ol>
        </nav>

        {/* Title and rating */}
        <div className="mt-4 sm:mt-6">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {display.title}
          </h1>
          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < Math.floor(display.rating)} />
                ))}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--accent-emerald)" }}
              >
                {display.rating}
              </span>
            </div>
            <span className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              {display.students} students enrolled
            </span>
          </div>
        </div>

        {/* Overview + Right preview */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left column */}
          <div className="order-2 lg:order-1">
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Course Overview
            </h2>
            <div className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {renderDescription(display.description)}
            </div>

            {display.learningOutcomes.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  What you'll learn
                </h3>
                <ul
                  className="list-disc ml-4 sm:ml-6 space-y-2 text-sm sm:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {display.learningOutcomes.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            {display.requirements.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Requirements
                </h3>
                <ul
                  className="list-disc ml-4 sm:ml-6 space-y-2 text-sm sm:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {display.requirements.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Videos Section */}
            {course.videos && course.videos.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3
                  className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
                  style={{ color: "var(--text-primary)" }}
                >
                  Course Videos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {course.videos.map((videoUrl, index) => {
                    // Check if it's a URL (starts with http) or a file path
                    const isUrl = videoUrl.startsWith("http");

                    return (
                      <div
                        key={index}
                        className="rounded-lg p-3 sm:p-4"
                        style={{ background: "var(--surface)" }}
                      >
                        {isUrl ? (
                          // For URLs, show a clickable link
                          <div
                            className="aspect-video rounded-lg overflow-hidden mb-2 sm:mb-3"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--brand-soft), var(--brand)10)",
                              border: "2px dashed var(--brand)40",
                            }}
                          >
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-full flex flex-col items-center justify-center transition-colors duration-300 cursor-pointer hover:opacity-80"
                              style={{ color: "var(--brand)" }}
                            >
                              <svg
                                className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-xs sm:text-sm font-semibold mb-1">
                                Click to Watch Video
                              </p>
                              <p className="text-xs opacity-70">
                                Opens in new tab
                              </p>
                            </a>
                          </div>
                        ) : (
                          // For uploaded files, show video player
                          <div
                            className="aspect-video rounded-lg overflow-hidden mb-2 sm:mb-3"
                            style={{ background: "var(--bg-secondary)" }}
                          >
                            <video
                              src={videoUrl}
                              controls
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full items-center justify-center text-gray-400 hidden"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <div className="text-center">
                                <svg
                                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-xs sm:text-sm">Video not available</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p
                            className="text-xs sm:text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Video {index + 1}
                          </p>
                          {isUrl && (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:opacity-80 transition-opacity underline"
                              style={{ color: "var(--brand)" }}
                            >
                              Open Link
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">✅</span>
                <span className="text-slate-700">Real-time Corporate Projects</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">✅</span>
                <span className="text-slate-700">1:1 AI Mentorship & Mock Interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">✅</span>
                <span className="text-slate-700">Weekly Audits & Assessments</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">✅</span>
                <span className="text-slate-700">Direct Referrals to Top MNCs</span>
              </div>
            </div> */}

            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8">
              <button
                onClick={handleEnrollClick}
                className="inline-flex items-center justify-center btn-premium px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base w-full sm:w-auto"
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Right preview card */}
          <aside className="order-1 lg:order-2">
            <div
              className="rounded-xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {display.thumbnail && display.thumbnail.trim() !== "" ? (
                <img
                  src={display.thumbnail}
                  alt={display.title}
                  className="aspect-[16/10] w-full rounded-xl object-cover mb-4"
                />
              ) : (
                <div
                  className="aspect-[16/10] w-full rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--surface), var(--surface-hover))",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No thumbnail
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: "var(--brand)" }}
                >
                  {display.price}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div
                      className="mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Level
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {display.level}
                    </div>
                  </div>
                  <div>
                    <div
                      className="mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Duration
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {display.duration}
                    </div>
                  </div>
                  <div>
                    <div
                      className="mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Category
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {display.category}
                    </div>
                  </div>
                  <div>
                    <div
                      className="mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Instructor
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {display.instructor}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEnrollClick}
                  className="w-full font-semibold py-2.5 sm:py-3 px-4 btn-premium text-sm sm:text-base"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2
              className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Similar Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {similarCourses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`} className="group">
                  <article
                    className="cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {c.thumbnail && c.thumbnail.trim() !== "" ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-32 sm:h-40 flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--surface), var(--surface-hover))",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div className="text-center">
                          <svg
                            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            No thumbnail
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-3 sm:p-5">
                      <h3
                        className="text-xs sm:text-sm font-semibold group-hover:opacity-80 transition-opacity duration-300 line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {c.title}
                      </h3>
                      <p
                        className="mt-1 text-xs sm:text-sm line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {c.shortDescription || c.description}
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {`${c.instructor?.firstName ?? ""} ${
                          c.instructor?.lastName ?? ""
                        }`.trim()}
                      </p>
                      <p
                        className="mt-1 text-sm font-semibold"
                        style={{ color: "var(--brand)" }}
                      >
                        ₹{Number(c.price ?? 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && orderInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
          <div
            className="rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-base sm:text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Confirm Purchase
              </h3>
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setOrderInfo(null);
                  setTermsAccepted(false);
                  setRefundAccepted(false);
                  setPrivacyAccepted(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
                style={{ color: "var(--text-muted)" }}
              >
                ✖
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Original Price
                </span>
                <span
                  className="text-xs sm:text-sm line-through"
                  style={{ color: "var(--text-muted)" }}
                >
                  {orderInfo.course.originalPrice
                    ? `₹${Number(orderInfo.course.originalPrice).toLocaleString(
                        "en-IN"
                      )}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  You Pay
                </span>
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "var(--brand)" }}
                >
                  ₹{Number(orderInfo.course.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Terms and Conditions Checkboxes */}
            <div className="mt-4 space-y-2 sm:space-y-3">
              {/* Terms & Conditions Checkbox */}
              <div
                className="p-2 sm:p-3 rounded-lg border"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded focus:ring-2"
                    style={{
                      accentColor: "var(--brand)",
                      borderColor: "var(--border)",
                    }}
                  />
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms-conditions"
                      className="hover:opacity-80 transition-opacity font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
              </div>

              {/* Refund Policy Checkbox */}
              <div
                className="p-2 sm:p-3 rounded-lg border"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundAccepted}
                    onChange={(e) => setRefundAccepted(e.target.checked)}
                    className="mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded focus:ring-2"
                    style={{
                      accentColor: "var(--brand)",
                      borderColor: "var(--border)",
                    }}
                  />
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    I agree to the{" "}
                    <Link
                      to="/refund-policy"
                      className="hover:opacity-80 transition-opacity font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      Refund Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Privacy Policy Checkbox */}
              <div
                className="p-2 sm:p-3 rounded-lg border"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded focus:ring-2"
                    style={{
                      accentColor: "var(--brand)",
                      borderColor: "var(--border)",
                    }}
                  />
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    I agree to the{" "}
                    <Link
                      to="/privacy-policy"
                      className="hover:opacity-80 transition-opacity font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={launchRazorpay}
              disabled={!termsAccepted || !refundAccepted || !privacyAccepted}
              className={`mt-4 sm:mt-6 w-full font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base ${
                termsAccepted && refundAccepted && privacyAccepted
                  ? "hover:opacity-90"
                  : "cursor-not-allowed opacity-50"
              }`}
              style={{
                background:
                  termsAccepted && refundAccepted && privacyAccepted
                    ? "var(--brand)"
                    : "var(--bg-secondary)",
                color:
                  termsAccepted && refundAccepted && privacyAccepted
                    ? "var(--text-accent)"
                    : "var(--text-muted)",
              }}
            >
              Pay Now
            </button>
            <p
              className="text-xs text-center mt-2 sm:mt-3"
              style={{ color: "var(--text-muted)" }}
            >
              Secure payments by Razorpay
            </p>
          </div>
        </div>
      )}

      {/* Login and Signup Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}
