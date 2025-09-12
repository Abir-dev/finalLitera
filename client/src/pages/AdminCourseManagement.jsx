import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const backendURL = "http://localhost:5000";

export default function AdminCourseManagement() {
  const { admin } = useAdminAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'programming',
    level: 'beginner',
    language: 'English',
    duration: '',
    price: '',
    originalPrice: '',
    currency: 'INR',
    tags: '',
    requirements: '',
    learningOutcomes: '',
    isPublished: false,
    isFeatured: false,
    isLaunchPad: false,
    videoUrl: '',
    imageUrl: ''
  });
  const [files, setFiles] = useState({
    thumbnail: null,
    videos: []
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${backendURL}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'thumbnail') {
      setFiles(prev => ({ ...prev, thumbnail: files[0] }));
    } else if (name === 'videos') {
      setFiles(prev => ({ ...prev, videos: Array.from(files) }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      // Add form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files
      if (files.thumbnail) {
        formDataToSend.append('thumbnail', files.thumbnail);
      }
      files.videos.forEach(video => {
        formDataToSend.append('videos', video);
      });

      let response;
      if (editingCourse) {
        // Update course
        response = await axios.put(
          `${backendURL}/api/admin/courses/${editingCourse._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Course updated successfully!');
      } else {
        // Create course
        response = await axios.post(
          `${backendURL}/api/admin/courses`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Course created successfully!');
      }

      setShowForm(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'programming',
      level: 'beginner',
      language: 'English',
      duration: '',
      price: '',
      originalPrice: '',
      currency: 'INR',
      tags: '',
      requirements: '',
      learningOutcomes: '',
      isPublished: false,
      isFeatured: false,
      isLaunchPad: false,
      videoUrl: '',
      imageUrl: ''
    });
    setFiles({ thumbnail: null, videos: [] });
  };

  // Edit course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      category: course.category || 'programming',
      level: course.level || 'beginner',
      language: course.language || 'English',
      duration: course.duration || '',
      price: course.price || '',
      originalPrice: course.originalPrice || '',
      currency: course.currency || 'INR',
      tags: course.tags ? course.tags.join(', ') : '',
      requirements: course.requirements ? course.requirements.join(', ') : '',
      learningOutcomes: course.learningOutcomes ? course.learningOutcomes.join(', ') : '',
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false,
      isLaunchPad: course.isLaunchPad || false,
      videoUrl: '',
      imageUrl: course.thumbnail || ''
    });
    setShowForm(true);
  };

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${backendURL}/api/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${backendURL}/api/admin/courses/${courseId}/toggle-publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Course ${currentStatus ? 'unpublished' : 'published'} successfully!`);
      fetchCourses();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update course status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage your courses and content</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCourse(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
        >
          + Add New Course
        </button>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="programming">Programming</option>
                      <option value="web-development">Web Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="1–2 line summary shown in listings. Example: Master React with hands‑on projects and real‑world patterns."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Tip: Keep it concise (under 300 characters). Shown on course cards and LaunchPad lists.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        description: `Who this course is for\n• Beginners to ${formData.category || 'the topic'}\n• Professionals upskilling to ${formData.level || 'beginner'} level\n\nWhat you'll learn\n• Build real projects step‑by‑step\n• Master core concepts and best practices\n• Learn modern tools and workflows\n\nCourse overview\n• Clear learning path from basics to advanced\n• Hands‑on assignments and quizzes\n• Lifetime access and updates\n\nOutcomes\n• Build production‑ready apps\n• Strengthen your portfolio\n• Interview‑ready confidence`
                      }))}
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
                    placeholder={"Write a compelling course description. Suggested sections:\n• Who this course is for\n• What you'll learn (bullets)\n• Course overview\n• Outcomes/benefits"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Shown on the Course Details and LaunchPad details pages.</p>
                </div>

                {/* Media Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {/* Thumbnail Preview */}
                    {(files.thumbnail || (editingCourse && editingCourse.thumbnail)) && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={files.thumbnail ? URL.createObjectURL(files.thumbnail) : editingCourse.thumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Videos
                    </label>
                    <input
                      type="file"
                      name="videos"
                      accept="video/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {/* Video Preview */}
                    {(files.videos && files.videos.length > 0) || (editingCourse && editingCourse.videos && editingCourse.videos.length > 0) ? (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                        <div className="space-y-2">
                          {/* New videos */}
                          {files.videos && files.videos.map((video, index) => (
                            <div key={`new-${index}`} className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden">
                              <video
                                src={URL.createObjectURL(video)}
                                controls
                                className="w-full h-full object-cover"
                              />
                              <p className="text-xs text-gray-500 p-2">{video.name}</p>
                            </div>
                          ))}
                          {/* Existing videos */}
                          {editingCourse && editingCourse.videos && editingCourse.videos.map((videoUrl, index) => {
                            const isUrl = videoUrl.startsWith('http');
                            
                            return (
                              <div key={`existing-${index}`} className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden">
                                {isUrl ? (
                                  // For URLs, show a clickable preview
                                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
                                    <a
                                      href={videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                    >
                                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                      <p className="text-xs text-center">Click to open</p>
                                    </a>
                                  </div>
                                ) : (
                                  // For uploaded files, show video player
                                  <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                )}
                                <div className="w-full h-full items-center justify-center text-gray-400 hidden">
                                  <div className="text-center">
                                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs text-gray-500">Video not available</p>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 p-2">
                                  Existing {isUrl ? 'Video Link' : 'Video'} {index + 1}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL (alternative to file upload)
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video URL (alternative to file upload)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {/* Video URL Preview */}
                    {formData.videoUrl && formData.videoUrl.trim() !== '' && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">URL Preview:</p>
                        <div className="w-full h-24 border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                          <a
                            href={formData.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
                          >
                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs text-center">Click to preview</p>
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{formData.videoUrl}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="JavaScript, React, Web Development"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Requirements (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Basic HTML, CSS knowledge"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Learning Outcomes (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    placeholder="Build responsive websites, Master React components"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Publish Course</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Course</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isLaunchPad"
                      checked={formData.isLaunchPad}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">LaunchPad Course</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Courses ({courses.length})</h2>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600">Create your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100">
                    {course.thumbnail && course.thumbnail.trim() !== '' ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-gray-400 ${course.thumbnail && course.thumbnail.trim() !== '' ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500">No thumbnail</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
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
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.shortDescription}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.level}</span>
                      <span>{course.duration}h</span>
                      <span>${course.price}</span>
                    </div>
                    
                    {/* Show video count if available */}
                    {course.videos && course.videos.length > 0 && (
                      <div className="text-xs text-blue-600 mb-2">
                        {course.videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {course.videos.length} video{course.videos.length > 1 ? 's' : ''}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(course._id, course.isPublished)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          course.isPublished
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {course.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
    </div>
  );
}
