import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import company logo images
import GoogleLogo from "../assets/Google1.jpg";
import MetaLogo from "../assets/Meta1.jpg";
import MicrosoftLogo from "../assets/Microsoft1.jpg";

const styles = {
  brandBlue: "#18457A",
  accentGreen: "#10B981",
  accentOrange: "#F59E0B",
  accentPurple: "#8B5CF6",
  accentRed: "#EF4444",
  accentPink: "#EC4899",
};

function ExamCard({ title, description, duration, questions, difficulty, type, startDate, endDate, isActive, onStart, category, maxScore, attempts }) {
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      case 'expert': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'contest': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'exam': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'practice': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'quiz': return 'text-pink-600 bg-pink-100 border-pink-200';
      case 'challenge': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'algorithms': return '⚡';
      case 'data structures': return '🏗️';
      case 'dynamic programming': return '🧠';
      case 'graph theory': return '🕸️';
      case 'mathematics': return '🔢';
      case 'strings': return '📝';
      case 'trees': return '🌳';
      case 'arrays': return '📊';
      default: return '📚';
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-blue-300 group">
      <div className="p-8">
        {/* Header with category icon */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl">{getCategoryIcon(category)}</span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-sm font-bold text-blue-700">
                {category}
              </span>
            </div>
            <h3 className="font-black text-gray-900 text-2xl mb-3 leading-tight group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">{description}</p>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getTypeColor(type)}`}>
              {type}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-base">
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-bold text-lg">{duration}</div>
              <div className="text-sm text-gray-500">Duration</div>
            </div>
          </div>
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
            <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-bold text-lg">{questions}</div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
          </div>
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
            <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-bold text-lg">{maxScore}</div>
              <div className="text-sm text-gray-500">Max Score</div>
            </div>
          </div>
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
            <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <div className="font-bold text-lg">{attempts}</div>
              <div className="text-sm text-gray-500">Attempts</div>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="border-t-2 border-gray-100 pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Start: {startDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">End: {endDate}</span>
            </div>
          </div>
          
          <button
            onClick={onStart}
            disabled={!isActive}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isActive ? '🚀 Start Exam Now' : '⏰ Coming Soon'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContestCard({ title, description, participants, prize, startTime, endTime, isLive, onJoin, category, difficulty, duration }) {
  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'championship': return '🏆';
      case 'sprint': return '⚡';
      case 'challenge': return '🔥';
      case 'tournament': return '🎯';
      case 'battle': return '⚔️';
      default: return '🎮';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-purple-400 group">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl">{getCategoryIcon(category)}</span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full text-sm font-bold text-purple-700">
                {category}
              </span>
            </div>
            <h3 className="font-black text-gray-900 text-2xl mb-3 leading-tight group-hover:text-purple-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">{description}</p>
          </div>
          <div className="flex flex-col items-end">
            {isLive && (
              <span className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white mb-3 animate-pulse">
                🔴 LIVE NOW
              </span>
            )}
            <div className="text-center">
              <span className="text-4xl font-black text-purple-600">₹{prize}</span>
              <div className="text-sm text-gray-500 font-semibold">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Contest Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-white p-4 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{participants}</div>
            <div className="text-sm text-gray-600 font-semibold">Participants</div>
          </div>
          <div className="text-center bg-white p-4 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{duration}</div>
            <div className="text-sm text-gray-600 font-semibold">Duration</div>
          </div>
          <div className="text-center bg-white p-4 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{difficulty}</div>
            <div className="text-sm text-gray-600 font-semibold">Level</div>
          </div>
        </div>

        <div className="border-t-2 border-purple-100 pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Starts: {startTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Ends: {endTime}</span>
            </div>
          </div>
          
          <button
            onClick={onJoin}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            🚀 Join Contest Now
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyLogo({ company, logoImage, description }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          <img 
            src={logoImage} 
            alt={`${company} logo`}
            className="w-16 h-16 object-contain"
          />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">{company}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group`}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-lg font-black text-white mb-3">{title}</h3>
        <p className="text-sm text-white/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SkillRequirement({ skill, icon, color }) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-${color}-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className="font-bold text-gray-900 text-lg">{skill}</span>
      </div>
    </div>
  );
}

