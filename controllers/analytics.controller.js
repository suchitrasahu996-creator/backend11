import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getDashboardAnalytics,
  getMonthlySummary,
  getCategoryBreakdown,
  getYearlyAnalytics,
  getSummary,
} from '../services/analytics.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const analytics = await getDashboardAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

export const getMonthly = asyncHandler(async (req, res) => {
  const monthly = await getMonthlySummary(req.user.id);

  res.status(200).json({
    success: true,
    data: monthly,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await getCategoryBreakdown(req.user.id);

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getYearly = asyncHandler(async (req, res) => {
  const yearly = await getYearlyAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data: yearly,
  });
});

export const getOverallSummary = asyncHandler(async (req, res) => {
  const summary = await getSummary(req.user.id);

  res.status(200).json({
    success: true,
    data: summary,
  });
});
