import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jyoedcgxfbcbloasucxj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_dAGCAFElRkycXFIEOXF-qw_Png6pQxb';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newPrograms = [
  {
    id: "prog_1",
    title: "TDRA National UAE Hackathon",
    organizer: "Telecommunications & Digital Government Regulatory Authority (TDRA)",
    domain: "hackathon.ae",
    type: "Hackathon",
    eligibility: "UAE High School & University Students",
    deadline: "2026-11-15",
    link: "https://hackathon.ae/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nThe TDRA National UAE Hackathon is the UAE's premier national innovation event under the theme 'Making Impact... Going Beyond the Idea'. It brings together students, young coders, and innovators from across all 7 emirates to design AI-driven solutions for digital government, cybersecurity, and public services.\n\n### Eligibility & Key Deadlines\nOpen to all UAE high school and university students. Participants gain access to mentorship, open government datasets, and project incubation support. Closing Deadline: November 15, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://hackathon.ae/",
            title: "TDRA UAE Hackathon Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "TDRA UAE Hackathon 2026 2027"
      ]
    }
  },
  {
    id: "prog_2",
    title: "Emirates Young Scientist Competition (EYSC)",
    organizer: "Ministry of Education & ATRC UAE",
    domain: "moe.gov.ae",
    type: "Fellowship",
    eligibility: "Grades 5-12 High School Students",
    deadline: "2026-12-10",
    link: "https://www.moe.gov.ae/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nThe Emirates Young Scientist Competition (EYSC) is the UAE's flagship scientific research competition for school students, held alongside the National Science, Technology & Innovation (NSTI) Festival. It empowers young researchers in AI, biotechnology, renewable energy, and space exploration.\n\n### Eligibility & Key Deadlines\nOpen to student research teams in Grades 5 through 12. Finalists present projects to international scientists and receive research grants. Submission Deadline: December 10, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.moe.gov.ae/",
            title: "Emirates Young Scientist Competition Official Guidelines"
          }
        }
      ],
      webSearchQueries: [
        "Emirates Young Scientist Competition EYSC"
      ]
    }
  },
  {
    id: "prog_3",
    title: "DEWA CleanTech & AI Sustainability Challenge",
    organizer: "DEWA Sustainability & Innovation Centre",
    domain: "dewa.gov.ae",
    type: "Hackathon",
    eligibility: "Senior Undergraduate & Postgrad Teams",
    deadline: "2026-10-20",
    link: "https://www.dewa.gov.ae/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nHosted at the Solar Park Innovation Centre in Dubai, the DEWA CleanTech Challenge invites university engineering and science students to build AI-driven solutions for decarbonization, smart power grids, and clean energy storage.\n\n### Eligibility & Key Deadlines\nOpen to university undergraduate and graduate student teams across the GCC. Offers cash prizes and incubator access at DEWA Innovation Hub. Registration Deadline: October 20, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.dewa.gov.ae/",
            title: "DEWA Innovation Challenge Portal"
          }
        }
      ],
      webSearchQueries: [
        "DEWA CleanTech Hackathon Dubai"
      ]
    }
  },
  {
    id: "prog_4",
    title: "NYUAD International Hackathon for Social Good",
    organizer: "NYU Abu Dhabi",
    domain: "nyu.edu",
    type: "Hackathon",
    eligibility: "Global & UAE University Students",
    deadline: "2026-11-20",
    link: "https://nyuad.nyu.edu/en/events/annual-nyuad-hackathon.html",
    groundedOverview: {
      text: "### Program Highlights & Focus\nAn internationally acclaimed annual hackathon uniting global student talent at NYU Abu Dhabi. Focuses on Quantum Computing, Machine Learning, and Climate Action aligned with UN Sustainable Development Goals.\n\n### Eligibility & Key Deadlines\nOpen to selected university students worldwide. Mentored by leaders from Google, MIT, and Oxford. Application Closing: November 20, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://nyuad.nyu.edu/en/events/annual-nyuad-hackathon.html",
            title: "NYUAD Annual Hackathon Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "NYUAD Hackathon for Social Good"
      ]
    }
  },
  {
    id: "prog_5",
    title: "Abu Dhabi University URIC Research Competition",
    organizer: "Abu Dhabi University",
    domain: "adu.ac.ae",
    type: "Fellowship",
    eligibility: "Undergraduate STEM & Humanities Students",
    deadline: "2026-12-05",
    link: "https://www.adu.ac.ae/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nThe Undergraduate Research and Innovation Competition (URIC) at Abu Dhabi University is one of the largest regional university research platforms. Students submit peer-reviewed research papers across Artificial Intelligence, Biomedical Engineering, Business, and Architecture.\n\n### Eligibility & Key Deadlines\nOpen to enrolled undergraduate students in Middle East higher education institutions. Abstract Submission Deadline: December 5, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.adu.ac.ae/",
            title: "ADU URIC Research Competition Portal"
          }
        }
      ],
      webSearchQueries: [
        "Abu Dhabi University URIC Competition"
      ]
    }
  },
  {
    id: "prog_6",
    title: "NASA Space Apps Challenge",
    organizer: "NASA & Global Partners",
    domain: "nasa.gov",
    type: "Hackathon",
    eligibility: "All Students (K12 & University)",
    deadline: "2026-10-01",
    link: "https://www.spaceappschallenge.org/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nNASA Space Apps Challenge is the world's largest global hackathon. Students solve challenges using open data from NASA and space agency partners to address real-world problems on Earth and in space.\n\n### Eligibility & Key Deadlines\nOpen to all students (high school and university). Includes local MENA event tracks. Registration Deadline: October 1, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.spaceappschallenge.org/",
            title: "NASA Space Apps Challenge Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "NASA Space Apps Challenge"
      ]
    }
  },
  {
    id: "prog_7",
    title: "Stanford Pre-Collegiate Summer Institute",
    organizer: "Stanford University",
    domain: "stanford.edu",
    type: "Summer School",
    eligibility: "High School Students (Grades 8-11)",
    deadline: "2026-08-15",
    link: "https://spcs.stanford.edu/programs/stanford-pre-collegiate-summer-institutes",
    groundedOverview: {
      text: "### Program Highlights & Focus\nAn intensive academic enrichment program giving high-achieving high school students unmatchable exposure to advanced computer science, biosciences, and artificial intelligence taught by Stanford scholars.\n\n### Eligibility & Key Deadlines\nOpen to high school students in Grades 8-11. Application Deadline: August 15, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://spcs.stanford.edu/programs/stanford-pre-collegiate-summer-institutes",
            title: "Stanford Pre-Collegiate Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "Stanford Pre-Collegiate Summer Institute"
      ]
    }
  },
  {
    id: "prog_8",
    title: "Google Solution Challenge",
    organizer: "Google Developers",
    domain: "google.com",
    type: "Hackathon",
    eligibility: "University Students",
    deadline: "2026-12-15",
    link: "https://developers.google.com/community/gdsc/solution-challenge",
    groundedOverview: {
      text: "### Program Highlights & Focus\nInvites university students in Google Developer Student Clubs to build solutions for one or more of the United Nations 17 Sustainable Development Goals using Google tech.\n\n### Eligibility & Key Deadlines\nOpen to university students. Top winners receive cash prizes, Google mentoring, and feature showcase. Deadline: December 15, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://developers.google.com/community/gdsc/solution-challenge",
            title: "Google Solution Challenge Guide"
          }
        }
      ],
      webSearchQueries: [
        "Google Solution Challenge"
      ]
    }
  },
  {
    id: "prog_9",
    title: "Oxford Summer Academy",
    organizer: "Oxford Study Courses",
    domain: "ox.ac.uk",
    type: "Summer School",
    eligibility: "Students aged 15-19",
    deadline: "2026-08-20",
    link: "https://www.oxfordsummeracademy.com/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nA premier academic immersion program hosted at Oxford colleges. Combines academic electives (Medicine, Law, Tech) with leadership and university prep.\n\n### Eligibility & Key Deadlines\nOpen to secondary students aged 15-19. Registration Closing: August 20, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.oxfordsummeracademy.com/",
            title: "Oxford Summer Academy Official Guide"
          }
        }
      ],
      webSearchQueries: [
        "Oxford Summer Academy"
      ]
    }
  },
  {
    id: "prog_10",
    title: "Harvard CS50x Computer Science Core",
    organizer: "Harvard University (edX)",
    domain: "harvard.edu",
    type: "Course",
    eligibility: "All Students & Life-long Learners",
    deadline: "2026-12-31",
    link: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    groundedOverview: {
      text: "### Program Highlights & Focus\nHarvard University's flagship introductory course to computer science and programming. Covers C, Python, SQL, HTML, CSS, JavaScript, and algorithmic thinking.\n\n### Eligibility & Key Deadlines\nOpen to all learners with self-paced certification. Enrollment open through December 31, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
            title: "Harvard CS50 Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "Harvard CS50x Core"
      ]
    }
  },
  {
    id: "prog_11",
    title: "TechGirls Leadership & Exchange Program",
    organizer: "U.S. Department of State",
    domain: "state.gov",
    type: "Fellowship",
    eligibility: "Female High School Students (Ages 15-17)",
    deadline: "2026-11-01",
    link: "https://techgirlsglobal.org/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nAn intensive STEM exchange program empowering young women from the Middle East and globally to pursue tech careers through tech camps and leadership mentoring.\n\n### Eligibility & Key Deadlines\nOpen to female high school students aged 15-17. Fully funded exchange program. Application Deadline: November 1, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://techgirlsglobal.org/",
            title: "TechGirls Global Exchange Portal"
          }
        }
      ],
      webSearchQueries: [
        "TechGirls Leadership Exchange"
      ]
    }
  },
  {
    id: "prog_12",
    title: "Mawhiba International Summer Program",
    organizer: "Mawhiba Saudi Arabia",
    domain: "mawhiba.org",
    type: "Fellowship",
    eligibility: "K12 High Achievers (Grades 9-12)",
    deadline: "2026-10-05",
    link: "https://www.mawhiba.org/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nSpecialized research enrichment program for gifted students across the MENA region, providing hands-on scientific projects in engineering, biotechnology, and AI.\n\n### Eligibility & Key Deadlines\nOpen to high-achieving high school students. Application Deadline: October 5, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://www.mawhiba.org/",
            title: "Mawhiba Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "Mawhiba International Summer Program"
      ]
    }
  },
  {
    id: "prog_13",
    title: "MIT Beaver Works Summer Institute",
    organizer: "Massachusetts Institute of Technology",
    domain: "mit.edu",
    type: "Summer School",
    eligibility: "Rising High School Seniors",
    deadline: "2026-09-10",
    link: "https://beaverworks.ll.mit.edu/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nA rigorous STEM program for high school seniors featuring project-based courses in autonomous RACECARS, cybersecurity, quantum software, and cube satellites.\n\n### Eligibility & Key Deadlines\nOpen to rising high school seniors with strong STEM background. Deadline: September 10, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://beaverworks.ll.mit.edu/",
            title: "MIT Beaver Works Official Guide"
          }
        }
      ],
      webSearchQueries: [
        "MIT Beaver Works Institute"
      ]
    }
  },
  {
    id: "prog_14",
    title: "Coders HQ Junior Python Virtual Academy",
    organizer: "Coders HQ UAE",
    domain: "codershq.ae",
    type: "Course",
    eligibility: "K12 level (Ages 8-15)",
    deadline: "2026-12-01",
    link: "https://codershq.ae/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nNational coding bootcamp launched under the UAE National Program for Coders. Teaches Python logic, game development, and AI basics to school students.\n\n### Eligibility & Key Deadlines\nOpen to UAE school students aged 8-15. Free virtual enrollment. Deadline: December 1, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://codershq.ae/",
            title: "Coders HQ UAE Official Portal"
          }
        }
      ],
      webSearchQueries: [
        "Coders HQ Junior Academy"
      ]
    }
  },
  {
    id: "prog_15",
    title: "Major League Hacking (MLH) Global Hackathons",
    organizer: "MLH Organization",
    domain: "mlh.io",
    type: "Hackathon",
    eligibility: "K12 & University Developers",
    deadline: "2026-11-30",
    link: "https://mlh.io/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nThe official student hackathon league hosting weekend hackathons globally and virtually. Students build apps, games, and hardware prototypes in 36-hour sprints.\n\n### Eligibility & Key Deadlines\nOpen to high school and university students of all skill levels. Continuous weekend intakes through November 30, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://mlh.io/",
            title: "MLH Global Hackathon League"
          }
        }
      ],
      webSearchQueries: [
        "Major League Hacking MLH"
      ]
    }
  },
  {
    id: "prog_16",
    title: "Middle East Youth Fellowship",
    organizer: "MEYE Initiative",
    domain: "meyef.org",
    type: "Fellowship",
    eligibility: "High School & Undergrad",
    deadline: "2026-10-15",
    link: "https://meyexpo.com/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nA regional leadership development fellowship connecting ambitious youth with policymakers, tech founders, and sustainability experts across the Middle East.\n\n### Eligibility & Key Deadlines\nOpen to secondary and undergraduate students. Application Deadline: October 15, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://meyexpo.com/",
            title: "Middle East Youth Fellowship Guide"
          }
        }
      ],
      webSearchQueries: [
        "Middle East Youth Fellowship"
      ]
    }
  },
  {
    id: "prog_17",
    title: "Archestra MCP Apps Hackathon",
    organizer: "Devpost & Archestra",
    domain: "devpost.com",
    type: "Hackathon",
    eligibility: "Global Virtual Developers & Students",
    deadline: "2026-10-29",
    link: "https://devpost.com/hackathons",
    groundedOverview: {
      text: "### Program Highlights & Focus\nA cutting-edge hackathon focused on building AI agents and Model Context Protocol (MCP) toolkits for autonomous workflows and developer tools.\n\n### Eligibility & Key Deadlines\nOpen to global developers and computer science students. Submission Deadline: October 29, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://devpost.com/hackathons",
            title: "Devpost MCP Hackathon Portal"
          }
        }
      ],
      webSearchQueries: [
        "Archestra MCP Apps Hackathon"
      ]
    }
  },
  {
    id: "prog_18",
    title: "Snowflake CoCo CLI Global Hackathon",
    organizer: "Snowflake Inc.",
    domain: "snowflake.com",
    type: "Hackathon",
    eligibility: "Virtual Developers (Global & MENA)",
    deadline: "2026-08-18",
    link: "https://snowflake.com/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nA global data engineering hackathon inviting developers and students to build cloud analytics and CLI extensions using Snowflake AI tools.\n\n### Eligibility & Key Deadlines\nOpen to virtual developers globally. Registration Deadline: August 18, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://snowflake.com/",
            title: "Snowflake Global Hackathon"
          }
        }
      ],
      webSearchQueries: [
        "Snowflake CoCo CLI Hackathon"
      ]
    }
  },
  {
    id: "prog_19",
    title: "AI Factory Online Global Hackathon",
    organizer: "Lablab.ai",
    domain: "lablab.ai",
    type: "Hackathon",
    eligibility: "Virtual AI Engineers & Students",
    deadline: "2026-08-10",
    link: "https://lablab.ai/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nAn online 48-hour AI buildathon empowering student coders to deploy generative AI applications, multimodal agents, and LLM automation tools.\n\n### Eligibility & Key Deadlines\nOpen to virtual AI engineers and students. Registration Closing: August 10, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://lablab.ai/",
            title: "Lablab.ai Hackathon Portal"
          }
        }
      ],
      webSearchQueries: [
        "AI Factory Online Hackathon"
      ]
    }
  },
  {
    id: "prog_20",
    title: "AI Infra Summit Virtual Hackathon",
    organizer: "AI Infra Association",
    domain: "lablab.ai",
    type: "Hackathon",
    eligibility: "Hybrid / Online Global Track",
    deadline: "2026-09-17",
    link: "https://lablab.ai/",
    groundedOverview: {
      text: "### Program Highlights & Focus\nFocuses on infrastructure-level AI innovations, model quantization, high-performance computing, and distributed training pipelines for student researchers.\n\n### Eligibility & Key Deadlines\nOpen to online track participants globally. Registration Deadline: September 17, 2026.",
      groundingChunks: [
        {
          web: {
            uri: "https://lablab.ai/",
            title: "AI Infra Summit Portal"
          }
        }
      ],
      webSearchQueries: [
        "AI Infra Summit Hackathon"
      ]
    }
  }
];

async function updatePrograms() {
  console.log('Updating data.json programs...');
  const dataPath = path.resolve(process.cwd(), 'data.json');
  const raw = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  data.programs = newPrograms;
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully updated ${newPrograms.length} active programs in data.json!`);

  // Sync to Supabase table
  console.log('Syncing updated programs to Supabase table...');
  const progRows = newPrograms.map(p => ({
    id: p.id,
    title: p.title,
    organizer: p.organizer || '',
    domain: p.domain || '',
    type: p.type,
    eligibility: p.eligibility || '',
    deadline: p.deadline || '',
    link: p.link || '',
    grounded_overview: p.groundedOverview || null,
  }));

  const { error } = await supabase.from('programs').insert(progRows);
  if (error) {
    console.error('Error syncing programs to Supabase:', error);
  } else {
    console.log(`Successfully synced all ${progRows.length} active programs to Supabase!`);
  }
}

updatePrograms().catch(console.error);
