import { CreateTipRequest, Tip, UpdateTipRequest } from "../types/Tip";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

/**
 * Fetch all tips from the backend.
 *
 * @param queries
 * @returns PaginatedData object containing all tips
 */
export async function getTips(): Promise<APIResult<Tip[]>> {
  try {
    const response = await get(`/api/tips`, {});
    const tips = (await response.json()) as Tip[];
    return { success: true, data: tips };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new tip in the backend.
 *
 * @param tip new tip to create
 * @returns created tip object
 */
export async function createTip(
  tip: CreateTipRequest,
): Promise<APIResult<Tip>> {
  try {
    const response = await post(`/api/tips`, tip);
    const json = (await response.json()) as Tip;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get a single tip by ID.
 *
 * @param id ID of tip to retrieve
 * @returns tip with matching ID
 */
export async function getTipById(id: string): Promise<APIResult<Tip>> {
  try {
    const response = await get(`/api/tips/${id}`);
    const json = (await response.json()) as Tip;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update a tip in the backend.
 *
 * @param id ID of tip to update
 * @param tip fields to update
 * @returns updated tip
 */
export async function updateTip(
  id: string,
  tip: UpdateTipRequest,
): Promise<APIResult<Tip>> {
  try {
    const response = await patch(`/api/tips/${id}`, tip);
    const json = (await response.json()) as Tip;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a Tip in the backend.
 *
 * @param id ID of Tip to delete
 * @returns a success message or error
 */
export async function deleteTip(id: string): Promise<APIResult<null>> {
  try {
    await del(`/api/tips/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Get tips by company ID.
 *
 * @param _id company ID of tips to retrieve
 * @param queries
 * @returns Tips associated with given company
 * company ID
 */
export async function getTipsByCompanyId(
  _id: string,
): Promise<APIResult<Tip[]>> {
  try {
    const response = await get(`/api/tips/company/${_id}`);
    const json = (await response.json()) as Tip[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
