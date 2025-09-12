// src/pages/Faq.jsx
import { useState } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Enrolling is simple! Browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll be guided through a quick registration process and can start learning immediately.",
      icon: "🎯",
      category: "Enrollment"
    },
    {
      question: "Do you offer live classes and support?",
      answer: "Yes! We offer daily live sessions with expert instructors where you can ask questions in real-time. Additionally, we provide 24/7 doubt support through our community forums and dedicated support team.",
      icon: "🎥",
      category: "Learning"
    },
    {
      question: "What if I'm not satisfied with a course?",
      answer: "We offer a 30-day money-back guarantee on all courses. If you're not completely satisfied with your learning experience, simply contact our support team within 30 days of purchase for a full refund.",
      icon: "💰",
      category: "Payment"
    },
    {
      question: "Are the courses suitable for beginners?",
      answer: "Absolutely! Our courses are designed for learners of all levels. We offer beginner-friendly content with clear explanations, and many courses include prerequisite materials to help you get started.",
      icon: "🚀",
      category: "Learning"
    },
    {
      question: "Do I get a certificate upon completion?",
      answer: "Yes, you'll receive a certificate of completion for every course you finish. Our certificates are recognized by industry professionals and can be shared on your LinkedIn profile and resume.",
      icon: "🏆",
      category: "Learning"
    },
    {
      question: "Can I access courses on mobile devices?",
      answer: "Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can learn anywhere, anytime with our mobile-optimized interface.",
      icon: "📱",
      category: "Support"
    },
    {
      question: "How long do I have access to the courses?",
      answer: "You have lifetime access to all courses you purchase. This means you can revisit the content anytime, and you'll also get free updates when we add new materials to the courses.",
      icon: "⏰",
      category: "Support"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. We also offer flexible payment plans for many courses, allowing you to pay in installments.",
      icon: "💳",
      category: "Payment"
    }
  ];

  const categories = [
    { name: "Enrollment", count: 2, icon: "🎯", color: "from-blue-500 to-cyan-500" },
    { name: "Learning", count: 3, icon: "📚", color: "from-purple-500 to-pink-500" },
    { name: "Support", count: 2, icon: "🛠️", color: "from-green-500 to-emerald-500" },
    { name: "Payment", count: 1, icon: "💰", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-15">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce">❓</div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                Frequently Asked
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                  {" "}Questions
                </span>
              </h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our courses, enrollment process, 
              and <span className="font-semibold text-indigo-600">AI-powered learning experience</span>. Can't find what you're looking for? 
              Contact our support team.
            </p>
          </div>
        </div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 animate-spin"></div>
        <div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-25 animate-ping"></div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4 animate-bounce">📂</div>
            <h2 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4A8B] to-indigo-600 mb-4">
              Browse by Category
            </h2>
            <p className="text-slate-600">
              Find answers organized by topic
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-center shadow-lg text-white`}>
                  <div className="text-3xl mb-3 animate-pulse">{category.icon}</div>
                  <div className="text-2xl font-bold mb-2">
                    {category.count}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    {category.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4 animate-bounce">💡</div>
            <h2 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4A8B] to-indigo-600 mb-4">
              Common Questions
            </h2>
            <p className="text-slate-600">
              Everything you need to know about our platform
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <div 
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${
                    openIndex === index ? 'border-indigo-500' : 'border-transparent'
                  }`}
                >
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors"
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl animate-pulse">{faq.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {faq.question}
                        </h3>
                        <span className="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className={`text-2xl transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </div>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 animate-fadeIn">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                        <p className="text-slate-700 leading-relaxed">
                          {faq.answer}
                        </p>
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
      <section className="py-16 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 shadow-lg">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Still Have Questions?</h3>
            <p className="text-slate-600 mb-6">
              Our AI-powered support team is here to help! Get instant answers or connect with our human experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Chat with AI Assistant
              </button>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                Contact Human Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
