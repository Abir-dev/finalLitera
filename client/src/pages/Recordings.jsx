import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  Users,
  Calendar,
  Star,
  BookOpen,
  Eye,
  Search,
  TrendingUp,
  Award,
  ArrowRight,
  Video,
  Loader2,
  AlertCircle,
} from "lucide-react";
import recordingService from "../services/recordingService.js";

function CourseRecordingCard({ enrollmentData, onViewRecordings }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="card-premium overflow-hidden group hover:scale-105 transition-all duration-300">
      {/* Thumbnail with Play Button */}
      <div className="relative h-48 bg-gradient-to-br from-bg-secondary to-bg-primary overflow-hidden">
        <img
          src={enrollmentData.course.thumbnail || "/icons/kinglogo.png"}
          alt={enrollmentData.course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
            <Play
              size={24}
              className="ml-1"
              style={{ color: "var(--brand)" }}
            />
          </div>
        </div>

        {/* Enrollment Progress Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-r from-brand to-brand-strong text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <BookOpen size={12} />
            {Math.round(enrollmentData.progress || 0)}% Complete
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div
          className="text-xs font-semibold mb-2 px-2 py-1 rounded-full inline-block"
          style={{ background: "var(--brand)10", color: "var(--brand)" }}
        >
          {enrollmentData.course.category || "Course"}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold mb-2 group-hover:text-brand transition-colors duration-300 line-clamp-2"
          style={{ color: "var(--text-primary)" }}
        >
          {enrollmentData.course.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {enrollmentData.course.description ||
            "Live class recordings for this course"}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} style={{ color: "var(--text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            By {enrollmentData.course.instructor || "Instructor"}
          </span>
        </div>

        {/* Meta Info */}
        <div
          className="flex items-center justify-between text-xs mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Enrolled {formatDate(enrollmentData.enrolledAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span>{Math.round(enrollmentData.progress || 0)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div
          className="flex items-center justify-between mt-4 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <Eye size={14} />
              <span>Live Classes</span>
            </div>
          </div>
          <button
            onClick={() => onViewRecordings(enrollmentData._id)}
            className="btn-premium px-4 py-2 text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            View Recordings
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecordingsPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUserEnrollments();
  }, []);

  const loadUserEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recordingService.getUserEnrollments();

      if (response.status === "success") {
        setEnrollments(response.data.enrollments || []);
      } else {
        setError("Failed to load enrollments");
      }
    } catch (error) {
      console.error("Error loading enrollments:", error);
      setError("Failed to load enrollments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecordings = (enrollmentId) => {
    navigate(`/dashboard/recordings/enrollment/${enrollmentId}`);
  };

  // Filter enrollments based on search term
  const filteredEnrollments = useMemo(() => {
    if (!searchTerm) return enrollments;

    return enrollments.filter(
      (enrollment) =>
        enrollment.course.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.course.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.course.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [enrollments, searchTerm]);

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
              Loading your enrolled courses...
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
            Error Loading Enrollments
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <button
            onClick={loadUserEnrollments}
            className="btn-premium px-6 py-3"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Play size={32} style={{ color: "var(--brand)" }} />
          <h1
            className="heading-1 text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            My Recordings
          </h1>
        </div>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          Access live class recordings from your enrolled courses
        </p>
      </div>

      {/* Search */}
      <div className="card-premium p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 input-with-icon">
            <Search
              size={18}
              className="icon-left"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pr-4 py-3 w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <BookOpen size={20} style={{ color: "var(--brand)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {enrollments.length}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Enrolled Courses
          </div>
        </div>

        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
              border: "1px solid var(--accent-gold)30",
            }}
          >
            <Video size={20} style={{ color: "var(--accent-gold)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {/* {enrollments.reduce(
              (sum, enrollment) => sum + (enrollment.progress || 0),
              0
            )} */}
            {0}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Progress
          </div>
        </div>

        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
              border: "1px solid var(--accent-rose)30",
            }}
          >
            <TrendingUp size={20} style={{ color: "var(--accent-rose)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {enrollments.filter((enrollment) => enrollment.progress > 0).length}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Courses in Progress
          </div>
        </div>
      </div>

      {/* Enrollments Grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEnrollments.map((enrollmentData) => (
            <CourseRecordingCard
              key={enrollmentData._id}
              enrollmentData={enrollmentData}
              onViewRecordings={handleViewRecordings}
            />
          ))}
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
            <Search size={32} style={{ color: "var(--brand)" }} />
          </div>
          <h3
            className="heading-3 text-xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {searchTerm ? "No courses found" : "No Enrolled Courses Yet"}
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {searchTerm
              ? "Try adjusting your search terms to find what you're looking for."
              : "You haven't enrolled in any courses yet. Browse our courses to get started."}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="btn-premium px-6 py-3"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => navigate("/courses")}
              className="btn-premium px-6 py-3"
            >
              Browse Courses
            </button>
          )}
        </div>
      )}
    </div>
  );
}
