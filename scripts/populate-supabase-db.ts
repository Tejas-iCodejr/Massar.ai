import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jyoedcgxfbcbloasucxj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_dAGCAFElRkycXFIEOXF-qw_Png6pQxb';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populate() {
  console.log('Reading hydrated data.json...');
  const dataPath = path.resolve(process.cwd(), 'data.json');
  const raw = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  // 1. Insert Universities
  if (data.universities && data.universities.length > 0) {
    const uniRows = data.universities.map((u: any) => ({
      id: u.id,
      name: u.name,
      domain: u.domain || '',
      location: u.location || '',
      type: u.type || '',
      description: u.description || '',
      tuition_fee: typeof u.tuitionFee === 'number' ? u.tuitionFee : parseFloat(u.tuitionFee) || 0,
      acceptance_rate: typeof u.acceptanceRate === 'number' ? u.acceptanceRate : parseFloat(u.acceptanceRate) || 0,
      intakes: u.intakes || [],
      grounded_overview: u.groundedOverview || null,
      grounded_location: u.groundedLocation || null,
    }));

    const { error: uniErr } = await supabase.from('universities').upsert(uniRows, { onConflict: 'id' });
    if (uniErr) console.error('Error inserting universities:', uniErr);
    else console.log(`Successfully seeded ${uniRows.length} universities into Supabase!`);
  }

  // 2. Insert Schools
  if (data.schools && data.schools.length > 0) {
    const schoolRows = data.schools.map((s: any) => ({
      id: s.id,
      name: s.name,
      domain: s.domain || '',
      curriculum: s.curriculum || '',
      emirate: s.emirate || '',
      country: s.country || 'UAE',
      rating: s.rating || '',
      tuition_range: s.tuitionRange || '',
      description: s.description || '',
      ranking: s.ranking || null,
      grounded_overview: s.groundedOverview || null,
      grounded_location: s.groundedLocation || null,
    }));

    const { error: schoolErr } = await supabase.from('schools').upsert(schoolRows, { onConflict: 'id' });
    if (schoolErr) console.error('Error inserting schools:', schoolErr);
    else console.log(`Successfully seeded ${schoolRows.length} schools into Supabase!`);
  }

  // 3. Insert Programs
  if (data.programs && data.programs.length > 0) {
    const progRows = data.programs.map((p: any) => ({
      id: p.id,
      title: p.title,
      organizer: p.organizer || '',
      domain: p.domain || '',
      type: p.type || '',
      eligibility: p.eligibility || '',
      deadline: p.deadline || '',
      link: p.link || '',
      grounded_overview: p.groundedOverview || null,
    }));

    const { error: progErr } = await supabase.from('programs').upsert(progRows, { onConflict: 'id' });
    if (progErr) console.error('Error inserting programs:', progErr);
    else console.log(`Successfully seeded ${progRows.length} programs into Supabase!`);
  }

  // 4. Insert Perks
  if (data.perks && data.perks.length > 0) {
    const perkRows = data.perks.map((pk: any) => ({
      id: pk.id,
      title: pk.title,
      provider: pk.provider || '',
      domain: pk.domain || '',
      description: pk.description || '',
      category: pk.category || '',
      link: pk.link || '',
      grounded_overview: pk.groundedOverview || null,
    }));

    const { error: perkErr } = await supabase.from('perks').upsert(perkRows, { onConflict: 'id' });
    if (perkErr) console.error('Error inserting perks:', perkErr);
    else console.log(`Successfully seeded ${perkRows.length} perks into Supabase!`);
  }

  console.log('Supabase Database Population Complete!');
}

populate().catch(console.error);
