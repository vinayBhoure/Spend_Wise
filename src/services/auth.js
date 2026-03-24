import { supabase } from '../lib/supabase';

/**
 * Log in a user with email and password
 */
export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

/**
 * Sign up a new user and generate a profile
 */
export const signupWithEmail = async (username, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: username,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Log out the current user
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetch the current session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.session;
};
