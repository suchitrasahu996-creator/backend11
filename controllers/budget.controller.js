import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budget.service.js';

export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await getAllBudgets(req.user.id);

  res.status(200).json({
    success: true,
    data: budgets,
  });
});

export const addBudget = asyncHandler(async (req, res) => {
  const { category, amount, period } = req.body;

  if (!category || !amount) {
    return res.status(400).json({
      success: false,
      error: 'Please provide category and amount',
    });
  }

  const budget = await createBudget(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: budget,
    message: 'Budget created successfully',
  });
});

export const modifyBudget = asyncHandler(async (req, res) => {
  const budget = await updateBudget(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: budget,
    message: 'Budget updated successfully',
  });
});

export const removeBudget = asyncHandler(async (req, res) => {
  await deleteBudget(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully',
  });
});
