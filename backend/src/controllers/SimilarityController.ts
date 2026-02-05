import createHttpError from "http-errors";
import Groq from "groq-sdk";

interface StudentData {
  name: string;
  school?: string;
  fieldOfInterest?: string[];
  projects?: string[];
  hobbies?: string[];
  skills?: string[];
  companiesOfInterest?: string[];
  major?: string;
  classLevel?: string;
}

interface AlumniData {
  name: string;
  position?: string;
  company?: string;
  organizations?: string[];
  specializations?: string[];
  hobbies?: string[];
  skills?: string[];
}

interface Similarity {
  category: string;
  description: string;
}

interface SimilarityResponse {
  similarities: Similarity[];
  summary: string;
}


export async function analyzeSimilarities(
  student: StudentData,
  alumni: AlumniData,
): Promise<SimilarityResponse> {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw createHttpError(500, "Groq API key not configured");
  }

  const groq = new Groq({ apiKey: groqApiKey });

  const prompt = `
    You are an expert career mentor analyzing similarities between a student and an alumni.

    STUDENT PROFILE:
    - Name: ${student.name}
    - School: ${student.school || "Not provided"}
    - Major: ${student.major || "Not provided"}
    - Class Level: ${student.classLevel || "Not provided"}
    - Field of Interest: ${student.fieldOfInterest?.join(", ") || "Not provided"}
    - Skills: ${student.skills?.join(", ") || "Not provided"}
    - Hobbies: ${student.hobbies?.join(", ") || "Not provided"}
    - Projects: ${student.projects?.join(", ") || "Not provided"}
    - Companies of Interest: ${student.companiesOfInterest?.join(", ") || "Not provided"}

    ALUMNI PROFILE:
    - Name: ${alumni.name}
    - Position: ${alumni.position || "Not provided"}
    - Company: ${alumni.company || "Not provided"}
    - Specializations: ${alumni.specializations?.join(", ") || "Not provided"}
    - Skills: ${alumni.skills?.join(", ") || "Not provided"}
    - Hobbies: ${alumni.hobbies?.join(", ") || "Not provided"}
    - Organizations: ${alumni.organizations?.join(", ") || "Not provided"}

    List the key similarities between the students and alumni in a single line. Don't use 
    complete sentences and no need to focus on grammer. If the two don't have similarities
    on a specific topic, then don't mention it. Focus on: 
    1. Shared skills
    2. Overlapping interests
    3. Similar career goals
    4. Shared hobbies and passions
    5. Similar Educational backgrounds

    Respond in the following JSON format (no markdown, pure JSON):
    {
      "similarities": [
        {
          "category": "Category Name",
          "description": "Brief description of the similarity"
        }
      ],
      "summary": "A brief 1-2 sentence summary of overall similarity and potential mentorship value"
    }`;

  try {
    const message = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      response_format: {type: "json_object"},
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.choices[0].message.content || "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw createHttpError(500, "Failed to parse Groq response");
    }

    let similarities: SimilarityResponse;
    try {
      similarities = JSON.parse(responseText);
    } catch (e) {
      console.error("JSON.parse failed on Groq content:", responseText);
      throw createHttpError(500, "Groq returned invalid JSON");
    }
    return similarities;
  } catch (error) {
    console.error("error in analyze similarities: ", error);
    if (error instanceof createHttpError.HttpError) {
      throw error;
    }
    throw createHttpError(
      500,
      `Error calling Groq API: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}