import { PaginatedData } from "../types/PaginatedData";
import {
  SavedApplication,
  SavedApplicationJSON,
  CreateSavedApplicationRequest,
  UpdateSavedApplicationRequest,
  GetSavedApplicationsByUserIDQuery,
} from "../types/SavedApplication";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

function parseSavedApplication(
  savedApplication: SavedApplicationJSON,
): SavedApplication {
  return {
    ...savedApplication,
    deadline: savedApplication.deadline
      ? new Date(savedApplication.deadline)
      : undefined,
    createdAt: savedApplication.createdAt
      ? new Date(savedApplication.createdAt)
      : undefined,
    updatedAt: savedApplication.updatedAt
      ? new Date(savedApplication.updatedAt)
      : undefined,
  };
}

/**
 * Fetch all saved applications from the backend.
 *
 * @returns A list of all saved applications
 */
export async function getAllSavedApplications(): Promise<
  APIResult<SavedApplication[]>
> {
  try {
    const response = await get("/api/applications/saved");
    const json = (await response.json()) as SavedApplicationJSON[];
    return {
      success: true,
      data: json.map((app) => parseSavedApplication(app)),
    };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new saved application in the backend.
 *
 * @param application Data for the new saved application
 * @returns The created saved application object
 */
export async function createSavedApplication(
  application: CreateSavedApplicationRequest,
): Promise<APIResult<SavedApplication>> {
  try {
    const response = await post("/api/applications/saved", application);
    const json = (await response.json()) as SavedApplicationJSON;
    return { success: true, data: parseSavedApplication(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch a single saved application by its ID from the backend.
 *
 * @param _id The ID of the saved application to fetch
 * @returns The saved application object
 */
export async function getSavedApplicationByID(
  _id: string,
): Promise<APIResult<SavedApplication>> {
  try {
    const response = await get(`/api/applications/saved/${_id}`);
    const json = (await response.json()) as SavedApplicationJSON;
    return { success: true, data: parseSavedApplication(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update a saved application in the backend.
 *
 * @param _id ID of the saved application to update
 * @param application Fields to update
 * @returns The updated saved application object
 */
export async function updateSavedApplication(
  _id: string,
  application: UpdateSavedApplicationRequest,
): Promise<APIResult<SavedApplication>> {
  try {
    const response = await patch(`/api/applications/saved/${_id}`, application);
    const json = (await response.json()) as SavedApplicationJSON;
    return { success: true, data: parseSavedApplication(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a saved application from the backend.
 *
 * @param _id The ID of the saved application to delete
 * @returns A success indicator or error
 */
export async function deleteSavedApplication(
  _id: string,
): Promise<APIResult<null>> {
  try {
    await del(`/api/applications/saved/${_id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch all saved applications belonging to a user ID.
 *
 * @param userId The ID of the user
 * @param queries Query parameters for pagination, filtering, and sorting
 * @returns PaginatedData object containing saved applications
 */
export async function getSavedApplicationsByUserID(
  userId: string,
  queries: GetSavedApplicationsByUserIDQuery = { page: 0, perPage: 10 },
): Promise<APIResult<PaginatedData<SavedApplication>>> {
  try {
    const response = await get(`/api/applications/saved/user/${userId}`, {
      ...queries,
    });
    const json = (await response.json()) as PaginatedData<SavedApplicationJSON>;
    const savedApplications: PaginatedData<SavedApplication> = {
      ...json,
      data: json.data.map((app) => parseSavedApplication(app)),
    };
    return { success: true, data: savedApplications };
  } catch (error) {
    return handleAPIError(error);
  }
}
