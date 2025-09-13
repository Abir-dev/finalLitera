import { useState, useEffect } from 'react';

const ProgressAnalytics = ({ courseProgressData, modules }) => {
  const [analytics, setAnalytics] = useState({
    weeklyProgress: [],
    learningStreak: 0,
    averageSessionTime: 0,
    mostWatchedModule: null,
    completionRate: 0
  });

  useEffect(() => {
    // Calculate analytics from progress data
    const calculateAnalytics = () => {
      // Simulate weekly progress data
      const weeklyProgress = [
        { week: 1, videos: 3, time: 45 },
        { week: 2, videos: 5, time: 78 },
        { week: 3, videos: 4, time: 62 },
        { week: 4, videos: 6, time: 95 },
        { week: 5, videos: 2, time: 34 },
        { week: 6, videos: 1, time: 18 }
      ];

      // Find most watched module
      const mostWatchedModule = modules.reduce((max, module) => {
        const moduleProgress = module.videos.filter(video => {
          const progress = localStorage.getItem(`video-progress-${video.id}`);
          const duration = localStorage.getItem(`video-duration-${video.id}`);
          if (progress && duration) {
            return (parseFloat(progress) / parseFloat(duration)) >= 0.95;
          }
          return false;
        }).length;
        
        return moduleProgress > max.completed ? { ...module, completed: moduleProgress } : max;
      }, { completed: 0 });

      setAnalytics({
        weeklyProgress,
        learningStreak: 7, // Simulated streak
        averageSessionTime: 45, // minutes
        mostWatchedModule: mostWatchedModule.completed > 0 ? mostWatchedModule : null,
        completionRate: courseProgressData.courseProgress || 0
      });
    };

    calculateAnalytics();
  }, [courseProgressData, modules]);

  const getMotivationalMessage = () => {
    const progress = courseProgressData.courseProgress || 0;
    if (progress >= 90) return "🎉 Amazing! You're almost done!";
    if (progress >= 70) return "🚀 Great progress! Keep it up!";
    if (progress >= 50) return "💪 You're halfway there!";
    if (progress >= 25) return "🌟 Good start! Keep learning!";
    return "🎯 Ready to start your learning journey?";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Analytics</h3>
      
      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
        <p className="text-center text-lg font-semibold text-gray-800">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Learning Streak</h4>
              <p className="text-2xl font-bold text-orange-600">{analytics.learningStreak} days</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
          <div className="mt-3 flex space-x-1">
            {[...Array(Math.min(analytics.learningStreak, 7))].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-orange-400 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Average Session Time */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Avg Session</h4>
              <p className="text-2xl font-bold text-green-600">{analytics.averageSessionTime} min</p>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>
        </div>

        {/* Most Watched Module */}
        {analytics.mostWatchedModule && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Favorite Module</h4>
                <p className="text-sm text-purple-600 line-clamp-2">
                  {analytics.mostWatchedModule.title}
                </p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
        )}

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Completion Rate</h4>
              <p className="text-2xl font-bold text-blue-600">{analytics.completionRate}%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Weekly Progress</h4>
        <div className="space-y-3">
          {analytics.weeklyProgress.map((week, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">
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

      {/* Learning Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Learning Tip</h4>
        <p className="text-sm text-yellow-700">
          {analytics.completionRate < 30 
            ? "Try to watch at least one video per day to build a consistent learning habit."
            : analytics.completionRate < 70
            ? "Great progress! Consider taking notes while watching to improve retention."
            : "Excellent work! Review completed modules to reinforce your learning."
          }
        </p>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
