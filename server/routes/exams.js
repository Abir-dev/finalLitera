import express from 'express';
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  updateExamStatus,
  getAvailableExams
} from '../controllers/examController.js';

const router = express.Router();

// Public listings
router.get('/', getExams);
router.get('/available', getAvailableExams);
router.get('/:id', getExamById);

// Admin management
router.post('/', createExam);
router.put('/:id', updateExam);
router.patch('/:id/status', updateExamStatus);
router.delete('/:id', deleteExam);

export default router;


