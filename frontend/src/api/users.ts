import { PaginatedData } from "../types/PaginatedData";
import {
  Alumni,
  CreateUserRequest,
  GetAlumniQuery,
  Student,
  UpdateUserRequest,
  User,
  UserJSON,
  UserType,
} from "../types/User";
import { APIResult, get, del, patch, post, handleAPIError } from "./requests";

function parseUser(user: UserJSON): User {
  if (user.type === UserType.Student) {
    return { ...user } as Student; // Safely return as Student
  } else if (user.type === UserType.Alumni) {
    return { ...user } as Alumni; // Safely return as Alumni
  }
  throw new Error("Invalid user type");
}

function parseAlumni(user: UserJSON): Alumni {
  if (user.type === UserType.Alumni) {
    return { ...user } as Alumni; // Safely return as Alumni
  }
  throw new Error("User is not an Alumni");
}

/**
 * Fetch all users from the backend.
 *
 * @returns A list of users
 */
export async function getUsers(): Promise<APIResult<User[]>> {
  try {
    const response = await get("/api/users");
    const json = (await response.json()) as UserJSON[];
    const users = json.map(parseUser);
    return { success: true, data: users };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch a single user by ID from the backend.
 *
 * @param id The ID of the user to fetch
 * @returns The user object
 */
export async function getUserById(id: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/users/${id}`);
    const json = (await response.json()) as UserJSON;
    return { success: true, data: parseUser(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Create a new user in the backend.
 *
 * @param user new user to create
 * @returns The created user object
 */
export async function createUser(
  user: CreateUserRequest,
): Promise<APIResult<User>> {
  try {
    const response = await post("/api/users", user);
    const json = (await response.json()) as UserJSON;
    return { success: true, data: parseUser(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Update a user in the backend.
 *
 * @param id id of user to update
 * @param user Fields to update
 * @returns updated user
 */
export async function updateUser(
  id: string,
  user: UpdateUserRequest,
): Promise<APIResult<User>> {
  try {
    const response = await patch(`/api/users/${id}`, user);
    const json = (await response.json()) as UserJSON;
    return { success: true, data: parseUser(json) };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Delete a user from the backend.
 *
 * @param id The ID of the user to delete
 * @returns A success message or error
 */
export async function deleteUser(id: string): Promise<APIResult<null>> {
  try {
    await del(`/api/users/${id}`);
    return { success: true, data: null };
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * Fetch alumni that are willing to share profile from the backend
 *
 * @param queries
 * @returns PaginatedData object containing alumni profile
 */
export async function getAlumni(
  queries: GetAlumniQuery = { page: 0, perPage: 10 },
): Promise<APIResult<PaginatedData<Alumni>>> {
  try {
    const response = await get(`/api/users/alumni`, { ...queries });
    const json = (await response.json()) as PaginatedData<UserJSON>;
    const result = { ...json, data: json.data.map(parseAlumni) };
    return { success: true, data: result };
  } catch (error) {
    return handleAPIError(error);
  }
}
