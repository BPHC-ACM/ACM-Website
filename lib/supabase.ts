import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use the public anon key by default. If you intend to run admin tasks server-side,
// set SUPABASE_SERVICE_ROLE_KEY and explicitly use that in a server-only module.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
