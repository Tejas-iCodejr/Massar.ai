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
  ".TECH Domain Name": "get.tech",
  "AI Factory Online Global Hackathon": "lablab.ai",
  "AI Infra Association": "lablab.ai",
  "AI Infra Summit Virtual Hackathon": "lablab.ai",
  "AWS Educate Cloud Tier": "aws.amazon.com",
  "Abu Dhabi University": "adu.ac.ae",
  "Ajman University": "ajman.ac.ae",
  "Al Ain University": "aau.ac.ae",
  "Al-Bayan International School": "bis.edu.kw",
  "Al-Imam Muhammad Ibn Saud Islamic University": "imamu.edu.sa",
  "Alfaisal University": "alfaisal.edu",
  "Altium Designer PCB License": "altium.com",
  "American Community School of Abu Dhabi (ACS)": "acs.sch.ae",
  "American International School Riyadh (AISR)": "aisr.org",
  "American International School of Jeddah (AISJ)": "aisj.edu.sa",
  "American School of Doha (ASD)": "asd.edu.qa",
  "American University in Dubai (AUD)": "aud.edu",
  "American University of Ras Al Khaimah (AURAK)": "aurak.ac.ae",
  "American University of Sharjah": "aus.edu",
  "Anthropic Academy AI Courses": "anthropic.com",
  "Appfigures Analytics": "appfigures.com",
  "Apple Education Store GCC Savings": "apple.com",
  "Apple Music Student Plan": "apple.com",
  "Apple TV+ Student Access": "apple.com",
  "Appwrite Pro Backend": "appwrite.io",
  "Archestra MCP Apps Hackathon": "devpost.com",
  "Asana Starter Plan": "asana.com",
  "Autodesk Education Suite & Fusion 360": "autodesk.com",
  "Autograph 2D/3D Motion Graphics": "left-angle.com",
  "BITS Pilani, Dubai Campus": "bits-pilani.ac.in",
  "Basecamp for Students": "basecamp.com",
  "Beautiful.ai AI Presentations": "beautiful.ai",
  "Brighton College Abu Dhabi": "brightoncollege.ae",
  "Brik AI Design Platform": "brik.ai",
  "British International School Jeddah (BISJ)": "bisj.com",
  "British International School Riyadh (BISR)": "bisr.com.sa",
  "BrowserStack Automate Mobile": "browserstack.com",
  "CARTO Spatial Analytics": "carto.com",
  "CST Studio Suite EM Simulation": "3ds.com",
  "Camber Cloud Compute Pass": "camber.cloud",
  "Canadian University Dubai": "cud.ac.ae",
  "Canva for Education": "canva.com",
  "Cargo Portfolio Site": "cargo.site",
  "Carnegie Mellon University in Qatar": "qatar.cmu.edu",
  "Cavalry 2D Animation Software": "cavalry.scenegroup.co",
  "Cisco Networking Academy (NetAcad) Voucher": "netacad.com",
  "Clerk Pro Student Plan": "clerk.com",
  "Codedex Club": "codedex.io",
  "Coders HQ Junior Python Virtual Academy": "codershq.ae",
  "Coders HQ UAE": "codershq.ae",
  "Compass International School Doha": "nordangliaeducation.com",
  "Cranleigh Abu Dhabi": "cranleigh.ae",
  "Crocs Student Savings": "crocs.com",
  "DESA (Doha English Speaking School)": "dess.org",
  "DataCamp Student Access": "datacamp.com",
  "Datadog Pro Infrastructure": "datadoghq.com",
  "Deira International School": "disdubai.ae",
  "Devpost & Archestra": "devpost.com",
  "Dhahran Ahliyya Schools (DAS)": "das.sch.sa",
  "Divisare Architecture Archive": "divisare.com",
  "Doha College": "dohacollege.com",
  "Dubai British School Emirates Hills": "dubaibritishschool.ae",
  "Dubai College": "dubaicollege.org",
  "Dubai English Speaking College (DESC)": "descdubai.com",
  "Dubai Future Foundation Student Free Zone Grant": "dubaifuture.ae",
  "Dubai International Academy (DIA) Emirates Hills": "diadubai.com",
  "Effat University": "effatuniversity.edu.sa",
  "ElevenReader Ultra AI Audio": "elevenlabs.io",
  "Emirates Airline Student Special Offer": "emirates.com",
  "Figma for Education": "figma.com",
  "Flux AI PCB Design": "flux.ai",
  "GEMS Modern Academy": "gemsmodernacademy-dubai.com",
  "GEMS Wellington International School": "wellingtoninternationalschool.com",
  "GEMS Wellington School Qatar": "gemswellingtonschool-qatar.com",
  "GEMS World Academy Dubai": "gemsworldacademy-dubai.com",
  "Georgetown University in Qatar": "qatar.georgetown.edu",
  "GitHub Student Developer Pack": "github.com",
  "GitKraken Pro GUI": "gitkraken.com",
  "GitLens for VS Code": "gitkraken.com",
  "Google Cloud Career Launchpad Voucher": "cloud.google.com",
  "Google Cloud Vertex AI Student Credits": "cloud.google.com",
  "Google Developers": "google.com",
  "Google Solution Challenge": "google.com",
  "Gulf Medical University": "gmu.ac.ae",
  "H&M Student Offer": "hm.com",
  "HackerRank Skill Certifications": "hackerrank.com",
  "Hamad Bin Khalifa University (HBKU)": "hbku.edu.qa",
  "Hamdan Foundation Student Innovation Award Grant": "ha.ae",
  "Hamilton International School Doha": "hamiltoninternationalschool.qa",
  "Harvard CS50x Computer Science Core": "harvard.edu",
  "Harvard University (edX)": "harvard.edu",
  "Heriot-Watt University Dubai": "hw.ac.uk",
  "Higher Colleges of Technology (HCT)": "hct.ac.ae",
  "Honeybadger Exception Monitoring": "honeybadger.io",
  "Horizon English School": "horizonenglishschool.com",
  "Hugging Face University Hub": "huggingface.co",
  "IBM SkillsBuild": "ibm.com",
  "IIT Delhi - Abu Dhabi": "abudhabi.iitd.ac.in",
  "ISG Dhahran (International Schools Group)": "isg.edu.sa",
  "ISIC International Student Identity Pass": "isic.org",
  "Imam Abdulrahman Bin Faisal University (IAU)": "iau.edu.sa",
  "International School of London (ISL) Qatar": "islqatar.org",
  "Jazan University": "jazanu.edu.sa",
  "Jeddah Prep and Grammar School (JPGS)": "jpgs.org",
  "JetBrains Academic Subscription": "jetbrains.com",
  "Jitter Motion Design Pro": "jitter.video",
  "Jouf University": "ju.edu.sa",
  "Jumeirah College": "jumeirahcollege.com",
  "Jumeirah English Speaking School (JESS) Arabian Ranches": "jess.sch.ae",
  "KAUST Destination & Seed Fund for Student Builders": "kaust.edu.sa",
  "KAUST Schools": "tks.kaust.edu.sa",
  "Kaggle GPU & TPU Notebooks": "kaggle.com",
  "Kali Linux Revealed Training": "kali.org",
  "Khalifa University": "ku.ac.ae",
  "Kickresume Premium": "kickresume.com",
  "King Abdulaziz University (KAU)": "kau.edu.sa",
  "King Abdullah University of Science and Technology (KAUST)": "kaust.edu.sa",
  "King Fahd University of Petroleum and Minerals (KFUPM)": "kfupm.edu.sa",
  "King Faisal School": "kfs.sch.sa",
  "King Khalid University": "kku.edu.sa",
  "King Saud University": "ksu.edu.sa",
  "Kingdom Schools": "kingdomschools.edu.sa",
  "Kings' School Dubai": "kings-edu.com",
  "Kiro AI-Native IDE": "kiro.dev",
  "Lablab.ai": "lablab.ai",
  "Lambda Labs GPU Student Access": "lambdalabs.com",
  "LambdaTest Cross-Browser Plan": "lambdatest.com",
  "Lebanese American University": "lau.edu.lb",
  "Levi's Student Discount": "levis.com",
  "Linear Issue Tracker": "linear.app",
  "LocalStack AWS Emulator": "localstack.cloud",
  "Lycée Français International Georges Pompidou": "lfigp.org",
  "MES Indian School Doha": "mesqatar.org",
  "MEYE Initiative": "meyef.org",
  "MIT Beaver Works Summer Institute": "mit.edu",
  "MLH Organization": "mlh.io",
  "MUBI Student Membership": "mubi.com",
  "Major League Hacking (MLH) Global Hackathons": "mlh.io",
  "Manarat Al-Riyadh International School": "maarif.com.sa",
  "Manipal Academy of Higher Education, Dubai": "manipaldubai.com",
  "Mapbox for Students": "mapbox.com",
  "Massachusetts Institute of Technology": "mit.edu",
  "Mawhiba International Summer Program": "mawhiba.org",
  "Mawhiba Saudi Arabia": "mawhiba.org",
  "Microsoft Learn Academic Exam Voucher": "microsoft.com",
  "Microsoft Office 365 Education": "microsoft.com",
  "Middle East Youth Fellowship": "meyef.org",
  "Middlesex University Dubai": "mdx.ac.ae",
  "Miro Education Plan": "miro.com",
  "Mohammed Bin Rashid Innovation Fund (MBRIF) Grant": "mbrif.ae",
  "NASA & Global Partners": "nasa.gov",
  "NASA Space Apps Challenge": "nasa.gov",
  "NVIDIA Deep Learning Institute": "nvidia.com",
  "NYU Abu Dhabi": "nyu.edu",
  "NYUAD Hackathon for Social Good": "nyu.edu",
  "Name.com Custom Domain & SSL": "name.com",
  "Namecheap .me Domain": "namecheap.com",
  "Navicat Database NFR License": "navicat.com",
  "New Relic Student Edition": "newrelic.com",
  "New York University Abu Dhabi": "nyuad.nyu.edu",
  "Nike Student Offer": "nike.com",
  "Nord Anglia International School Dubai": "nordangliaeducation.com",
  "Northwestern University in Qatar": "qatar.northwestern.edu",
  "Notion Student Personal Pro": "notion.so",
  "Oxford Study Courses": "ox.ac.uk",
  "Oxford Summer Academy": "ox.ac.uk",
  "POEditor Localization Plus": "poeditor.com",
  "PUMA Student Discount": "puma.com",
  "Pageclip Form Backend": "pageclip.co",
  "Paramount+ Student Plan": "paramountplus.com",
  "Park House English School": "parkhouseenglishschool.com",
  "Polypane Responsive Browser": "polypane.app",
  "PopSQL Collaborative SQL": "popsql.com",
  "Postman Student Expert": "postman.com",
  "Prince Mohammad Bin Fahd University": "pmu.edu.sa",
  "Prince Sultan University": "psu.edu.sa",
  "Princess Nourah bint Abdulrahman University": "pnu.edu.sa",
  "QSTP Product Development & Proof of Concept Grant": "qstp.org.qa",
  "Qassim University": "qu.edu.sa",
  "Qatar Academy Doha (QAD)": "qad.edu.qa",
  "Qatar Airways Student Club Privilege": "qatarairways.com",
  "Qatar University": "qu.edu.qa",
  "RDIA Saudi Student Innovation Grant (SIGP)": "rdia.gov.sa",
  "Raha International School": "ris.ae",
  "Red Hat Academy Student Subscription": "redhat.com",
  "Repton School Dubai": "reptondubai.org",
  "Rochester Institute of Technology Dubai (RIT Dubai)": "rit.edu/dubai",
  "RoleSharp Student Premium": "rolesharp.com",
  "Royal Grammar School Guildford Dubai (RGS)": "rgsgdubai.ae",
  "RunPod AI GPU Compute Grant": "runpod.io",
  "Ryanair Student Discount": "ryanair.com",
  "SAP Learning Student Edition": "sap.com",
  "Samsung Student & Campus Discount": "samsung.com",
  "Scrimba Pro Pass": "scrimba.com",
  "Sentry Error Monitoring": "sentry.io",
  "Sharjah English School": "sharjahenglishschool.org",
  "Sheraa Student Seed & Venture Grant": "sheraa.ae",
  "Sherborne Qatar": "sherborneqatar.org",
  "SimpleAnalytics Starter Plan": "simpleanalytics.com",
  "Snowflake CoCo CLI Global Hackathon": "snowflake.com",
  "Snowflake Inc.": "snowflake.com",
  "SolidWorks Student Edition": "solidworks.com",
  "Sorbonne University Abu Dhabi": "sorbonne.ae",
  "Spotify Premium for Students": "spotify.com",
  "Stanford Pre-Collegiate Summer Institute": "stanford.edu",
  "Stanford University": "stanford.edu",
  "Superhuman AI Email Client": "superhuman.com",
  "Swiss International School Qatar (SISQ)": "sisq.qa",
  "TDRA ICT Fund BETHA Student Research Grant": "tdra.gov.ae",
  "Taibah University": "taibahu.edu.sa",
  "TechGirls Leadership & Exchange Program": "state.gov",
  "Tencent Cloud Student VPS": "tencentcloud.com",
  "Texas A&M University at Qatar": "qatar.tamu.edu",
  "The British School Al Khubairat (BSAK)": "britishschool.sch.ae",
  "The British University in Dubai": "buid.ac.ae",
  "The Economist Espresso": "economist.com",
  "The English College Dubai": "englishcollege.ac.ae",
  "The King's School Riyadh": "kingscollege-riyadh.com",
  "The Millennium School Dubai": "themillenniumschool-dubai.com",
  "The New York Times Student": "nytimes.com",
  "Transloadit Encoding Pack": "transloadit.com",
  "U.S. Department of State": "state.gov",
  "UXPin Interactive Prototyping": "uxpin.com",
  "Umm Al-Qura University": "uqu.edu.sa",
  "Undergraduate Research Experience Program (UREP)": "qrdi.org.qa",
  "United Arab Emirates University": "uaeu.ac.ae",
  "Unity Student Plan": "unity.com",
  "University of Birmingham Dubai": "birmingham.ac.uk",
  "University of Ha'il": "uoh.edu.sa",
  "University of Sharjah": "sharjah.ac.ae",
  "University of Wollongong in Dubai": "uowdubai.ac.ae",
  "Unreal Engine Academic License": "unrealengine.com",
  "Victory Heights Primary School": "vhprimary.com",
  "Weights & Biases Academic Pro": "wandb.ai",
  "Weill Cornell Medicine - Qatar": "qatar-weill.cornell.edu",
  "YNAB Student Subscription": "ynab.com",
  "YouTube Music Student": "youtube.com",
  "YouTube Premium Student": "youtube.com",
  "Zayed Sustainability Prize Global High Schools Grant": "zayedsustainabilityprize.com",
  "Zayed University": "zu.ac.ae",
  "Zed AI Code Editor Pro": "zed.dev",
  "adidas Student Offer": "adidas.com",
  "edX University Course Audit": "edx.org",
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
    sources.push(`https://unavatar.io/${resolvedDomain}`);
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
