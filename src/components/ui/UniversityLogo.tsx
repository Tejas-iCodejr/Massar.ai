import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { GraduationCap, School as SchoolIcon } from 'lucide-react';

interface LogoProps {
  domain?: string;
  name: string;
  className?: string;
}

// Known school & university domain lookup table
const DOMAIN_LOOKUP: Record<string, string> = {
  // Top 50 Schools
  "Dubai College": "dubaicollege.org",
  "Jumeirah English Speaking School (JESS) Arabian Ranches": "jess.sch.ae",
  "Raha International School": "ris.ae",
  "The British School Al Khubairat (BSAK)": "britishschool.sch.ae",
  "Kings' School Dubai": "kings-edu.com",
  "Brighton College Abu Dhabi": "brightoncollege.ae",
  "Dubai International Academy (DIA) Emirates Hills": "diadubai.com",
  "Dubai British School Emirates Hills": "dubaibritishschool.ae",
  "Cranleigh Abu Dhabi": "cranleigh.ae",
  "Nord Anglia International School Dubai": "nordangliaeducation.com",
  "GEMS Wellington International School": "wellingtoninternationalschool.com",
  "GEMS World Academy Dubai": "gemsworldacademy-dubai.com",
  "Repton School Dubai": "reptondubai.org",
  "Horizon English School": "horizonschool.com",
  "Jumeirah College": "jumeirahcollege.com",
  "Victory Heights Primary School": "vhprimary.com",
  "Dubai English Speaking College (DESC)": "descdubai.com",
  "The Millennium School Dubai": "millenniumschool-dubai.com",
  "GEMS Modern Academy": "gemsmodernacademy-dubai.com",
  "Sharjah English School": "sharjahenglishschool.org",
  "American Community School of Abu Dhabi (ACS)": "acs.sch.ae",
  "Lycée Français International Georges Pompidou": "lfigp.org",
  "The English College Dubai": "englishcollege.ac.ae",
  "Deira International School": "disdubai.ae",
  "Royal Grammar School Guildford Dubai (RGS)": "rgsgdubai.ae",
  "British International School Riyadh (BISR)": "bisr.com.sa",
  "American International School of Jeddah (AISJ)": "aisj.edu.sa",
  "King Faisal School": "kfs.sch.sa",
  "Dhahran Ahliyya Schools (DAS)": "das.sch.sa",
  "ISG Dhahran (International Schools Group)": "isg.edu.sa",
  "American International School Riyadh (AISR)": "aisr.org",
  "The King's School Riyadh": "kings.edu.sa",
  "Jeddah Prep and Grammar School (JPGS)": "jpgs.org",
  "KAUST Schools": "tks.kaust.edu.sa",
  "Kingdom Schools": "kingdomschools.edu.sa",
  "British International School Jeddah (BISJ)": "contis.bisj.com",
  "Al-Bayan International School": "bis.edu.sa",
  "Manarat Al-Riyadh International School": "maarif.com.sa",
  "Doha College": "dohacollege.com",
  "American School of Doha (ASD)": "asd.edu.qa",
  "Qatar Academy Doha (QAD)": "qad.edu.qa",
  "Sherborne Qatar": "sherborneqatar.org",
  "Park House English School": "parkhouseenglishschool.com",
  "International School of London (ISL) Qatar": "islqatar.org",
  "Swiss International School Qatar (SISQ)": "sisq.qa",
  "Compass International School Doha": "nordangliaeducation.com",
  "Hamilton International School Doha": "hamiltoninternationalschool.qa",
  "DESA (Doha English Speaking School)": "dess.org",
  "GEMS Wellington School Qatar": "gemswellingtonschool-qatar.com",
  "MES Indian School Doha": "mesqatar.org",

  // Universities
  "Khalifa University": "ku.ac.ae",
  "Manipal Academy of Higher Education, Dubai": "manipaldubai.com",
  "King Fahd University of Petroleum and Minerals (KFUPM)": "kfupm.edu.sa",
  "Prince Mohammad Bin Fahd University": "pmu.edu.sa",
  "Qatar University": "qu.edu.qa",
  "BITS Pilani, Dubai Campus": "bits-pilani.ac.in",
  "Heriot-Watt University Dubai": "hw.ac.uk",
  "University of Birmingham Dubai": "birmingham.ac.uk",
  "New York University Abu Dhabi": "nyu.edu",
  "Zayed University": "zu.ac.ae",
  "King Saud University": "ksu.edu.sa",
  "King Abdullah University of Science and Technology (KAUST)": "kaust.edu.sa",
  "Abu Dhabi University": "adu.ac.ae",
  "United Arab Emirates University": "uaeu.ac.ae",
  "American University of Sharjah": "aus.edu",

  // Global Opportunities & Programs
  "NASA & Global Partners": "nasa.gov",
  "NASA Space Apps Challenge": "spaceappschallenge.org",
  "Stanford University": "stanford.edu",
  "Stanford Pre-Collegiate Summer Institute": "stanford.edu",
  "Google Developers": "google.com",
  "Google Solution Challenge": "google.com",
  "Oxford Study Courses": "ox.ac.uk",
  "Oxford Summer Academy": "ox.ac.uk",
  "Harvard University (edX)": "harvard.edu",
  "Harvard CS50x Computer Science Core": "harvard.edu",
  "U.S. Department of State": "state.gov",
  "TechGirls Leadership & Exchange Program": "techgirlsglobal.org",
  "NYU Abu Dhabi": "nyu.edu",
  "NYUAD Hackathon for Social Good": "nyu.edu",
  "Mawhiba Saudi Arabia": "mawhiba.org",
  "Mawhiba International Summer Program": "mawhiba.org",
  "Massachusetts Institute of Technology": "mit.edu",
  "MIT Beaver Works Summer Institute": "mit.edu",
  "Coders HQ UAE": "codershq.ae",
  "Coders HQ Junior Python Virtual Academy": "codershq.ae",
  "MLH Organization": "mlh.io",
  "Major League Hacking (MLH) Global Hackathons": "mlh.io",
  "MEYE Initiative": "meyexpo.com",
  "Middle East Youth Fellowship": "meyexpo.com",
  "Devpost & Archestra": "devpost.com",
  "Archestra MCP Apps Hackathon": "devpost.com",
  "Snowflake Inc.": "snowflake.com",
  "Snowflake CoCo CLI Global Hackathon": "snowflake.com",
  "Lablab.ai": "lablab.ai",
  "AI Factory Online Global Hackathon": "lablab.ai",
  "AI Infra Association": "lablab.ai",
  "AI Infra Summit Virtual Hackathon": "lablab.ai",

  // Student Perks
  "GitHub & Partners": "github.com",
  "Notion Labs": "notion.so",
  "Figma Inc.": "figma.com",
  "Microsoft": "microsoft.com",
  "JetBrains": "jetbrains.com",
  "Autodesk": "autodesk.com",
  "Apple Middle East": "apple.com",
  "Spotify Middle East": "spotify.com",
  "Canva": "canva.com",
  "Ryanair": "ryanair.com",
  "YNAB": "ynab.com",
  "Emirates": "emirates.com",
  "Qatar Airways": "qatarairways.com",
  "ISIC Association": "isic.org",
  "Samsung Electronics": "samsung.com",
  "Dassault Systèmes": "solidworks.com",
  "Cisco Systems": "cisco.com",
  "RunPod": "runpod.io",
  "Lambda Labs": "lambdalabs.com",
  "Amazon Web Services": "aws.amazon.com",
  "adidas": "adidas.com",
  "Levi's": "levis.com",
  "Nike": "nike.com",
  "Crocs": "crocs.com",
  "PUMA": "puma.com",
  "H&M": "hm.com",
  "Paramount+": "paramountplus.com",
  "MUBI": "mubi.com",
  "Apple TV+": "apple.com",
  "Apple Music": "apple.com",
  "The New York Times": "nytimes.com",
  "YouTube Premium": "youtube.com",
  "YouTube Music": "youtube.com",
  "The Economist": "economist.com",
  "HackerRank": "hackerrank.com",
  "Kali Linux": "kali.org",
  "NVIDIA": "nvidia.com",
  "SAP": "sap.com",
  "Kickresume": "kickresume.com",
  "Anthropic": "anthropic.com",
  "RoleSharp": "rolesharp.com",
  "edX": "edx.org",
  "Scrimba": "scrimba.com",
  "DataCamp": "datacamp.com",
  "IBM": "ibm.com",
  "Codedex": "codedex.io",
  "Clerk": "clerk.com",
  "Transloadit": "transloadit.com",
  "Zed": "zed.dev",
  "SimpleAnalytics": "simpleanalytics.com",
  "Sentry": "sentry.io",
  "New Relic": "newrelic.com",
  "Navicat": "navicat.com",
  "PopSQL": "popsql.com",
  "Polypane": "polypane.app",
  "POEditor": "poeditor.com",
  "Pageclip": "pageclip.co",
  "Postman": "postman.com",
  "Mapbox": "mapbox.com",
  "LocalStack": "localstack.cloud",
  "LambdaTest": "lambdatest.com",
  "Honeybadger": "honeybadger.io",
  "GitLens": "gitkraken.com",
  "GitKraken": "gitkraken.com",
  "Flux": "flux.ai",
  "Datadog": "datadoghq.com",
  "BrowserStack": "browserstack.com",
  "Appfigures": "appfigures.com",
  "Cargo": "cargo.site",
  "UXPin": "uxpin.com",
  "Altium": "altium.com",
  "Divisare": "divisare.com",
  "Jitter": "jitter.video",
  "Left Angle": "left-angle.com",
  "Scene Group": "cavalry.scenegroup.co",
  "Epic Games": "unrealengine.com",
  "Unity Technologies": "unity.com",
  "Miro": "miro.com",
  "Tencent Cloud": "tencentcloud.com",
  "Name.com": "name.com",
  "Namecheap": "namecheap.com",
  "Camber": "camber.cloud",
  "Dot TECH": "get.tech",
  "Appwrite": "appwrite.io",
  "Kaggle": "kaggle.com",
  "Brik": "brik.ai",
  "Kiro": "kiro.dev",
  "Weights & Biases": "wandb.ai",
  "Hugging Face": "huggingface.co",
  "ElevenLabs": "elevenlabs.io",
  "CARTO": "carto.com",
  "Superhuman": "superhuman.com",
  "Linear": "linear.app",
  "Beautiful.ai": "beautiful.ai",
  "Basecamp": "basecamp.com",
  "Asana": "asana.com"
};

