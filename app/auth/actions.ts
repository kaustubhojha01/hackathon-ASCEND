'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Incorrect email or password. Please try again.' };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'Please confirm your email address before signing in.' };
        }
        return { error: error.message };
      }
    }
  } catch (err: unknown) {
    return { error: (err as Error).message || 'An unexpected error occurred during login.' };
  }

  redirect('/dashboard');
}

export async function signupAction(formData: FormData) {
  const username = (formData.get('username') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const archetype = formData.get('archetype') as string;

  if (!username || !email || !password) {
    return { error: 'Please fill in all required fields.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            archetype: archetype || 'Cyber Mage',
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { error: 'An account with this email already exists. Please sign in.' };
        }
        return { error: error.message };
      }
    }
  } catch (err: unknown) {
    return { error: (err as Error).message || 'An unexpected error occurred during signup.' };
  }

  redirect('/dashboard');
}
