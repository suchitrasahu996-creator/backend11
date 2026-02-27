import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (email, password, name) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email,
        password: hashedPassword,
        name,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const loginUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    throw new Error('User not found');
  }

  return data;
};
