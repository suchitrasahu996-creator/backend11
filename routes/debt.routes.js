import express from 'express';
import {
  getDebts,
  addDebt,
  modifyDebt,
  removeDebt,
  payDebtAmount,
} from '../controllers/debt.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getDebts).post(addDebt);

router.route('/:id').put(modifyDebt).delete(removeDebt);
router.patch('/:id/pay', payDebtAmount);

export default router;
