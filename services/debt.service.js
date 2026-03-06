import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllDebts = async (userId) => {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createDebt = async (userId, debtData) => {
  const debtId = uuidv4();

  const { data, error } = await supabase
    .from('debts')
    .insert([
      {
        id: debtId,
        user_id: userId,
        ...debtData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateDebt = async (debtId, userId, updates) => {
  const { data, error } = await supabase
    .from('debts')
    .update(updates)
    .eq('id', debtId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const payDebt = async (debtId, userId, payment) => {

  const { data: debt, error: fetchError } = await supabase
    .from('debts')
    .select('*')
    .eq('id', debtId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const newAmount = parseFloat(debt.amount) - parseFloat(payment);

  if (newAmount < 0) {
    throw new Error('Payment exceeds remaining debt');
  }

  const { data, error } = await supabase
    .from('debts')
    .update({ amount: newAmount })
    .eq('id', debtId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};
export const deleteDebt = async (debtId, userId) => {
  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', debtId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Debt deleted successfully' };
};
