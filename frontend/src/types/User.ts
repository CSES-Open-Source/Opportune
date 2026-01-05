import { Company } from "./Company";

export enum UserType {
  Student = "STUDENT",
  Alumni = "ALUMNI",
  Admin = "ADMIN",
}

export enum ClassLevel {
  Freshman = "FRESHMAN",
  Sophomore = "SOPHOMORE",
  Junior = "JUNIOR",
  Senior = "SENIOR",
  Other = "OTHER",
}

export interface BaseUser {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
  type: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  hobbies?: string[];
  skills?: string[];
}

export interface Student extends BaseUser {
  type: UserType.Student;
  major?: string;
  classLevel?: ClassLevel;
  school?: string;
  fieldOfInterest?: string[];
  projects?: string[];
  companiesOfInterest?: string[];
}

export interface Alumni extends BaseUser {
  type: UserType.Alumni;
  company?: Company;
  shareProfile?: boolean;
  position?: string;
  organizations?: string[];
  specializations?: string[];
}

export type User = Student | Alumni;

export interface UserJSON {
  _id: string;
  email: string;
  name: string;
  type: UserType;
  profilePicture: string;
  linkedIn?: string;
  phoneNumber?: string;
  hobbies?: string[];
  skills?: string[];
  major?: string;
  classLevel?: ClassLevel;
  school?: string;
  fieldOfInterest?: string[];
  projects?: string[];
  companiesOfInterest?: string[];
  company?: Company;
  shareProfile?: boolean;
  position?: string;
  organizations?: string[];
  specializations?: string[];
}

export interface CreateUserRequest {
  _id: string;
  email: string;
  name: string;
  type: UserType;
  profilePicture: string;
  linkedIn?: string;
  phoneNumber?: string;
  major?: string;
  classLevel?: ClassLevel;
  company?: Company;
  shareProfile?: boolean;
  position?: string;
}

export interface UpdateUserRequest {
  profilePicture?: string;
  type?: UserType;
  linkedIn?: string;
  phoneNumber?: string;
  hobbies?: string[];
  skills?: string[];
  major?: string;
  classLevel?: ClassLevel;
  school?: string;
  fieldOfInterest?: string[];
  projects?: string[];
  companiesOfInterest?: string[];
  company?: Company;
  shareProfile?: boolean;
  position?: string;
  organizations?: string[];
  specializations?: string[];
}

export interface GetAlumniQuery {
  page: number;
  perPage: number;
  query?: string;
  industry?: string[];
  organizations?: string[];
  specializations?: string[];
}