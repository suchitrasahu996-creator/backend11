import { supabase } from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllInvestments = async (userId) => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createInvestment = async (userId, investmentData) => {
  const investmentId = uuidv4();

  const { data, error } = await supabase
    .from('investments')
    .insert([
      {
        id: investmentId,
        user_id: userId,
        ...investmentData,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateInvestment = async (investmentId, userId, updates) => {
  const { data, error } = await supabase
    .from('investments')
    .update(updates)
    .eq('id', investmentId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteInvestment = async (investmentId, userId) => {
  const { error } = await supabase
    .from('investments')
    .delete()
    .eq('id', investmentId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Investment deleted successfully' };
};
