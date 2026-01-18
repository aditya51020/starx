import express from 'express';
import { getProperties, getProperty } from '../controllers/propertyController.js';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

router.get('/properties', getProperties);
router.get('/properties/:id', getProperty);
router.post('/inquiries', createInquiry);

export default router;