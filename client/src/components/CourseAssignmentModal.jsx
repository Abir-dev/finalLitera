import React, { useState, useEffect } from "react";

export default function CourseAssignmentModal({ student, isOpen, onClose, onCourseAssigned }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch available courses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableCourses();
    }
  }, [isOpen]);

  const fetchAvailableCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
      const token = localStorage.getItem('adminToken');

      console.log('Fetching available courses...');
      console.log('API_BASE:', API_BASE);
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

      const response = await fetch(`${API_BASE}/admin/courses/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setCourses(data.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(`Failed to load available courses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedCourseId) {
      setError("Please select a course to assign");
      return;
    }

    setIsAssigning(true);
    setError("");
    setSuccess("");

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://finallitera.onrender.com/api';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE}/admin/students/${student.id}/assign-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ courseId: selectedCourseId })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.message === "Student is already enrolled in this course") {
          throw new Error("This student is already enrolled in the selected course. Please choose a different course.");
        }

        throw new Error(data.message || 'Failed to assign course');
      }

      setSuccess("Course assigned successfully!");

      // Call the callback to refresh the student list
      if (onCourseAssigned) {
        onCourseAssigned(data.data);
      }

      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Error assigning course:', error);
      setError(error.message || 'Failed to assign course');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedCourseId("");
    setError("");
    setSuccess("");
    setCourses([]);
    onClose();
  };

  const selectedCourse = courses.find(course => course._id === selectedCourseId);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Assign Course to Student</h2>
              <p className="text-[color:var(--text-secondary)] mt-1">
                Assign a course to <span className="font-semibold">{student.name}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
              <span className="ml-3 text-[color:var(--text-secondary)]">Loading available courses...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Course Selection */}
              <div>
                <label htmlFor="courseSelect" className="block text-sm font-medium mb-2">
                  Select Course to Assign *
                </label>
                <select
                  id="courseSelect"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full input-premium"
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} - {course.level} ({course.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Course Preview */}
              {selectedCourse && (
                <div className="rounded-lg p-4 btn-outline-premium">
                  <h3 className="text-lg font-semibold mb-2">Selected Course</h3>
                  <div className="flex items-start space-x-4">
                    {selectedCourse.thumbnail && (
                      <img
                        src={selectedCourse.thumbnail}
                        alt={selectedCourse.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{selectedCourse.title}</h4>
                      <p className="text-sm text-[color:var(--text-secondary)] mt-1 line-clamp-2">
                        {selectedCourse.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-[color:var(--text-muted)]">
                        <span>📚 {selectedCourse.level}</span>
                        <span>🏷️ {selectedCourse.category}</span>
                        <span>⏱️ {selectedCourse.duration}</span>
                        <span style={{ color: 'var(--accent-gold)' }}>💰 ₹{selectedCourse.price}</span>
                      </div>
                      {selectedCourse.instructor && (
                        <p className="text-sm text-[color:var(--text-muted)] mt-1">
                          👨‍🏫 Instructor: {selectedCourse.instructor.firstName} {selectedCourse.instructor.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Student Info */}
              <div className="rounded-lg p-4 btn-outline-premium">
                <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-[color:var(--text-secondary)]">{student.email}</p>
                    <p className="text-sm text-[color:var(--text-muted)]">
                      Current courses: {student.course !== "-" ? "1" : "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="p-3 rounded-md" style={{ color: '#ff6b7a', background: 'rgba(255,107,122,0.08)', border: '1px solid rgba(255,107,122,0.25)' }}>
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md" style={{ color: '#7ed957', background: 'rgba(126,217,87,0.08)', border: '1px solid rgba(126,217,87,0.25)' }}>
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 btn-outline-premium rounded-lg"
                  disabled={isAssigning}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCourse}
                  disabled={!selectedCourseId || isAssigning}
                  className="flex-1 px-4 py-2 btn-premium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAssigning ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Assigning...
                    </span>
                  ) : (
                    "Assign Course"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
