// src/pages/About.jsx
import { Users, BookOpen, Award, TrendingUp, Target, Brain, BarChart3 } from "lucide-react";

export default function About() {
  const stats = [
    { number: "50K+", label: "Students Enrolled", icon: Users, color: "var(--brand)" },
    { number: "200+", label: "Expert Instructors", icon: BookOpen, color: "var(--accent-rose)" },
    { number: "500+", label: "Courses Available", icon: Award, color: "var(--accent-gold)" },
    { number: "95%", label: "Success Rate", icon: TrendingUp, color: "var(--brand-strong)" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(1000px 600px at 30% 20%, rgba(79,140,255,0.15), transparent 60%)' }}></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="reveal">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Empowering Learners
              <span style={{ color: 'var(--brand)' }}> Worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              We're on a mission to make premium education accessible to everyone. 
              Through innovative <span style={{ color: 'var(--brand)' }}>AI-powered technology</span> and expert-led courses, we help learners 
              achieve their dreams and advance their careers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="card-premium p-8 text-center group hover:scale-105 transition-all duration-300">
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                    border: `1px solid ${stat.color}30`
                  }}
                >
                  <stat.icon size={32} style={{ color: stat.color }} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {stat.number}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
                  <Target size={24} style={{ color: 'var(--brand)' }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                To democratize premium education by providing world-class learning experiences 
                that are accessible, affordable, and effective for learners of all backgrounds.
              </p>
              <div className="space-y-6">
                <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)', border: '1px solid var(--accent-gold)30' }}>
                      <Target size={20} style={{ color: 'var(--accent-gold)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Personalized Learning</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tailored learning paths designed for individual needs and learning styles</p>
                    </div>
                  </div>
                </div>
                <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
                      <Brain size={20} style={{ color: 'var(--brand)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>AI-Powered Technology</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Advanced artificial intelligence for adaptive learning and content delivery</p>
                    </div>
                  </div>
                </div>
                <div className="card-premium p-6 group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)', border: '1px solid var(--accent-rose)30' }}>
                      <BarChart3 size={20} style={{ color: 'var(--accent-rose)' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Real-time Analytics</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comprehensive progress tracking and performance analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative reveal">
              <div className="card-premium p-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)', border: '1px solid var(--brand)30' }}>
                    <Brain size={40} style={{ color: 'var(--brand)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Learning</h3>
                  <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Our platform uses cutting-edge artificial intelligence to provide personalized learning experiences, 
                    adaptive content delivery, and intelligent progress tracking.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-premium p-4 text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)' }}>
                        <Brain size={16} style={{ color: 'var(--brand)' }} />
                      </div>
                      <div className="text-sm font-semibold">Smart Analytics</div>
                    </div>
                    <div className="card-premium p-4 text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)' }}>
                        <Target size={16} style={{ color: 'var(--accent-gold)' }} />
                      </div>
                      <div className="text-sm font-semibold">Adaptive Learning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
