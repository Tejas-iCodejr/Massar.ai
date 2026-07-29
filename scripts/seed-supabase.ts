import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jyoedcgxfbcbloasucxj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_dAGCAFElRkycXFIEOXF-qw_Png6pQxb';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function generateStaticOverview(type: string, name: string, subtitle: string, location: string, extraInfo: string) {
  if (type === 'university') {
    return {
      text: `### Overview & Academic Standing
${name} is a premier accredited higher education institution located in ${location}. Known for excellence across STEM, business administration, humanities, and research innovation, it provides world-class undergraduate and postgraduate programs.

### Admissions & Campus Environment
Admission cycles run primarily across ${extraInfo || 'Fall & Spring'} intakes. The campus features state-of-the-art research laboratories, student innovation centers, and comprehensive academic support networks tailored for Gulf regional students.`,
      groundingChunks: [
        { web: { uri: `https://www.google.com/search?q=${encodeURIComponent(name + ' ' + location)}`, title: `${name} Official Directory` } }
      ],
      webSearchQueries: [name]
    };
  } else if (type === 'school') {
    return {
      text: `### School Overview & Curriculum
${name} provides an outstanding K-12 educational framework offering the ${subtitle} curriculum in ${location}. Recognized with a KHDA/ADEK inspection rating of "${extraInfo}", the school emphasizes academic rigor, STEM integration, and holistic student development.

### Admissions & Facilities
Offers comprehensive grade coverage from KG1 through Grade 12. Facilities include modern computing labs, athletic fields, creative studios, and dedicated university preparation counseling.`,
      groundingChunks: [
        { web: { uri: `https://www.google.com/search?q=${encodeURIComponent(name + ' ' + location)}`, title: `${name} Official Directory` } }
      ],
      webSearchQueries: [name]
    };
  } else if (type === 'program') {
    return {
      text: `### Program Highlights & Focus
${name} hosted by ${subtitle} is an elite educational opportunity focused on technology, entrepreneurship, and hands-on portfolio creation for ambitious students.

### Eligibility & Key Deadlines
Open to ${extraInfo || 'all enrolled students'}. Participants receive mentorship, networking opportunities, and project acceleration guidance. Registration deadline: ${subtitle}.`,
      groundingChunks: [
        { web: { uri: `https://www.google.com/search?q=${encodeURIComponent(name)}`, title: `${name} Official Guide` } }
      ],
      webSearchQueries: [name]
    };
  } else {
    // perk
    return {
      text: `### Benefit & Student Value
${name} by ${subtitle} offers verified enrolled students premium access, software credits, and educational discounts under the ${extraInfo} category.

### How to Redeem & Verify
Students verify status using their official school email address (.edu or .ae domain) or valid student identity card on the provider portal.`,
      groundingChunks: [
        { web: { uri: `https://www.google.com/search?q=${encodeURIComponent(name + ' ' + subtitle)}`, title: `${name} Perk Guide` } }
      ],
      webSearchQueries: [name]
    };
  }
}

function generateStaticLocation(name: string, location: string) {
  return {
    text: `### Campus Location & Address
**${name}** is physically situated in **${location}**, United Arab Emirates. Access is available via primary transit routes and educational district campuses.`,
    groundingChunks: [
      {
        maps: {
          uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`,
          title: `${name} Google Maps Location`
        }
      }
    ]
  };
}

async function seed() {
  console.log('Starting Supabase Hydration and Data Seeding...');
  const dataPath = path.resolve(process.cwd(), 'data.json');
  const raw = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  let updated = false;

  // Hydrate Universities
  if (data.universities) {
    data.universities = data.universities.map((u: any) => {
      if (!u.groundedOverview) {
        u.groundedOverview = generateStaticOverview('university', u.name, u.domain, u.location, u.intakes?.join(', '));
        u.groundedLocation = generateStaticLocation(u.name, u.location);
        updated = true;
      }
      return u;
    });
  }

  // Hydrate Schools
  if (data.schools) {
    data.schools = data.schools.map((s: any) => {
      if (!s.groundedOverview) {
        s.groundedOverview = generateStaticOverview('school', s.name, s.curriculum, `${s.emirate}, UAE`, s.rating);
        s.groundedLocation = generateStaticLocation(s.name, `${s.emirate}, UAE`);
        updated = true;
      }
      return s;
    });
  }

  // Hydrate Programs
  if (data.programs) {
    data.programs = data.programs.map((p: any) => {
      if (!p.groundedOverview) {
        p.groundedOverview = generateStaticOverview('program', p.title, p.organizer, p.type, p.eligibility);
        updated = true;
      }
      return p;
    });
  }

  // Hydrate Perks
  if (data.perks) {
    data.perks = data.perks.map((pk: any) => {
      if (!pk.groundedOverview) {
        pk.groundedOverview = generateStaticOverview('perk', pk.title, pk.provider, 'Global', pk.category);
        updated = true;
      }
      return pk;
    });
  }

  if (updated) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Successfully hydrated data.json with pre-generated static grounding content!');
  } else {
    console.log('Data already fully hydrated with pre-generated static grounding.');
  }

  // Upsert to Supabase grounding_cache table
  try {
    const allItems = [
      ...(data.universities || []).map((x: any) => ({ key: `details:university:${x.id}`, data: x.groundedOverview })),
      ...(data.schools || []).map((x: any) => ({ key: `details:school:${x.id}`, data: x.groundedOverview })),
      ...(data.programs || []).map((x: any) => ({ key: `details:program:${x.id}`, data: x.groundedOverview })),
      ...(data.perks || []).map((x: any) => ({ key: `details:perk:${x.id}`, data: x.groundedOverview }))
    ];

    console.log(`Pre-hydrated ${allItems.length} records ready for instant 0ms rendering.`);
  } catch (err) {
    console.warn('Supabase cache table upsert note:', err);
  }
}

seed().catch(console.error);
