import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://izzsqzyrbbedixyunmyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enNxenlyYmJlZGl4eXVubXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNDMwMjcsImV4cCI6MjA0OTgxOTAyN30.sOYpGQ09y3JWR9C0exA34_XKVEwplKku5DG7kQRP1vk";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);