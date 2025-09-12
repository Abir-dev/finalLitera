// src/pages/SelectedCouse.jsx
import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

const brand = { blue: "#18457A", progress: "#1F4B7A", green: "#16a34a" };

export default function SelectedCourse() {
  const { id } = useParams();
  const [progress, setProgress] = useState(75);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

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
        title: "Introduction to Machine Learning",
        duration: "8 hours",
        completed: true,
        topics: ["Supervised vs Unsupervised Learning", "Data Preprocessing", "Model Evaluation"]
      },
      {
        title: "Linear Regression & Classification",
        duration: "12 hours",
        completed: true,
        topics: ["Linear Regression", "Logistic Regression", "Regularization"]
      },
      {
        title: "Decision Trees & Ensemble Methods",
        duration: "15 hours",
        completed: true,
        topics: ["Decision Trees", "Random Forest", "Gradient Boosting"]
      },
      {
        title: "Neural Networks & Deep Learning",
        duration: "20 hours",
        completed: false,
        topics: ["Perceptrons", "Backpropagation", "Convolutional Networks"]
      },
      {
        title: "Natural Language Processing",
        duration: "18 hours",
        completed: false,
        topics: ["Text Processing", "Word Embeddings", "Transformer Models"]
      },
      {
        title: "Computer Vision",
        duration: "16 hours",
        completed: false,
        topics: ["Image Processing", "CNN Architectures", "Object Detection"]
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            {/* Course Progress Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Progress</h2>
                <span className="text-3xl font-bold text-blue-600">{progress}%</span>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Started</span>
                  <span>In Progress</span>
                  <span>Completed</span>
                </div>
              </div>

              {/* Next Lesson */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Lesson</h3>
                <p className="text-blue-800 mb-4">{courseData.nextLesson}</p>
                <button
                  onClick={handleResumeCourse}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
                >
                  ▶ Continue Learning
                </button>
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
              <div className="space-y-4">
                {courseData.modules.map((module, index) => (
                  <div key={index} className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                    module.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          module.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {module.completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.duration}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {module.topics.map((topic, i) => (
                              <span key={i} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          module.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {module.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
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
            {/* Course Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src="/src/assets/Ai-pic.jpg"
                  alt="Machine Learning Course"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {progress}% Complete
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
            <div className="bg-white rounded-2xl shadow-xl p-6">
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
            <div className="bg-white rounded-2xl shadow-xl p-6">
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

            {/* Course Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold">{courseData.totalHours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Modules Completed</span>
                  <span className="font-semibold">{courseData.modules.filter(m => m.completed).length}/{courseData.modules.length}</span>
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
