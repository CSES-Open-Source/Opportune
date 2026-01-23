import { PaginatedData } from "../types/PaginatedData";
import {
  Application,
  ApplicationJSON,
  CreateApplicationRequest,
  GetApplicationsByUserIDQuery,
  UpdateApplicationRequest,
  MonthlyData,
  RawMonthlyItem,
  ApplicationAnalytics,
} from "../types/Application";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

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


/**
 * Gets the month by month data of applications submitted for the analytics tab
 * @param userId 
 * @returns The name of the month's with applications submitted and the counts as an object
 */
export async function getMonthlyData(
  userId: string,
): Promise<APIResult<MonthlyData[]>> {
    try {
      const response = await get(`/api/applications/applied/analytics/${userId}`);
      const json = await response.json();

      if(!response.ok){
        throw new Error(json.message || "Failed to fetch month by month data");
      }
      const monthArray = Array.isArray(json.monthlyApplications) ? json.monthlyApplications : [];

      const formatMonth = (raw: string) => {
        const match = /^(\d{4})-(\d{2})$/.exec(String(raw));
        if (match) {
          const year = Number(match[1]);
          const monthIndex = Number(match[2]) - 1; 
          const d = new Date(year, monthIndex, 1);
          return d.toLocaleString(undefined, { month: "long" }); 
        }
        return String(raw); 
      };

      const result: MonthlyData[] = monthArray.map((m: RawMonthlyItem) => {
        const raw = m.month ?? m._id ?? String(m._id ?? "");
        return {
          month: formatMonth(raw),
          applications: Number(m.count ?? m.applications ?? 0),
        };
      });
      return { 
        success: true, 
        data: result,
      };
    } 
    catch (error) {
      return handleAPIError(error);
    }
  
}



/**
 * Gets the analytics data for a users application, including application count
 * interview count and offer count
 * @param userId 
 * @returns Returns the application stats for the users application as an application stats object
 */
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