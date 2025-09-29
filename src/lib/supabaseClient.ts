import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
console.log("Inside the supabaseClient file.");
console.log("SupabaseUrl is:", supabaseUrl);
console.log("SupabaseAnonKey is: ", supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey)