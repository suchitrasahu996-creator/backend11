import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transaction.service.js';

export const getTransactions = asyncHandler(async (req, res) => {
  const filters = {
    month: req.query.month,
    type: req.query.type,
    category: req.query.category,
  };

  const transactions = await getAllTransactions(req.user.id, filters);

  res.status(200).json({
    success: true,
    data: transactions,
  });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await getTransactionById(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

export const addTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, description, date } = req.body;

  if (!type || !category || !amount || !date) {
    return res.status(400).json({
      success: false,
      error: 'Please provide type, category, amount, and date',
    });
  }

  const transaction = await createTransaction(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: transaction,
    message: 'Transaction created successfully',
  });
});

export const modifyTransaction = asyncHandler(async (req, res) => {
  const transaction = await updateTransaction(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: transaction,
    message: 'Transaction updated successfully',
  });
});

export const removeTransaction = asyncHandler(async (req, res) => {
  await deleteTransaction(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Transaction deleted successfully',
  });
});