export default function AlgoBridge() {
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE}/exams/available`);
        if (res.ok) {
          const json = await res.json();
          const data = json.data?.exams || [];
          setExams(data.map((e) => ({ ...e, id: e.id || e._id })));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

        const contests = useMemo(
        () => [
          {
            id: 1,
            title: "Winter Coding Championship 2024",
            description: "Annual competitive programming contest with exciting prizes and global recognition. Test your skills against the best programmers worldwide.",
            participants: 1250,
            prize: "4,00,000",
            startTime: "Dec 20, 2:00 PM",
            endTime: "Dec 20, 6:00 PM",
            isLive: true,
            category: "Championship",
            difficulty: "Expert",
            duration: "4 hours"
          },
          {
            id: 2,
            title: "Algorithm Master Challenge",
            description: "Intensive algorithmic thinking contest with complex problem sets. Push your limits and discover new problem-solving approaches.",
            participants: 890,
            prize: "2,50,000",
            startTime: "Dec 25, 10:00 AM",
            endTime: "Dec 25, 2:00 PM",
            isLive: false,
            category: "Challenge",
            difficulty: "Hard",
            duration: "4 hours"
          },
          {
            id: 3,
            title: "Data Structures Sprint",
            description: "Fast-paced contest focusing on data structure implementation and optimization. Speed and accuracy matter in this exciting challenge.",
            participants: 650,
            prize: "1,50,000",
            startTime: "Dec 28, 3:00 PM",
            endTime: "Dec 28, 5:00 PM",
            isLive: false,
            category: "Sprint",
            difficulty: "Medium",
            duration: "2 hours"
          },
          {
            id: 4,
            title: "Mathematics in Programming",
            description: "Unique contest combining mathematical concepts with programming. Solve complex mathematical problems using algorithmic approaches.",
            participants: 420,
            prize: "1,00,000",
            startTime: "Jan 1, 2025, 9:00 AM",
            endTime: "Jan 1, 2025, 1:00 PM",
            isLive: false,
            category: "Tournament",
            difficulty: "Hard",
            duration: "4 hours"
          }
        ],
        []
      );

  const handleStartExam = (examId) => {
    navigate(`/dashboard/exam/${examId}`);
  };

  const handleJoinContest = (contestId) => {
    alert(`🎯 Joining Contest #${contestId}! Preparing contest environment...`);
    // Navigate to contest interface
  };

  const handleQuickAction = (action) => {
    alert(`✨ ${action} feature coming soon!`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
      {/* Enhanced Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          🚀 AlgoBridge
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
          Master Algorithms Through Interactive Learning
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Experience the future of algorithmic education with our comprehensive exam platform, 
          competitive contests, and real-time leaderboards designed to challenge and inspire.
        </p>
      </div>

      {/* NEW: Company Logos Showcase */}
      <div className="mb-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            🏢 Official Partners & Certifiers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get certified by industry leaders and unlock opportunities at top tech companies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-300">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src={GoogleLogo} 
                  alt="Google logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Google</h3>
              <p className="text-sm text-gray-600">Search & AI Algorithms</p>
              <div className="mt-3 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                Official Partner
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-purple-300">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src={MetaLogo} 
                  alt="Meta logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Meta</h3>
              <p className="text-sm text-gray-600">Social Media & AI</p>
              <div className="mt-3 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                Official Partner
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-300">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src={MicrosoftLogo} 
                  alt="Microsoft logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Microsoft</h3>
              <p className="text-sm text-gray-600">Enterprise & Cloud</p>
              <div className="mt-3 px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                Official Partner
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg">
            <span>🎯</span>
            <span>Triple Certification Available</span>
            <span>🎯</span>
          </div>
        </div>
      </div>

      {/* NEW: About Company Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏢 Why AlgoBridge?
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Your career launchpad, connecting ambitious students with opportunities at Google, Meta, Microsoft and other top MNCs.
          </p>
        </div>

        {/* Triple Certification Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black mb-4">🏆 Achieve Triple Certification</h3>
            <p className="text-xl opacity-90">
              From Google, Meta, and Microsoft simultaneously, by scoring a minimum of 60% in our qualifying exam.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CompanyLogo 
              company="Google" 
              logoImage={GoogleLogo}
              description="Master search algorithms and data structures"
            />
            <CompanyLogo 
              company="Meta" 
              logoImage={MetaLogo}
              description="Social media algorithms and AI systems"
            />
            <CompanyLogo 
              company="Microsoft" 
              logoImage={MicrosoftLogo}
              description="Enterprise software and cloud computing"
            />
          </div>
        </div>

        {/* Target Audience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* CSE/IT/ECE/BCA/MCA Students */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border-2 border-green-200 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">🎓 For CSE/IT/ECE/BCA/MCA Students</h3>
            <div className="grid grid-cols-2 gap-4">
              <SkillRequirement skill="Quantitative Aptitude" icon="🧮" color="green" />
              <SkillRequirement skill="Logical Reasoning" icon="🧩" color="blue" />
              <SkillRequirement skill="Verbal Ability" icon="💬" color="purple" />
              <SkillRequirement skill="Situation Analysis" icon="🔍" color="orange" />
              <SkillRequirement skill="Sitting Arrangement" icon="🪑" color="red" />
              <SkillRequirement skill="Pseudo Code Proficiency" icon="💻" color="indigo" />
            </div>
          </div>

          {/* Other B-Tech Branches */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">⚡ For Other B-Tech Branches</h3>
            <div className="grid grid-cols-1 gap-4">
              <SkillRequirement skill="Quantitative Aptitude" icon="🧮" color="purple" />
              <SkillRequirement skill="Logical Reasoning" icon="🧩" color="pink" />
              <SkillRequirement skill="Verbal Ability" icon="💬" color="indigo" />
            </div>
          </div>
        </div>

        {/* Your Direct Path to Top MNCs */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-gray-900 mb-4">🚀 Your Direct Path to Top MNCs</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive support to help you land your dream job at top multinational companies.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <BenefitCard 
            icon="🤝"
            title="Direct Referrals"
            description="Benefit from our strong industry connections, providing direct referrals to companies like Google, Meta, Microsoft, Infosys, Wipro, TCS, and Accenture."
            gradient="from-blue-500 to-blue-600"
          />
          <BenefitCard 
            icon="🌐"
            title="Industry Networking"
            description="Participate in exclusive networking sessions to connect with key decision-makers and expand your professional circle."
            gradient="from-purple-500 to-purple-600"
          />
          <BenefitCard 
            icon="🎯"
            title="Interview Preparation"
            description="Hone your skills with mock HR and technical interviews, ensuring you are fully prepared for real-world scenarios."
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Success Statistics */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-indigo-200 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-gray-900 mb-4">📊 Success Statistics</h3>
            <p className="text-lg text-gray-600">Join thousands of successful candidates who have transformed their careers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="text-4xl font-black text-indigo-600 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-lg font-bold text-gray-700">Placement Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-purple-600 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-lg font-bold text-gray-700">Companies</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-pink-600 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-lg font-bold text-gray-700">Students Placed</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-blue-600 group-hover:scale-110 transition-transform duration-300">₹15L</div>
              <div className="text-lg font-bold text-gray-700">Avg Package</div>
            </div>
          </div>
        </div>
      </div>



      {/* Enhanced Stats Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-3xl p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center group">
            <div className="text-4xl font-black text-blue-900 group-hover:scale-110 transition-transform duration-300">{exams.length}</div>
            <div className="text-lg font-bold text-blue-700">Available Exams</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black text-purple-900 group-hover:scale-110 transition-transform duration-300">{contests.length}</div>
            <div className="text-lg font-bold text-purple-700">Active Contests</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black text-green-900 group-hover:scale-110 transition-transform duration-300">2.5K+</div>
            <div className="text-lg font-bold text-green-700">Students Enrolled</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black text-orange-900 group-hover:scale-110 transition-transform duration-300">₹8L+</div>
            <div className="text-lg font-bold text-orange-700">Total Prizes</div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'exams'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          📚 Exams & Practice
        </button>
        <button
          onClick={() => setActiveTab('contests')}
          className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'contests'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          🏆 Coding Contests
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          🏅 Leaderboard
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'exams' && (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
              🎯 Available Exams & Practice Tests
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  {...exam}
                  onStart={() => handleStartExam(exam.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contests' && (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
              🏆 Active & Upcoming Contests
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {contests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  {...contest}
                  onJoin={() => handleJoinContest(contest.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
              🏅 Top Performers
            </h2>
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="p-8">
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Alex Chen", score: 2850, contests: 15, badge: "🥇", streak: 8 },
                    { rank: 2, name: "Sarah Kim", score: 2720, contests: 12, badge: "🥈", streak: 6 },
                    { rank: 3, name: "Mike Johnson", score: 2650, contests: 18, badge: "🥉", streak: 10 },
                    { rank: 4, name: "Emma Wilson", score: 2580, contests: 14, badge: "🏅", streak: 5 },
                    { rank: 5, name: "David Lee", score: 2510, contests: 16, badge: "🏅", streak: 7 }
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center space-x-6">
                        <span className="text-4xl">{player.badge}</span>
                        <div>
                          <div className="text-2xl font-black text-gray-900">{player.name}</div>
                          <div className="text-lg text-gray-600 font-semibold">Rank #{player.rank}</div>
                          <div className="text-sm text-blue-600 font-bold">🔥 {player.streak} day streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">{player.score} pts</div>
                        <div className="text-lg text-gray-600 font-semibold">{player.contests} contests</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quick Actions */}
      <div className="mt-12 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 rounded-3xl p-8">
        <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => handleQuickAction('Create Practice Test')}
            className="p-6 bg-white rounded-2xl border-2 border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-green-300 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">Create Practice Test</div>
                <div className="text-base text-gray-600">Customize your learning experience</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('Join Live Contest')}
            className="p-6 bg-white rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-300 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">Join Live Contest</div>
                <div className="text-base text-gray-600">Real-time competitive programming</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('View Analytics')}
            className="p-6 bg-white rounded-2xl border-2 border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-300 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">View Analytics</div>
                <div className="text-base text-gray-600">Track your progress & performance</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
