import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllTransactions = async (userId, filters = {}) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (filters.month) {
    const [year, month] = filters.month.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    query = query.gte('date', startDate).lte('date', endDate);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTransactionById = async (transactionId, userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Transaction not found');
  }

  return data;
};

export const createTransaction = async (userId, transactionData) => {
  const transactionId = uuidv4();

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        id: transactionId,
        user_id: userId,
        ...transactionData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateTransaction = async (transactionId, userId, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', transactionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteTransaction = async (transactionId, userId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Transaction deleted successfully' };
};
