import Exam from '../models/Exam.js';

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Admin (for now unsecured similar to courses create)
export const createExam = async (req, res) => {
  try {
    const body = req.body || {};

    const normalized = { ...body };

    if (!normalized.examUrl) {
      normalized.examUrl = '';
    }

    const exam = await Exam.create(normalized);

    res.status(201).json({
      status: 'success',
      message: 'Exam created successfully',
      data: { exam }
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ status: 'error', message: 'Server error during exam creation' });
  }
};

// @desc    Get exams with filters
// @route   GET /api/exams
// @access  Public
export const getExams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.visibility) filter.visibility = req.query.visibility;

    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    // upcoming and active flags
    if (req.query.when === 'upcoming') {
      filter.scheduledDate = { $gt: new Date() };
    } else if (req.query.when === 'active_now') {
      filter.scheduledDate = { $lte: new Date() };
      filter.status = 'active';
    }

    const exams = await Exam.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Exam.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        exams,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Get single exam by id
// @route   GET /api/exams/:id
// @access  Public
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ status: 'error', message: 'Exam not found' });
    }
    res.status(200).json({ status: 'success', data: { exam } });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Exam not found' });
    }
    res.status(200).json({ status: 'success', message: 'Exam updated successfully', data: { exam: updated } });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ status: 'error', message: 'Server error during exam update' });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ status: 'error', message: 'Exam not found' });
    }
    await Exam.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ status: 'error', message: 'Server error during exam deletion' });
  }
};

// @desc    Toggle status (active/draft)
// @route   PATCH /api/exams/:id/status
// @access  Private/Admin
export const updateExamStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'active', 'archived'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }
    const updated = await Exam.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Exam not found' });
    }
    res.status(200).json({ status: 'success', message: 'Status updated', data: { exam: updated } });
  } catch (error) {
    console.error('Update exam status error:', error);
    res.status(500).json({ status: 'error', message: 'Server error during status update' });
  }
};

// @desc    Public endpoint for available exams for AlgoBridge
// @route   GET /api/exams/available
// @access  Public
export const getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const publicExams = await Exam.find({ visibility: 'public' }).sort({ scheduledDate: 1 });
    const mapped = publicExams.map(e => ({
      id: e._id,
      title: e.title,
      description: e.description,
      duration: `${e.duration} minutes`,
      questions: e.totalQuestions,
      difficulty: 'Medium',
      type: e.type,
      category: e.course || 'Algorithms',
      startDate: e.scheduledDate ? e.scheduledDate.toDateString() : '',
      endDate: '',
      isActive: e.status === 'active' && e.scheduledDate && e.scheduledDate <= now,
      maxScore: 100,
      attempts: e.attempts || 0,
      examUrl: e.examUrl || ''
    }));
    res.status(200).json({ status: 'success', data: { exams: mapped } });
  } catch (error) {
    console.error('Get available exams error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


