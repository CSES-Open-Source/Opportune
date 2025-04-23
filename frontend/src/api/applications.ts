import { PaginatedData } from "../types/PaginatedData";
import {
  Application,
  CreateApplicationRequest,
  GetApplicationsByUserIDQuery,
  UpdateApplicationRequest,
} from "../types/Application";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

/**
 * Fetch all applications from the backend.
 *
 * @returns A list of applications
 */
export async function getAllApplications(): Promise<APIResult<Application[]>> {
  try {
    const response = await get("/api/applications/applied");
    const json = (await response.json()) as Application[];
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch a single application by ID from the backend.
 *
 * @param id The ID of the application to fetch
 * @returns The application object
 */
export async function getApplicationbyID(
  id: string,
): Promise<APIResult<Application>> {
  try {
    const response = await get(`/api/applications/applied/${id}`);
    const json = (await response.json()) as Application;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new application in the backend.
 *
 * @param user new user to create
 * @returns The created user object
 */
export async function createApplication(
  application: CreateApplicationRequest,
): Promise<APIResult<Application>> {
  try {
    const response = await post("/api/applications/applied", application);
    const json = (await response.json()) as Application;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update an application in the backend.
 *
 * @param id id of application to update
 * @param application Fields to update
 * @returns updated application
 */
export async function updateUser(
  id: string,
  application: UpdateApplicationRequest,
): Promise<APIResult<Application>> {
  try {
    const response = await patch(
      `/api/applications/applied/${id}`,
      application,
    );
    const json = (await response.json()) as Application;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete an application from the backend.
 *
 * @param id The ID of the application to delete
 * @returns A success message or error
 */
export async function deleteApplication(id: string): Promise<APIResult<null>> {
  try {
    await del(`/api/applications/applied/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch all applications belonging to a user id
 *
 * @param queries
 * @returns PaginatedData object containing applications
 */
export async function getApplicationsByUserID(
  _id: string,
  queries: GetApplicationsByUserIDQuery = { page: 0, perPage: 10 },
): Promise<APIResult<PaginatedData<Application>>> {
  try {
    const response = await get(`/api/applications/applied/user/${_id}`, {
      ...queries,
    });
    const json = (await response.json()) as PaginatedData<Application>;
    const result = { ...json, data: json.data };
    return { success: true, data: result };
  } catch (error) {
    return handleAPIError(error);
  }
}
