// src/components/StatCard.jsx
import { Play, Clock, FileText, Award, Users, Star, Zap, Shield } from "lucide-react";

export default function StatCard() {
  const stats = [
    {
      icon: Play,
      title: "Live Sessions",
      desc: "Interactive expert-led classes",
      value: "500+",
      color: "var(--brand)",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Active Students",
      desc: "Join our growing community",
      value: "10K+",
      color: "var(--accent-rose)",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: FileText,
      title: "Premium Resources",
      desc: "Industry-grade study materials",
      value: "1M+",
      color: "var(--accent-gold)",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Award,
      title: "Certified Courses",
      desc: "Industry-recognized programs",
      value: "50+",
      color: "var(--brand-strong)",
      gradient: "from-indigo-500 to-purple-600"
    },
  ];

  return (
    <section className="container-premium py-20 relative overflow-hidden ">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div> */}
      {/* <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse-float"></div> */}
      {/* <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse-float animation-delay-2000"></div>
       */}
      <div className="relative z-10 ">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-white">Premium Features</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">LITERA</span>?
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed">
            Experience premium education with industry-leading features designed to accelerate your learning journey
          </p>
        </div>
        
        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-premium p-8 text-center hover-lift relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div 
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                      border: `1px solid ${item.color}30`
                    }}
                  >
                    {/* Icon Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: `radial-gradient(circle, ${item.color}30, transparent 70%)`
                      }}
                    ></div>
                    
                    <item.icon 
                      size={36} 
                      style={{ color: item.color }}
                      className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Floating Value */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">{item.value}</span>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {item.desc}
                </p>

                {/* Hover Effect Line */}
                <div 
                  className="absolute bottom-0 left-1/2 w-0 h-1 rounded-full transition-all duration-300 group-hover:w-16 group-hover:left-1/2 group-hover:-translate-x-1/2"
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield size={16} className="text-green-400" />
              <span>Trusted by 10,000+ professionals</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap size={16} className="text-yellow-400" />
              <span>99.9% uptime guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
