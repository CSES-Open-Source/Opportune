import mongoose from "mongoose";
import Application from "../src/models/Application"; // Adjust path as necessary
import Company from "../src/models/Company"; // Adjust path as necessary
import dotenv from "dotenv";

dotenv.config();

/*
 * USAGE:
 * First, populate the companies with seed-companies.ts
 * Then, run the following command to populate applications for a specific user (e.g. your own):
 * ts-node seed-applicationss.ts <userId>
 */

// The ordered list of company names for mock data
const companyNames = [
  "NVIDIA",
  "Intel",
  "Adobe",
  "Uber",
  "Google",
  "Tesla",
  "Slack",
  "Netflix",
  "IBM",
  "Zoom",
];

// Raw application data template
const applicationDataTemplate = [
  {
    position: "Software Engineer Intern",
    process: [
      { status: "APPLIED", date: "2026-01-26T08:00:00.000Z" },
      { status: "PHONE", date: "2026-01-28T22:34:12.777Z" },
      { status: "FINAL", date: "2026-02-05T08:00:00.000Z" },
    ],
  },
  {
    position: "Hardware Engineer Intern",
    process: [{ status: "APPLIED", date: "2026-01-25T08:00:00.000Z" }],
  },
  {
    position: "Software Engineer Intern",
    process: [{ status: "APPLIED", date: "2026-01-24T08:00:00.000Z" }],
  },
  {
    position: "Software Engineer Intern",
    process: [{ status: "APPLIED", date: "2026-01-20T08:00:00.000Z" }],
  },
  {
    position: "Software Engineer Intern",
    process: [
      { status: "APPLIED", date: "2026-01-18T08:00:00.000Z" },
      { status: "OA", date: "2026-01-24T08:00:00.000Z" },
      { status: "FINAL", date: "2026-01-28T22:40:06.707Z" },
      { status: "OFFER", date: "2026-01-29T08:00:00.000Z" },
    ],
  },
  {
    position: "Software Engineer Intern",
    process: [
      { status: "APPLIED", date: "2026-01-15T08:00:00.000Z" },
      { status: "PHONE", date: "2026-01-22T08:00:00.000Z" },
    ],
  },
  {
    position: "Software Engineer Intern",
    process: [{ status: "APPLIED", date: "2026-01-14T08:00:00.000Z" }],
  },
  {
    position: "Software Engineer Intern",
    process: [
      { status: "APPLIED", date: "2026-01-12T08:00:00.000Z" },
      { status: "REJECTED", date: "2026-01-28T22:39:04.338Z" },
    ],
  },
  {
    position: "Software Engineer Intern",
    process: [
      { status: "APPLIED", date: "2026-01-05T08:00:00.000Z" },
      { status: "GHOSTED", date: "2026-03-19T07:00:00.000Z" },
    ],
  },
  {
    position: "Software Engineer Intern",
    process: [{ status: "APPLIED", date: "2026-01-22T08:00:00.000Z" }],
  },
];

async function seedApplications() {
  const mongoUri = process.env.MONGODB_URI;
  const userId = process.argv[2]; // Get UID from command line argument

  if (!mongoUri) throw new Error("MONGODB_URI not found in environment");
  if (!userId)
    throw new Error(
      "Please provide a User ID as an argument: ts-node script.ts <userId>",
    );

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB...");

    // 1. Clear out existing applications for this user specifically
    await Application.deleteMany({ userId: userId });
    console.log(`Cleared existing applications for user: ${userId}`);

    const applicationsToInsert = [];

    // 2. Map company names to their Database ObjectIDs
    for (let i = 0; i < companyNames.length; i++) {
      const companyName = companyNames[i];
      const appTemplate = applicationDataTemplate[i];

      const companyDoc = await Company.findOne({ name: companyName });

      if (!companyDoc) {
        console.warn(
          `Warning: Company '${companyName}' not found. Skipping...`,
        );
        continue;
      }

      applicationsToInsert.push({
        userId: userId,
        company: companyDoc._id,
        position: appTemplate.position,
        process: appTemplate.process.map((p) => ({
          ...p,
          date: new Date(p.date),
        })),
      });
    }

    // 3. Insert fresh data
    if (applicationsToInsert.length > 0) {
      await Application.insertMany(applicationsToInsert);
      console.log(
        `Successfully seeded ${applicationsToInsert.length} applications.`,
      );
    }
  } catch (error) {
    console.error("Error seeding applications:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedApplications();
