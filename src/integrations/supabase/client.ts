// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://izzsqzyrbbedixyunmyh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enNxenlyYmJlZGl4eXVubXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNDMwMjcsImV4cCI6MjA0OTgxOTAyN30.sOYpGQ09y3JWR9C0exA34_XKVEwplKku5DG7kQRP1vk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);