import { PaginatedData } from "../types/PaginatedData";
import {
  Application,
  ApplicationJSON,
  CreateApplicationRequest,
  GetApplicationsByUserIDQuery,
  UpdateApplicationRequest,
} from "../types/Application";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

// Timeline entry for an application status
export type TimelineEntry = {
  status: string;
  date: string | Date;
  note?: string | null;
};

// Application timeline (with full process history)
export type ApplicationTimeline = {
  _id: string;
  company?: string | null;
  position?: string;
  timeline: TimelineEntry[];
};

// chetan: fetching analytics values portion from backend
export type ApplicationAnalytics = {
  totalApplications: number;
  successRate: string;
  interviewRate: string;
  offersReceived: number;
  applicationsThisYear: number;
  applicationStatus: Record<string, number>;
  oa: number;
  final: number;
  applicationsByMonth: Record<string, number>;
  phone: number;
  ghosted: number;
  rejected: number;
  interviews: number;
  applicationTimelines: ApplicationTimeline[];
  insights?: { tip?: string };
}


function parseApplication(application: ApplicationJSON): Application {
  return {
    ...application,
    process: application.process?.map((process) => {
      return { ...process, date: new Date(process.date) };
    }),
    createdAt: new Date(application.createdAt || ""),
    updatedAt: new Date(application.updatedAt || ""),
  };
}

/**
 * Fetch all applications from the backend.
 *
 * @returns A list of applications
 */
export async function getAllApplications(): Promise<APIResult<Application[]>> {
  try {
    const response = await get("/api/applications/applied");
    const json = (await response.json()) as ApplicationJSON[];
    return {
      success: true,
      data: json.map((application) => parseApplication(application)),
    };
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
    const json = (await response.json()) as ApplicationJSON;
    return { success: true, data: parseApplication(json) };
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
    const json = (await response.json()) as ApplicationJSON;
    return { success: true, data: parseApplication(json) };
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
export async function updateApplication(
  id: string,
  application: UpdateApplicationRequest,
): Promise<APIResult<Application>> {
  try {
    const response = await patch(
      `/api/applications/applied/${id}`,
      application,
    );
    const json = (await response.json()) as ApplicationJSON;
    return { success: true, data: parseApplication(json) };
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
    const json = (await response.json()) as PaginatedData<ApplicationJSON>;
    const applications: PaginatedData<Application> = {
      ...json,
      data: json.data.map((application) => parseApplication(application)),
    };
    return { success: true, data: applications };
  } catch (error) {
    return handleAPIError(error);
  }
}

// chetan: api call for fetching analytics data
export async function getApplicationDetails(
  userId: string,
): Promise<APIResult<ApplicationAnalytics>> {
  try {
    const response = await get(`/api/applications/applied/analytics/${userId}`);
    const json = (await response.json()) as ApplicationAnalytics;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}