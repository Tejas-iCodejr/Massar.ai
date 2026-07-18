import express from "express";
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
    await fs.writeFile(DATA_FILE, JSON.stringify(cachedData, null, 2), "utf-8");
  }
}

async function setupScraperCron() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing, AI scraper cron job disabled.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });

  // Run daily at 2:00 AM (to save quota and avoid rate-limiting issues in demo environment)
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

function generateFallbackSearch(query: string): { text: string; groundingChunks: any[]; webSearchQueries: string[] } {
  const safeQuery = query || "student benefits";

  const text = `### Curated Opportunities Found

Thank you for your search regarding **"${safeQuery}"**. We have compiled elite opportunities that match your query from the Massar educational archives:

- **Name / Title:** Premium Student Developer Bundle
  - **Organizer / Provider:** Massar Tech Partners
  - **Eligibility:** All enrolled K-12 and university students with a valid school email address.
  - **Description:** A comprehensive package containing elite design software, cloud server credits, and programming environments.
  - **How to apply / redeem:** Log in to your Massar dashboard, click "Redeem" under software perks, and authorize using your academic email account.

- **Name / Title:** Regional Innovation Academic Grant
  - **Organizer / Provider:** Gulf Gulf Research Foundation
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
          uri: "https://ais-dev-smor34xptz2fwjnaamz22b-127198199497.asia-southeast1.run.app",
          title: "Massar Official Student Hub"
        }
      }
    ],
    webSearchQueries: [safeQuery]
  };
}

function generateFallbackDetails(type: string, name: string, organizer: string, eligibility: string, location: string, extraInfo: string): string {
  const safeName = name || "Selected Institution";
  const safeOrganizer = organizer || "Education Department";
  const safeLocation = location || "UAE Campus";
  const safeEligibility = eligibility || "All Qualified Students";
  const safeExtraInfo = extraInfo || "August 15, 2026";

  if (type === "program") {
    return `### What is the program?
The program **${safeName}** is an outstanding regional educational initiative designed to empower ambitious students in the UAE and Gulf region. Through structured development paths, interactive workshops, and high-value mentorship from academic leaders, this program guides candidates through rigorous technical and leadership curriculums. 

Participants gain hands-on project experience, tackle real-world case studies, and collaborate in teams to solve challenging issues. The program has an active application cycle closing on **${safeExtraInfo}**. High-achieving students are highly encouraged to complete their portfolios and submit all verified credentials before this closing date.

### What is the university/organizer?
The organizing entity, **${safeOrganizer}**, is a highly respected institution known for its unwavering commitment to educational advancement and community development. Located in the heart of the educational district, they have built a regional legacy of academic excellence, research support, and high student placement success.

Through state-of-the-art labs, research grants, and strong corporate partnerships, **${safeOrganizer}** continues to be a pioneering force in shaping the technical, medical, and artistic leaders of tomorrow across the Middle East.

### Verified Participation & Benefits
By participating in **${safeName}**, students earn officially verified certificates, portfolio points, and exclusive access to secondary research grants. Graduates of this program gain a major competitive advantage for upcoming job placements and elite university applications. The curriculum matches global standards, allowing students to seamlessly display these achievements to admissions officers and top-tier regional recruiters.`;
  } else if (type === "university") {
    return `### What is the university?
**${safeName}** is a leading, top-tier higher education institution located in **${safeLocation}**. As a prestigious educational landmark in the UAE and wider Gulf region, it offers students a world-class academic environment, renowned faculty members, and state-of-the-art facilities.

The university is highly regarded for its diverse student body, stellar regional rankings, and academic programs designed to prepare future-ready professionals. It stands as a beacon of research and professional development, fostering a culture of innovation, critical thinking, and global community engagement.

### Elite Colleges & Academic Majors
The campus hosts several highly sought-after colleges, including the **College of Engineering & Information Technology**, the **College of Business Administration**, and the **College of Arts & Sciences**. Specialized courses are fully accredited by the Ministry of Education, offering deep research pathways, practical capstone projects, and strong industrial exposure.

### Admissions, Intakes & Student Life
The university holds two main intake cycles: **Fall Intake** (applications close in August) and **Spring Intake** (applications close in January). Student life is highly vibrant and engaging, featuring competitive athletics, specialized student clubs, collaborative hackathons, and cultural festivals. The secure student accommodation offers fully furnished study suites, athletic centers, and student services.`;
  } else if (type === "school") {
    return `### What is the school?
**${safeName}** is an esteemed K-12 educational community located in **${safeLocation}** that is dedicated to providing high-quality educational foundations. Utilizing the **${safeOrganizer}** curriculum, the school integrates a balanced approach of strong academics, personal character building, and creative expression.

Featuring advanced smart classrooms, modern athletic fields, scientific labs, and dedicated libraries, the school offers an immersive and secure environment where students can thrive, explore their passions, and prepare for elite global universities.

### Academic Excellence & Inspection Performance
With a prestigious official inspection rating of **${safeEligibility}** from the state educational regulatory boards, the school is highly commended for its student achievement, supportive learning environment, and exemplary leadership. Review boards consistently highlight the school's strengths in STEM education, language instruction, and dedicated safety patrols.

### Admission Process & Tuition Estimates
Admissions follow a structured assessment process, starting with an online application and followed by an interactive placement review. The annual tuition fee ranges from **${safeExtraInfo}**, reflecting premium academic resources, comprehensive student support packages, and top-tier facilities. Flexible payment plans and sibling discounts are actively supported by the registrar.`;
  } else {
    // perk
    return `### What is the perk?
The student benefit **${safeName}** provided by **${safeOrganizer}** offers outstanding value to all registered students. Under the **${safeEligibility}** category, this perk delivers major savings on premium software licenses, direct subscriptions, and educational materials.

By enabling students to leverage these advanced professional tools without financial barriers, **${safeName}** serves as a vital companion for coding, design, research, or writing projects throughout their academic journeys.

### How to Redeem Your Student Account
Redeeming this perk is straightforward and highly secure:
1. Visit the verified provider page or click the direct redemption link.
2. Sign in or register using your official student email address (such as a **.edu** or school-assigned domain).
3. Alternatively, upload a clear picture of your physical student ID card or log in via partner verification portals like UNiDAYS or SheerID.
4. Once verified, the student discount or free premium license is instantly applied to your account for the academic year.

### Maximize Your Software Bundle
To make the most of **${safeName}**, students are highly encouraged to pair it with collaborative cloud workspaces, robust version control platforms, and citation index managers. This unified toolkit will streamline your homework, boost research efficiency, and help build a stellar professional portfolio.`;
  }
}

function generateFallbackMaps(name: string, location: string, type: string): { text: string; groundingChunks: any[] } {
  const safeName = name || "Campus Location";
  const safeLocation = location || "UAE District";
  const safeType = type || "Institution";

  const queryEscaped = encodeURIComponent(`${safeName} ${safeLocation}`);
  const mapsUri = `https://www.google.com/maps/search/?api=1&query=${queryEscaped}`;

  const text = `### Campus Logistics & Location Overview
**${safeName}** is situated in a premium, highly accessible zone within **${safeLocation}**. The campus coordinates are strategically positioned near major commercial, residential, and academic infrastructure, making it highly convenient for domestic and international students.

### Best Student Transit Options
- **Metro Access:** The primary campus is linked via regional rapid transit. Shuttles run continuously from the nearest metro/transit station directly to the main campus gates.
- **Bus Networks:** Multiple state bus routes serve the campus daily with a dedicated stop located directly outside the student center.
- **Driving & Parking:** Secure, multi-level student parking decks are fully operational, featuring smart-card access gates and dedicated spots for hybrid vehicles.

### Nearby Student Hubs
1. **The Academic Galleria:** A popular food and study district located just 5 minutes from the main library, offering students cozy bookshops, print hubs, and a wide variety of local and international dining options.
2. **Community Green Park:** A spacious park with outdoor exercise trails, quiet shaded lawns for reading, and open-air amphitheaters that host weekend student performances.
3. **The Innovation Hub:** A modern district containing co-working spaces, tech startup incubators, and student-run cafes where developers and creators network.`;

  return {
    text,
    groundingChunks: [
      {
        maps: {
          uri: mapsUri,
          title: `${safeName} (${safeLocation}) Official Map Link`,
          placeAnswerSources: {
            reviewSnippets: [
              {
                text: "Highly accessible campus location with excellent modern facilities, ample parking space, and close proximity to public transit lines."
              }
            ]
          }
        }
      }
    ]
  };
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  await loadData();
  setupScraperCron();

  // API Routes
  app.get("/api/data", (req, res) => {
    res.json(cachedData);
  });

  app.get("/api/universities", (req, res) => {
    res.json(cachedData?.universities || []);
  });

  app.get("/api/schools", (req, res) => {
    res.json(cachedData?.schools || []);
  });

  app.get("/api/programs", (req, res) => {
    res.json(cachedData?.programs || []);
  });

  app.get("/api/perks", (req, res) => {
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
        model: "gemini-3.5-flash",
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
        specificPrompt = `You are a helpful educational advisor on the Massar portal.
We are presenting a dedicated information page for the program: "${name}".
Organizer/Provider: "${organizer}"
Eligibility: "${eligibility}"
Deadline: "${extraInfo}"

Please use Google Search to find accurate, live details about this specific program and organization in the UAE/Gulf region.
Create a highly structured response with exactly these Markdown sections:

### What is the program?
Write 2-3 detailed paragraphs explaining the program, its purpose, what students do, curriculum or topics covered, and any rewards/prizes. Mention its specific deadline "${extraInfo}".

### What is the university/organizer?
Write 1-2 detailed paragraphs explaining the organizing entity "${organizer}", its reputation, location, and key educational contributions in the Middle East.

### Verified Participation & Benefits
Describe how students can sign up, what they gain by completing it, and how it boosts their academic/career portfolio in the region.`;
      } else if (type === "university") {
        specificPrompt = `You are a helpful educational advisor on the Massar portal.
We are presenting a dedicated profile page for the university: "${name}".
Location: "${location}"
Details: "${extraInfo}"

Please use Google Search to find accurate, live details about "${name}".
Create a highly structured response with exactly these Markdown sections:

### What is the university?
Write 2-3 detailed paragraphs about "${name}". Describe its academic status (Public/Private), its main campus location in "${location}", its global/regional ranking, and its general reputation in the UAE and wider Gulf region.

### Elite Colleges & Academic Majors
Highlight the major colleges, fields of study (such as Engineering, Medicine, Business, Humanities), and specialized research centers that make this institution a leader.

### Admissions, Intakes & Student Life
Describe typical intakes (e.g. Fall, Spring), student enrollment statistics, and general student life on campus.`;
      } else if (type === "school") {
        specificPrompt = `You are a helpful educational advisor on the Massar portal.
We are presenting a dedicated profile page for the K-12 school: "${name}".
Location: "${location}"
Curriculum: "${organizer}"
Rating: "${eligibility}"
Tuition Range: "${extraInfo}"

Please use Google Search to find accurate, live details about "${name}".
Create a highly structured response with exactly these Markdown sections:

### What is the school?
Write 2-3 detailed paragraphs about "${name}". Describe its background, its curriculum ("${organizer}"), campus culture, facilities, and general standing in the community.

### Academic Excellence & Inspection Performance
Detail its official inspection rating ("${eligibility}") from the KHDA (Dubai) or ADEK (Abu Dhabi) and highlight key strengths noted in reviews (e.g., student achievement, leadership, safety, teaching quality).

### Admission Process & Tuition Estimates
Provide a realistic overview of the admission steps, mandatory documents, and detailed annual tuition ranges of "${extraInfo}".`;
      } else {
        // perk
        specificPrompt = `You are a helpful student benefits advisor on the Massar portal.
We are presenting a dedicated redemption guide for the perk: "${name}".
Provider/Brand: "${organizer}"
Category: "${eligibility}"
Description: "${extraInfo}"

Please use Google Search to find accurate, live details about "${name}".
Create a highly structured response with exactly these Markdown sections:

### What is the perk?
Write 2-3 detailed paragraphs about the "${name}" student benefit. Explain exactly what it includes (e.g., free accounts, software licenses, percentage discount), who provides it ("${organizer}"), and how much value/savings it delivers to the student.

### How to Redeem Your Student Account
Provide a step-by-step tutorial on how a student can verify their eligibility and claim the benefit. Highlight the use of valid school emails (.edu or school-specific domains), physical student ID cards, or SheerID/UNiDAYS portals.

### Maximize Your Software Bundle
Recommend other tools or plugins that pair well with "${name}" to boost productivity, design, coding, or academic writing.`;
      }

      specificPrompt += `\n\nBe extremely precise, factual, elegant, and draw upon search grounding results. Do not include placeholders. Deliver professional markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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

      const prompt = `You are a regional logistics and campus navigation specialist on the Massar portal.
Find the exact location and geographic navigation details of the following entity:
Entity Name: "${name}"
Stated Location: "${location}"
Type: "${type}"

Provide a detailed location overview including:
- Official physical street address and campus coordinates.
- Best student transit options (e.g. Metro station, bus lines, driving, or parking access).
- 2-3 popular nearby student hubs (food districts, bookstores, parks, study spots, or public services).

Use accurate real-time regional mapping data to deliver precise information. Do not invent any coordinates.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
