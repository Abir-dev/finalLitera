import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";
import recordingService from "../services/recordingService.js";

export default function VideoPlayerPage() {
  const { recordingId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (recordingId) {
      loadRecording();
    }
  }, [recordingId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [recording]);

  const loadRecording = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recordingService.getRecordingById(recordingId);

      if (response.status === "success") {
        setRecording(response.data.recording);
      } else {
        setError("Failed to load recording");
      }
    } catch (error) {
      console.error("Error loading recording:", error);
      if (error.response?.status === 403) {
        setError("You don't have access to this recording");
      } else {
        setError("Failed to load recording. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownloadNotes = async () => {
    try {
      const response = await fetch(`/api/live-class-recordings/${recordingId}/notes-pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = recording.notesPdfName || `notes-${recording.lectureNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to download PDF notes');
      }
    } catch (error) {
      console.error('Error downloading PDF notes:', error);
      alert('Failed to download PDF notes. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4"
            style={{ color: "var(--brand)" }}
          />
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Loading recording...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card-premium p-12 text-center max-w-md">
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
            Error Loading Recording
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => loadRecording()}
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

  if (!recording) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Recording not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-300"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1
                className="text-lg font-bold line-clamp-1"
                style={{ color: "var(--text-primary)" }}
              >
                {recording.lectureNumber}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {recording.course?.title || "Live Class Recording"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={recording.recordingUrl}
                className="w-full aspect-video"
                poster={recording.course?.thumbnail}
                onClick={togglePlay}
              />

              {/* Custom Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div
                  className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      background: "var(--brand)",
                      width: `${(currentTime / duration) * 100}%`,
                    }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                    >
                      {isPlaying ? (
                        <Pause size={20} className="text-white" />
                      ) : (
                        <Play size={20} className="text-white" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                    >
                      {isMuted ? (
                        <VolumeX size={20} className="text-white" />
                      ) : (
                        <Volume2 size={20} className="text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                    >
                      {isFullscreen ? (
                        <Minimize size={20} className="text-white" />
                      ) : (
                        <Maximize size={20} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Details */}
            <div className="mt-6">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {recording.lectureNumber}
              </h2>

              {recording.description && (
                <p
                  className="text-lg mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {recording.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-premium p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
                        border: "1px solid var(--brand)30",
                      }}
                    >
                      <Calendar size={16} style={{ color: "var(--brand)" }} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Date
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatDate(recording.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-premium p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
                        border: "1px solid var(--accent-gold)30",
                      }}
                    >
                      <Clock
                        size={16}
                        style={{ color: "var(--accent-gold)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Duration
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {recording.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-premium p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                        border: "1px solid var(--accent-rose)30",
                      }}
                    >
                      <User size={16} style={{ color: "var(--accent-rose)" }} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Hosted By
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {recording.hostedBy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-premium p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
                        border: "1px solid var(--brand-strong)30",
                      }}
                    >
                      <Eye size={16} style={{ color: "var(--brand-strong)" }} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Views
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {recording.views}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* PDF Notes Download */}
            {recording.notesPdfUrl && (
              <div className="card-premium p-6 mb-6">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Lecture Notes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
                        border: "1px solid var(--accent-rose)30",
                      }}
                    >
                      <FileText size={16} style={{ color: "var(--accent-rose)" }} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        PDF Notes Available
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {recording.notesPdfName || "Lecture Notes"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadNotes()}
                    className="btn-premium w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF Notes
                  </button>
                </div>
              </div>
            )}

            {/* Course Information */}
            <div className="card-premium p-6">
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Course Information
              </h3>

              {recording.course && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={recording.course.thumbnail || "/icons/kinglogo.png"}
                      alt={recording.course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4
                        className="font-semibold text-sm line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {recording.course.title}
                      </h4>
                      {recording.course.category && (
                        <p
                          className="text-xs mt-1 px-2 py-1 rounded-full inline-block"
                          style={{
                            background: "var(--brand)10",
                            color: "var(--brand)",
                          }}
                        >
                          {recording.course.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/recordings/course/${recording.course._id}`
                      )
                    }
                    className="btn-premium w-full py-3 flex items-center justify-center gap-2"
                  >
                    View All Recordings
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
