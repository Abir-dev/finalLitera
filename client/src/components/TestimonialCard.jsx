// src/components/TestimonialCard.jsx

import pic7 from "../assets/pic7.webp"; 

export default function TestimonialCard({ quote, name, role }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm 
                    transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <p className="text-slate-700 leading-relaxed">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        
        <img src={pic7} alt=""  className="w-13 h-13 rounded-full" />
        <div>
          <div className="text-sm font-semibold text-slate-800">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}
