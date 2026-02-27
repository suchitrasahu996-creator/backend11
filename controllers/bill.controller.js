import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getAllBills,
  createBill,
  updateBill,
  deleteBill,
  markBillAsPaid,
} from '../services/bill.service.js';

export const getBills = asyncHandler(async (req, res) => {
  const bills = await getAllBills(req.user.id);

  res.status(200).json({
    success: true,
    data: bills,
  });
});

export const addBill = asyncHandler(async (req, res) => {
  const { name, amount, due_date } = req.body;

  if (!name || !amount || !due_date) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, amount, and due_date',
    });
  }

  const bill = await createBill(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: bill,
    message: 'Bill created successfully',
  });
});

export const modifyBill = asyncHandler(async (req, res) => {
  const bill = await updateBill(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: bill,
    message: 'Bill updated successfully',
  });
});

export const removeBill = asyncHandler(async (req, res) => {
  await deleteBill(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Bill deleted successfully',
  });
});

export const payBill = asyncHandler(async (req, res) => {
  const bill = await markBillAsPaid(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: bill,
    message: 'Bill marked as paid',
  });
});
