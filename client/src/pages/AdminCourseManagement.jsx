import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { toast } from "react-hot-toast";
import axios from "axios";

// Force the correct backend URL
const backendURL = import.meta.env.VITE_API_URL;

export default function AdminCourseManagement() {
  const { admin } = useAdminAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "programming",
    level: "beginner",
    language: "English",
    duration: "",
    price: "",
    originalPrice: "",
    currency: "INR",
    tags: "",
    requirements: "",
    learningOutcomes: "",
    isPublished: false,
    isFeatured: false,
    isLaunchPad: false,
    videoUrl: "",
    imageUrl: "",
  });
  const [files, setFiles] = useState({
    thumbnail: null,
    videos: [],
  });
  const [submitting, setSubmitting] = useState(false);

  // Meet Links Modal State
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showCourseSelectionModal, setShowCourseSelectionModal] =
    useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [meetLinkData, setMeetLinkData] = useState({
    meetLink: "",
    isLiveClass: false,
    sessionDate: "",
    sessionDuration: "",
  });
  const [linksSubmitting, setLinksSubmitting] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log(
        "Fetching courses with token:",
        token ? "Token exists" : "No token"
      );
      console.log("Backend URL:", backendURL);
      console.log("Admin:", admin);

      if (!token) {
        toast.error("Admin not logged in. Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backendURL}/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("Courses response:", response.data);
      console.log("Courses data:", response.data.data);
      console.log("Courses array:", response.data.data.courses);
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Admin session expired. Please login again.");
        localStorage.removeItem("adminToken");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Insufficient permissions.");
      } else {
        toast.error(
          `Failed to fetch courses: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test server connection first
    const testConnection = async () => {
      try {
        console.log("Testing server connection...");
        const response = await axios.get(`${backendURL}/health`);
        console.log("Server health check:", response.data);
      } catch (error) {
        console.error("Server connection test failed:", error);
        toast.error(
          "Cannot connect to server. Please check if the backend is running."
        );
      }
    };

    testConnection();
    fetchCourses();
  }, []);

  // Debug courses state changes
  useEffect(() => {
    console.log("Courses state updated:", courses);
    console.log("Courses length:", courses.length);
  }, [courses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "thumbnail") {
      setFiles((prev) => ({ ...prev, thumbnail: files[0] }));
    } else if (name === "videos") {
      setFiles((prev) => ({ ...prev, videos: Array.from(files) }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files
      if (files.thumbnail) {
        formDataToSend.append("thumbnail", files.thumbnail);
      }
      files.videos.forEach((video) => {
        formDataToSend.append("videos", video);
      });

      let response;
      if (editingCourse) {
        // Update course
        response = await axios.put(
          `${backendURL}/admin/courses/${editingCourse._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Course updated successfully!");
      } else {
        // Create course
        const response = await axios.post(
          `${backendURL}/admin/courses`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Course created successfully!");
      }

      setShowForm(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      category: "programming",
      level: "beginner",
      language: "English",
      duration: "",
      price: "",
      originalPrice: "",
      currency: "INR",
      tags: "",
      requirements: "",
      learningOutcomes: "",
      isPublished: false,
      isFeatured: false,
      isLaunchPad: false,
      videoUrl: "",
      imageUrl: "",
    });
    setFiles({ thumbnail: null, videos: [] });
  };

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      shortDescription: course.shortDescription || "",
      category: course.category || "programming",
      level: course.level || "beginner",
      language: course.language || "English",
      duration: course.duration || "",
      price: course.price || "",
      originalPrice: course.originalPrice || "",
      currency: course.currency || "INR",
      tags: course.tags ? course.tags.join(", ") : "",
      requirements: course.requirements ? course.requirements.join(", ") : "",
      learningOutcomes: course.learningOutcomes
        ? course.learningOutcomes.join(", ")
        : "",
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false,
      isLaunchPad: course.isLaunchPad || false,
      videoUrl: "",
      imageUrl: course.thumbnail || "",
    });
    setShowForm(true);
  };

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${backendURL}/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${backendURL}/admin/courses/${courseId}/toggle-publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `Course ${currentStatus ? "unpublished" : "published"} successfully!`
      );
      fetchCourses();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update course status");
    }
  };

  // Handle Add Links button click
  const handleAddLinks = (course) => {
    setSelectedCourse(course);
    setMeetLinkData({
      meetLink: course.schedule?.liveSessions?.[0]?.meetingLink || "",
      isLiveClass: course.schedule?.liveSessions?.length > 0 || false,
      sessionDate: course.schedule?.liveSessions?.[0]?.date
        ? new Date(course.schedule.liveSessions[0].date)
            .toISOString()
            .slice(0, 16)
        : "",
      sessionDuration: course.schedule?.liveSessions?.[0]?.duration || "",
    });
    setShowLinksModal(true);
  };

  // Handle meet link input changes
  const handleMeetLinkChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMeetLinkData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle meet link submission
  const handleMeetLinkSubmit = async (e) => {
    e.preventDefault();
    setLinksSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${backendURL}/admin/courses/${selectedCourse._id}/meet-links`,
        meetLinkData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Meet links updated successfully!");
      setShowLinksModal(false);
      fetchCourses();
    } catch (error) {
      console.error("Error updating meet links:", error);
      toast.error(
        error.response?.data?.message || "Failed to update meet links"
      );
    } finally {
      setLinksSubmitting(false);
    }
  };

  // Close meet links modal
  const handleCloseLinksModal = () => {
    setShowLinksModal(false);
    setSelectedCourse(null);
    setMeetLinkData({
      meetLink: "",
      isLiveClass: false,
      sessionDate: "",
      sessionDuration: "",
    });
  };

  // Create sample course for testing
  const createSampleCourse = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const sampleCourseData = {
        title: "Sample React Course",
        description:
          "This is a sample course to test the live links functionality. Learn React fundamentals and best practices.",
        shortDescription: "Learn React from scratch",
        category: "programming",
        level: "beginner",
        language: "English",
        duration: 120,
        price: 99,
        originalPrice: 199,
        currency: "INR",
        tags: "react,javascript,frontend",
        requirements: "Basic HTML,CSS knowledge",
        learningOutcomes:
          "Build React apps,Understand components,State management",
        isPublished: true,
        isFeatured: false,
        isLaunchPad: false,
      };

      const response = await axios.post(
        `${backendURL}/admin/courses`,
        sampleCourseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Sample course created successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error creating sample course:", error);
      toast.error("Failed to create sample course");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-gray-300 mt-1">Manage your courses and content</p>
        </div>
        <div className="flex items-center gap-3">
          {courses.length > 0 && (
            <button
              onClick={() => setShowCourseSelectionModal(true)}
              className="btn-outline-premium px-6 py-3 text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Manage Live Links
            </button>
          )}
          <button
            onClick={() => {
              resetForm();
              setEditingCourse(null);
              setShowForm(true);
            }}
            className="btn-premium px-6 py-3 text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Course
          </button>
          {courses.length === 0 && (
            <button
              onClick={createSampleCourse}
              className="btn-gold-premium px-6 py-3 text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Create Sample Course
            </button>
          )}
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-premium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-premium"
                      required
                    >
                      <option value="programming">Programming</option>
                      <option value="web-development">Web Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="mobile-development">
                        Mobile Development
                      </option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="input-premium"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="input-premium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-premium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="input-premium"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="1–2 line summary shown in listings. Example: Master React with hands‑on projects and real‑world patterns."
                    className="input-premium"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Tip: Keep it concise (under 300 characters). Shown on course
                    cards and LaunchPad lists.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Detailed Description *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          description: `Who this course is for\n• Beginners to ${
                            formData.category || "the topic"
                          }\n• Professionals upskilling to ${
                            formData.level || "beginner"
                          } level\n\nWhat you'll learn\n• Build real projects step‑by‑step\n• Master core concepts and best practices\n• Learn modern tools and workflows\n\nCourse overview\n• Clear learning path from basics to advanced\n• Hands‑on assignments and quizzes\n• Lifetime access and updates\n\nOutcomes\n• Build production‑ready apps\n• Strengthen your portfolio\n• Interview‑ready confidence`,
                        }))
                      }
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Use description template
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="8"
                    placeholder={
                      "Write a compelling course description. Suggested sections:\n• Who this course is for\n• What you'll learn (bullets)\n• Course overview\n• Outcomes/benefits"
                    }
                    className="input-premium"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Shown on the Course Details and LaunchPad details pages.
                  </p>
                </div>

                {/* Media Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Course Thumbnail
                    </label>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="input-premium"
                    />
                    {/* Thumbnail Preview */}
                    {(files.thumbnail ||
                      (editingCourse && editingCourse.thumbnail)) && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-300 mb-2">Preview:</p>
                        <div className="w-full h-32 border border-gray-600 rounded-lg overflow-hidden">
                          <img
                            src={
                              files.thumbnail
                                ? URL.createObjectURL(files.thumbnail)
                                : editingCourse.thumbnail
                            }
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Course Videos
                    </label>
                    <input
                      type="file"
                      name="videos"
                      accept="video/*"
                      multiple
                      onChange={handleFileChange}
                      className="input-premium"
                    />
                    {/* Video Preview */}
                    {(files.videos && files.videos.length > 0) ||
                    (editingCourse &&
                      editingCourse.videos &&
                      editingCourse.videos.length > 0) ? (
                      <div className="mt-3">
                        <p className="text-sm text-gray-300 mb-2">
                          Video Preview:
                        </p>
                        <div className="space-y-2">
                          {/* New videos */}
                          {files.videos &&
                            files.videos.map((video, index) => (
                              <div
                                key={`new-${index}`}
                                className="w-full h-32 border border-gray-600 rounded-lg overflow-hidden"
                              >
                                <video
                                  src={URL.createObjectURL(video)}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                                <p className="text-xs text-gray-500 p-2">
                                  {video.name}
                                </p>
                              </div>
                            ))}
                          {/* Existing videos */}
                          {editingCourse &&
                            editingCourse.videos &&
                            editingCourse.videos.map((videoUrl, index) => {
                              const isUrl = videoUrl.startsWith("http");

                              return (
                                <div
                                  key={`existing-${index}`}
                                  className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden"
                                >
                                  {isUrl ? (
                                    // For URLs, show a clickable preview
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
                                      <a
                                        href={videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                      >
                                        <svg
                                          className="w-8 h-8 mx-auto mb-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                          />
                                        </svg>
                                        <p className="text-xs text-center">
                                          Click to open
                                        </p>
                                      </a>
                                    </div>
                                  ) : (
                                    // For uploaded files, show video player
                                    <video
                                      src={videoUrl}
                                      controls
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  )}
                                  <div className="w-full h-full items-center justify-center text-gray-400 hidden">
                                    <div className="text-center">
                                      <svg
                                        className="w-8 h-8 mx-auto mb-1"
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
                                      <p className="text-xs text-gray-500">
                                        Video not available
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 p-2">
                                    Existing {isUrl ? "Video Link" : "Video"}{" "}
                                    {index + 1}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Image URL (alternative to file upload)
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Video URL (alternative to file upload)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/video.mp4"
                      className="input-premium"
                    />
                    {/* Video URL Preview */}
                    {formData.videoUrl && formData.videoUrl.trim() !== "" && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-300 mb-2">
                          URL Preview:
                        </p>
                        <div className="w-full h-24 border border-gray-600 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
                          <a
                            href={formData.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
                          >
                            <svg
                              className="w-8 h-8 mb-1"
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
                            <p className="text-xs text-center">
                              Click to preview
                            </p>
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {formData.videoUrl}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="JavaScript, React, Web Development"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Requirements (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Basic HTML, CSS knowledge"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Learning Outcomes (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    placeholder="Build responsive websites, Master React components"
                    className="input-premium"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white">
                      Publish Course
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white">
                      Featured Course
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isLaunchPad"
                      checked={formData.isLaunchPad}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white">
                      LaunchPad Course
                    </span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-600">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-outline-premium px-6 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-premium px-6 py-3 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingCourse
                      ? "Update Course"
                      : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="card-premium">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Courses ({courses.length})
          </h2>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-white mb-2">
                No courses yet
              </h3>
              <p className="text-gray-300">
                Create your first course to get started!
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Courses count: {courses.length}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="card-premium overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-800">
                    {course.thumbnail && course.thumbnail.trim() !== "" ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center text-gray-500 ${
                        course.thumbnail && course.thumbnail.trim() !== ""
                          ? "hidden"
                          : ""
                      }`}
                    >
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
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs text-gray-400">No thumbnail</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex space-x-1 ml-2">
                        {course.isPublished && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                        {course.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {course.isLaunchPad && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            LaunchPad
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {course.shortDescription}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{course.level}</span>
                      <span>{course.duration}h</span>
                      <span>${course.price}</span>
                    </div>

                    {/* Show video count if available */}
                    {course.videos && course.videos.length > 0 && (
                      <div className="text-xs text-blue-600 mb-2">
                        {course.videos.some((video) => video.startsWith("http"))
                          ? "🔗"
                          : "📹"}{" "}
                        {course.videos.length} video
                        {course.videos.length > 1 ? "s" : ""}
                      </div>
                    )}

                    {/* Live Class Status */}
                    {course.schedule?.liveSessions?.length > 0 && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
                          </svg>
                          Live Class Enabled
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 px-3 py-2 text-sm btn-outline-premium rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAddLinks(course)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          course.schedule?.liveSessions?.length > 0
                            ? "bg-green-900/30 text-green-300 border border-green-600 hover:bg-green-900/50"
                            : "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {course.schedule?.liveSessions?.length > 0
                          ? "Manage Links"
                          : "Add Links"}
                      </button>
                      <button
                        onClick={() =>
                          handleTogglePublish(course._id, course.isPublished)
                        }
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          course.isPublished
                            ? "bg-yellow-900/30 text-yellow-300 border border-yellow-600 hover:bg-yellow-900/50"
                            : "bg-green-900/30 text-green-300 border border-green-600 hover:bg-green-900/50"
                        }`}
                      >
                        {course.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="px-3 py-2 text-sm bg-red-900/30 text-red-300 border border-red-600 rounded-lg hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meet Links Modal */}
      {showLinksModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Manage Live Class Links
                </h2>
                <button
                  onClick={handleCloseLinksModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-white">
                  {selectedCourse.title}
                </h3>
                <p className="text-sm text-gray-300">
                  Configure live class meeting links for this course
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <form onSubmit={handleMeetLinkSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isLiveClass"
                      checked={meetLinkData.isLiveClass}
                      onChange={handleMeetLinkChange}
                      className="w-4 h-4 text-blue-500 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-white">
                      Enable Live Class (Show in Live Classes section)
                    </span>
                  </label>
                </div>

                {meetLinkData.isLiveClass && (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Meeting Link *
                    </label>
                    <input
                      type="url"
                      name="meetLink"
                      value={meetLinkData.meetLink}
                      onChange={handleMeetLinkChange}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="input-premium"
                      required={meetLinkData.isLiveClass}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Enter the Google Meet, Zoom, or other meeting platform
                      link for this live class.
                    </p>

                    {/* Meet Link Preview */}
                    {meetLinkData.meetLink &&
                      meetLinkData.meetLink.trim() !== "" && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-300 mb-2">
                            Meeting Link Preview:
                          </p>
                          <div className="w-full h-20 border border-gray-600 rounded-lg overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                            <a
                              href={meetLinkData.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-full flex flex-col items-center justify-center text-green-600 hover:bg-green-100 transition-colors duration-300 cursor-pointer"
                            >
                              <svg
                                className="w-6 h-6 mb-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"
                                />
                              </svg>
                              <p className="text-xs text-center">
                                Click to test meeting link
                              </p>
                            </a>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {meetLinkData.meetLink}
                          </p>
                        </div>
                      )}

                    {/* Live Session Date/Time */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-white mb-2">
                        Live Session Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="sessionDate"
                        value={meetLinkData.sessionDate}
                        onChange={handleMeetLinkChange}
                        className="input-premium"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Set when this course should go live.
                      </p>
                    </div>

                    {/* Live Session Duration */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-white mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        name="sessionDuration"
                        value={meetLinkData.sessionDuration}
                        onChange={handleMeetLinkChange}
                        placeholder="60"
                        className="input-premium"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-600">
                  <button
                    type="button"
                    onClick={handleCloseLinksModal}
                    className="btn-outline-premium px-6 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={linksSubmitting}
                    className="btn-premium px-6 py-3 disabled:opacity-50"
                  >
                    {linksSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Selection Modal for Live Links */}
      {showCourseSelectionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Select Course to Manage Live Links
                </h2>
                <button
                  onClick={() => setShowCourseSelectionModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="border border-gray-600 rounded-lg p-4 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCourse(course);
                      setMeetLinkData({
                        meetLink:
                          course.schedule?.liveSessions?.[0]?.meetingLink || "",
                        isLiveClass:
                          course.schedule?.liveSessions?.length > 0 || false,
                      });
                      setShowCourseSelectionModal(false);
                      setShowLinksModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {course.description?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">
                            Level: {course.level}
                          </span>
                          <span className="text-xs text-gray-400">
                            Duration: {course.duration} min
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              course.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.schedule?.liveSessions?.length > 0 ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Live Enabled
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            No Live Links
                          </span>
                        )}
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {courses.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No courses available
                  </h3>
                  <p className="text-gray-300">
                    Create a course first to manage live links.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
