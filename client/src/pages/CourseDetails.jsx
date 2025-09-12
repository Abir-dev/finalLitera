import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { courseService } from "../services/courseService";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`w-5 h-5 ${filled ? "text-emerald-500" : "text-slate-300"}`}
      fill="currentColor"
      aria-hidden="true"
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
      } catch (e) {
        setSimilarCourses([]);
      }
    })();
  }, [course]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error ||
              "The course you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center bg-[#1B4A8B] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#153a6f] transition-colors duration-300"
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
          <ul key={idx} className="list-disc ml-6 text-slate-700 space-y-1">
            {bulletLines.map((l, i) => (
              <li key={i}>{l.replace(/^(\-|\*|•)\s+/, "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="mt-4 text-slate-600 leading-relaxed">
          {block}
        </p>
      );
    });
  };

  // Enroll/Register handlers
  const handleEnrollClick = async () => {
    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: `/courses/${display.id}` },
      });
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
      alert("Please accept all Terms & Conditions, Refund Policy, and Privacy Policy to continue with payment.");
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
          navigate("/subscription");
        },
        modal: {
          ondismiss: function() {
            // When user closes the modal, reset state
            setShowCheckout(false);
            setOrderInfo(null);
          }
        },
        prefill: {},
        theme: { color: "#1B4A8B" },
      };
      
      console.log("Razorpay options:", options);
      const rzp = new window.Razorpay(options);
      console.log("Razorpay instance created:", rzp);
      rzp.open();
      console.log("Razorpay opened");
    } catch (error) {
      console.error("Error launching Razorpay:", error);
      alert("Error in opening checkout: " + error.message);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#1B4A8B]">
                Home
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <Link to="/courses" className="hover:text-[#1B4A8B]">
                Courses
              </Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="text-gray-900 font-medium">{display.title}</li>
          </ol>
        </nav>

        {/* Title and rating */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1b3b6b]">
            {display.title}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < Math.floor(display.rating)} />
              ))}
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              {display.rating}
            </span>
            <span className="text-xs text-slate-500">
              {display.students} students enrolled
            </span>
          </div>
        </div>

        {/* Overview + Right preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left column */}
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Course Overview
            </h2>
            {renderDescription(display.description)}

            {display.learningOutcomes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  What you'll learn
                </h3>
                <ul className="list-disc ml-6 text-slate-700 space-y-1">
                  {display.learningOutcomes.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            {display.requirements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Requirements
                </h3>
                <ul className="list-disc ml-6 text-slate-700 space-y-1">
                  {display.requirements.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Videos Section */}
            {course.videos && course.videos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Course Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.videos.map((videoUrl, index) => {
                    // Check if it's a URL (starts with http) or a file path
                    const isUrl = videoUrl.startsWith("http");

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        {isUrl ? (
                          // For URLs, show a clickable link
                          <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden mb-2 border-2 border-dashed border-blue-300">
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
                            >
                              <svg
                                className="w-16 h-16 mb-3"
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
                              <p className="text-sm font-semibold mb-1">
                                Click to Watch Video
                              </p>
                              <p className="text-xs text-blue-500">
                                Opens in new tab
                              </p>
                            </a>
                          </div>
                        ) : (
                          // For uploaded files, show video player
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
                            <video
                              src={videoUrl}
                              controls
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="w-full h-full items-center justify-center text-gray-400 hidden">
                              <div className="text-center">
                                <svg
                                  className="w-12 h-12 mx-auto mb-2"
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
                                <p className="text-sm text-gray-500">
                                  Video not available
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Video {index + 1}
                          </p>
                          {isUrl && (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
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

            <div className="mt-8">
              <button
                onClick={handleEnrollClick}
                className="inline-flex items-center justify-center rounded-full bg-[#1b3b6b] text-white font-semibold px-6 py-2.5 shadow hover:bg-[#163257] transition-colors duration-300"
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Right preview card */}
          <aside>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg sticky top-6">
              {display.thumbnail && display.thumbnail.trim() !== "" ? (
                <img
                  src={display.thumbnail}
                  alt={display.title}
                  className="aspect-[16/10] w-full rounded-xl object-cover mb-4"
                />
              ) : (
                <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">No thumbnail</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-3xl font-bold text-[#1b3b6b]">
                  {display.price}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Level</div>
                    <div className="font-semibold">{display.level}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-semibold">{display.duration}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Category</div>
                    <div className="font-semibold">{display.category}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Instructor</div>
                    <div className="font-semibold">{display.instructor}</div>
                  </div>
                </div>

                <button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#1b3b6b] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#163257] transition-colors duration-300"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Similar Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCourses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`} className="group">
                  <article className="cursor-pointer rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    {c.thumbnail && c.thumbnail.trim() !== "" ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-400 mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-xs text-gray-500">No thumbnail</p>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#1b3b6b] transition-colors duration-300">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {c.shortDescription || c.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {`${c.instructor?.firstName ?? ""} ${
                          c.instructor?.lastName ?? ""
                        }`.trim()}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Confirm Purchase</h3>
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setOrderInfo(null);
                  setTermsAccepted(false);
                  setRefundAccepted(false);
                  setPrivacyAccepted(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Original Price</span>
                <span className="text-sm line-through text-slate-400">
                  {orderInfo.course.originalPrice
                    ? `₹${Number(orderInfo.course.originalPrice).toLocaleString(
                        "en-IN"
                      )}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  You Pay
                </span>
                <span className="text-xl font-bold text-[#1b3b6b]">
                  ₹{Number(orderInfo.course.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Terms and Conditions Checkboxes */}
            <div className="mt-4 space-y-3">
              {/* Terms & Conditions Checkbox */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#1b3b6b] border-gray-300 rounded focus:ring-[#1b3b6b]"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms-conditions"
                      className="text-[#1b3b6b] hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
              </div>

              {/* Refund Policy Checkbox */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundAccepted}
                    onChange={(e) => setRefundAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#1b3b6b] border-gray-300 rounded focus:ring-[#1b3b6b]"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/refund-policy"
                      className="text-[#1b3b6b] hover:underline font-medium"
                    >
                      Refund Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#1b3b6b] border-gray-300 rounded focus:ring-[#1b3b6b]"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-[#1b3b6b] hover:underline font-medium"
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
              className={`mt-6 w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
                termsAccepted && refundAccepted && privacyAccepted
                  ? "bg-[#1b3b6b] text-white hover:bg-[#163257]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Pay Now
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Secure payments by Razorpay
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
