import { APIResult, post, handleAPIError } from "./requests";

export interface GenerateEmailRequest {
  studentId: string;
  alumniId: string;
  tone?: string;
  purpose?: string;
}

export interface GenerateEmailResponse {
  email: string;
  sharedInterests: string[];
}

/**
 * Generate a personalized email to an alumni.
 * 
 * @param data Request data (studentId, alumniId, tone, purpose)
 * @returns Generated email and shared interests
 */
export async function generateEmail(
  data: GenerateEmailRequest
): Promise<APIResult<GenerateEmailResponse>> {
  try {
    const response = await post("/api/email/generate-email", data);
    const json = (await response.json()) as GenerateEmailResponse;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
