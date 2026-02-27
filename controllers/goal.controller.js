import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addToGoal,
} from '../services/goal.service.js';

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await getAllGoals(req.user.id);

  res.status(200).json({
    success: true,
    data: goals,
  });
});

export const addGoal = asyncHandler(async (req, res) => {
  const { name, target_amount, target_date } = req.body;

  if (!name || !target_amount || !target_date) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, target_amount, and target_date',
    });
  }

  const goal = await createGoal(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: goal,
    message: 'Goal created successfully',
  });
});

export const modifyGoal = asyncHandler(async (req, res) => {
  const goal = await updateGoal(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: goal,
    message: 'Goal updated successfully',
  });
});

export const removeGoal = asyncHandler(async (req, res) => {
  await deleteGoal(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Goal deleted successfully',
  });
});

export const saveToGoal = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({
      success: false,
      error: 'Please provide amount',
    });
  }

  const goal = await addToGoal(req.params.id, req.user.id, amount);

  res.status(200).json({
    success: true,
    data: goal,
    message: 'Amount added to goal successfully',
  });
});
