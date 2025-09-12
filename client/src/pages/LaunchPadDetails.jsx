import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { courseService } from "../services/courseService";

const LaunchPadDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, bg, logo, title, desc } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Use real course data if available, otherwise fallback to dummy data
  const courseData = course ? {
    title: course.title,
    instructor: `${course.instructor?.firstName || 'Unknown'} ${course.instructor?.lastName || 'Instructor'}`,
    duration: `${course.duration} hours`,
    level: course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner',
    progress: 0, // This would come from user enrollment data
    modules: course.learningOutcomes || [
      "Introduction to Modern Web Development",
      "React.js Fundamentals",
      "Node.js Backend Development",
      "Database Design & Management",
      "API Development & Integration",
      "Deployment & DevOps"
    ],
    nextLesson: "Start Learning",
    certificate: `${course.title} Certificate`,
    price: course.price,
    currency: course.currency || 'INR',
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail,
    rating: course.rating?.average || 0,
    enrollmentCount: course.enrollmentCount || 0,
    videos: course.videos || []
  } : {
    title: title || "Advanced Web Development",
    instructor: "Dr. Sarah Johnson",
    duration: "12 weeks",
    level: "Intermediate",
    progress: 65,
    modules: [
      "Introduction to Modern Web Development",
      "React.js Fundamentals",
      "Node.js Backend Development",
      "Database Design & Management",
      "API Development & Integration",
      "Deployment & DevOps"
    ],
    nextLesson: "React.js Fundamentals - Part 2",
    certificate: "Web Development Professional Certificate"
  };

  // Render long description as bullets/paragraphs based on lines starting with -, *, •
  const renderLongDescription = (text) => {
    if (!text) return null;
    const blocks = String(text).split(/\n\n+/);
    return blocks.map((block, idx) => {
      const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
      const bulletLines = lines.filter(l => /^(\-|\*|•)\s+/.test(l));
      if (bulletLines.length === lines.length && lines.length > 0) {
        return (
          <ul key={idx} className="list-disc ml-6 text-gray-700 space-y-1">
            {bulletLines.map((l, i) => (
              <li key={i}>{l.replace(/^(\-|\*|•)\s+/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-gray-700 mb-3">{block}</p>
      );
    });
  };

  if (!title) {
    return (
      <div className="text-center mt-20 text-2xl font-semibold">
        No data found!
      </div>
    );
  }

  const handleDownloadCertificate = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          // Simulate file download completion
          setTimeout(() => {
            alert("Certificate downloaded successfully!");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleResumeCourse = () => {
    // Navigate to the next lesson or current progress
    alert(`Resuming course: ${courseData.nextLesson}`);
  };

  const handleEnrollClick = async () => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/launchpad' } });
      return;
    }
    try {
      const result = await courseService.createOrder(course?._id);
      setOrderInfo(result.data);
      setShowCheckout(true);
    } catch (e) {
      alert(e.message || 'Failed to initiate payment');
    }
  };

  const launchRazorpay = () => {
    if (!orderInfo?.order) return;

    if (!termsAccepted || !refundAccepted || !privacyAccepted) {
      alert("Please accept all Terms & Conditions, Refund Policy, and Privacy Policy to continue with payment.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderInfo.order.amount,
      currency: orderInfo.order.currency,
      name: courseData.title,
      description: 'Course Enrollment',
      order_id: orderInfo.order.id,
      notes: orderInfo.order.notes,
      handler: function () {
        navigate('/subscription');
      },
      prefill: {},
      theme: { color: '#1B4A8B' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Image */}
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src={bg || "/src/assets/courses1.jpg"}
                  alt={title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {courseData.progress}% Complete
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseData.title}</h1>
                  <p className="text-gray-600 text-lg mb-6">
                    {courseData.shortDescription || courseData.description || "Master modern web development with hands-on projects and real-world applications"}
                  </p>
                </div>
                {logo && (
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg shadow-md overflow-hidden border border-gray-300">
                    <img
                      src={logo}
                      alt="logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{courseData.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{courseData.level}</div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{courseData.modules.length}</div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {courseData.price ? `₹${courseData.price.toLocaleString()}` : 'Free'}
                  </div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
              </div>

              {/* Video Count */}
              {courseData.videos && courseData.videos.length > 0 && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg text-center border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {courseData.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {courseData.videos.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {courseData.videos.some(video => video.startsWith('http')) ? 'Video Links' : 'Course Videos'}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Stats */}
              {courseData.enrollmentCount > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{courseData.enrollmentCount}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">★ {courseData.rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{courseData.instructor.split(' ')[0]}</div>
                    <div className="text-sm text-gray-600">Instructor</div>
                  </div>
                </div>
              )}

              {/* Progress Bar - Only show if user has progress */}
              {courseData.progress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Progress</span>
                    <span className="text-sm font-medium text-gray-700">{courseData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${courseData.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={course ? handleEnrollClick : handleResumeCourse}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {courseData.progress > 0 ? '▶ Resume Course' : '🚀 Enroll Now'}
                </button>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isDownloading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Downloading... {downloadProgress}%
                    </span>
                  ) : (
                    "📜 Download Certificate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Modules */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
              <div className="space-y-4">
                {courseData.modules.map((module, index) => (
                  <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{module}</h3>
                      <p className="text-sm text-gray-600">Estimated time: 2-3 hours</p>
                    </div>
                    <div className="text-green-500">
                      {index < Math.floor(courseData.progress / 16.67) ? "✓" : "○"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Videos Section */}
            {courseData.videos && courseData.videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseData.videos.map((videoUrl, index) => {
                    // Check if it's a URL (starts with http) or a file path
                    const isUrl = videoUrl.startsWith('http');
                    
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
                              <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm font-semibold mb-1">Click to Watch Video</p>
                              <p className="text-xs text-blue-500">Opens in new tab</p>
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
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full items-center justify-center text-gray-400 hidden">
                              <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Video not available</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">Video {index + 1}</p>
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
          </div>

          {/* Course Details & Actions */}
          <div className="space-y-6">
            {/* Next Lesson - Only show if user has progress */}
            {courseData.progress > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Next Lesson</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{courseData.nextLesson}</h4>
                  <p className="text-sm text-blue-700 mb-3">Continue where you left off</p>
                  <button
                    onClick={handleResumeCourse}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            )}

            {/* Certificate Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Certificate</h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{courseData.certificate}</h4>
                <p className="text-sm text-gray-600 mb-4">Complete the course to earn your certificate</p>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading || courseData.progress < 100}
                  className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {courseData.progress < 100 ? "Complete Course First" : "Download Certificate"}
                </button>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About This Course</h3>
              <div className="space-y-3">
                {courseData.description ? (
                  renderLongDescription(courseData.description)
                ) : Array.isArray(desc) ? (
                  desc.map((point, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">{desc}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            to="/launchpad"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
          >
            ← Back to LaunchPad
          </Link>
        </div>
      </div>
      {showCheckout && orderInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Confirm Purchase</h3>
              <button 
                onClick={() => {
                  setShowCheckout(false);
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
                <span className="text-sm line-through text-slate-400">{orderInfo.course.originalPrice ? `₹${Number(orderInfo.course.originalPrice).toLocaleString('en-IN')}` : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">You Pay</span>
                <span className="text-xl font-bold text-[#1b3b6b]">₹{Number(orderInfo.course.price).toLocaleString('en-IN')}</span>
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
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms-conditions"
                      className="text-blue-600 hover:underline font-medium"
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
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/refund-policy"
                      className="text-blue-600 hover:underline font-medium"
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
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-blue-600 hover:underline font-medium"
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
            <p className="text-xs text-slate-500 mt-3 text-center">Secure payments by Razorpay</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default LaunchPadDetails;
