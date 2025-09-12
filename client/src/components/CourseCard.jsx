// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

export default function CourseCard({ imgSrc, title, level, desc, id, videos, price, duration }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105">
      {/* Image Section */}
      {imgSrc ? (
        <div className="relative overflow-hidden">
          <img 
            src={imgSrc} 
            alt={title} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-sm">
              {level}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-indigo-600">{level}</div>
          {videos && videos.length > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {videos.some(video => video.startsWith('http')) ? '🔗' : '📹'} {videos.length} video{videos.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{desc}</p>
        
        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {duration && <span>⏱️ {duration}h</span>}
          {price && <span className="font-semibold text-green-600">₹{price}</span>}
        </div>
        
        <Link to={`/courses/${id}`}>
          <button className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold px-4 py-3 hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <span className="mr-2">👁️</span>
            View Course
            <span className="ml-2">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
