import { PaginatedData } from "../types/PaginatedData";
import {
  LeetcodeQuestion,
  CreateLeetcodeQuestionRequest,
  UpdateLeetcodeQuestionRequest,
  GetLeetcodeQuestionsQuery,
} from "../types/LeetcodeQuestion";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

/**
 * Fetch all leetcode questions from the backend.
 *
 * @param queries
 * @returns PaginatedData object containing all leetcode questions
 */
export async function getLeetcodeQuestions(
  queries: GetLeetcodeQuestionsQuery = { page: 0, perPage: 10 },
): Promise<APIResult<PaginatedData<LeetcodeQuestion[]>>> {
  try {
    const response = await get(`/api/questions/leetcode`, {
      ...queries,
    });
    const json = (await response.json()) as PaginatedData<LeetcodeQuestion[]>;
    const result = { ...json, data: json.data };
    return { success: true, data: result };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new leetcode question in the backend.
 *
 * @param leetcodeQuestion new leetcode question to create
 * @returns created leetcode question object
 */
export async function createLeetcodeQuestion(
  leetcodeQuestion: CreateLeetcodeQuestionRequest,
): Promise<APIResult<LeetcodeQuestion>> {
  try {
    const response = await post(`/api/questions/leetcode`, leetcodeQuestion);
    const json = (await response.json()) as LeetcodeQuestion;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get a single leetcode question by ID.
 *
 * @param id ID of leetcode question to retrieve
 * @returns leetcode question with matching ID
 */
export async function getLeetcodeQuestionById(
  id: string,
): Promise<APIResult<LeetcodeQuestion>> {
  try {
    const response = await get(`/api/questions/leetcode/${id}`);
    const json = (await response.json()) as LeetcodeQuestion;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update a leetcode question in the backend.
 *
 * @param id ID of leetcode question to update
 * @param leetcodeQuestion fields to update
 * @returns updated leetcode question
 */
export async function updateLeetcodeQuestion(
  id: string,
  leetcodeQuestion: UpdateLeetcodeQuestionRequest,
): Promise<APIResult<LeetcodeQuestion>> {
  try {
    const response = await patch(
      `/api/questions/leetcode/${id}`,
      leetcodeQuestion,
    );
    const json = (await response.json()) as LeetcodeQuestion;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a leetcode question in the backend.
 *
 * @param id ID of leetcode question to delete
 * @returns a success message or error
 */
export async function deleteLeetcodeQuestion(
  id: string,
): Promise<APIResult<null>> {
  try {
    await del(`/api/questions/leetcode/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get leetcode questions by company ID.
 *
 * @param _id company ID of leetcode questions to retrieve
 * @param queries
 * @returns PaginatedData object containing leetcode questions with matching
 * company ID
 */
export async function getLeetcodeQuestionByCompanyId(
  _id: string,
): Promise<APIResult<LeetcodeQuestion[]>> {
  try {
    const response = await get(`/api/questions/leetcode/company/${_id}`);
    const json = (await response.json()) as LeetcodeQuestion[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