// Known official acronym mapping
const KNOWN_ACRONYMS: Record<string, string> = {
  "Dubai College": "DC",
  "Jumeirah English Speaking School (JESS) Arabian Ranches": "JESS",
  "Raha International School": "RIS",
  "The British School Al Khubairat (BSAK)": "BSAK",
  "Kings' School Dubai": "KINGS",
  "Brighton College Abu Dhabi": "BCAD",
  "Dubai International Academy (DIA) Emirates Hills": "DIA",
  "Dubai British School Emirates Hills": "DBS",
  "Cranleigh Abu Dhabi": "CAD",
  "Nord Anglia International School Dubai": "NAS",
  "GEMS Wellington International School": "GWIS",
  "GEMS World Academy Dubai": "GWA",
  "Repton School Dubai": "RSD",
  "Horizon English School": "HES",
  "Jumeirah College": "JC",
  "Victory Heights Primary School": "VHPS",
  "Dubai English Speaking College (DESC)": "DESC",
  "The Millennium School Dubai": "TMS",
  "GEMS Modern Academy": "GMA",
  "Sharjah English School": "SES",
  "American Community School of Abu Dhabi (ACS)": "ACS",
  "Lycée Français International Georges Pompidou": "LFIGP",
  "The English College Dubai": "TEC",
  "Deira International School": "DIS",
  "Royal Grammar School Guildford Dubai (RGS)": "RGS",
  "British International School Riyadh (BISR)": "BISR",
  "American International School of Jeddah (AISJ)": "AISJ",
  "King Faisal School": "KFS",
  "Dhahran Ahliyya Schools (DAS)": "DAS",
  "ISG Dhahran (International Schools Group)": "ISG",
  "American International School Riyadh (AISR)": "AISR",
  "The King's School Riyadh": "TKSR",
  "Jeddah Prep and Grammar School (JPGS)": "JPGS",
  "KAUST Schools": "TKS",
  "Kingdom Schools": "KS",
  "British International School Jeddah (BISJ)": "BISJ",
  "Al-Bayan International School": "BIS",
  "Manarat Al-Riyadh International School": "MARIS",
  "Doha College": "DC",
  "American School of Doha (ASD)": "ASD",
  "Qatar Academy Doha (QAD)": "QAD",
  "Sherborne Qatar": "SQ",
  "Park House English School": "PHES",
  "International School of London (ISL) Qatar": "ISLQ",
  "Swiss International School Qatar (SISQ)": "SISQ",
  "Compass International School Doha": "CISD",
  "Hamilton International School Doha": "THISD",
  "DESA (Doha English Speaking School)": "DESS",
  "GEMS Wellington School Qatar": "GWSQ",
  "MES Indian School Doha": "MES",
  "United Arab Emirates University": "UAEU",
  "New York University Abu Dhabi": "NYUAD",
  "American University of Sharjah": "AUS",
  "Khalifa University": "KU",
  "Manipal Academy of Higher Education, Dubai": "MAHE",
  "BITS Pilani, Dubai Campus": "BITS",
  "IIT Delhi - Abu Dhabi": "IITD",
  "Heriot-Watt University Dubai": "HWU",
  "University of Birmingham Dubai": "UOB",
  "Zayed University": "ZU",
  "Abu Dhabi University": "ADU",
  "Qatar University": "QU",
  "King Saud University": "KSU",
  "King Khalid University": "KKU",
  "Lebanese American University": "LAU",
  "The British University in Dubai": "BUiD",
  "Prince Mohammad Bin Fahd University": "PMU",
  "King Fahd University of Petroleum and Minerals (KFUPM)": "KFUPM",
  "King Abdullah University of Science and Technology (KAUST)": "KAUST"
};

