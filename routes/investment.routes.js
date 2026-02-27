import express from 'express';
import {
  getInvestments,
  addInvestment,
  modifyInvestment,
  removeInvestment,
} from '../controllers/investment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getInvestments).post(addInvestment);

router.route('/:id').put(modifyInvestment).delete(removeInvestment);

export default router;
