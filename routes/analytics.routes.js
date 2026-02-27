import express from 'express';
import {
  getDashboard,
  getMonthly,
  getCategories,
  getYearly,
  getOverallSummary,
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/summary', getOverallSummary);
router.get('/monthly', getMonthly);
router.get('/categories', getCategories);
router.get('/yearly', getYearly);

export default router;
