import { Company } from "./Company";

export interface SavedApplication {
  _id: string;
  userId: string;
  company: Company;
  position: string;
  location?: string;
  link?: string;
  materialsNeeded?: string[];
  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SavedApplicationJSON {
  _id: string;
  userId: string;
  company: Company;
  position: string;
  location?: string;
  link?: string;
  materialsNeeded?: string[];
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSavedApplicationRequest {
  userId: string;
  company: Company;
  position: string;
  location?: string;
  link?: string;
  materialsNeeded?: string[];
  deadline?: Date;
}

export interface UpdateSavedApplicationRequest {
  userId?: string;
  company?: Company;
  position?: string;
  location?: string;
  link?: string;
  materialsNeeded?: string[];
  deadline?: Date;
}

export interface GetSavedApplicationsByUserIDQuery {
  page?: number;
  perPage?: number;
  query?: string;
  sortBy?: string;
}
