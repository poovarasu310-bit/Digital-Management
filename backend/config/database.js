const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bscibptrelujspoyddzd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzY2licHRyZWx1anNwb3lkZHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNTM1MTUsImV4cCI6MjA4OTcyOTUxNX0.jX40dbL2TvJ6q0F9VOAS5JKmmehWf3Kd5oFN4Haz27Y';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
