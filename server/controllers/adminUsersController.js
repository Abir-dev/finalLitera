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

// @desc    Create new student (Admin only)
// @route   POST /api/admin/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'First name, last name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create new student
    const student = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'student',
      isActive: true
    });

    await student.save();

    // Return student data without password
    const studentData = {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role,
      isActive: student.isActive,
      createdAt: student.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'Student created successfully',
      data: {
        student: studentData
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during student creation'
    });
  }
};


