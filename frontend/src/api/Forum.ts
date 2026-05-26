import {
  Question,
  Answer,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  ReactToAnswerRequest,
} from "../types/Forum";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

/**
 * Fetch all questions from the backend.
 */
export async function getAllQuestions(): Promise<APIResult<Question[]>> {
  try {
    const response = await get("/api/forum/questions");
    const json = (await response.json()) as Question[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch a single question by ID, with populated answers.
 */
export async function getQuestionById(
  id: string,
): Promise<APIResult<Question>> {
  try {
    const response = await get(`/api/forum/questions/${id}`);
    const json = (await response.json()) as Question;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new question.
 */
export async function createQuestion(
  question: CreateQuestionRequest,
): Promise<APIResult<Question>> {
  try {
    const response = await post("/api/forum/questions", question);
    const json = (await response.json()) as Question;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update an existing question.
 */
export async function updateQuestion(
  id: string,
  question: UpdateQuestionRequest,
): Promise<APIResult<Question>> {
  try {
    const response = await patch(`/api/forum/questions/${id}`, question);
    const json = (await response.json()) as Question;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a question and its answers.
 */
export async function deleteQuestion(id: string): Promise<APIResult<null>> {
  try {
    await del(`/api/forum/questions/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Post an answer to a question.
 */
export async function createAnswer(
  questionId: string,
  answer: CreateAnswerRequest,
): Promise<APIResult<Answer>> {
  try {
    const response = await post(
      `/api/forum/questions/${questionId}/answers`,
      answer,
    );
    const json = (await response.json()) as Answer;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update an answer.
 */
export async function updateAnswer(
  answerId: string,
  answer: UpdateAnswerRequest,
): Promise<APIResult<Answer>> {
  try {
    const response = await patch(`/api/forum/answers/${answerId}`, answer);
    const json = (await response.json()) as Answer;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete an answer.
 */
export async function deleteAnswer(answerId: string): Promise<APIResult<null>> {
  try {
    await del(`/api/forum/answers/${answerId}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * React to an answer with an emoji.
 * delta: 1 to add, -1 to remove.
 */
export async function reactToAnswer(
  answerId: string,
  reaction: ReactToAnswerRequest,
): Promise<APIResult<Answer>> {
  try {
    const response = await patch(
      `/api/forum/answers/${answerId}/reactions`,
      reaction,
    );
    const json = (await response.json()) as Answer;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}