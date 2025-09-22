// src/pages/SelectedCouse.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import VideoPlaylist from "../components/VideoPlaylist.jsx";
import CourseProgressTracker from "../components/CourseProgressTracker.jsx";
import ProgressAnalytics from "../components/ProgressAnalytics.jsx";

const brand = { blue: "#18457A", progress: "#1F4B7A", green: "#16a34a" };

export default function SelectedCourse() {
  const { id } = useParams();
  const [progress, setProgress] = useState(75);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [courseProgressData, setCourseProgressData] = useState({
    courseProgress: 0,
    moduleProgress: [],
    timeProgress: 0,
    totalVideos: 0,
    completedVideos: 0
  });

  // Enhanced course data for Machine Learning
  const courseData = useMemo(() => ({
    title: "Advanced Machine Learning & AI",
    instructor: "Dr. John Doe",
    institution: "IIT Kharagpur",
    duration: "16 weeks",
    level: "Advanced",
    totalHours: "120 hours",
    rating: 4.8,
    students: 1247,
    lastAccessed: "2 days ago",
    nextLesson: "Neural Network Architectures - Part 3",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Machine Learning",
        duration: "8 hours",
        completed: true,
        topics: ["Supervised vs Unsupervised Learning", "Data Preprocessing", "Model Evaluation"],
        videos: [
          {
            id: "video-1-1",
            title: "What is Machine Learning?",
            description: "Introduction to the fundamentals of machine learning and its applications",
            duration: "15:30",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses1.jpg"
          },
          {
            id: "video-1-2",
            title: "Types of Machine Learning",
            description: "Understanding supervised, unsupervised, and reinforcement learning",
            duration: "18:45",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses2.jpg"
          },
          {
            id: "video-1-3",
            title: "Data Preprocessing Techniques",
            description: "Hands-on tutorial on cleaning and preparing data for ML models",
            duration: "22:15",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses3.jpg"
          }
        ]
      },
      {
        id: "module-2",
        title: "Linear Regression & Classification",
        duration: "12 hours",
        completed: true,
        topics: ["Linear Regression", "Logistic Regression", "Regularization"],
        videos: [
          {
            id: "video-2-1",
            title: "Linear Regression Fundamentals",
            description: "Understanding the mathematical foundation of linear regression",
            duration: "20:10",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses4.jpg"
          },
          {
            id: "video-2-2",
            title: "Implementing Linear Regression",
            description: "Step-by-step implementation using Python and scikit-learn",
            duration: "25:30",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses5.jpg"
          },
          {
            id: "video-2-3",
            title: "Logistic Regression Explained",
            description: "Understanding classification problems and logistic regression",
            duration: "18:20",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses1.jpg"
          },
          {
            id: "video-2-4",
            title: "Regularization Techniques",
            description: "L1, L2 regularization and their impact on model performance",
            duration: "16:45",
            type: "demo",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses2.jpg"
          }
        ]
      },
      {
        id: "module-3",
        title: "Decision Trees & Ensemble Methods",
        duration: "15 hours",
        completed: true,
        topics: ["Decision Trees", "Random Forest", "Gradient Boosting"],
        videos: [
          {
            id: "video-3-1",
            title: "Decision Trees Algorithm",
            description: "Understanding how decision trees make predictions",
            duration: "19:30",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses3.jpg"
          },
          {
            id: "video-3-2",
            title: "Building Decision Trees in Python",
            description: "Practical implementation of decision trees",
            duration: "24:15",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses4.jpg"
          },
          {
            id: "video-3-3",
            title: "Random Forest Ensemble",
            description: "Understanding ensemble methods and random forests",
            duration: "21:40",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses5.jpg"
          },
          {
            id: "video-3-4",
            title: "Gradient Boosting Deep Dive",
            description: "Advanced ensemble techniques with gradient boosting",
            duration: "28:20",
            type: "demo",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses1.jpg"
          }
        ]
      },
      {
        id: "module-4",
        title: "Neural Networks & Deep Learning",
        duration: "20 hours",
        completed: false,
        topics: ["Perceptrons", "Backpropagation", "Convolutional Networks"],
        videos: [
          {
            id: "video-4-1",
            title: "Introduction to Neural Networks",
            description: "Understanding the basic building blocks of neural networks",
            duration: "23:15",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses2.jpg"
          },
          {
            id: "video-4-2",
            title: "Perceptrons and Activation Functions",
            description: "Deep dive into perceptrons and different activation functions",
            duration: "26:30",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses3.jpg"
          },
          {
            id: "video-4-3",
            title: "Backpropagation Algorithm",
            description: "Understanding how neural networks learn through backpropagation",
            duration: "31:45",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses4.jpg"
          },
          {
            id: "video-4-4",
            title: "Convolutional Neural Networks",
            description: "Introduction to CNNs for image processing",
            duration: "29:20",
            type: "demo",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses5.jpg"
          },
          {
            id: "video-4-5",
            title: "Building Your First CNN",
            description: "Hands-on tutorial on implementing CNNs with TensorFlow",
            duration: "35:10",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses1.jpg"
          }
        ]
      },
      {
        id: "module-5",
        title: "Natural Language Processing",
        duration: "18 hours",
        completed: false,
        topics: ["Text Processing", "Word Embeddings", "Transformer Models"],
        videos: [
          {
            id: "video-5-1",
            title: "Text Preprocessing Techniques",
            description: "Tokenization, stemming, and text cleaning methods",
            duration: "20:25",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses2.jpg"
          },
          {
            id: "video-5-2",
            title: "Word Embeddings and Word2Vec",
            description: "Understanding vector representations of words",
            duration: "24:40",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses3.jpg"
          },
          {
            id: "video-5-3",
            title: "Transformer Architecture",
            description: "Introduction to transformer models and attention mechanisms",
            duration: "32:15",
            type: "demo",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses4.jpg"
          }
        ]
      },
      {
        id: "module-6",
        title: "Computer Vision",
        duration: "16 hours",
        completed: false,
        topics: ["Image Processing", "CNN Architectures", "Object Detection"],
        videos: [
          {
            id: "video-6-1",
            title: "Image Processing Fundamentals",
            description: "Basic image processing techniques and filters",
            duration: "22:30",
            type: "tutorial",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            thumbnail: "/src/assets/courses5.jpg"
          },
          {
            id: "video-6-2",
            title: "Advanced CNN Architectures",
            description: "ResNet, VGG, and other modern CNN architectures",
            duration: "28:45",
            type: "lecture",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            thumbnail: "/src/assets/courses1.jpg"
          },
          {
            id: "video-6-3",
            title: "Object Detection with YOLO",
            description: "Implementing real-time object detection",
            duration: "33:20",
            type: "demo",
            url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            thumbnail: "/src/assets/courses2.jpg"
          }
        ]
      }
    ],
    projects: [
      {
        title: "Turning Data into Decisions",
        description: "Build a recommendation system for e-commerce",
        status: "Completed",
        grade: "A+"
      },
      {
        title: "From Raw Data to Executive Stories",
        description: "Create interactive dashboards with Tableau",
        status: "Completed",
        grade: "A"
      },
      {
        title: "Design Beyond Charts",
        description: "Advanced data visualization techniques",
        status: "In Progress",
        grade: "Pending"
      },
      {
        title: "The Art and Science of Dashboards",
        description: "Build comprehensive business intelligence solutions",
        status: "Not Started",
        grade: "Pending"
      }
    ],
    assessments: [
      { week: 1, score: 92, status: "Completed" },
      { week: 2, score: 88, status: "Completed" },
      { week: 3, score: 95, status: "Completed" },
      { week: 4, score: 90, status: "Completed" },
      { week: 5, score: 87, status: "Completed" },
      { week: 6, score: 0, status: "Pending" }
    ]
  }), []);

  const handleDownloadCertificate = () => {
    if (progress < 100) {
      alert("Complete the course to download your certificate!");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setTimeout(() => {
            alert("Certificate downloaded successfully! 🎉");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleResumeCourse = () => {
    const nextModule = courseData.modules.find(m => !m.completed);
    if (nextModule) {
      alert(`Resuming course: ${nextModule.title}`);
    } else {
      alert("Congratulations! You've completed all modules!");
    }
  };

  const handleAssessmentClick = (week) => {
    const assessment = courseData.assessments.find(a => a.week === week);
    if (assessment.status === "Completed") {
      alert(`Week ${week} Assessment - Score: ${assessment.score}%`);
    } else {
      alert(`Week ${week} Assessment - Not yet available`);
    }
  };

  const handleVideoComplete = (videoId) => {
    // Mark video as completed and update progress
    console.log(`Video ${videoId} completed!`);
    // Here you would typically update the backend with video completion
    // For now, we'll just show a success message
    alert(`Great job! You've completed the video.`);
  };

  const handleVideoProgressUpdate = (videoId, currentTime, duration) => {
    // Save video progress to localStorage
    localStorage.setItem(`video-progress-${videoId}`, currentTime.toString());
    localStorage.setItem(`video-duration-${videoId}`, duration.toString());
    
    // Update overall course progress based on video completion
    const totalVideos = courseData.modules.reduce((total, module) => total + module.videos.length, 0);
    const completedVideos = courseData.modules.reduce((total, module) => {
      return total + module.videos.filter(video => {
        const progress = localStorage.getItem(`video-progress-${video.id}`);
        const videoDuration = localStorage.getItem(`video-duration-${video.id}`);
        if (progress && videoDuration) {
          return (parseFloat(progress) / parseFloat(videoDuration)) >= 0.95;
        }
        return false;
      }).length;
    }, 0);
    
    const newProgress = Math.round((completedVideos / totalVideos) * 100);
    setProgress(newProgress);
  };

  const handleCourseProgressUpdate = (progressData) => {
    setCourseProgressData(progressData);
    setProgress(progressData.courseProgress);
  };

  // Initialize progress on component mount
  useEffect(() => {
    const initializeProgress = () => {
      const totalVideos = courseData.modules.reduce((total, module) => total + module.videos.length, 0);
      const completedVideos = courseData.modules.reduce((total, module) => {
        return total + module.videos.filter(video => {
          const progress = localStorage.getItem(`video-progress-${video.id}`);
          const videoDuration = localStorage.getItem(`video-duration-${video.id}`);
          if (progress && videoDuration) {
            return (parseFloat(progress) / parseFloat(videoDuration)) >= 0.95;
          }
          return false;
        }).length;
      }, 0);
      
      const initialProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
      setProgress(initialProgress);
    };

    initializeProgress();
  }, [courseData.modules]);

  return (
    <div className="min-h-screen  ">
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: brand.blue }}>
              {courseData.title}
            </h1>
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>👨‍🏫 {courseData.instructor} • {courseData.institution}</span>
            <span>⏱️ {courseData.duration}</span>
            <span>📊 {courseData.level} Level</span>
            <span>⭐ {courseData.rating}/5 ({courseData.students} students)</span>
            <span>🕒 Last accessed: {courseData.lastAccessed}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Course Content */}
          <div className="space-y-8">
            {/* Comprehensive Course Progress Tracker */}
            <CourseProgressTracker 
              modules={courseData.modules}
              onProgressUpdate={handleCourseProgressUpdate}
              courseId={id}
              showDetailed={true}
            />

            {/* Quick Actions */}
            <div className=" rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleResumeCourse}
                  className="p-4 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Continue Learning</h4>
                      <p className="text-sm text-gray-600">{courseData.nextLesson}</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-4  border border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">View Progress</h4>
                      <p className="text-sm text-gray-600">See detailed progress above</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Video Playlist */}
            <VideoPlaylist 
              modules={courseData.modules}
              onVideoComplete={handleVideoComplete}
              onProgressUpdate={handleVideoProgressUpdate}
            />

            {/* Projects Section */}
            <div className=" rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hands-on Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courseData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    {project.grade !== 'Pending' && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">Grade: {project.grade}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Course Image with Progress */}
            <div className=" rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src="/src/assets/Ai-pic.jpg"
                  alt="Machine Learning Course"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {courseProgressData.courseProgress || progress}% Complete
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="text-white">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{courseProgressData.completedVideos || 0}/{courseProgressData.totalVideos || 0} videos</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${courseProgressData.courseProgress || progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Machine Learning</h3>
                <p className="text-gray-600 mb-4">Dive deep into machine learning algorithms and AI applications</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>👨‍🏫 By {courseData.instructor}</span>
                </div>
              </div>
            </div>

            {/* Weekly Assessments */}
            <div className=" rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Assessments</h3>
              <div className="space-y-3">
                {courseData.assessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Week {assessment.week}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        assessment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {assessment.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {assessment.status === 'Completed' && (
                        <span className="text-sm font-semibold text-green-600">{assessment.score}%</span>
                      )}
                      <button
                        onClick={() => handleAssessmentClick(assessment.week)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          assessment.status === 'Completed' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-600'
                        } transition-colors`}
                      >
                        {assessment.status === 'Completed' ? 'View' : 'Locked'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Section */}
            <div className=" rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Certificate</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {progress >= 100 
                    ? "Congratulations! You've earned your certificate!" 
                    : `Complete ${100 - progress}% more to earn your certificate`
                  }
                </p>
                
                {progress >= 100 ? (
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={isDownloading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Downloading... {downloadProgress}%
                      </span>
                    ) : (
                      "📜 Download Certificate"
                    )}
                  </button>
                ) : (
                  <div className="w-full px-6 py-3 bg-gray-300 text-gray-600 rounded-full font-semibold cursor-not-allowed">
                    🔒 Complete Course First
                  </div>
                )}
              </div>
            </div>

            {/* Progress Analytics */}
            <ProgressAnalytics 
              courseProgressData={courseProgressData}
              modules={courseData.modules}
            />

            {/* Enhanced Course Stats */}
            <div className=" rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-semibold text-blue-600">{courseProgressData.courseProgress || progress}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Videos Watched</span>
                  <span className="font-semibold">{courseProgressData.completedVideos || 0}/{courseProgressData.totalVideos || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Progress</span>
                  <span className="font-semibold text-green-600">{courseProgressData.timeProgress || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold">{courseData.totalHours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Modules Completed</span>
                  <span className="font-semibold">
                    {courseProgressData.moduleProgress?.filter(m => m.progress === 100).length || 0}/{courseData.modules.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects Done</span>
                  <span className="font-semibold">{courseData.projects.filter(p => p.status === 'Completed').length}/{courseData.projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(courseData.assessments.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.score, 0) / courseData.assessments.filter(a => a.status === 'Completed').length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
