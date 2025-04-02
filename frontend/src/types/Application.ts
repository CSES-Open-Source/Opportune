import { Company } from "./Company";

export enum Status {
  Applied = "APPLIED",
  OA = "OA",
  Phone = "PHONE",
  Final = "FINAL",
  Offer = "OFFER",
  Rejected = "REJECTED",
}

export interface Application {
  userId: string;
  company: Company;
  position: string;
  link?: string;
  location?: string;
  process?: Array<{
    status: Status;
    date: string | Date;
    note?: string;
  }>;
}

export interface CreateApplicationRequest {
  userId: string;
  company: Company;
  position: string;
  location?: string;
  link?: string;
  process?: Array<{
    status: Status;
    date: string | Date;
    note?: string;
  }>;
}

export interface UpdateApplicationRequest {
  userId?: string;
  company?: Company;
  position?: string;
  link?: string;
  location?: string;
  process?: Array<{
    status: Status;
    date: string | Date;
    note?: string;
  }>;
}

export interface GetApplicationsByUserIDQuery {
  page?: number;
  perPage?: number;
  query?: string;
  status?: string;
  sortBy?: string;
}
