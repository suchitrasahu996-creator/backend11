import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllBudgets = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createBudget = async (userId, budgetData) => {
  const budgetId = uuidv4();

  const { data, error } = await supabase
    .from('budgets')
    .insert([
      {
        id: budgetId,
        user_id: userId,
        ...budgetData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateBudget = async (budgetId, userId, updates) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', budgetId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
export const addSpent = async (budgetId, userId, amount) => {

  const { data: budget, error: fetchError } = await supabase
    .from('budgets')
    .select('spent, amount')
    .eq('id', budgetId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError || !budget) {
    throw new Error('Budget not found');
  }

  const newSpent = parseFloat(budget.spent) + parseFloat(amount);

  if (newSpent > budget.amount) {
    throw new Error('Budget exceeded');
  }

  const { data, error } = await supabase
    .from('budgets')
    .update({ spent: newSpent })
    .eq('id', budgetId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};
export const deleteBudget = async (budgetId, userId) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Budget deleted successfully' };
};
