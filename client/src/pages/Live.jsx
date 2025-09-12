// src/pages/LiveClasses.jsx
import { useMemo, useState, useEffect } from "react";
import axios from "axios";

const styles = {
  brandBlue: "#18457A",
  liveRed: "#D14343",
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
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
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
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch live classes from API
  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        const response = await axios.get(`${API_BASE}/courses?liveClasses=true`);
        
        // Transform courses to match our component structure
        const transformedCourses = response.data.data.courses.map(course => ({
          id: course._id,
          title: course.title,
          instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor',
          viewers: Math.floor(Math.random() * 5000) + 100, // Random viewer count for demo
          thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
          meetLink: course.schedule?.liveSessions?.[0]?.meetingLink || "",
          isLive: true, // All courses with live sessions are considered live
          startTime: new Date(course.schedule?.liveSessions?.[0]?.date || Date.now()).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          duration: `${course.schedule?.liveSessions?.[0]?.duration || course.duration || 60} minutes`
        }));

        setCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching live classes:', error);
        setError('Failed to load live classes');
        // Fallback to sample data if API fails
        setCourses([
          {
            id: 1,
            title: "Advanced React Development",
            instructor: "Dr. Sarah Johnson",
            viewers: "1.8K",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
            meetLink: "https://meet.google.com/abc-defg-hij",
            isLive: true,
            startTime: "10:00 AM",
            duration: "2 hours"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, []);

  const liveClasses = courses.filter(item => item.isLive);
  const upcomingClasses = courses.filter(item => !item.isLive);

    return (
    <>
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: styles.brandBlue }}>
          Live Classes
        </h1>

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

        {/* Upcoming Classes Section */}
        {upcomingClasses.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Upcoming Classes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((item) => (
                <LiveClassCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* AI Features List */}
      <div className="mt-12 bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">AI-Powered Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
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
