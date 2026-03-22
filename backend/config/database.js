const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
