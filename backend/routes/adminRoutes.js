import express from 'express';
import { protect } from '../middlewares/auth.js';
import { createProperty, updateProperty, deleteProperty, bulkDelete, getStats } from '../controllers/propertyController.js';
import { uploadImages, handleUpload } from '../controllers/uploadController.js';

const router = express.Router();

router.use(protect);

router.post('/properties', createProperty);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.delete('/properties/bulk', bulkDelete);
router.get('/stats', getStats);
router.post('/upload', uploadImages, handleUpload);

export default router;