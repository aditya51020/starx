import express from 'express';
import { protect } from '../middlewares/auth.js';
import { createProperty, updateProperty, deleteProperty, bulkDelete, getStats, getProperty } from '../controllers/propertyController.js';
import { uploadImages, handleUpload } from '../controllers/uploadController.js';
import { getInquiries, deleteInquiry, updateInquiryStatus } from '../controllers/inquiryController.js';

const router = express.Router();

router.use(protect);

router.post('/properties', createProperty);
router.get('/properties/:id', getProperty); // Added missing GET route
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.delete('/properties/bulk', bulkDelete);
router.get('/stats', getStats);
router.post('/upload', uploadImages, handleUpload);

// Inquiries
router.get('/inquiries', getInquiries);
router.delete('/inquiries/:id', deleteInquiry);
router.patch('/inquiries/:id/status', updateInquiryStatus);

export default router;