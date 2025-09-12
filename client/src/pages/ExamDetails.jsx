import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE}/exams/${id}`);
        if (!res.ok) throw new Error('Failed to load exam');
        const json = await res.json();
        setExam(json.data?.exam || null);
      } catch (e) {
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStart = () => {
    if (exam?.examUrl) {
      window.open(exam.examUrl, '_blank', 'noopener');
    }
  };

  if (loading) return <div className="p-6">Loading exam...</div>;
  if (error || !exam) return <div className="p-6 text-red-600">{error || 'Exam not found'}</div>;

  const isActive = exam.status === 'active' && exam.scheduledDate && new Date(exam.scheduledDate) <= new Date();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${exam.status === 'active' ? 'bg-green-500' : exam.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
              {exam.status}
            </span>
          </div>
          <p className="mt-2 text-white/90">{exam.course}</p>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed">{exam.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-900">{exam.duration}</div>
              <div className="text-xs text-gray-600">Minutes</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-900">{exam.totalQuestions}</div>
              <div className="text-xs text-gray-600">Questions</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-900">{exam.passingScore}%</div>
              <div className="text-xs text-gray-600">Passing Score</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-gray-900">{exam.attempts || 0}</div>
              <div className="text-xs text-gray-600">Attempts Allowed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>Type: <span className="font-semibold text-gray-900">{exam.type}</span></div>
            <div>Average Score: <span className="font-semibold text-gray-900">{exam.avgScore || 0}%</span></div>
            <div>Scheduled: <span className="font-semibold text-gray-900">{exam.scheduledDate ? new Date(exam.scheduledDate).toLocaleString() : 'N/A'}</span></div>
            <div>Visibility: <span className="font-semibold text-gray-900">{exam.visibility || 'public'}</span></div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <button
                onClick={handleStart}
                disabled={!isActive || !exam.examUrl}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold ${isActive && exam.examUrl ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
              >
                {isActive ? '🚀 Open Exam' : '⏰ Coming Soon'}
              </button>
              {exam.examUrl ? (
                <a
                  href={exam.examUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-6 py-3 rounded-lg font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-center"
                >
                  View Exam URL
                </a>
              ) : (
                <div className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-500 text-center">No URL provided</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


