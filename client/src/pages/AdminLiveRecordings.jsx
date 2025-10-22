import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/useToast.js";
import { courseService } from "../services/courseService.js";
import {
  liveClassRecordingService,
  recordingUtils,
} from "../services/liveClassRecordingService.js";
import VideoPlayer from "../components/VideoPlayer.jsx";
import {
  Upload,
  Video,
  Calendar,
  Clock,
  User,
  BookOpen,
  Plus,
  Eye,
  Trash2,
  Download,
  Play,
  FileVideo,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit,
  X,
} from "lucide-react";

export default function AdminLiveRecordings() {
  const { toasts, success, error, removeToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState(null);
  const [recordingToEdit, setRecordingToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    lectureNumber: "",
    date: "",
    duration: "",
    startTime: "",
    endTime: "",
    hostedBy: "",
    courseId: "",
    description: "",
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all courses without pagination for dropdown
      const response = await courseService.getAllCourses();
      setCourses(response.data?.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [error]);

  const fetchRecordings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await liveClassRecordingService.getRecordings();
      setRecordings(response.data?.recordings || []);
    } catch (err) {
      console.error("Error fetching recordings:", err);
      error("Failed to fetch recordings");
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Fetch courses for dropdown
  useEffect(() => {
    fetchCourses();
    fetchRecordings();
  }, [fetchCourses, fetchRecordings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = recordingUtils.validateVideoFile(file);
      if (!validation.valid) {
        error(validation.message);
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.lectureNumber ||
      !formData.date ||
      !formData.duration ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.hostedBy ||
      !formData.courseId ||
      !uploadedFile
    ) {
      error("Please fill in all required fields and upload a video file");
      return;
    }

    setSubmitting(true);

    try {
      // Create recording data
      const recordingData = {
        ...formData,
        video: uploadedFile,
        courseId: formData.courseId,
      };

      // Create recording using the service
      await liveClassRecordingService.createRecording(recordingData);

      // Refresh recordings list
      await fetchRecordings();

      // Reset form
      setFormData({
        lectureNumber: "",
        date: "",
        duration: "",
        startTime: "",
        endTime: "",
        hostedBy: "",
        courseId: "",
        description: "",
      });
      setUploadedFile(null);

      // Clear file input
      const fileInput = document.getElementById("videoFile");
      if (fileInput) fileInput.value = "";

      success("Recording uploaded successfully!");
    } catch (err) {
      console.error("Error uploading recording:", err);
      error(err.message || "Failed to upload recording. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewRecording = (recording) => {
    setSelectedRecording(recording);
    setShowDetailModal(true);
  };

  const handleDeleteRecording = (recording) => {
    setRecordingToDelete(recording);
    setShowDeleteDialog(true);
  };

  const handleEditRecording = (recording) => {
    setRecordingToEdit(recording);

    // Debug: Log the original date format
    console.log("Original recording date:", recording.date);
    console.log("Date type:", typeof recording.date);

    // Format date for HTML date input (YYYY-MM-DD)
    let formattedDate = "";
    if (recording.date) {
      let date;

      // Handle different date formats
      if (typeof recording.date === "string") {
        // If it's already a string, try to parse it
        date = new Date(recording.date);
      } else if (recording.date instanceof Date) {
        // If it's already a Date object
        date = recording.date;
      } else {
        // Try to create a new Date
        date = new Date(recording.date);
      }

      console.log("Parsed date:", date);
      console.log("Is valid date:", !isNaN(date.getTime()));

      if (!isNaN(date.getTime())) {
        // Format as YYYY-MM-DD for HTML date input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
        console.log("Formatted date for input:", formattedDate);
      } else {
        console.warn("Invalid date format:", recording.date);
      }
    }

    setFormData({
      lectureNumber: recording.lectureNumber || "",
      date: formattedDate,
      duration: recording.duration || "",
      startTime: recording.startTime || "",
      endTime: recording.endTime || "",
      hostedBy: recording.hostedBy || "",
      courseId: recording.course?._id || recording.course || "",
      description: recording.description || "",
    });
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!recordingToDelete) return;

    setIsDeleting(true);
    try {
      await liveClassRecordingService.deleteRecording(recordingToDelete._id);
      success("Recording deleted successfully");
      await fetchRecordings();
      setShowDeleteDialog(false);
      setRecordingToDelete(null);
    } catch (err) {
      console.error("Error deleting recording:", err);
      error("Failed to delete recording");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateRecording = async (e) => {
    e.preventDefault();

    if (!recordingToEdit) return;

    setIsUpdating(true);
    try {
      const updateData = {
        lectureNumber: formData.lectureNumber,
        date: formData.date,
        duration: formData.duration,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hostedBy: formData.hostedBy,
        course: formData.courseId,
        description: formData.description,
      };

      await liveClassRecordingService.updateRecording(
        recordingToEdit._id,
        updateData
      );
      success("Recording updated successfully");
      await fetchRecordings();
      setShowEditModal(false);
      setRecordingToEdit(null);
      resetForm();
    } catch (err) {
      console.error("Error updating recording:", err);
      error("Failed to update recording");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      lectureNumber: "",
      date: "",
      duration: "",
      startTime: "",
      endTime: "",
      hostedBy: "",
      courseId: "",
      description: "",
    });
    setUploadedFile(null);
  };

  const formatFileSize = recordingUtils.formatFileSize;
  const formatDate = recordingUtils.formatDate;

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-80 max-w-md ${
              toast.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : toast.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : toast.type === "warning"
                ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                : "bg-blue-50 border-blue-500 text-blue-800"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={20} />}
            {toast.type === "error" && <AlertCircle size={20} />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Upload Live Classes Recording
          </h1>
          <p className="text-gray-300 mt-1 text-xs sm:text-sm lg:text-base">
            Upload and manage live class recordings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="card-premium">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload size={20} />
              Upload New Recording
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Lecture Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lecture Number *
                </label>
                <input
                  type="text"
                  name="lectureNumber"
                  value={formData.lectureNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., Lecture 1, Week 2, Session 3"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2:30:00 (hours:minutes:seconds)"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Start Time and End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Hosted By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hosted By *
                </label>
                <input
                  type="text"
                  name="hostedBy"
                  value={formData.hostedBy}
                  onChange={handleInputChange}
                  placeholder="Instructor name"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Course *
                </label>
                <div className="relative">
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-gray-800 text-white">
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option
                        key={course._id}
                        value={course._id}
                        className="bg-gray-800 text-white"
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description of the recording"
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Recording *
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/mp4,video/avi,video/mov,video/wmv"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="videoFile"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileVideo size={48} className="text-gray-400" />
                    <span className="text-white font-medium">
                      {uploadedFile
                        ? uploadedFile.name
                        : "Click to upload video"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      MP4, AVI, MOV, WMV (Max 5GB)
                    </span>
                    {uploadedFile && (
                      <span className="text-green-400 text-sm">
                        {formatFileSize(uploadedFile.size)}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-premium px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Recording
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recordings List */}
        <div className="card-premium">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Video size={20} />
              Previously Uploaded Recordings
            </h2>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p>Loading recordings...</p>
                </div>
              ) : recordings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No recordings uploaded yet</p>
                  <p className="text-sm mt-1">
                    Upload your first recording using the form on the left
                  </p>
                </div>
              ) : (
                recordings.map((recording) => (
                  <div
                    key={recording._id || recording.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleViewRecording(recording)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">
                          {recording.lectureNumber}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2 truncate">
                          {recording.course?.title || "Unknown Course"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {recording.date || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {recording.duration || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {recording.hostedBy || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecording(recording);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="View Recording"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRecording(recording);
                          }}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit Recording"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecording(recording);
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Recording"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Last modified:{" "}
                        {recording.uploadedAt
                          ? formatDate(recording.uploadedAt)
                          : "Unknown"}
                      </span>
                      {recording.fileSize && (
                        <span className="bg-gray-700/50 px-2 py-1 rounded">
                          {formatFileSize(recording.fileSize)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recording Detail Modal */}
      {showDetailModal && selectedRecording && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedRecording.lectureNumber}
                </h2>
                <p className="text-gray-300 mt-1">
                  {selectedRecording.course?.title}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Video size={20} />
                    Video Player
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    {selectedRecording.recordingUrl ? (
                      <VideoPlayer
                        src={selectedRecording.recordingUrl}
                        title={selectedRecording.lectureNumber}
                        className="h-80 w-full"
                      />
                    ) : (
                      <div className="h-80 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video
                            size={48}
                            className="mx-auto text-gray-400 mb-2"
                          />
                          <p className="text-gray-300">No video available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recording Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileVideo size={20} />
                    Recording Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Course
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.course?.title || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Date
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.date || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Duration
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.duration || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Time
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.startTime &&
                        selectedRecording.endTime
                          ? `${selectedRecording.startTime} - ${selectedRecording.endTime}`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Hosted By
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.hostedBy || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        File Size
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.fileSize
                          ? formatFileSize(selectedRecording.fileSize)
                          : "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-300 block mb-1">
                        Uploaded At
                      </label>
                      <p className="text-white font-medium">
                        {selectedRecording.uploadedAt
                          ? formatDate(selectedRecording.uploadedAt)
                          : "N/A"}
                      </p>
                    </div>

                    {selectedRecording.views !== undefined && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <label className="text-sm font-medium text-gray-300 block mb-1">
                          Views
                        </label>
                        <p className="text-white font-medium">
                          {selectedRecording.views || 0}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedRecording.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText size={20} />
                    Description
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedRecording.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Close
                </button>
                {selectedRecording.recordingUrl && (
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedRecording.recordingUrl;
                      link.download = `${selectedRecording.lectureNumber}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="btn-premium px-4 py-2 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Delete Recording
                  </h3>
                  <p className="text-sm text-gray-300">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete this recording?
                </p>
                {recordingToDelete && (
                  <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                    <p className="font-medium text-white">
                      {recordingToDelete.lectureNumber}
                    </p>
                    <p className="text-sm text-gray-300">
                      {recordingToDelete.course?.title || "Unknown Course"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setRecordingToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recording Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit size={24} />
                  Edit Recording
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setRecordingToEdit(null);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateRecording} className="space-y-4">
                {/* Lecture Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lecture Number *
                  </label>
                  <input
                    type="text"
                    name="lectureNumber"
                    value={formData.lectureNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., Lecture 1, Week 2, Session 3"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:30:00 (hours:minutes:seconds)"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Start Time and End Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Hosted By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hosted By *
                  </label>
                  <input
                    type="text"
                    name="hostedBy"
                    value={formData.hostedBy}
                    onChange={handleInputChange}
                    placeholder="Instructor name"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Course *
                  </label>
                  <div className="relative">
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-gray-800 text-white">
                        Select a course
                      </option>
                      {courses.map((course) => (
                        <option
                          key={course._id}
                          value={course._id}
                          className="bg-gray-800 text-white"
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional description of the recording"
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setRecordingToEdit(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-premium px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        Update Recording
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
