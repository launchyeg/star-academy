import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — check your .env file.'
  )
}

/**
 * Shared Supabase client. Auth (admin login) and all academy data
 * (groups/students/subscriptions) go through this single instance.
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
