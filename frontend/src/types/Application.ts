import { Company } from "./Company";

export enum Status {
  Applied = "APPLIED",
  OA = "OA",
  Phone = "PHONE",
  Final = "FINAL",
  Offer = "OFFER",
  Rejected = "REJECTED",
  Ghosted = "GHOSTED",
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

export interface ApplicationStats{
  total: number;
  phone: number;
  oa: number;
  final: number;
  offer: number;
  rejected: number;
  ghosted: number;
  interviews: number;
}

export interface MonthlyData {
  month: string;
  applications: number;
}

export interface RawMonthlyItem {
  _id?: string;
  month?: string;
  count?: number;
  applications?: number;
}

export interface SankeyNode {
  name: string;
  // optional color and value fields are provided by the Sankey layout
  color?: string;
  value?: number;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeyTooltipEntry {
  name?: string;
  value?: number | string;
  [key: string]: unknown;
}

export type TimelineEntry = { 
  status: string; 
  date: string | Date; 
  note?: string | null 
};

export type ApplicationTimeline = { 
  _id: string; 
  company?: string | null; 
  position?: string; 
  timeline: TimelineEntry[] 
};

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
