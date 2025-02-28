import { Company } from "./Company";

export enum UserType {
  Student = "STUDENT",
  Alumni = "ALUMNI",
}

export enum ClassLevel {
  Freshmen = "FRESHMEN",
  Sophomore = "SOPHOMORE",
  Junior = "JUNIOR",
  Senior = "SENIOR",
  Other = "OTHER",
}

export interface BaseUser {
  _id: string;
  email: string;
  name: string;
  type: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  profilePicture?: string;
  company?: Company;
  shareProfile?: boolean;
  major?: string;
  classLevel?: ClassLevel;
}

export interface Student extends BaseUser {
  type: UserType.Student;
  major: string;
  classLevel: ClassLevel;
}

export interface Alumni extends BaseUser {
  type: UserType.Alumni;
  company: Company;
  shareProfile: boolean;
}

export type User = Student | Alumni;

export interface UserJSON {
  _id: string;
  email: string;
  name: string;
  type: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: ClassLevel;
  company?: Company;
  shareProfile?: boolean;
}

export interface CreateUserRequest {
  _id: string;
  email: string;
  name: string;
  type: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: ClassLevel;
  company?: Company;
  shareProfile?: boolean;
}

export interface UpdateUserRequest {
  type?: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: ClassLevel;
  company?: Company;
  shareProfile?: boolean;
}

export interface GetAlumniQuery {
  page: number;
  perPage: number;
  query?: string;
}
