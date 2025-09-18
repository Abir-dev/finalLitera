// src/components/CourseCard.jsx
import { Link } from "react-router-dom";
import { Play, Clock, Star, Users, Award } from "lucide-react";

export default function CourseCard({ 
  imgSrc, 
  title, 
  level, 
  desc, 
  id, 
  videos, 
  price, 
  duration, 
  rating = 4.8,
  students = 1250,
  instructor = "Expert Instructor"
}) {
  return (
    <div className="card-premium group hover-lift overflow-hidden relative">
      {/* Premium Image Section */}
      {imgSrc ? (
        <div className="relative overflow-hidden h-56">
          <img 
            src={imgSrc} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Level Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
              {level}
            </span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <Play size={24} className="text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Video Count */}
          {videos && videos.length > 0 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Play size={14} className="text-white" />
              <span className="text-xs text-white font-medium">{videos.length} lessons</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-56 flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
          <span className="text-6xl relative z-10">📚</span>
        </div>
      )}

      {/* Premium Content Section */}
      <div className="p-6">
        {/* Course Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--brand)' }}></div>
            <span className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>{level}</span>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 text-gray-300 line-clamp-3">
          {desc}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{duration}h</span>
            </div>
          )}
          {students && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{students.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          {price && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>₹{price}</span>
              <span className="text-xs text-gray-400 line-through">₹{Math.round(price * 1.5)}</span>
            </div>
          )}
          
          <Link to={`/courses/${id}`} className="flex-1 ml-4">
            <button className="w-full btn-premium btn-sm">
              <span>View Course</span>
              <span>→</span>
            </button>
          </Link>
        </div>

        {/* Instructor */}
        {instructor && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{instructor.charAt(0)}</span>
              </div>
              <span className="text-xs text-gray-400">by {instructor}</span>
            </div>
          </div>
        )}
      </div>

      {/* Premium Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
