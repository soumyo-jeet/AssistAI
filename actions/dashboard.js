"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3
  }
});

const DEFAULT_INSIGHTS = {
  salaryRanges: [{
    role: "Entry-Level Position",
    min: 50000,
    max: 100000,
    median: 75000,
    location: "Global"
  }],
  growthRate: 5.0,
  demandLevel: "Medium",
  topSkills: ["Adaptability", "Technical Literacy"],
  marketOutlook: "Neutral",
  keyTrends: ["Industry Evolution", "Technology Adoption"],
  recommendedSkills: ["AI Fundamentals", "Data Analysis"]
};

const VALID_DEMAND_LEVELS = new Set(["High", "Medium", "Low"]);


export const generateIndustryInsights = async (industry) => {
  if (!industry?.trim()) throw new Error("Industry is required");

  const strictPrompt = `
    Generate ${industry} industry insights in this EXACT JSON format:
    {
      "demandLevel": "${Array.from(VALID_DEMAND_LEVELS).join('|')}",
      "growthRate": number,
      "salaryRanges": [{
        "role": "string", 
        "min": number, 
        "max": number,
        "median": number,
        "location": "string"
      }],
      "topSkills": ["string"],
      "marketOutlook": "string",
      "keyTrends": ["string"],
      "recommendedSkills": ["string"]
    }
    Rules:
    1. demandLevel MUST be one of: ${Array.from(VALID_DEMAND_LEVELS).join(', ')}
    2. Include exactly 3 salary ranges
    3. Return ONLY the JSON object with NO additional text
    4. All fields are REQUIRED
  `;

  try {
    const result = await model.generateContent(strictPrompt);
    const text = result.response.text();
    const jsonString = text.replace(/```json|```/g, "").trim();
    
    const aiData = JSON.parse(jsonString);
    
    const validated = {
      demandLevel: VALID_DEMAND_LEVELS.has(aiData.demandLevel) 
        ? aiData.demandLevel 
        : "Medium",
      growthRate: Number(aiData.growthRate) || DEFAULT_INSIGHTS.growthRate,
      salaryRanges: (aiData.salaryRanges || []).slice(0, 3).map(range => ({
        ...DEFAULT_INSIGHTS.salaryRanges[0],
        ...range
      })),
      topSkills: aiData.topSkills || DEFAULT_INSIGHTS.topSkills,
      marketOutlook: aiData.marketOutlook || DEFAULT_INSIGHTS.marketOutlook,
      keyTrends: aiData.keyTrends || DEFAULT_INSIGHTS.keyTrends,
      recommendedSkills: aiData.recommendedSkills || DEFAULT_INSIGHTS.recommendedSkills
    };
    
    if (!VALID_DEMAND_LEVELS.has(validated.demandLevel)) {
      validated.demandLevel = "Medium";
    }

    return validated;

  } catch (error) {
    console.error("AI generation failed, using defaults. Error:", error.message);
    return {
      ...DEFAULT_INSIGHTS,
      demandLevel: "Medium"
    };
  }
};

export const createOrUpdateIndustryInsight = async (industry, tx) => {
  const insights = await generateIndustryInsights(industry);
  
  return tx.industryInsight.upsert({
    where: { industry },
    create: {
      industry,
      demandLevel: insights.demandLevel,
      growthRate: insights.growthRate,
      salaryRanges: insights.salaryRanges,
      topSkills: insights.topSkills,
      marketOutlook: insights.marketOutlook,
      keyTrends: insights.keyTrends,
      recommendedSkills: insights.recommendedSkills,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    update: {
      demandLevel: insights.demandLevel,
      growthRate: insights.growthRate,
      salaryRanges: insights.salaryRanges,
      topSkills: insights.topSkills,
      marketOutlook: insights.marketOutlook,
      keyTrends: insights.keyTrends,
      recommendedSkills: insights.recommendedSkills,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
};



export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
