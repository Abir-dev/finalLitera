// src/pages/LiveClasses.jsx
import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import profileService from "../services/profileService.js";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

const styles = {
  brandBlue: "#18457A",
  liveRed: "#D14343",
  navyblue: "#18457A",
};

function LiveBadge() {
  return (
    <span
      className="pointer-events-none select-none inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] leading-none animate-pulse"
      style={{ borderColor: styles.liveRed, color: styles.liveRed }}
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
      </svg>
      LIVE
    </span>
  );
}

function LiveClassCard({ title, instructor, viewers, meetLink, thumbnail, isLive = true, startTime, duration }) {
  const handleJoinClass = () => {
    if (meetLink) {
      window.open(meetLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleJoinClass}>
      <div className="relative">
        <div
          className="h-44 sm:h-48 w-full rounded-xl bg-slate-200 border overflow-hidden hover:shadow-lg transition-all duration-300"
          style={{ borderColor: isLive ? styles.liveRed : "#e5e7eb" }}
        >
          {/* Course Thumbnail */}
          <div className="relative w-full h-full">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Join Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all hover:scale-110">
                <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
                </svg>
              </div>
            </div>

            {/* Live Viewers Count */}
            {isLive && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {viewers} watching
                </div>
              </div>
            )}

            {/* AI-Powered Features Indicator */}
            {isLive && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  AI Powered
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-1">By {instructor}</p>

        {/* Live Status Info */}
        {isLive ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live Now
            </span>
            <span>•</span>
            <span>{viewers} viewers</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
              </svg>
              Starts at {startTime}
            </span>
            <span>•</span>
            <span>{duration}</span>
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={handleJoinClass}
          className="mt-3 w-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-medium py-2 px-4 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
        >
          {isLive ? 'Join Live Class' : 'Join Meeting'}
        </button>
      </div>
    </div>
  );
}

export default function LiveClasses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchEnrolledLiveClasses = useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        console.log('Fetching enrolled courses for live classes...');

        // First, try to get user's enrolled courses
        let enrolledCourseIds = [];
        try {
          const enrolledResponse = await profileService.getEnrolledCourses();
          const enrolled = enrolledResponse.enrolledCourses || [];

          console.log('Enrolled courses response:', enrolled);
          console.log('Enrolled courses count:', enrolled.length);

          // Extract course IDs from enrolled courses
          enrolledCourseIds = enrolled.map(enrollment => {
            // Handle different data structures
            if (enrollment.course && enrollment.course._id) {
              return enrollment.course._id;
            } else if (enrollment._id) {
              return enrollment._id;
            } else if (typeof enrollment === 'string') {
              return enrollment;
            }
            return null;
          }).filter(Boolean);

          console.log('Enrolled course IDs:', enrolledCourseIds);
          setEnrolledCourses(enrolled);
        } catch (enrollmentError) {
          console.log('Failed to fetch enrolled courses, falling back to all courses:', enrollmentError);
          // If enrollment fetch fails, we'll show all courses but with a warning
        }

        // Now fetch all courses with live sessions
        const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
        const response = await axios.get(`${API_BASE}/courses?liveClasses=true`);

        console.log('All courses with live sessions:', response.data.data.courses);

        // Only show live classes from enrolled courses
        let coursesToShow = [];
        if (enrolledCourseIds.length > 0) {
          coursesToShow = response.data.data.courses.filter(course =>
            enrolledCourseIds.includes(course._id)
          );
          console.log('Filtered courses (enrolled only):', coursesToShow);
        }

        if (coursesToShow.length === 0) {
          if (enrolledCourseIds.length > 0) {
            setError("You don't have any enrolled courses with live sessions.");
          } else {
            setError("No live classes available at the moment.");
          }
          setCourses([]);
          return;
        }

        // Transform into live and upcoming sessions
        const transformedCourses = coursesToShow.flatMap(course => {
          const sessions = Array.isArray(course.schedule?.liveSessions) ? course.schedule.liveSessions : [];
          const now = new Date();

          // Find a session that is currently live
          const currentSession = sessions.find(session => {
            if (!session?.date) return false;
            const sessionStart = new Date(session.date);
            const sessionEnd = new Date(sessionStart.getTime() + (session.duration || 60) * 60000);
            return now >= sessionStart && now <= sessionEnd;
          });

          const items = [];
          if (currentSession) {
            items.push({
              id: course._id,
              title: course.title,
              instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor',
              viewers: Math.floor(Math.random() * 5000) + 100,
              thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
              meetLink: currentSession.meetingLink || "",
              isLive: true,
              startTime: new Date(currentSession.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              duration: `${currentSession.duration || course.duration || 60} minutes`
            });
          }

          // Upcoming sessions (future ones)
          const upcoming = sessions
            .filter(s => s?.date && new Date(s.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

          upcoming.forEach((s) => {
            items.push({
              id: course._id,
              title: course.title,
              instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor',
              viewers: 0,
              thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
              meetLink: s.meetingLink || "",
              isLive: false,
              startTime: new Date(s.date).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
              duration: `${s.duration || course.duration || 60} minutes`
            });
          });

          return items;
        });

        setCourses(transformedCourses);

      } catch (error) {
        console.error('Error fetching live classes:', error);
        setError('Failed to load live classes. Please try again.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
  }, []);

  // Initial load and auto-refresh hooks
  useEffect(() => {
    fetchEnrolledLiveClasses();

    // Periodic refresh every 60s
    const interval = setInterval(() => {
      fetchEnrolledLiveClasses();
    }, 60000);

    // Refresh when tab becomes visible
    const onVisibility = () => {
      if (!document.hidden) fetchEnrolledLiveClasses();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchEnrolledLiveClasses]);

  // Socket listener for immediate updates from admin changes
  useEffect(() => {
    if (!user?.id && !user?._id) return;
    const apiEnv = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
    const normalizedApi = apiEnv.endsWith('/api') ? apiEnv : `${apiEnv.replace(/\/$/, '')}/api`;
    const backendURL = normalizedApi.replace(/\/api$/, '');

    let socket;
    try {
      socket = io(backendURL, {
        withCredentials: true,
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 10000,
        forceNew: true,
      });

      socket.on('connect', () => {
        const uid = user.id || user._id;
        if (uid) socket.emit('register_user', uid);
      });

      socket.on('new_notification', (payload) => {
        if (!payload) return;
        if (payload.type === 'live_class_scheduled' || payload.type === 'course_updated' || payload.type === 'live_class_updated') {
          fetchEnrolledLiveClasses();
        }
      });
    } catch (e) {
      console.warn('Live socket init failed:', e.message);
    }

    return () => {
      try {
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect();
        }
      } catch {}
    };
  }, [user?.id, user?._id, fetchEnrolledLiveClasses]);

  const liveClasses = courses.filter(item => item.isLive);
  const upcomingClasses = courses.filter(item => !item.isLive);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: styles.brandBlue }}>
              {enrolledCourses.length > 0 ? 'My Live Classes' : 'Live Classes'}
            </h1>
            <p className="text-gray-600 mt-1">
              {enrolledCourses.length > 0
                ? 'Live sessions from your enrolled courses'
                : 'All available live sessions'
              }
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Loading live classes...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Only enrolled courses' live classes are shown; no fallback to all courses */}

        {/* No enrolled courses with live sessions */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Live Classes Available
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have any enrolled courses with live sessions at the moment.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                • Enroll in courses that offer live sessions
              </p>
              <p className="text-sm text-gray-500">
                • Check back later for scheduled live classes
              </p>
            </div>
            <button
              onClick={() => window.location.href = "/courses"}
              className="mt-4 px-6 py-2 bg-[#1F4B7A] text-white rounded-lg hover:bg-[#1a3f6b] transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Live Now Section */}
        {liveClasses.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <LiveBadge />
              <h2 className="text-lg font-semibold text-slate-900">Happening Now</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((item) => (
                <LiveClassCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-700" fill="currentColor" aria-hidden="true"><path d="M7 10h5v5H7z"/><path d="M3 4a2 2 0 012-2h1V0h2v2h6V0h2v2h1a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm2 4h14V4H5v4zm14 2H5v10h14V10z"/></svg>
              <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((item, idx) => (
                <LiveClassCard key={`${item.id}-${idx}`} {...item} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* AI Features List */}
      <div className="mt-12 bg-navyblue text-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">AI-Powered Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Real-time Transcription</h4>
              <p className="text-sm text-slate-600">Automatic speech-to-text with 99% accuracy</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Smart Q&A</h4>
              <p className="text-sm text-slate-600">AI-powered question answering and explanations</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Learning Analytics</h4>
              <p className="text-sm text-slate-600">Personalized insights and progress tracking</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );



}
