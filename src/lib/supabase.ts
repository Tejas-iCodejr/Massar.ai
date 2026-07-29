import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://jyoedcgxfbcbloasucxj.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dAGCAFElRkycXFIEOXF-qw_Png6pQxb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
