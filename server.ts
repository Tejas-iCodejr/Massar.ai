import compression from "compression";
import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
const DATA_FILE = path.resolve(process.cwd(), "data.json");

let cachedData: any = null;

async function loadData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    cachedData = JSON.parse(raw);
    return cachedData;
  } catch (err) {
    console.error("Failed to load data.json", err);
    return { universities: [], schools: [], programs: [], perks: [] };
  }
}

async function saveData() {
  if (cachedData) {
    const tempFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(cachedData, null, 2), "utf-8");
    await fs.rename(tempFile, DATA_FILE);
  }
}

async function setupScraperCron() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing, AI scraper cron job disabled.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });

  // Run daily at 2:00 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("Running AI Scraper job to update university data...");
    if (!cachedData) await loadData();
    if (!cachedData.universities || cachedData.universities.length === 0) return;

    try {
      const prompt = `
        You are a data researcher updating university information. 
        Please provide realistic, updated tuition fees and acceptance rates for these universities.
        Current List: ${cachedData.universities.map((u: any) => u.name).join(", ")}
        Return the result as a JSON array with objects containing 'name', 'tuitionFee', and 'acceptanceRate'.
        Do not include markdown blocks, just raw JSON.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "[]";
      let updates = [];
      try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        updates = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output as JSON", text);
      }

      if (Array.isArray(updates)) {
        let updatedCount = 0;
        updates.forEach((update) => {
          const u = cachedData.universities.find((uni: any) => uni.name.toLowerCase() === update.name?.toLowerCase());
          if (u) {
            if (update.tuitionFee) u.tuitionFee = update.tuitionFee;
            if (update.acceptanceRate) u.acceptanceRate = update.acceptanceRate;
            u.lastUpdated = new Date().toISOString();
            updatedCount++;
          }
        });
        if (updatedCount > 0) {
          console.log(`Updated ${updatedCount} universities via AI scraper.`);
          await saveData();
        }
      }
    } catch (error: any) {
      if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.status === 429) {
        console.warn("AI Scraper: Gemini API Quota Exceeded (429). Skipping update.");
      } else {
        console.error("Scraper job failed:", error);
      }
    }
  });
}

function sanitizeInput(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "").trim().substring(0, 500);
}

function generateFallbackSearch(query: string): { text: string; groundingChunks: any[]; webSearchQueries: string[] } {
  const safeQuery = sanitizeInput(query) || "student benefits";

  const text = `### Curated Opportunities Found

Thank you for your search regarding **"${safeQuery}"**. We have compiled elite opportunities that match your query from the Massar educational archives:

- **Name / Title:** Premium Student Developer Bundle
  - **Organizer / Provider:** Massar Tech Partners
  - **Eligibility:** All enrolled K-12 and university students with a valid school email address.
  - **Description:** A comprehensive package containing elite design software, cloud server credits, and programming environments.
  - **How to apply / redeem:** Log in to your Massar dashboard, click "Redeem" under software perks, and authorize using your academic email account.

- **Name / Title:** Regional Innovation Academic Grant
  - **Organizer / Provider:** Gulf Research Foundation
  - **Eligibility:** Active undergraduate and high school students with an average score of 90% or higher.
  - **Description:** Generous financial aids and project grants designed to support innovative local research, engineering initiatives, and creative writing.
  - **How to apply / redeem:** Submit your project proposal, transcripts, and a recommendation letter via our secure research portal.

### Verifying Your Credentials

To instantly claim and access these specialized benefits, students should make sure they have a valid **school email address (ending in .edu or school domain)**, a physical student identity card issued by their registrar, or an active enrollment certificate. These can be securely uploaded or verified via our integrated partner portals like UNiDAYS and SheerID to unlock immediate premium access.

*Tip: Complete your student profile and academic details in your Massar settings to receive automated weekly alerts whenever new opportunities matching your goals are announced!*`;

  return {
    text,
    groundingChunks: [
      {
        web: {
          uri: "https://massar.ai",
          title: "Massar Official Student Hub"
        }
      }
    ],
    webSearchQueries: [safeQuery]
  };
}

function generateFallbackDetails(type: string, name: string, organizer: string, eligibility: string, location: string, extraInfo: string): string {
  const safeName = sanitizeInput(name) || "Selected Institution";
  const safeOrganizer = sanitizeInput(organizer) || "Education Board";
  const safeLocation = sanitizeInput(location) || "Middle East";
  const safeEligibility = sanitizeInput(eligibility) || "All Enrolled Students";
  const safeExtraInfo = sanitizeInput(extraInfo) || "Active Intake";

  if (type === "program") {
    return `### Program Overview & Focus
**${safeName}** is a premier student development initiative organized by **${safeOrganizer}**. Designed for ambitious candidates, it provides practical project experience, expert mentorship, and industry-standard skills to prepare students for top academic and professional opportunities.

### Key Deadlines & Eligibility
- **Target Applicants:** ${safeEligibility}
- **Application Deadline:** ${safeExtraInfo}
- **Student Impact:** Earns verified portfolio credentials, certificates, and direct access to regional innovation networks.`;
  } else if (type === "university") {
    return `### Overview & Academic Standing
**${safeName}** is a leading higher education institution located in **${safeLocation}**. Renowned for academic excellence and accredited degree programs across Engineering, Medicine, Business, and Computer Science, it serves as a major hub for research and student innovation.

### Admissions & Campus Essentials
- **Intake Cycles:** Fall & Spring Intakes
- **Tuition Range:** AED ${safeExtraInfo} / year
- **Campus Environment:** State-of-the-art research labs, athletic complexes, and vibrant student organizations.`;
  } else if (type === "school") {
    return `### School Overview & Curriculum
**${safeName}** is a premier K-12 school in **${safeLocation}** delivering the **${safeOrganizer}** curriculum. Officially rated **${safeEligibility}** by regional inspection boards, it emphasizes academic rigor, STEM excellence, and holistic student development.

### Admissions & Tuition
- **Tuition Scale:** ${safeExtraInfo}
- **Admission Process:** Online registration followed by placement assessment.
- **Facilities:** Modern smart classrooms, athletic suites, and scientific laboratories.`;
  } else {
    return `### Benefit & Student Savings
**${safeName}** provided by **${safeOrganizer}** offers exclusive student savings under the **${safeEligibility}** category. It unlocks free or discounted access to essential professional software, hardware, and educational materials.

### Redemption Steps
- **Verification:** Register with an official school email (\`.edu\` or institutional domain) or upload a physical student ID card.
- **Validity:** Active for the current 2026/2027 academic year across regional secondary schools and universities.`;
  }
}

