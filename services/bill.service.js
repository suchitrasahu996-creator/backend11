import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllBills = async (userId) => {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createBill = async (userId, billData) => {
  const billId = uuidv4();

  const { data, error } = await supabase
    .from('bills')
    .insert([
      {
        id: billId,
        user_id: userId,
        is_paid: false,
        ...billData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateBill = async (billId, userId, updates) => {
  const { data, error } = await supabase
    .from('bills')
    .update(updates)
    .eq('id', billId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteBill = async (billId, userId) => {
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', billId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Bill deleted successfully' };
};

export const markBillAsPaid = async (billId, userId) => {
  const { data, error } = await supabase
    .from('bills')
    .update({ is_paid: true })
    .eq('id', billId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};