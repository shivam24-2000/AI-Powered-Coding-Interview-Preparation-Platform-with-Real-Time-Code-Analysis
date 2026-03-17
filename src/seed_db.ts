import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { PROBLEMS } from './problems';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials inside .env file!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seed = async () => {
  console.log("🚀 Starting Seeder push...");
  const parsedProblems = PROBLEMS.map((p: any) => ({
    ...p,
    hints: p.hints || [] // Ensure hints is never null
  }));

  const { error } = await supabase.from('problems').insert(parsedProblems);
  if (error) {
    console.error("❌ Seeding failed:", error.message);
  } else {
    console.log(`✅ Successfully seeded ${PROBLEMS.length} problems to your Supabase!`);
  }
};

seed();
