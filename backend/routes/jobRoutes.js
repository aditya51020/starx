import express from 'express';
import { getAllJobs, createJob, deleteJob } from '../controllers/jobController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public route
router.get('/', getAllJobs);

// Protected routes (Admin only)
router.post('/', protect, createJob);
router.delete('/:id', protect, deleteJob);

export default router;
