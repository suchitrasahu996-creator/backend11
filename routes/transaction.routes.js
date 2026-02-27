import express from 'express';
import {
  getTransactions,
  getTransaction,
  addTransaction,
  modifyTransaction,
  removeTransaction,
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getTransactions).post(addTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(modifyTransaction)
  .delete(removeTransaction);

export default router;
