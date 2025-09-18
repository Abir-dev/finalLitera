// src/pages/Faq.jsx
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Users, CreditCard, Award, Smartphone, Clock, Shield, BookOpen } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamic FAQ generation with premium content
  const generateDynamicFaqs = () => {
    const baseFaqs = [
      {
        question: "How do I enroll in a premium course?",
        answer: "Enrolling in our premium courses is seamless! Browse our curated course catalog, select your desired program, and click 'Enroll Now'. You'll be guided through our secure payment process and gain immediate access to all course materials, live sessions, and premium support.",
        icon: HelpCircle,
        category: "Enrollment",
        priority: 1
      },
      {
        question: "What makes LITERA's live classes special?",
        answer: "Our live classes feature industry experts with 10+ years of experience. Each session includes real-time Q&A, hands-on coding, and personalized feedback. We maintain small class sizes (max 25 students) to ensure individual attention and optimal learning outcomes.",
        icon: Users,
        category: "Learning",
        priority: 1
      },
      {
        question: "What is your premium refund policy?",
        answer: "We offer a comprehensive 30-day money-back guarantee on all premium courses. If you're not completely satisfied with your learning experience, contact our dedicated support team within 30 days for a full refund, no questions asked.",
        icon: CreditCard,
        category: "Payment",
        priority: 1
      },
      {
        question: "Are your courses suitable for complete beginners?",
        answer: "Absolutely! Our courses are designed with progressive learning paths. We provide prerequisite materials, beginner-friendly explanations, and step-by-step guidance. Many students start with zero experience and successfully transition into tech careers.",
        icon: BookOpen,
        category: "Learning",
        priority: 2
      },
      {
        question: "What certifications do I receive upon completion?",
        answer: "You'll receive industry-recognized certificates of completion for every course. Our certificates are verified by industry professionals and can be shared on LinkedIn, included in your resume, and used for career advancement opportunities.",
        icon: Award,
        category: "Learning",
        priority: 2
      },
      {
        question: "Can I access courses on mobile devices?",
        answer: "Yes! Our premium platform is fully responsive and optimized for all devices. Access your courses seamlessly on smartphones, tablets, and desktop computers with our mobile-first design and offline capabilities.",
        icon: Smartphone,
        category: "Support",
        priority: 2
      },
      {
        question: "How long do I have access to premium courses?",
        answer: "You have lifetime access to all premium courses you purchase, including future updates and new content. Our platform also provides offline access, so you can learn anywhere, anytime, even without an internet connection.",
        icon: Clock,
        category: "Support",
        priority: 2
      },
      {
        question: "What secure payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, UPI, and bank transfers through our secure payment gateway. We also offer flexible EMI options and installment plans for premium courses, making quality education accessible to everyone.",
        icon: CreditCard,
        category: "Payment",
        priority: 2
      },
      {
        question: "How do you ensure course quality and security?",
        answer: "All our courses undergo rigorous quality assurance and are taught by verified industry experts. We use enterprise-grade security to protect your data and provide encrypted video streaming for a secure learning experience.",
        icon: Shield,
        category: "Support",
        priority: 3
      }
    ];

    // Add dynamic elements and sort by priority
    return baseFaqs
      .map(faq => ({
        ...faq,
        id: `faq-${faq.category.toLowerCase()}-${faq.priority}`,
        views: Math.floor(Math.random() * 1000) + 100,
        helpful: Math.floor(Math.random() * 50) + 20,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
      .sort((a, b) => a.priority - b.priority);
  };

  const faqs = generateDynamicFaqs();

  // Dynamic categories based on FAQ data
  const categories = [
    { name: "All", count: faqs.length, icon: HelpCircle, color: "var(--brand)" },
    { name: "Enrollment", count: faqs.filter(f => f.category === "Enrollment").length, icon: HelpCircle, color: "var(--brand)" },
    { name: "Learning", count: faqs.filter(f => f.category === "Learning").length, icon: BookOpen, color: "var(--accent-rose)" },
    { name: "Support", count: faqs.filter(f => f.category === "Support").length, icon: Users, color: "var(--accent-gold)" },
    { name: "Payment", count: faqs.filter(f => f.category === "Payment").length, icon: CreditCard, color: "var(--brand-strong)" }
  ];

  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(1000px 600px at 30% 20%, rgba(79,140,255,0.15), transparent 60%)' }}></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="reveal">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Frequently Asked
              <span style={{ color: 'var(--brand)' }}> Questions</span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
              Find answers to common questions about our premium courses, enrollment process, 
              and <span style={{ color: 'var(--brand)' }}>AI-powered learning experience</span>. Can't find what you're looking for? 
              Contact our dedicated support team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Browse by Category</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Find answers organized by topic and priority
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.name
                    ? "btn-premium"
                    : "btn-outline-premium"
                }`}
              >
                <category.icon size={20} />
                <span className="font-semibold">{category.name}</span>
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Common Questions</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to know about our premium platform
            </p>
          </div>
          
          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <div key={faq.id} className="group">
                <div className={`card-premium overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'ring-2' : ''
                }`} style={{ 
                  ringColor: openIndex === index ? 'var(--brand)' : 'transparent' 
                }}>
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-opacity-50 transition-all duration-300"
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
                        background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                        border: '1px solid var(--brand)30'
                      }}>
                        <faq.icon size={24} style={{ color: 'var(--brand)' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ 
                            background: 'var(--brand)20', 
                            color: 'var(--brand)' 
                          }}>
                            {faq.category}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {faq.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}>
                      {openIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 animate-fadeIn">
                      <div className="card-premium p-6">
                        <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                          {faq.answer}
                        </p>
                        <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span>{faq.helpful} people found this helpful</span>
                          <span>Updated {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="card-premium p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent" style={{ background: 'radial-gradient(800px 400px at 50% 50%, rgba(79,140,255,0.1), transparent 60%)' }}></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '1px solid var(--brand)30'
              }}>
                <HelpCircle size={40} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Still Have Questions?</h3>
              <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Our premium support team is here to help! Get instant answers from our AI assistant or connect with our human experts for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-premium px-8 py-4 text-lg font-semibold">
                  <span className="mr-2">🤖</span>
                  Chat with AI Assistant
                </button>
                <button className="btn-outline-premium px-8 py-4 text-lg font-semibold">
                  <span className="mr-2">👨‍💼</span>
                  Contact Human Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
