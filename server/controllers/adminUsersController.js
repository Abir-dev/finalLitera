import User from '../models/User.js';

// @desc    List students for admin panel
// @route   GET /api/admin/students
// @access  Private/Admin (adminAuth)
export const listStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: 'student' };
    if (typeof req.query.isActive !== 'undefined') {
      filter.isActive = req.query.isActive === 'true';
    }

    const students = await User.find(filter)
      .select('-password')
      .populate('enrolledCourses.course', 'title thumbnail')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        users: students,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin list students error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


