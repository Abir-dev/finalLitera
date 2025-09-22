import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Clock,
  Users,
  Calendar,
  Star,
  BookOpen,
  Download,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Filter,
  Search,
  TrendingUp,
  Award,
} from "lucide-react";

// Dynamic recordings generation with premium content
const generateDynamicRecordings = () => {
  const recordingTemplates = [
    {
      title: "Advanced Machine Learning & AI",
      teacher: "Dr. Sarah Chen",
      duration: "2:45:30",
      views: 2847,
      rating: 4.9,
      category: "Machine Learning",
      thumbnail: "https://img.youtube.com/vi/GwIo3gDZCVQ/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/GwIo3gDZCVQ",
      description:
        "Comprehensive introduction to machine learning algorithms and neural networks with hands-on coding examples.",
      tags: ["AI", "Neural Networks", "Python", "TensorFlow"],
      isPremium: true,
    },
    {
      title: "Neural Networks Simplified",
      teacher: "Alex Rodriguez",
      duration: "1:32:15",
      views: 1923,
      rating: 4.8,
      category: "Deep Learning",
      thumbnail: "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
      description:
        "Deep dive into neural network architectures and backpropagation with visual explanations.",
      tags: ["Deep Learning", "Backpropagation", "Architecture"],
      isPremium: true,
    },
    {
      title: "Full-Stack React Development",
      teacher: "Emma Thompson",
      duration: "3:15:45",
      views: 3456,
      rating: 4.7,
      category: "Web Development",
      thumbnail: "https://img.youtube.com/vi/JxgmHe2NyeY/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/JxgmHe2NyeY",
      description:
        "Build modern web applications with React, Node.js, and MongoDB from scratch.",
      tags: ["React", "Node.js", "MongoDB", "Full-Stack"],
      isPremium: false,
    },
    {
      title: "Data Science with Python",
      teacher: "Dr. Michael Kim",
      duration: "2:20:10",
      views: 2156,
      rating: 4.6,
      category: "Data Science",
      thumbnail: "https://img.youtube.com/vi/efR1C6CvhmE/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/efR1C6CvhmE",
      description:
        "Complete data analysis workflow using Python, Pandas, and visualization libraries.",
      tags: ["Python", "Pandas", "Data Analysis", "Visualization"],
      isPremium: true,
    },
    {
      title: "Cloud Computing & DevOps",
      teacher: "David Wilson",
      duration: "2:55:20",
      views: 1876,
      rating: 4.8,
      category: "Cloud Computing",
      thumbnail: "https://img.youtube.com/vi/7VeUPuFGJHk/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/7VeUPuFGJHk",
      description:
        "Deploy and scale applications using AWS, Docker, and Kubernetes.",
      tags: ["AWS", "Docker", "Kubernetes", "DevOps"],
      isPremium: true,
    },
    {
      title: "Advanced JavaScript Concepts",
      teacher: "Lisa Park",
      duration: "1:45:30",
      views: 2934,
      rating: 4.9,
      category: "Programming",
      thumbnail: "https://img.youtube.com/vi/sDv4f4s2SB8/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/sDv4f4s2SB8",
      description:
        "Master advanced JavaScript concepts including closures, prototypes, and async programming.",
      tags: ["JavaScript", "ES6+", "Async", "Advanced"],
      isPremium: false,
    },
  ];

  return recordingTemplates.map((recording, index) => ({
    id: `recording-${index + 1}`,
    ...recording,
    // Add dynamic elements
    uploadDate: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    likes: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 100) + 10,
    downloads: Math.floor(Math.random() * 200) + 20,
    isNew: index < 2,
    isTrending: Math.random() > 0.7,
  }));
};

const liveClasses = generateDynamicRecordings();

const upcomingClasses = [
  {
    id: 2,
    title: "Logistic Regression Explained",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/yIYKR4sgzI8",
  },
  {
    id: 3,
    title: "Clustering Algorithms",
    teacher: "freeCodeCamp",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/Iq9DzN6mvYA",
  },
  {
    id: 4,
    title: "Principal Component Analysis",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/FgakZw6K1QQ",
  },
  {
    id: 5,
    title: "Naive Bayes Classifier",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/O2L2Uv9pdDA",
  },
  {
    id: 6,
    title: "K-Nearest Neighbors",
    teacher: "Data School",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/HVXime0nQeI",
  },
  {
    id: 7,
    title: "Intro to Reinforcement Learning",
    teacher: "DeepMind",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/Mut_u40Sqz4",
  },
];

