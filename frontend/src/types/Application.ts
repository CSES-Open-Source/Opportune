export enum Status {
  Applied = "APPLIED",
  Oa = "OA",
  Phone = "PHONE",
  Final = "FINAL",
  Offer = "OFFER",
  Rejected = "REJECTED",
}

export interface Application {
  userId: string;
  companyId: string;
  companyName: string;
  position: string;
  link?: string;
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
  link?: string;
  process?: string;
}

export interface UpdateApplicationRequest {
  userId?: string;
  companyId?: string;
  companyName?: string;
  position?: string;
  link?: string;
  process?: string;
}

export interface GetApplicationsByUserIDQuery {
  page: number;
  perPage: number;
  query?: string;
  status?: string;
  sortBy?: string;
}
