import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { validationResult, matchedData } from "express-validator";
import { Groq } from "groq-sdk";
import validationErrorParser from "../util/validationErrorParser";
import User from "../models/User";
import Student from "../models/Student";
import Alumni from "../models/Alumni";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to calculate shared interests
const calculateSharedInterests = (
  student: any, // Typed as any for simplicity in this helper, could be strict
  alumni: any
): string[] => {
  const shared: string[] = [];

  // 1. Compare Student Field of Interest vs Alumni Specializations/Industry
  if (student.fieldOfInterest && alumni.specializations) {
    const studentFields = student.fieldOfInterest.map((s: string) => s.toLowerCase());
    const alumniSpecs = alumni.specializations.map((s: string) => s.toLowerCase());

    const common = studentFields.filter((f: string) => alumniSpecs.some((s: string) => s.includes(f) || f.includes(s)));
    shared.push(...common);
  }

  // 2. Compare Hobbies
  if (student.hobbies && alumni.hobbies) {
    const studentHobbies = student.hobbies.map((s: string) => s.toLowerCase());
    const alumniHobbies = alumni.hobbies.map((s: string) => s.toLowerCase());

    const common = studentHobbies.filter((h: string) => alumniHobbies.includes(h));
    shared.push(...common);
  }

  // 3. Compare Skills
  if (student.skills && alumni.skills) {
    const studentSkills = student.skills.map((s: string) => s.toLowerCase());
    const alumniSkills = alumni.skills.map((s: string) => s.toLowerCase());

    const common = studentSkills.filter((s: string) => alumniSkills.includes(s));
    shared.push(...common);
  }

  // 4. Compare Organizations (if student organizations existed in model, but for now we look at general matches if name mentions logic)
  // Since User model has organizations for both, check that
  if (student.organizations && alumni.organizations) {
    const studentOrgs = student.organizations.map((s: string) => s.toLowerCase());
    const alumniOrgs = alumni.organizations.map((s: string) => s.toLowerCase());

    const common = studentOrgs.filter((o: string) => alumniOrgs.includes(o));
    shared.push(...common);
  }

  return [...new Set(shared)]; // unique items
};


export const generateEmail: RequestHandler = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, validationErrorParser(errors)));
  }

  const { studentId, alumniId, tone, purpose } = matchedData(req);

  // 1. Fetch Student and Alumni Data
  // We need both the User document (for name, etc) and the specific Student/Alumni document (for details)
  // However, the User model contains most things now based on my earlier read, but Student/Alumni specific models exist too.
  // Let's rely on the User model as the base, and fetch specific profiles if needed.
  // Actually, User.ts seems to contain most fields (organizations, specializations, etc) for Alumni, and (major, school) for Student.
  // But Student.ts has fieldOfInterest. Let's fetch both to be safe.

  const studentUser = await User.findById(studentId);
  const alumniUser = await User.findById(alumniId).populate("company");

  if (!studentUser || !alumniUser) {
    return next(createHttpError(404, "Student or Alumni not found"));
  }

  // Fetch specialized docs if needed (Student model has fieldOfInterest)
  const studentProfile = await Student.findOne({ userId: studentId });
  const alumniProfile = await Alumni.findOne({ userId: alumniId });

  // Merge data for processing
  const studentData = {
    ...studentUser.toObject(),
    ...studentProfile?.toObject(),
    // Ensure arrays exist
    fieldOfInterest: studentProfile?.fieldOfInterest || studentUser.fieldOfInterest || [],
    hobbies: studentProfile?.hobbies || studentUser.hobbies || [],
    skills: studentProfile?.skills || studentUser.skills || [],
    projects: studentProfile?.projects || studentUser.projects || [],
  };

  const alumniData = {
    ...alumniUser.toObject(),
    ...alumniProfile?.toObject(),
    organizations: alumniProfile?.organizations || alumniUser.organizations || [],
    specializations: alumniProfile?.specializations || alumniUser.specializations || [],
    hobbies: alumniProfile?.hobbies || alumniUser.hobbies || [],
    skills: alumniProfile?.skills || alumniUser.skills || []
  };

  // 2. Calculate Shared Interests
  const sharedInterests = calculateSharedInterests(studentData, alumniData);

  // 3. Construct Prompt
  const prompt = `
  Write a personalized email from a student to an alumnus.
  
  **Student Details:**
  - Name: ${studentData.name}
  - Major: ${studentData.major || "Undecided"}
  - School: ${studentData.school || "University"}
  
  **Alumni Details:**
  - Name: ${alumniData.name}
  - Position: ${alumniData.position || "Professional"}
  - Company: ${(alumniData.company as any)?.name || "their company"}
  
  **Shared Interests/Common Ground:**
  ${sharedInterests.length > 0 ? sharedInterests.join(", ") : "None specifically found, focus on their career path."}
  
  **User Options:**
  - Tone: ${tone || "Professional"}
  - Purpose: ${purpose || "To ask for a coffee chat to learn more about their career."}
  
  **Instructions:**
  - Keep it concise (under 150 words).
  - Use the shared interests to build rapport if available.
  - Be polite and respectful.
  - Output ONLY the email body text. Do not include subject line or placeholders like "[Insert Name]".
  `;

  // 4. Call Groq
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful career assistant helping students network with alumni."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 300
    });

    const emailContent = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({ email: emailContent, sharedInterests });

  } catch (error) {
    console.error("Groq API Error:", error);
    return next(createHttpError(500, "Failed to generate email. Please try again later."));
  }
});