function RecordingCard({ recording }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="card-premium overflow-hidden group hover:scale-105 transition-all duration-300">
      {/* Thumbnail with Play Button */}
      <div className="relative h-48 bg-gradient-to-br from-bg-secondary to-bg-primary overflow-hidden">
        <img
          src={recording.thumbnail}
          alt={recording.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
            <Play
              size={24}
              className="ml-1"
              style={{ color: "var(--brand)" }}
            />
          </div>
        </div>

        {/* Premium Badge */}
        {recording.isPremium && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-r from-accent-gold to-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award size={12} />
              Premium
            </div>
          </div>
        )}

        {/* New Badge */}
        {recording.isNew && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-accent-rose to-pink-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </div>
          </div>
        )}

        {/* Trending Badge */}
        {recording.isTrending && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-gradient-to-r from-brand to-brand-strong text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp size={12} />
              Trending
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div
          className="text-xs font-semibold mb-2 px-2 py-1 rounded-full inline-block"
          style={{ background: "var(--brand)10", color: "var(--brand)" }}
        >
          {recording.category}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold mb-2 group-hover:text-brand transition-colors duration-300 line-clamp-2"
          style={{ color: "var(--text-primary)" }}
        >
          {recording.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {recording.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} style={{ color: "var(--text-muted)" }} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            By {recording.teacher}
          </span>
        </div>

        {/* Meta Info */}
        <div
          className="flex items-center justify-between text-xs mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{recording.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{recording.views.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star
              size={12}
              className="fill-current"
              style={{ color: "var(--accent-gold)" }}
            />
            <span>{recording.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {recording.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                background: "var(--surface)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Upload Date */}
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Calendar size={12} />
          <span>Uploaded {formatDate(recording.uploadDate)}</span>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center justify-between mt-4 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 text-xs hover:text-brand transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Heart size={14} />
              <span>{recording.likes}</span>
            </button>
            <button
              className="flex items-center gap-1 text-xs hover:text-brand transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <MessageCircle size={14} />
              <span>{recording.comments}</span>
            </button>
            <button
              className="flex items-center gap-1 text-xs hover:text-brand transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Download size={14} />
              <span>{recording.downloads}</span>
            </button>
          </div>
          <button className="btn-premium px-4 py-2 text-sm">Watch Now</button>
        </div>
      </div>
    </div>
  );
}

export default function RecordingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [
      ...new Set(liveClasses.map((recording) => recording.category)),
    ];
    return ["all", ...cats];
  }, []);

  // Filter and sort recordings
  const filteredRecordings = useMemo(() => {
    let filtered = liveClasses.filter((recording) => {
      const matchesSearch =
        recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || recording.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort recordings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case "oldest":
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case "rating":
          return b.rating - a.rating;
        case "views":
          return b.views - a.views;
        case "duration":
          return b.duration.localeCompare(a.duration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Play size={32} style={{ color: "var(--brand)" }} />
          <h1
            className="heading-1 text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Recording Classes
          </h1>
        </div>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          Access premium recorded sessions from industry experts and learn at
          your own pace
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card-premium p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 input-with-icon">
            <Search
              size={18}
              className="icon-left"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pr-4 py-3 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-premium"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-premium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="views">Most Viewed</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <Play size={20} style={{ color: "var(--brand)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {liveClasses.length}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Recordings
          </div>
        </div>

        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)",
              border: "1px solid var(--accent-gold)30",
            }}
          >
            <Award size={20} style={{ color: "var(--accent-gold)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {liveClasses.filter((r) => r.isPremium).length}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Premium Content
          </div>
        </div>

        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-rose)20, var(--accent-rose)10)",
              border: "1px solid var(--accent-rose)30",
            }}
          >
            <TrendingUp size={20} style={{ color: "var(--accent-rose)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {liveClasses.filter((r) => r.isTrending).length}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Trending Now
          </div>
        </div>

        <div className="card-premium p-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-strong)20, var(--brand-strong)10)",
              border: "1px solid var(--brand-strong)30",
            }}
          >
            <Eye size={20} style={{ color: "var(--brand-strong)" }} />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {liveClasses.reduce((sum, r) => sum + r.views, 0).toLocaleString()}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Views
          </div>
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecordings.map((recording) => (
          <RecordingCard key={recording.id} recording={recording} />
        ))}
      </div>

      {/* No Results */}
      {filteredRecordings.length === 0 && (
        <div className="card-premium p-12 text-center">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
              border: "1px solid var(--brand)30",
            }}
          >
            <Search size={32} style={{ color: "var(--brand)" }} />
          </div>
          <h3
            className="heading-3 text-xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No recordings found
          </h3>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("newest");
            }}
            className="btn-premium px-6 py-3"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
