// src/components/TestimonialCard.jsx
import { Star, Quote, CheckCircle, Award } from "lucide-react";
import pic7 from "../assets/pic7.webp"; 

export default function TestimonialCard({ 
  quote, 
  name, 
  role = "Student", 
  rating = 5,
  verified = true,
  course = "Full Stack Development"
}) {
  return (
    <div className="card-premium p-8 group hover-lift relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <Quote size={40} className="text-blue-400" />
      </div>
      
      {/* Verified Badge */}
      {verified && (
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full">
          <CheckCircle size={12} className="text-green-400" />
          <span className="text-xs font-medium text-green-400">Verified</span>
        </div>
      )}
      
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            className={`fill-current transition-all duration-300 ${
              i < rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-400">({rating}.0)</span>
      </div>
      
      {/* Quote */}
      <blockquote className="text-lg leading-relaxed mb-8 relative z-10 text-white group-hover:text-white transition-colors duration-300">
        <span className="text-4xl text-blue-400/30 absolute -top-2 -left-2">"</span>
        {quote}
        <span className="text-4xl text-blue-400/30 absolute -bottom-4 -right-2">"</span>
      </blockquote>
      
      {/* Author Section */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-400/30 group-hover:border-blue-400/50 transition-colors duration-300">
            <img 
              src={pic7} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle size={10} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white group-hover:text-white transition-colors duration-300">
              {name}
            </h4>
            {verified && (
              <Award size={14} className="text-yellow-400" />
            )}
          </div>
          <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
            {role}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Completed: {course}
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
