import express from 'express';
import {
  getBudgets,
  addBudget,
  modifyBudget,
  removeBudget,
  spendBudget,
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBudgets).post(addBudget);

router.route('/:id').put(modifyBudget).delete(removeBudget);
router.patch('/:id/spend', spendBudget);

export default router;
