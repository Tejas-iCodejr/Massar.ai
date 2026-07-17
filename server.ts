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

  // Run every 2 minutes for demo purposes (normally this would be daily/weekly)
  cron.schedule("*/2 * * * *", async () => {
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
    } catch (error) {
      console.error("Scraper job failed:", error);
    }
  });
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
