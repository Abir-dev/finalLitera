import { useState, useEffect, useMemo } from 'react';

const CourseProgressTracker = ({ 
  modules, 
  onProgressUpdate, 
  courseId,
  showDetailed = true 
}) => {
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Calculate overall course progress
  const courseProgress = useMemo(() => {
    if (!modules || modules.length === 0) return 0;

    const totalVideos = modules.reduce((total, module) => total + module.videos.length, 0);
    if (totalVideos === 0) return 0;

    const completedVideos = modules.reduce((total, module) => {
      return total + module.videos.filter(video => {
        const progress = localStorage.getItem(`video-progress-${video.id}`);
        const duration = localStorage.getItem(`video-duration-${video.id}`);
        if (progress && duration) {
          return (parseFloat(progress) / parseFloat(duration)) >= 0.95;
        }
        return false;
      }).length;
    }, 0);

    return Math.round((completedVideos / totalVideos) * 100);
  }, [modules, progressData]);

  // Calculate module-level progress
  const moduleProgress = useMemo(() => {
    return modules.map(module => {
      const totalVideos = module.videos.length;
      if (totalVideos === 0) return { ...module, progress: 0, completedVideos: 0 };

      const completedVideos = module.videos.filter(video => {
        const progress = localStorage.getItem(`video-progress-${video.id}`);
        const duration = localStorage.getItem(`video-duration-${video.id}`);
        if (progress && duration) {
          return (parseFloat(progress) / parseFloat(duration)) >= 0.95;
        }
        return false;
      }).length;

      const progress = Math.round((completedVideos / totalVideos) * 100);
      return {
        ...module,
        progress,
        completedVideos,
        totalVideos
      };
    });
  }, [modules, progressData]);

  // Calculate time-based progress
  const timeProgress = useMemo(() => {
    const totalDuration = modules.reduce((total, module) => {
      return total + module.videos.reduce((moduleTotal, video) => {
        const duration = video.duration ? parseFloat(video.duration.split(':')[0]) * 60 + parseFloat(video.duration.split(':')[1]) : 0;
        return moduleTotal + duration;
      }, 0);
    }, 0);

    const watchedDuration = modules.reduce((total, module) => {
      return total + module.videos.reduce((moduleTotal, video) => {
        const progress = localStorage.getItem(`video-progress-${video.id}`);
        return moduleTotal + (progress ? parseFloat(progress) : 0);
      }, 0);
    }, 0);

    return totalDuration > 0 ? Math.round((watchedDuration / totalDuration) * 100) : 0;
  }, [modules, progressData]);

  // Load progress data on component mount
  useEffect(() => {
    const loadProgressData = () => {
      setIsLoading(true);
      // Simulate loading progress data
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    loadProgressData();
  }, [courseId]);

  // Update progress when videos are watched
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate({
        courseProgress,
        moduleProgress,
        timeProgress,
        totalVideos: modules.reduce((total, module) => total + module.videos.length, 0),
        completedVideos: modules.reduce((total, module) => {
          return total + module.videos.filter(video => {
            const progress = localStorage.getItem(`video-progress-${video.id}`);
            const duration = localStorage.getItem(`video-duration-${video.id}`);
            if (progress && duration) {
              return (parseFloat(progress) / parseFloat(duration)) >= 0.95;
            }
            return false;
          }).length;
        }, 0)
      });
    }
  }, [courseProgress, moduleProgress, timeProgress, modules, onProgressUpdate]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className=" rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Course Progress */}
      <div className=" rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Progress</h2>
          <div className={`text-3xl font-bold ${getProgressTextColor(courseProgress)}`}>
            {courseProgress}%
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(courseProgress)} rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${courseProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Started</span>
            <span>In Progress</span>
            <span>Completed</span>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-blue-500 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {modules.reduce((total, module) => total + module.videos.length, 0)}
            </div>
            <div className="text-sm text-blue-600">Total Videos</div>
          </div>
          <div className="text-center p-4 border border-green-500 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {modules.reduce((total, module) => {
                return total + module.videos.filter(video => {
                  const progress = localStorage.getItem(`video-progress-${video.id}`);
                  const duration = localStorage.getItem(`video-duration-${video.id}`);
                  if (progress && duration) {
                    return (parseFloat(progress) / parseFloat(duration)) >= 0.95;
                  }
                  return false;
                }).length;
              }, 0)}
            </div>
            <div className="text-sm text-green-600">Completed Videos</div>
          </div>
          <div className="text-center p-4 border border-purple-500 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(timeProgress)}%
            </div>
            <div className="text-sm text-purple-600">Time Watched</div>
          </div>
        </div>
      </div>

      {/* Detailed Module Progress */}
      {showDetailed && (
        <div className="rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Module Progress</h3>
          <div className="space-y-4">
            {moduleProgress.map((module, index) => (
              <div key={module.id || index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      module.progress === 100 
                        ? 'bg-green-500 text-white' 
                        : module.progress > 0
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {module.progress === 100 ? '✓' : index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-600">
                        {module.completedVideos}/{module.totalVideos} videos completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getProgressTextColor(module.progress)}`}>
                      {module.progress}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.duration}
                    </div>
                  </div>
                </div>

                {/* Module Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(module.progress)} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>

                {/* Module Topics */}
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Streak */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Learning Streak</h3>
            <p className="text-blue-100">Keep the momentum going!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">7</div>
            <div className="text-sm text-blue-200">days</div>
          </div>
        </div>
        <div className="mt-4 flex space-x-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">🔥</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-3">
          {moduleProgress
            .filter(module => module.progress < 100)
            .slice(0, 3)
            .map((module, index) => (
              <div key={module.id || index} className="flex items-center space-x-3 p-3 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{module.title}</p>
                  <p className="text-sm text-gray-600">
                    {module.completedVideos}/{module.totalVideos} videos completed
                  </p>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {100 - module.progress}% remaining
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressTracker;
