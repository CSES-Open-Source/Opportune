import { PaginatedData } from "../types/PaginatedData";
import {
  InterviewQuestion,
  CreateInterviewQuestionRequest,
  UpdateInterviewQuestionRequest,
  GetInterviewQuestionsQuery,
  InterviewQuestionJSON,
} from "../types/InterviewQuestion";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

function parseInterviewQuestion(
  interviewQuestion: InterviewQuestionJSON,
): InterviewQuestion {
  return {
    ...interviewQuestion,
    date: interviewQuestion.date ? new Date(interviewQuestion.date) : undefined,
  };
}

/**
 * Fetch all interview questions from the backend.
 *
 * @param queries
 * @returns PaginatedData object containing all interview questions
 */
export async function getAllInterviewQuestions(
  queries: GetInterviewQuestionsQuery = { page: 0, perPage: 10 },
): Promise<APIResult<PaginatedData<InterviewQuestion>>> {
  try {
    const response = await get(`/api/questions/interview`, {
      ...queries,
    });
    const json =
      (await response.json()) as PaginatedData<InterviewQuestionJSON>;
    const interviewQuestions = json.data.map((item) =>
      parseInterviewQuestion(item),
    );
    return { success: true, data: { ...json, data: interviewQuestions } };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new interview question in the backend.
 *
 * @param interviewQuestion new interview question to create
 * @returns created interview question object
 */
export async function createInterviewQuestion(
  interviewQuestion: CreateInterviewQuestionRequest,
): Promise<APIResult<InterviewQuestion>> {
  try {
    const response = await post(`/api/questions/interview`, interviewQuestion);
    const json = (await response.json()) as InterviewQuestionJSON;
    return { success: true, data: parseInterviewQuestion(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get a single interview question by ID.
 *
 * @param id ID of interview question to retrieve
 * @returns interview question with matching ID
 */
export async function getInterviewQuestionByID(
  id: string,
): Promise<APIResult<InterviewQuestion>> {
  try {
    const response = await get(`/api/questions/interview/${id}`);
    const json = (await response.json()) as InterviewQuestionJSON;
    return { success: true, data: parseInterviewQuestion(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update an interview question in the backend.
 *
 * @param id ID of interview question to update
 * @param interviewQuestion fields to update
 * @returns updated interview question
 */
export async function updateInterviewQuestion(
  id: string,
  interviewQuestion: UpdateInterviewQuestionRequest,
): Promise<APIResult<InterviewQuestion>> {
  try {
    const response = await patch(
      `/api/questions/interview${id}`,
      interviewQuestion,
    );
    const json = (await response.json()) as InterviewQuestionJSON;
    return { success: true, data: parseInterviewQuestion(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete an interview question in the backend.
 *
 * @param id ID of interview question to delete
 * @returns a success message or error
 */
export async function deleteInterviewQuestion(
  id: string,
): Promise<APIResult<null>> {
  try {
    await del(`/api/questions/interview/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get interview questions by company ID.
 *
 * @param _id company ID of interview questions to retrieve
 * @returns interview questions with matching company ID
 */
export async function getInterviewQuestionsByCompanyId(
  _id: string,
): Promise<APIResult<InterviewQuestion[]>> {
  try {
    const response = await get(`/api/questions/interview/company/${_id}`);
    const json = (await response.json()) as InterviewQuestionJSON[];
    return {
      success: true,
      data: json.map((item) => parseInterviewQuestion(item)),
    };
  } catch (error) {
    return handleAPIError(error);
  }
}
