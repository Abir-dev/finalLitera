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
  BookOpen,
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
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{
                  background: "var(--brand)10",
                  color: "var(--brand)",
                }}
              >
                <Eye size={12} />
                <span>{recording.views || 0}</span>
              </div>
            </div>
          </div>

          {recording.description && (
            <p
              className="text-sm mb-3 line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {recording.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)" }}>
                {formatDate(recording.date)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)" }}>
                {recording.duration}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)" }}>
                {recording.hostedBy}
              </span>
            </div>
          </div>

          <button
            onClick={() => onWatch(recording._id)}
            className="btn-premium px-4 py-2 text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            <Play size={14} />
            Watch Recording
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnrollmentRecordings() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRecordings();
  }, [enrollmentId, currentPage]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recordingService.getRecordingsByEnrollment(
        enrollmentId,
        currentPage,
        10
      );

      if (response.status === "success") {
        setData(response.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError("Failed to load recordings");
      }
    } catch (error) {
      console.error("Error loading recordings:", error);
      setError("Failed to load recordings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = (recordingId) => {
    navigate(`/dashboard/recordings/watch/${recordingId}`);
  };

  const handleBack = () => {
    navigate("/dashboard/recordings");
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
          <div className="flex gap-3 justify-center">
            <button onClick={loadRecordings} className="btn-premium px-6 py-3">
              Try Again
            </button>
            <button onClick={handleBack} className="btn-secondary px-6 py-3">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            No recordings have been uploaded for this course yet.
          </p>
          <button onClick={handleBack} className="btn-premium px-6 py-3">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-bg-secondary transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1
              className="heading-1 text-3xl md:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {data.course.title}
            </h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Live class recordings for this course
            </p>
          </div>
        </div>

        {/* Course Info */}
        <div className="card-premium p-6 mb-8">
          <div className="flex items-start gap-4">
            <img
              src={data.course.thumbnail || "/icons/kinglogo.png"}
              alt={data.course.title}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {data.course.title}
              </h2>
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {data.course.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-muted)" }}>
                    {data.course.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-muted)" }}>
                    {data.course.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-muted)" }}>
                    Enrolled{" "}
                    {new Date(data.enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recordings */}
      {data.recordings.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Recordings ({data.recordings.length})
            </h2>
          </div>

          <div className="grid gap-6">
            {data.recordings.map((recording) => (
              <RecordingItem
                key={recording._id}
                recording={recording}
                onWatch={handleWatch}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span
                className="px-4 py-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            No recordings have been uploaded for this course yet. Check back
            later for new recordings.
          </p>
          <button onClick={handleBack} className="btn-premium px-6 py-3">
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
