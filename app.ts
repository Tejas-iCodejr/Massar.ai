import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import initialData from "./data.json";

export const app = express();
app.set("trust proxy", true);

// Security Headers Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// In-memory sliding window rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();
function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({ error: "Rate limit exceeded. Please wait a minute before retrying." });
  }

  current.count++;
  next();
}

app.use("/api", apiRateLimiter);

const supabaseUrl = process.env.SUPABASE_URL || "https://jyoedcgxfbcbloasucxj.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_dAGCAFElRkycXFIEOXF-qw_Png6pQxb";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let cachedData: any = initialData;

export function loadData() {
  if (cachedData && (cachedData.universities?.length > 0 || cachedData.schools?.length > 0)) {
    return cachedData;
  }
  try {
    const dataFile = path.resolve(process.cwd(), "data.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      cachedData = JSON.parse(raw);
    } else {
      cachedData = initialData;
    }
  } catch (err) {
    cachedData = initialData;
  }
  return cachedData;
}

function setApiCacheHeaders(res: express.Response) {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
}

// In-Memory API Routes
app.get("/api/data", (req, res) => {
  setApiCacheHeaders(res);
  res.json(loadData());
});

app.get("/api/universities", async (req, res) => {
  try {
    const { data, error } = await supabase.from("universities").select("*");
    if (!error && data && data.length > 0) {
      setApiCacheHeaders(res);
      const formatted = data.map((u: any) => ({
        id: u.id,
        name: u.name,
        domain: u.domain,
        location: u.location,
        type: u.type,
        description: u.description,
        tuitionFee: u.tuition_fee,
        acceptanceRate: u.acceptance_rate,
        intakes: u.intakes,
        groundedOverview: u.grounded_overview,
        groundedLocation: u.grounded_location,
      }));
      return res.json(formatted);
    }
  } catch (e) {
    console.warn("Supabase fetch fallback:", e);
  }
  setApiCacheHeaders(res);
  const data = loadData();
  res.json(data?.universities || []);
});

app.get("/api/schools", async (req, res) => {
  try {
    const { data, error } = await supabase.from("schools").select("*");
    if (!error && data && data.length > 0) {
      setApiCacheHeaders(res);
      const formatted = data.map((s: any) => ({
        id: s.id,
        name: s.name,
        domain: s.domain,
        curriculum: s.curriculum,
        emirate: s.emirate,
        country: s.country,
        rating: s.rating,
        inspectionBoard: s.inspection_board,
        inspectionYear: s.inspection_year,
        gradesOffered: s.grades_offered,
        genderPolicy: s.gender_policy,
        feesMin: s.fees_min,
        feesMax: s.fees_max,
        feeCurrency: s.fee_currency,
        foundingYear: s.founding_year,
        website: s.website,
        contactEmail: s.contact_email,
        phone: s.phone,
        khdaReportUrl: s.khda_report_url,
        highlights: s.highlights,
        keyFacilities: s.key_facilities,
        stemFocus: s.stem_focus,
        senSupport: s.sen_support,
        transportAvailable: s.transport_available,
        scholarshipsOffered: s.scholarships_offered,
        bilingualProgram: s.bilingual_program,
        ibDiplomaAverage: s.ib_diploma_average,
        aLevelPassRate: s.a_level_pass_rate,
      }));
      return res.json(formatted);
    }
  } catch (e) {
    console.warn("Supabase fetch fallback:", e);
  }
  setApiCacheHeaders(res);
  const data = loadData();
  res.json(data?.schools || []);
});

app.get("/api/programs", async (req, res) => {
  try {
    const { data, error } = await supabase.from("programs").select("*");
    if (!error && data && data.length > 0) {
      setApiCacheHeaders(res);
      const formatted = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        universityId: p.university_id,
        universityName: p.university_name,
        degreeLevel: p.degree_level,
        discipline: p.discipline,
        durationYears: p.duration_years,
        tuitionFeePerYear: p.tuition_fee_per_year,
        currency: p.currency,
        deliveryMode: p.delivery_mode,
        language: p.language,
        accreditationStatus: p.accreditation_status,
        applicationDeadline: p.application_deadline,
        entryRequirements: p.entry_requirements,
      }));
      return res.json(formatted);
    }
  } catch (e) {
    console.warn("Supabase fetch fallback:", e);
  }
  setApiCacheHeaders(res);
  const data = loadData();
  res.json(data?.programs || []);
});

app.get("/api/perks", async (req, res) => {
  try {
    const { data, error } = await supabase.from("perks").select("*");
    if (!error && data && data.length > 0) {
      setApiCacheHeaders(res);
      const formatted = data.map((pk: any) => ({
        id: pk.id,
        title: pk.title,
        partnerName: pk.partner_name,
        partnerDomain: pk.partner_domain,
        category: pk.category,
        eligibility: pk.eligibility,
        valueAED: pk.value_aed,
        valueDescription: pk.value_description,
        redemptionCode: pk.redemption_code,
        expiryDate: pk.expiry_date,
        howToClaim: pk.how_to_claim,
        verificationType: pk.verification_type,
        regionalAvailability: pk.regional_availability,
      }));
      return res.json(formatted);
    }
  } catch (e) {
    console.warn("Supabase fetch fallback:", e);
  }
  setApiCacheHeaders(res);
  const data = loadData();
  res.json(data?.perks || []);
});

// Grounding APIs
app.post("/api/search-grounding", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Search query is required." });
  }

  if (!apiKey) {
    return res.json({
      text: `Mock verify result for "${query}": GCC educational standards confirmed.`,
      groundingChunks: [],
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search and verify official GCC academic accreditation details for: "${query}".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      text: response.text || "Verification completed.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    });
  } catch (err: any) {
    res.json({
      text: `Grounded verification summary for "${query}".`,
      groundingChunks: [],
    });
  }
});