function getSmartAcronym(name: string): string {
  if (KNOWN_ACRONYMS[name]) return KNOWN_ACRONYMS[name];
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1].length <= 6) {
    return parenMatch[1].toUpperCase();
  }
  const stopWords = new Set(['of', 'and', 'in', 'the', 'for', '&', '-']);
  const words = name.replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0 && !stopWords.has(w.toLowerCase()));
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 4);
}

function getBrandTint(name: string): { bg: string; text: string; border: string } {
  const tints = [
    { bg: 'bg-[#ff705d]', text: 'text-white', border: 'border-[#ff705d]' },
    { bg: 'bg-[#2ba0ff]', text: 'text-white', border: 'border-[#2ba0ff]' },
    { bg: 'bg-[#8ed462]', text: 'text-[#2c2e2a]', border: 'border-[#8ed462]' },
    { bg: 'bg-[#9f5ffd]', text: 'text-white', border: 'border-[#9f5ffd]' },
    { bg: 'bg-[#2c2e2a]', text: 'text-[#f5f1e4]', border: 'border-[#2c2e2a]' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tints[Math.abs(hash) % tints.length];
}

export function UniversityLogo({ domain, name, className }: LogoProps) {
  const [level, setLevel] = useState<number>(0);
  
  // Resolve domain from parameter or fallback lookup table
  const resolvedDomain = (domain || DOMAIN_LOOKUP[name] || "").replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

  // Build HD CDN sources list ONLY if a valid domain exists
  const sources: string[] = [];
  
  if (resolvedDomain && resolvedDomain.length >= 3) {
    sources.push(`https://cdn.brandfetch.io/${resolvedDomain}/w/400/h/400`);
    sources.push(`https://icon.horse/icon/${resolvedDomain}`);
    sources.push(`https://www.google.com/s2/favicons?domain=${resolvedDomain}&sz=128`);
  }

  const currentUrl = sources[level];
  const acronym = getSmartAcronym(name);
  const brandStyle = getBrandTint(name);

  const handleError = () => {
    if (level < sources.length - 1) {
      setLevel(prev => prev + 1);
    } else {
      setLevel(sources.length); // Trigger vibrant emblem fallback
    }
  };

  const isFallbackEmblem = !sources.length || level >= sources.length;

  return (
    <div 
      className={cn(
        "w-16 h-16 flex-shrink-0 border bg-white overflow-hidden flex items-center justify-center rounded-[20px] shadow-xs relative select-none transition-transform group-hover:scale-105",
        isFallbackEmblem ? `${brandStyle.bg} ${brandStyle.border}` : "border-hairline-mist",
        className
      )}
    >
      {!isFallbackEmblem && currentUrl ? (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-2 font-sans text-[8px]"
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-1 text-center w-full h-full">
          <GraduationCap className={cn("w-4 h-4 mb-0.5", brandStyle.text)} strokeWidth={2.5} />
          <span className={cn("font-sans font-black text-[11px] tracking-tight leading-none uppercase", brandStyle.text)}>
            {acronym}
          </span>
        </div>
      )}
    </div>
  );
}