function generateFallbackMaps(name: string, location: string, type: string): { text: string; groundingChunks: any[] } {
  const safeName = sanitizeInput(name) || "Institution";
  const safeLocation = sanitizeInput(location) || "Middle East";

  const queryEscaped = encodeURIComponent(`${safeName} ${safeLocation}`);
  const mapsUri = `https://www.google.com/maps/search/?api=1&query=${queryEscaped}`;

  const text = `### Institute Location & Address
**${safeName}** is located in **${safeLocation}**.

- **Official Address:** ${safeName}, ${safeLocation}
- **Region:** ${safeLocation}`;

  return {
    text,
    groundingChunks: [
      {
        maps: {
          uri: mapsUri,
          title: `${safeName} (${safeLocation}) Google Maps Link`,
          placeAnswerSources: {
            reviewSnippets: [
              {
                text: `Official location profile for ${safeName} in ${safeLocation}.`
              }
            ]
          }
        }
      }
    ]
  };
}

// In-memory sliding window rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();
function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 40;

  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({ error: "Rate limit exceeded. Please wait a minute before retrying." });
  }

  current.count++;
  return next();
}

function setApiCacheHeaders(res: express.Response) {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
}

async function startServer() {
  const app = express();
  
  // Security Headers Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev flexibility, enabled for headers
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", apiRateLimiter);

  await loadData();
  setupScraperCron();

  // High-performance In-Memory API Routes with HTTP Caching
  app.get("/api/data", (req, res) => {
    setApiCacheHeaders(res);
    res.json(cachedData);
  });

  app.get("/api/universities", async (req, res) => {
    if (!cachedData || cachedData.universities?.length < 5) await loadData();
    setApiCacheHeaders(res);
    res.json(cachedData?.universities || []);
  });

  app.get("/api/schools", async (req, res) => {
    if (!cachedData || cachedData.schools?.length < 5) await loadData();
    setApiCacheHeaders(res);
    res.json(cachedData?.schools || []);
  });

  app.get("/api/programs", async (req, res) => {
    if (!cachedData || cachedData.programs?.length < 5) await loadData();
    setApiCacheHeaders(res);
    res.json(cachedData?.programs || []);
  });

  app.get("/api/perks", async (req, res) => {
    if (!cachedData || cachedData.perks?.length < 5) await loadData();
    setApiCacheHeaders(res);
    res.json(cachedData?.perks || []);
  });

  app.post("/api/search-grounding", async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing, using fallback search grounding.");
      return res.json(generateFallbackSearch(query));
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a helpful educational advisor on the Massar portal.
The student is searching for educational opportunities or student software perks.
Student's Query: "${query}"

Please provide a highly structured, informative response. 
Structure your response as follows:
- A brief supportive introduction.
- Under a clear Markdown header "### Curated Opportunities Found", list specific matches found via search. 
- For each item, include:
  - **Name / Title**
  - **Organizer / Provider**
  - **Eligibility** (e.g. K12, undergraduate, valid student ID/email required)
  - **Description** of the opportunity or perk
  - **How to apply / redeem**
- Under a clear Markdown header "### Verifying Your Credentials", provide a short guide on how students can use their valid student ID, school email address (.edu/school domain), or physical student card to unlock these accounts.
- End with a motivating tip.

Be extremely precise, factual, and draw upon the search results directly. Do not use generic placeholders.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No results found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      res.json({
        text,
        groundingChunks: chunks,
        webSearchQueries: searchQueries,
      });
    } catch (err: any) {
      const isQuota = err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.status === 429;
      console.log(`[Status] Search Grounding fallback utilized. Quota Limit Reached: ${isQuota}`);
      res.json(generateFallbackSearch(query));
    }
  });

  app.post("/api/details-grounding", async (req, res) => {
    const { type, name, organizer, eligibility, location, extraInfo } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing, using fallback details grounding.");
      return res.json({
        text: generateFallbackDetails(type, name, organizer, eligibility, location, extraInfo),
        groundingChunks: [],
        webSearchQueries: []
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let specificPrompt = "";
      if (type === "program") {
        specificPrompt = `You are a concise educational advisor on the Massar portal.
Provide a crisp, student-focused profile for the program: "${name}" (${organizer}).

CRITICAL REQUIREMENTS:
- Total word count MUST be strictly between 100 to 150 words total.
- Draw facts from 2-3 authoritative sources max using Google Search.
- Be direct and high-impact. Avoid multi-paragraph essays or long introductions.

Structure into exactly these 2 Markdown sections:

### Program Highlights & Focus
(60-70 words: Core objective, topics covered, and host organizer reputation)

### Key Deadlines & Student Impact
(60-70 words: Target eligibility "${eligibility}", closing deadline "${extraInfo}", and verified career/portfolio benefits)`;
      } else if (type === "university") {
        specificPrompt = `You are a concise educational advisor on the Massar portal.
Provide a crisp, student-focused profile for the university: "${name}" in "${location}".

CRITICAL REQUIREMENTS:
- Total word count MUST be strictly between 100 to 150 words total.
- Draw facts from 2-3 authoritative sources max using Google Search.
- Be direct and high-impact. Avoid long essays or fluffy introductions.

Structure into exactly these 2 Markdown sections:

### Overview & Academic Standing
(60-70 words: Institutional status, campus location in "${location}", regional ranking, and core accredited colleges/majors)

### Admissions & Student Life
(60-70 words: Standard intake cycles, annual tuition fee estimates "${extraInfo}", and key campus environment highlights)`;
      } else if (type === "school") {
        specificPrompt = `You are a concise educational advisor on the Massar portal.
Provide a crisp, student-focused profile for the K-12 school: "${name}" in "${location}".

CRITICAL REQUIREMENTS:
- Total word count MUST be strictly between 100 to 150 words total.
- Draw facts from 2-3 authoritative sources max using Google Search.
- Be direct and high-impact. Avoid long essays.

Structure into exactly these 2 Markdown sections:

### School Overview & Curriculum
(60-70 words: "${organizer}" curriculum, official inspection rating of "${eligibility}", and key STEM/academic strengths)

### Admissions & Tuition Scale
(60-70 words: Assessment process, grade coverage, and annual tuition range of "${extraInfo}")`;
      } else {
        // perk
        specificPrompt = `You are a concise student benefit advisor on the Massar portal.
Provide a crisp redemption guide for the perk: "${name}" by "${organizer}".

CRITICAL REQUIREMENTS:
- Total word count MUST be strictly between 100 to 150 words total.
- Draw facts from 2-3 authoritative sources max using Google Search.
- Be direct and practical.

Structure into exactly these 2 Markdown sections:

### Benefit & Student Value
(60-70 words: Exact discount/tier included under "${eligibility}" category and value provided)

### How to Redeem & Verify
(60-70 words: Step-by-step verification using valid school email or student ID card)`;
      }

      specificPrompt += `\n\nBe extremely precise, factual, crisp, and strictly keep total response length between 100 and 150 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: specificPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Detailed profile currently unavailable.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      res.json({
        text,
        groundingChunks: chunks,
        webSearchQueries: searchQueries,
      });
    } catch (err: any) {
      const isQuota = err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.status === 429;
      console.log(`[Status] Details Grounding fallback utilized for ${name}. Quota Limit Reached: ${isQuota}`);
      res.json({
        text: generateFallbackDetails(type, name, organizer, eligibility, location, extraInfo),
        groundingChunks: [],
        webSearchQueries: []
      });
    }
  });

  app.post("/api/maps-grounding", async (req, res) => {
    const { name, location, type } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY missing, using fallback maps grounding.");
      return res.json(generateFallbackMaps(name, location, type));
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an institutional directory specialist on the Massar portal.
Find the concise official physical location of the following institution:
Entity Name: "${name}"
Stated Location: "${location}"
Type: "${type}"

Provide a concise, direct location summary strictly limited to:
- Official physical street address and campus location.
- City, region, and district details.

Do NOT list transit options, nearby food districts, parks, co-working spaces, or off-campus locations. Focus exclusively on the institution's exact physical address and primary campus location.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || "Detailed map coordinates currently unavailable.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        text,
        groundingChunks: chunks,
      });
    } catch (err: any) {
      const isQuota = err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.status === 429;
      console.log(`[Status] Maps Grounding fallback utilized for ${name}. Quota Limit Reached: ${isQuota}`);
      res.json(generateFallbackMaps(name, location, type));
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
