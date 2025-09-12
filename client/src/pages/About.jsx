// src/pages/About.jsx
export default function About() {
  const stats = [
    { number: "50K+", label: "Students Enrolled", icon: "🎓", color: "from-blue-500 to-cyan-500" },
    { number: "200+", label: "Expert Instructors", icon: "👨‍🏫", color: "from-purple-500 to-pink-500" },
    { number: "500+", label: "Courses Available", icon: "📚", color: "from-green-500 to-emerald-500" },
    { number: "95%", label: "Success Rate", icon: "🏆", color: "from-orange-500 to-red-500" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Former Google engineer with 10+ years in edtech",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "PhD in Computer Science from Stanford",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Full-stack developer with 8+ years experience",
      gradient: "from-green-400 to-emerald-400"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-10">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce">🤖</div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                Empowering Learners
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                  {" "}Worldwide
                </span>
              </h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make quality education accessible to everyone. 
              Through innovative <span className="font-semibold text-indigo-600">AI-powered technology</span> and expert-led courses, we help learners 
              achieve their dreams and advance their careers.
            </p>
          </div>
        </div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 animate-spin"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-25 animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-3xl animate-pulse`}>
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-15 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🎯</div>
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4A8B] to-indigo-600">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                To democratize education by providing world-class learning experiences 
                that are accessible, affordable, and effective for learners of all backgrounds.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Personalized learning paths tailored to individual needs</p>
                </div>
                <div className="flex items-start space-x-3 group hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-slate-600">AI-powered adaptive learning technology</p>
                </div>
                <div className="flex items-start space-x-3 group hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Real-time progress tracking and analytics</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">🚀</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">AI-Powered Learning</h3>
                  <p className="text-slate-600 mb-6">
                    Our platform uses cutting-edge artificial intelligence to provide personalized learning experiences, 
                    adaptive content delivery, and intelligent progress tracking.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🧠</div>
                      <div className="text-sm font-semibold text-slate-700">Smart Analytics</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm font-semibold text-slate-700">Adaptive Learning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4 animate-bounce">👥</div>
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4A8B] to-indigo-600 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-slate-600">
              Expert educators and technologists dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className={`bg-gradient-to-br ${member.gradient} rounded-2xl p-8 text-center shadow-lg`}>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-white/90 mb-4 font-medium">{member.role}</p>
                  <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
