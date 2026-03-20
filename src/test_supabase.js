import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = {};
const envContent = fs.readFileSync('.env', 'utf8');
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await supabase.from('problems').select('*');
  const validPar = data.find(p => p.title.toLowerCase().includes('valid parentheses'));
  console.log("Valid Parentheses Problem Row:", JSON.stringify(validPar, null, 2));
}

test();
