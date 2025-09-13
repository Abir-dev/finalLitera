import { useState } from 'react';
import VideoPlayer from './VideoPlayer.jsx';
import '../styles/video-player.css';

const VideoPlaylist = ({ modules, onVideoComplete, onProgressUpdate }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  const handleVideoClick = (video, module) => {
    setSelectedVideo({
      ...video,
      moduleTitle: module.title,
      moduleId: module.id
    });
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  const handleVideoEnd = (videoId) => {
    // Mark video as completed
    if (onVideoComplete) {
      onVideoComplete(videoId);
    }
  };

  const getVideoProgress = (videoId) => {
    const savedProgress = localStorage.getItem(`video-progress-${videoId}`);
    const savedDuration = localStorage.getItem(`video-duration-${videoId}`);
    
    if (savedProgress && savedDuration) {
      return (parseFloat(savedProgress) / parseFloat(savedDuration)) * 100;
    }
    return 0;
  };

  const isVideoCompleted = (videoId) => {
    const progress = getVideoProgress(videoId);
    return progress >= 95; // Consider 95% as completed
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Videos</h2>
          <div className="text-sm text-gray-600">
            {modules.reduce((total, module) => total + module.videos.length, 0)} videos
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id || moduleIndex} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Module Header */}
              <div 
                className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleModule(module.id || moduleIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      module.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {module.completed ? '✓' : moduleIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">
                        {module.videos.length} videos • {module.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Module Progress */}
                    <div className="text-sm text-gray-600">
                      {module.videos.filter(video => isVideoCompleted(video.id)).length}/{module.videos.length} completed
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedModule === (module.id || moduleIndex) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Module Videos */}
              {expandedModule === (module.id || moduleIndex) && (
                <div className="p-4 bg-white">
                  <div className="space-y-3">
                    {module.videos.map((video, videoIndex) => {
                      const progress = getVideoProgress(video.id);
                      const isCompleted = isVideoCompleted(video.id);
                      
                      return (
                        <div 
                          key={video.id || videoIndex}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            isCompleted 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                          onClick={() => handleVideoClick(video, module)}
                        >
                          <div className="flex items-center space-x-4">
                            {/* Video Thumbnail/Icon */}
                            <div className="relative">
                              {video.thumbnail ? (
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title}
                                  className="w-20 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              )}
                              
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              {progress > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b">
                                  <div 
                                    className="h-full bg-blue-500 rounded-b"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Video Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    {video.duration && (
                                      <span>⏱️ {video.duration}</span>
                                    )}
                                    {video.type && (
                                      <span className={`px-2 py-1 rounded-full ${
                                        video.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                                        video.type === 'tutorial' ? 'bg-green-100 text-green-800' :
                                        video.type === 'demo' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {video.type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {/* Completion Status */}
                                  {isCompleted ? (
                                    <div className="flex items-center space-x-1 text-green-600">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                      </svg>
                                      <span className="text-sm font-medium">Completed</span>
                                    </div>
                                  ) : progress > 0 ? (
                                    <div className="text-sm text-blue-600">
                                      {Math.round(progress)}% watched
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      Not started
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={handleClosePlayer}
          onVideoEnd={handleVideoEnd}
          onProgressUpdate={onProgressUpdate}
          autoPlay={true}
        />
      )}
    </div>
  );
};

export default VideoPlaylist;
