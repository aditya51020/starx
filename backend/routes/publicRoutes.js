import express from 'express';
import { getProperties, getProperty } from '../controllers/propertyController.js';

const router = express.Router();

router.get('/properties', getProperties);
router.get('/properties/:id', getProperty);

export default router;