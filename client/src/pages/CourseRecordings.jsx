import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Video,
  Eye,
  ChevronRight,
} from "lucide-react";
import recordingService from "../services/recordingService.js";

function RecordingItem({ recording, onWatch }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card-premium p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Recording Thumbnail/Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <Play size={24} style={{ color: "var(--brand)" }} />
          </div>
        </div>

        {/* Recording Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-lg font-bold group-hover:text-brand transition-colors duration-300 line-clamp-2"
              style={{ color: "var(--text-primary)" }}
            >
              {recording.lectureNumber}
            </h3>
            <button
              onClick={() => onWatch(recording._id)}
              className="btn-premium px-4 py-2 text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300"
            >
              Watch Now
              <ChevronRight size={14} />
            </button>
          </div>

          {recording.description && (
            <p
              className="text-sm mb-3 line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {recording.description}
            </p>
          )}

          {/* Meta Information */}
          <div
            className="flex flex-wrap items-center gap-4 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(recording.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{recording.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{recording.hostedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{recording.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseRecordingsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    if (courseId) {
      loadCourseRecordings();
    }
  }, [courseId]);

  const loadCourseRecordings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recordingService.getStudentCourseRecordings(
        courseId,
        page,
        20
      );

      if (response.status === "success") {
        setCourse(response.data.course);
        setRecordings(response.data.recordings || []);
        setPagination(
          response.data.pagination || { current: 1, pages: 1, total: 0 }
        );
      } else {
        setError("Failed to load recordings");
      }
    } catch (error) {
      console.error("Error loading course recordings:", error);
      if (error.response?.status === 403) {
        setError("You are not enrolled in this course");
      } else {
        setError("Failed to load recordings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = (recordingId) => {
    navigate(`/dashboard/recordings/watch/${recordingId}`);
  };

  const handlePageChange = (newPage) => {
    loadCourseRecordings(newPage);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2
              size={48}
              className="animate-spin mx-auto mb-4"
              style={{ color: "var(--brand)" }}
            />
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Loading recordings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="card-premium p-12 text-center">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--error)20, var(--error)10)",
              border: "1px solid var(--error)30",
            }}
          >
            <AlertCircle size={32} style={{ color: "var(--error)" }} />
          </div>
          <h3
            className="heading-3 text-xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Error Loading Recordings
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => loadCourseRecordings()}
              className="btn-premium px-6 py-3"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard/recordings")}
              className="btn-premium px-6 py-3"
            >
              Back to Recordings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard/recordings")}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1
              className="heading-1 text-3xl md:text-4xl mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {course?.title || "Course Recordings"}
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Live class recordings for this course
            </p>
          </div>
        </div>

        {/* Course Info Card */}
        {course && (
          <div className="card-premium p-6 mb-8">
            <div className="flex items-start gap-6">
              <img
                src={course.thumbnail || "/icons/kinglogo.png"}
                alt={course.title}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {course.title}
                </h2>
                {course.description && (
                  <p
                    className="text-sm mb-4 line-clamp-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {course.description}
                  </p>
                )}
                <div
                  className="flex flex-wrap items-center gap-4 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {course.category && (
                    <div
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "var(--brand)10",
                        color: "var(--brand)",
                      }}
                    >
                      {course.category}
                    </div>
                  )}
                  {course.instructor && (
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Video size={14} />
                    <span>{pagination.total} recordings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recordings List */}
      {recordings.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              All Recordings ({pagination.total})
            </h2>
          </div>

          <div className="space-y-4">
            {recordings.map((recording) => (
              <RecordingItem
                key={recording._id}
                recording={recording}
                onWatch={handleWatch}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="btn-premium px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                          pageNum === pagination.current
                            ? "bg-brand text-white"
                            : "hover:bg-white/10"
                        }`}
                        style={{
                          color:
                            pageNum === pagination.current
                              ? "white"
                              : "var(--text-secondary)",
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="btn-premium px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card-premium p-12 text-center">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <Video size={32} style={{ color: "var(--brand)" }} />
          </div>
          <h3
            className="heading-3 text-xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No Recordings Available
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            There are no live class recordings available for this course yet.
          </p>
          <button
            onClick={() => navigate("/dashboard/recordings")}
            className="btn-premium px-6 py-3"
          >
            Back to Recordings
          </button>
        </div>
      )}
    </div>
  );
}
