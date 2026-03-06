import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  payDebt,
} from '../services/debt.service.js';

export const getDebts = asyncHandler(async (req, res) => {
  const debts = await getAllDebts(req.user.id);

  res.status(200).json({
    success: true,
    data: debts,
  });
});

export const addDebt = asyncHandler(async (req, res) => {
  const { name, amount, interest_rate } = req.body;

  if (!name || !amount) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name and amount',
    });
  }

  const debt = await createDebt(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: debt,
    message: 'Debt created successfully',
  });
});

export const modifyDebt = asyncHandler(async (req, res) => {
  const debt = await updateDebt(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: debt,
    message: 'Debt updated successfully',
  });
});
export const payDebtAmount = asyncHandler(async (req, res) => {

  const { amount } = req.body;

  if (amount === undefined || amount === null)  {
    return res.status(400).json({
      success: false,
      error: 'Payment amount required'
    });
  }

  const debt = await payDebt(req.params.id, req.user.id, amount);

  res.status(200).json({
    success: true,
    data: debt,
    message: 'Debt payment recorded'
  });
});
export const removeDebt = asyncHandler(async (req, res) => {
  await deleteDebt(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Debt deleted successfully',
  });
});
