import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllGoals = async (userId) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createGoal = async (userId, goalData) => {
  const goalId = uuidv4();

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        id: goalId,
        user_id: userId,
        current_amount: 0,
        ...goalData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateGoal = async (goalId, userId, updates) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteGoal = async (goalId, userId) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Goal deleted successfully' };
};

export const addToGoal = async (goalId, userId, amount) => {
  const { data: goal, error: fetchError } = await supabase
    .from('goals')
    .select('current_amount, target_amount')
    .eq('id', goalId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError || !goal) {
    throw new Error('Goal not found');
  }

  const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);

  const { data, error } = await supabase
    .from('goals')
    .update({ current_amount: newAmount })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
