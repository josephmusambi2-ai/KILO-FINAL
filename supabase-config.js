/* ============================================================
   SUPABASE CONFIG — edit these two values if you ever
   move to a different Supabase project.

   SUPABASE_URL  — Project Settings → API → Project URL
   SUPABASE_KEY  — Project Settings → API → anon / public key

   These are safe to be public (they only have the permissions
   your Supabase Row Level Security policies allow).
   ============================================================ */

const SUPABASE_URL = "https://frqpjggebgujapyrrewn.supabase.co";
const SUPABASE_KEY = "sb_publishable_CWjV-DBudNjeN4UQhLsvQA_77FJCz9N";

// `supabase` here is the global from the CDN script loaded above this file.
// `db` is used throughout store.js and admin.js to make Supabase calls.
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
