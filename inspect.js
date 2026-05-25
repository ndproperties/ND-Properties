import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('site_content')
    .insert({
      id: 'global',
      heroTitle: 'Get to own your own home and <br /><span class="italic text-gray-400 font-normal">Make your dream come true</span>',
      heroSubtitle: 'Exclusive architectural masterpieces, thoughtfully curated for Bengalis who appreciate minimalist elegance and visionary living.',
      aboutTitle: 'A curated luxury <br />real estate consultancy',
      aboutText: 'Offering premium minimalist spaces tailored with a rigorous five-step verification protocol.',
      contactEmail: 'ndproperties.buisness@gmail.com',
      contactPhone: '9748158051',
      contactLoungeBE: 'Beverly Hills',
      contactLoungeZH: 'Zurich',
      contactLoungeDK: 'Dhaka',
    })
    .select();
  
  console.log("Error during insert:", error);
  console.log("Inserted Data:", data);
}
test();
