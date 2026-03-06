import mongoose from "mongoose";
import Company from "../src/models/Company";
import User from "../src/models/User";
import InterviewQuestion from "../src/models/InterviewQuestion";
import LeetcodeQuestion from "../src/models/LeetcodeQuestion";
import Tips from "../src/models/Tips";
import dotenv from "dotenv";

/*
 * USAGE:
 * First, populate alumni users with seed-alumni.ts: ts-node seed-alumni.ts
 * Run the following command to populate interviewquestions, leetcodequestions, and tips tables
 * ts-node seed-interview-insights.ts
 */

dotenv.config();

const COMPANY_NAMES = [
  "Google",
  "Meta",
  "Apple",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Tesla",
  "Uber",
  "Airbnb",
  "Spotify",
  "Slack",
  "Zoom",
  "Salesforce",
  "Adobe",
  "Oracle",
  "IBM",
  "Intel",
  "NVIDIA",
  "AMD",
  "Palantir",
];

async function seedAlumniData() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI not found");

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB...");

    // 1. Fetch Companies and Alumni
    const companies = await Company.find({ name: { $in: COMPANY_NAMES } });
    const alumni = await User.find({ type: "ALUMNI" });

    if (companies.length === 0 || alumni.length === 0) {
      throw new Error(
        "Ensure companies and alumni are already seeded in the DB.",
      );
    }

    const getRandomAlumni = () =>
      alumni[Math.floor(Math.random() * alumni.length)]._id;

    // 2. Clear existing data
    await InterviewQuestion.deleteMany({});
    await LeetcodeQuestion.deleteMany({});
    await Tips.deleteMany({});
    console.log(
      "Cleared existing Interview Questions, LeetCode Questions, and Tips.",
    );

    const interviewData = [];
    const leetcodeData = [];
    const tipsData = [];

    // 3. Generate data for each company
    for (const companyName of COMPANY_NAMES) {
      const companyId = companies.find((c) => c.name === companyName)?._id;
      if (!companyId) continue;

      // Seed 2 Interview Questions per company
      for (let i = 0; i < 2; i++) {
        interviewData.push({
          company: companyId,
          user: getRandomAlumni(),
          question: `How would you design a system to handle ${companyName}'s scale for ${i === 0 ? "real-time updates" : "distributed storage"}?`,
          date: new Date(`2026-02-${10 + i}T00:00:00.000Z`),
        });
      }

      // Seed 2 LeetCode Questions per company
      const difficulties: ("EASY" | "MEDIUM" | "HARD")[] = ["MEDIUM", "HARD"];
      for (let i = 0; i < 2; i++) {
        leetcodeData.push({
          company: companyId,
          user: getRandomAlumni(),
          title: `${companyName} Specific Problem ${i + 1}`,
          url: `https://leetcode.com/problems/sample-problem-${i}/`,
          difficulty: difficulties[i],
          date: new Date(`2026-02-${15 + i}T00:00:00.000Z`),
        });
      }

      // Seed 1 Tip per company
      tipsData.push({
        user: getRandomAlumni(),
        company: companyId,
        text: `Focus heavily on ${companyName}'s leadership principles and system design fundamentals.`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 4. Bulk Insert
    await InterviewQuestion.insertMany(interviewData);
    await LeetcodeQuestion.insertMany(leetcodeData);
    await Tips.insertMany(tipsData);

    console.log(`Seeding complete:`);
    console.log(`- ${interviewData.length} Interview Questions`);
    console.log(`- ${leetcodeData.length} LeetCode Questions`);
    console.log(`- ${tipsData.length} Alumni Tips`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seedAlumniData();
