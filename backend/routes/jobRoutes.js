import express from 'express';
import { getAllJobs, createJob, deleteJob } from '../controllers/jobController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public route
router.get('/', getAllJobs);

// Protected routes (Admin only)
router.post('/', protect, requireAdmin, createJob);
router.delete('/:id', protect, requireAdmin, deleteJob);


export default router;
