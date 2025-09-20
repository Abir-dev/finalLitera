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
  instructor = "Expert Instructor",
}) {
  return (
    <div className="card-premium course-card group hover-lift overflow-hidden relative">
      {/* Premium Image Section */}
      {imgSrc ? (
        <div className="relative overflow-hidden h-40 flex-shrink-0">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Level Badge */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white">
              {level}
            </span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <Play
                size={18}
                className="text-white ml-0.5 sm:ml-1"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Video Count */}
          {videos && videos.length > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
              <Play size={12} className="text-white" />
              <span className="text-xs text-white font-medium">
                {videos.length} lessons
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-full h-40 flex items-center justify-center relative overflow-hidden flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--brand), var(--brand-strong))",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
          <span className="text-4xl sm:text-6xl relative z-10">📚</span>
        </div>
      )}

      {/* Premium Content Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Course Meta */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
              style={{ backgroundColor: "var(--brand)" }}
            ></div>
            <span
              className="text-xs sm:text-sm font-semibold"
              style={{ color: "var(--brand)" }}
            >
              {typeof level === "string" ? level : "Beginner"}
            </span>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm font-medium text-white">
                {typeof rating === "object" ? rating?.average || 4.8 : rating}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold mb-2 group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
          {typeof title === "string" ? title : "Untitled Course"}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 text-gray-300 line-clamp-3 flex-grow">
          {typeof desc === "string" && desc.trim()
            ? desc
            : "Learn comprehensive skills in this expertly designed course."}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-3 sm:gap-4 mb-3 text-xs text-gray-400 flex-wrap">
          {duration && typeof duration === "number" && duration > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{duration}h</span>
            </div>
          )}
          {students && typeof students === "number" && students > 0 && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{students.toLocaleString()}</span>
            </div>
          )}
          {(!duration || duration === 0) && (!students || students === 0) && (
            <div className="flex items-center gap-1">
              <Award size={12} />
              <span>Certificate Course</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            {price && typeof price === "number" && price > 0 ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--accent-gold)" }}
                >
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{Math.round(price * 1.5).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-green-400">Free</span>
              </div>
            )}

            <Link to={`/courses/${id}`} className="flex-1 ml-2 sm:ml-3">
              <button className="w-full btn-premium btn-sm text-xs py-2">
                <span>View Course</span>
                <span>→</span>
              </button>
            </Link>
          </div>
          {/* Instructor */}
          {instructor &&
            typeof instructor === "string" &&
            instructor.trim() && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {instructor.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 truncate">
                    by {instructor}
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Premium Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
