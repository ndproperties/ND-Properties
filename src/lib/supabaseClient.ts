import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables, falling back to active project keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://exssqfyelqpaxqeyttac.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3NxZnllbHFwYXhxZXl0dGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTE2MDcsImV4cCI6MjA5NTI2NzYwN30.NiB5_5pXPr8Vo0d1p2SHOB7y7fhQeqOo0ToBPeQKOmo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
