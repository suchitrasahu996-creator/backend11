import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from '../services/investment.service.js';

export const getInvestments = asyncHandler(async (req, res) => {
  const investments = await getAllInvestments(req.user.id);

  res.status(200).json({
    success: true,
    data: investments,
  });
});

export const addInvestment = asyncHandler(async (req, res) => {
  const { name, type, amount } = req.body;

  if (!name || !type || !amount) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, type, and amount',
    });
  }

  const investment = await createInvestment(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: investment,
    message: 'Investment created successfully',
  });
});

export const modifyInvestment = asyncHandler(async (req, res) => {
  const investment = await updateInvestment(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: investment,
    message: 'Investment updated successfully',
  });
});

export const removeInvestment = asyncHandler(async (req, res) => {
  await deleteInvestment(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Investment deleted successfully',
  });
});
