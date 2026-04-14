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

export enum MajorType {
  Anthropology = "Anthropology",
  Artificial_Intelligence = "Artificial Intelligence",
  Astronomy_and_Astrophysics = "Astronomy and Astrophysics",
  Bioengineering = "Bioengineering",
  Biology = "Biology",
  Black_Diaspora_and_African_American_Studies = "Black Diaspora and African American Studies",
  Chemical_Engineering = "Chemical Engineering",
  Chemistry_and_Biochemistry = "Chemistry and Biochemistry",
  Chicanx_and_Latinx_Studies = "Chicanx and Latinx Studies",
  Chinese_Studies = "Chinese Studies",
  Cinematic_Arts = "Cinematic Arts",
  Classical_Studies = "Classical Studies",
  Cognitive_Science = "Cognitive Science",
  Communication = "Communication",
  Computer_Engineering_CSE = "Computer Engineering (CSE)",
  Computer_Engineering_ECE = "Computer Engineering (ECE)",
  Computer_Science = "Computer Science",
  Critical_Gender_Studies = "Critical Gender Studies",
  Data_Science = "Data Science",
  Economics = "Economics",
  Education_Studies = "Education Studies",
  Electrical_Engineering = "Electrical Engineering",
  Environmental_Systems = "Environmental Systems",
  Ethnic_Studies = "Ethnic Studies",
  German_Studies = "German Studies",
  Global_Health = "Global Health",
  Global_South_Studies = "Global South Studies",
  History = "History",
  Human_Developmental_Sciences = "Human Developmental Sciences",
  International_Studies = "International Studies",
  Italian_Studies = "Italian Studies",
  Japanese_Studies = "Japanese Studies",
  Jewish_Studies = "Jewish Studies",
  Latin_American_Studies = "Latin American Studies",
  Linguistics = "Linguistics",
  Literature = "Literature",
  Marine_Biology = "Marine Biology",
  Mathematics = "Mathematics",
  Mechanical_and_Aerospace_Engineering = "Mechanical and Aerospace Engineering",
  Music = "Music",
  Nanoengineering = "Nanoengineering",
  Oceanography = "Oceanography",
  Philosophy = "Philosophy",
  Physics = "Physics",
  Political_Science = "Political Science",
  Psychology = "Psychology",
  Public_Health = "Public Health",
  Religion = "Religion",
  Russian_and_Soviet_Studies = "Russian and Soviet Studies",
  Sociology = "Sociology",
  Structural_Engineering = "Structural Engineering",
  Theater_and_Dance = "Theater and Dance",
  Urban_Studies = "Urban Studies",
  Visual_Arts = "Visual Arts",
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
  major?: MajorType;
  shareProfile?: boolean;
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

  fieldOfInterest?: string[];
  projects?: string[];
  companiesOfInterest?: string[];
  organizations?: string[];
  specializations?: string[];
  hobbies?: string[];
  skills?: string[];
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

export interface GetStudentsQuery {
  page: number;
  perPage: number;
  query?: string;
  major?: string[];
}