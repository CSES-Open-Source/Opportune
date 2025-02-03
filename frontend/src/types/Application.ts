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
  companyId: string;
  companyName: string;
  position: string;
  location?: string;
  link?: string;
  process?: string;
}

export interface UpdateApplicationRequest {
  userId?: string;
  companyId?: string;
  companyName?: string;
  position?: string;
  link?: string;
  location?: string;
  process?: string;
}

export interface GetApplicationsByUserIDQuery {
  page: number;
  perPage: number;
  query?: string;
  status?: string;
  sortBy?: string;
}
