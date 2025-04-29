import { Company } from "./Company";

export enum Status {
  Applied = "APPLIED",
  OA = "OA",
  Phone = "PHONE",
  Final = "FINAL",
  Offer = "OFFER",
  Rejected = "REJECTED",
}

export interface ApplicationProcess {
  status: Status;
  date: Date;
  note?: string;
}

export interface Application {
  _id: string;
  userId: string;
  company: Company;
  position: string;
  link?: string;
  location?: string;
  process?: Array<ApplicationProcess>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApplicationJSON {
  _id: string;
  userId: string;
  company: Company;
  position: string;
  link?: string;
  location?: string;
  process?: Array<ApplicationProcess>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplicationRequest {
  userId: string;
  company: Company;
  position: string;
  location?: string;
  link?: string;
  process?: Array<ApplicationProcess>;
}

export interface UpdateApplicationRequest {
  userId?: string;
  company?: Company;
  position?: string;
  link?: string;
  location?: string;
  process?: Array<ApplicationProcess>;
}

export interface GetApplicationsByUserIDQuery {
  page?: number;
  perPage?: number;
  query?: string;
  status?: string;
  sortBy?: string;
}
