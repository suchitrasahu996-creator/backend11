import express from 'express';
import {
  getBills,
  addBill,
  modifyBill,
  removeBill,
  payBill,
} from '../controllers/bill.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBills).post(addBill);

router.route('/:id').put(modifyBill).delete(removeBill);

router.patch('/:id/pay', payBill);

export default router;
