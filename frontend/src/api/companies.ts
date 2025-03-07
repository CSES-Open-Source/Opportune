import {
  Company,
  CompanyJSON,
  CompanyQuery,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../types/Company";
import { PaginatedData } from "../types/PaginatedData";
import objectToFormData from "../utils/objectToFormData";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

function parseCompany(company: CompanyJSON): Company {
  return { ...company } as Company;
}

/**
 * Fetch all companies from the backend.
 *
 * @param query Query parameters
 * @returns A list of companies
 */
export async function getCompanies(
  query?: CompanyQuery & {
    page?: number;
    perPage?: number;
    query?: string;
    state?: string;
    industry?: string;
    employees?: string;
  },
): Promise<APIResult<PaginatedData<Company>>> {
  try {
    const response = await get("/api/companies", { ...query });
    const json = (await response.json()) as PaginatedData<CompanyJSON>;
    const res = {
      ...json,
      data: json.data.map(parseCompany),
    } as PaginatedData<Company>;
    return { success: true, data: res };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getAllCompanies(): Promise<APIResult<Company[]>> {
  try {
    const response = await get("/api/companies/all");
    const json = (await response.json()) as CompanyJSON[];
    const res = json.map(parseCompany) as Company[];
    return { success: true, data: res };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch a single company by ID from the backend.
 *
 * @param id The ID of the company to fetch
 * @returns The company object
 */
export async function getCompanyById(id: string): Promise<APIResult<Company>> {
  try {
    const response = await get(`/api/companies/${id}`);
    const json = (await response.json()) as CompanyJSON;
    return { success: true, data: parseCompany(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new company in the backend.
 *
 * @param company new company to create
 * @returns The created company object
 */
export async function createCompany(
  company: CreateCompanyRequest & { name: string },
): Promise<APIResult<Company>> {
  try {
    const response = await post("/api/companies", objectToFormData(company));
    const json = (await response.json()) as CompanyJSON;
    return { success: true, data: parseCompany(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update a company in the backend.
 *
 * @param id id of company to update
 * @param company Fields to update
 * @returns updated company
 */
export async function updateCompany(
  id: string,
  company: UpdateCompanyRequest,
): Promise<APIResult<Company>> {
  try {
    const response = await patch(
      `/api/companies/${id}`,
      objectToFormData(company),
    );
    const json = (await response.json()) as CompanyJSON;
    return { success: true, data: parseCompany(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a company from the backend.
 *
 * @param id The ID of the company to delete
 * @returns A success message or error
 */
export async function deleteCompany(id: string): Promise<APIResult<null>> {
  try {
    await del(`/api/companies/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}
