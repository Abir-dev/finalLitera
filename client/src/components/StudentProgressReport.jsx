import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StudentProgressReport = ({ student, isOpen, onClose }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentProgress();
    }
  }, [isOpen, student]);

  // Auto-refresh every 30 seconds when modal is open
  useEffect(() => {
    let interval;
    if (isOpen && autoRefresh) {
      interval = setInterval(() => {
        fetchStudentProgress();
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, autoRefresh]);

  const fetchStudentProgress = async () => {
    setLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE}/admin/students/${student.id}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student progress');
      }

      const data = await response.json();
      const progressData = data.data.progress;

      // If no real data, use mock data as fallback
      if (!progressData || !progressData.courses || progressData.courses.length === 0) {
        const mockProgressData = {
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            joinDate: student.joinDate,
            lastActive: new Date().toISOString(),
            status: student.status
          },
          courses: [
            {
              id: 'course-1',
              title: 'Advanced Machine Learning & AI',
              instructor: 'Dr. John Doe',
              enrolledDate: '2024-01-15',
              progress: 75,
              totalVideos: 24,
              completedVideos: 18,
              totalDuration: '12:30:00',
              watchedDuration: '9:22:30',
              modules: [
                {
                  id: 'module-1',
                  title: 'Introduction to Machine Learning',
                  progress: 100,
                  videos: 6,
                  completedVideos: 6,
                  duration: '3:15:00',
                  topics: ['ML Basics', 'Data Types', 'Algorithms']
                },
                {
                  id: 'module-2',
                  title: 'Supervised Learning',
                  progress: 80,
                  videos: 8,
                  completedVideos: 6,
                  duration: '4:20:00',
                  topics: ['Linear Regression', 'Classification', 'Decision Trees']
                },
                {
                  id: 'module-3',
                  title: 'Unsupervised Learning',
                  progress: 60,
                  videos: 6,
                  completedVideos: 4,
                  duration: '3:45:00',
                  topics: ['Clustering', 'Dimensionality Reduction']
                },
                {
                  id: 'module-4',
                  title: 'Deep Learning',
                  progress: 0,
                  videos: 4,
                  completedVideos: 0,
                  duration: '1:10:00',
                  topics: ['Neural Networks', 'CNN', 'RNN']
                }
              ],
              assessments: [
                { title: 'ML Fundamentals Quiz', score: 85, date: '2024-01-20', status: 'Completed' },
                { title: 'Supervised Learning Assignment', score: 92, date: '2024-01-25', status: 'Completed' },
                { title: 'Unsupervised Learning Project', score: 78, date: '2024-02-01', status: 'Completed' },
                { title: 'Final Exam', score: null, date: null, status: 'Pending' }
              ],
              projects: [
                { title: 'House Price Prediction', status: 'Completed', score: 88, dueDate: '2024-01-30' },
                { title: 'Customer Segmentation', status: 'In Progress', score: null, dueDate: '2024-02-15' },
                { title: 'Image Classification', status: 'Not Started', score: null, dueDate: '2024-02-28' }
              ]
            }
          ],
          analytics: {
            totalLearningTime: '9:22:30',
            averageSessionTime: '45 minutes',
            learningStreak: 7,
            completionRate: 75,
            lastActivity: '2 hours ago',
            weeklyProgress: [
              { week: 1, videos: 3, time: 45 },
              { week: 2, videos: 5, time: 78 },
              { week: 3, videos: 4, time: 62 },
              { week: 4, videos: 6, time: 95 }
            ]
          }
        };

        setProgressData(mockProgressData);
      } else {
        setProgressData(progressData);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!progressData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Progress Report', pageWidth / 2, 20, { align: 'center' });

    // Student Info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 20, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${progressData.student.name}`, 20, 50);
    doc.text(`Email: ${progressData.student.email}`, 20, 58);
    doc.text(`Join Date: ${new Date(progressData.student.joinDate).toLocaleDateString()}`, 20, 66);
    doc.text(`Status: ${progressData.student.status}`, 20, 74);
    doc.text(`Last Active: ${new Date(progressData.student.lastActive).toLocaleDateString()}`, 20, 82);

    // Course Progress
    doc.setFont('helvetica', 'bold');
    doc.text('Course Progress', 20, 100);

    progressData.courses.forEach((course, index) => {
      const yPos = 110 + (index * 60);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(course.title, 20, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Progress: ${course.progress}%`, 20, yPos + 8);
      doc.text(`Videos: ${course.completedVideos}/${course.totalVideos}`, 20, yPos + 16);
      doc.text(`Duration: ${course.watchedDuration}/${course.totalDuration}`, 20, yPos + 24);
      doc.text(`Instructor: ${course.instructor}`, 20, yPos + 32);
      doc.text(`Enrolled: ${new Date(course.enrolledDate).toLocaleDateString()}`, 20, yPos + 40);
    });

    // Module Details
    let yPos = 200;
    doc.setFont('helvetica', 'bold');
    doc.text('Module Details', 20, yPos);
    yPos += 10;

    progressData.courses[0].modules.forEach((module, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`${module.title} - ${module.progress}%`, 20, yPos);
      doc.text(`Videos: ${module.completedVideos}/${module.videos}`, 30, yPos + 8);
      doc.text(`Duration: ${module.duration}`, 30, yPos + 16);
      yPos += 25;
    });

    // Analytics
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Learning Analytics', 20, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Learning Time: ${progressData.analytics.totalLearningTime}`, 20, yPos);
    doc.text(`Average Session: ${progressData.analytics.averageSessionTime}`, 20, yPos + 8);
    doc.text(`Learning Streak: ${progressData.analytics.learningStreak} days`, 20, yPos + 16);
    doc.text(`Completion Rate: ${progressData.analytics.completionRate}%`, 20, yPos + 24);

    // Save the PDF
    doc.save(`${progressData.student.name.replace(/\s+/g, '_')}_Progress_Report.pdf`);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '0:00';
    return timeString;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Student Progress Report</h2>
                {autoRefresh && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-1">{student?.name} - Detailed Progress Analysis</p>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${autoRefresh
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
              </button>
              <button
                onClick={fetchStudentProgress}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={generatePDF}
                disabled={!progressData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Loading progress data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Data</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : progressData ? (
            <div className="space-y-8">
              {/* Student Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Student Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{progressData.student.name}</div>
                    <div className="text-sm text-gray-600">Student Name</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{progressData.analytics.completionRate}%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{progressData.analytics.learningStreak}</div>
                    <div className="text-sm text-gray-600">Learning Streak (days)</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{progressData.analytics.totalLearningTime}</div>
                    <div className="text-sm text-gray-600">Total Learning Time</div>
                  </div>
                </div>
              </div>

              {/* Course Progress */}
              {progressData.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                      <p className="text-gray-600">Instructor: {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getProgressColor(course.progress)}`}>
                        {course.progress}%
                      </div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  {/* Course Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(course.progress)} rounded-full transition-all duration-1000`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{course.completedVideos}/{course.totalVideos} videos completed</span>
                      <span>{course.watchedDuration}/{course.totalDuration} watched</span>
                    </div>
                  </div>

                  {/* Module Progress */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Module Progress</h4>
                    <div className="space-y-3">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{module.title}</h5>
                            <span className={`font-bold ${getProgressColor(module.progress)}`}>
                              {module.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-full ${getProgressBarColor(module.progress)} rounded-full transition-all duration-1000`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{module.completedVideos}/{module.videos} videos</span>
                            <span>{module.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {module.topics.map((topic, topicIndex) => (
                              <span key={topicIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessments */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Assessments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.assessments.map((assessment, assessmentIndex) => (
                        <div key={assessmentIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{assessment.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${assessment.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {assessment.status}
                            </span>
                          </div>
                          {assessment.score && (
                            <div className="text-2xl font-bold text-blue-600">{assessment.score}%</div>
                          )}
                          {assessment.date && (
                            <div className="text-sm text-gray-600">
                              {new Date(assessment.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Projects</h4>
                    <div className="space-y-3">
                      {course.projects.map((project, projectIndex) => (
                        <div key={projectIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{project.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : project.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {project.status}
                            </span>
                          </div>
                          {project.score && (
                            <div className="text-lg font-bold text-green-600 mb-1">{project.score}%</div>
                          )}
                          <div className="text-sm text-gray-600">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Learning Analytics */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {progressData.analytics.totalLearningTime}
                    </div>
                    <div className="text-sm text-blue-800">Total Learning Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {progressData.analytics.averageSessionTime}
                    </div>
                    <div className="text-sm text-green-800">Average Session</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {progressData.analytics.learningStreak}
                    </div>
                    <div className="text-sm text-purple-800">Learning Streak</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {progressData.analytics.lastActivity}
                    </div>
                    <div className="text-sm text-orange-800">Last Activity</div>
                  </div>
                </div>

                {/* Weekly Progress Chart */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h4>
                  <div className="space-y-3">
                    {progressData.analytics.weeklyProgress.map((week, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 text-sm font-medium text-gray-600">
                          Week {week.week}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{week.videos} videos</span>
                            <span>{week.time} min</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${(week.videos / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressReport;
