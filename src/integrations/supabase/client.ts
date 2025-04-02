
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://netcarmsimamwzchhxkk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldGNhcm1zaW1hbXd6Y2hoeGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTA3OTcsImV4cCI6MjA1OTE4Njc5N30.iEUBwJpm5rQLICOxoyh_7iLm62z5DssXImZpTcVQnzQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
